require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'henmo_ai',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  
  try {
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    
    // Test basic query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Query test successful:', result.rows[0].current_time);
    
    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'users'
    `);
    
    if (tableCheck.rows.length > 0) {
      console.log('✅ Users table exists');
      
      // Check for test user
      const userCheck = await client.query(
        'SELECT id, email, role FROM users WHERE email = $1',
        ['ugochukwuhenry16@gmail.com']
      );
      
      if (userCheck.rows.length > 0) {
        console.log('✅ Test user exists:', userCheck.rows[0]);
      } else {
        console.log('⚠️  Test user not found - you may need to create it');
      }
    } else {
      console.log('❌ Users table not found - run migrations first');
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Check your .env database credentials');
    console.log('3. Ensure the database "henmo_ai" exists');
    console.log('4. Run: createdb henmo_ai (if database doesn\'t exist)');
  } finally {
    await pool.end();
  }
}

testConnection();