const { query } = require('./src/config/database');
const bcrypt = require('bcryptjs');

async function checkPassword() {
  try {
    const result = await query('SELECT username, password_hash FROM users WHERE username = $1', ['ugochukwuhenry']);
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log('User:', user.username);
      console.log('Has password_hash:', !!user.password_hash);
      
      if (user.password_hash) {
        const isValid = await bcrypt.compare('1995Mobuchi@', user.password_hash);
        console.log('Password valid:', isValid);
      }
    } else {
      console.log('❌ User not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkPassword();