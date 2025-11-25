const { query } = require('./src/config/database');

async function checkUser() {
  try {
    const result = await query('SELECT username, email, role FROM users WHERE username = $1', ['ugochukwuhenry']);
    
    if (result.rows.length > 0) {
      console.log('✅ User found:', result.rows[0]);
    } else {
      console.log('❌ User not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUser();