const { Pool } = require('pg');
const config = require('./index');
const logger = require('../utils/logger');

// Create connection pool
const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
  min: config.database.pool.min,
  max: config.database.pool.max,
  idleTimeoutMillis: config.database.pool.idleTimeoutMillis,
  connectionTimeoutMillis: config.database.pool.connectionTimeoutMillis,
});

// Pool event handlers
pool.on('connect', () => {
  logger.debug('New client connected to database');
});

pool.on('error', (err) => {
  logger.error('Unexpected database error:', err);
});

// Query helper with logging
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug(`Query executed in ${duration}ms`, { 
      query: text.substring(0, 100),
      rows: result.rowCount 
    });
    return result;
  } catch (error) {
    logger.error('Database query error:', { 
      query: text.substring(0, 100), 
      error: error.message 
    });
    throw error;
  }
};

// Get a client from pool for transactions
const getClient = async () => {
  const client = await pool.connect();
  const originalQuery = client.query.bind(client);
  const originalRelease = client.release.bind(client);

  // Track query count for debugging
  let queryCount = 0;

  client.query = (...args) => {
    queryCount++;
    return originalQuery(...args);
  };

  client.release = () => {
    logger.debug(`Client released after ${queryCount} queries`);
    client.query = originalQuery;
    client.release = originalRelease;
    return originalRelease();
  };

  return client;
};

// Transaction helper
const transaction = async (callback) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Health check
const healthCheck = async () => {
  try {
    const result = await query('SELECT NOW() as now');
    return { 
      status: 'healthy', 
      timestamp: result.rows[0].now,
      poolSize: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount,
    };
  } catch (error) {
    return { 
      status: 'unhealthy', 
      error: error.message 
    };
  }
};

// Graceful shutdown
const close = async () => {
  logger.info('Closing database pool...');
  await pool.end();
  logger.info('Database pool closed');
};

module.exports = {
  pool,
  query,
  getClient,
  transaction,
  healthCheck,
  close,
};