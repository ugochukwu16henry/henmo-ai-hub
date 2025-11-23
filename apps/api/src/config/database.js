const { Pool } = require('pg');
const config = require('./index');
const logger = require('../utils/logger');

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

pool.on('error', (err) => {
  logger.error('Unexpected database error:', err);
});

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

const healthCheck = async () => {
  try {
    const result = await query('SELECT NOW() as now');
    return { 
      status: 'healthy', 
      timestamp: result.rows[0].now,
    };
  } catch (error) {
    return { 
      status: 'unhealthy', 
      error: error.message 
    };
  }
};

const close = async () => {
  logger.info('Closing database pool...');
  await pool.end();
  logger.info('Database pool closed');
};

module.exports = {
  pool,
  query,
  healthCheck,
  close,
};