const { query } = require('./src/config/database');

async function addMissingColumns() {
  try {
    console.log('🔧 Adding missing columns...');
    
    const columns = [
      'ADD COLUMN locked_until TIMESTAMP WITH TIME ZONE',
      'ADD COLUMN last_login TIMESTAMP WITH TIME ZONE',
      'ADD COLUMN login_ip VARCHAR(45)'
    ];
    
    for (const col of columns) {
      try {
        await query(`ALTER TABLE users ${col}`);
        console.log(`✅ Added: ${col.split(' ')[2]}`);
      } catch (e) {
        console.log(`⚠️ ${col.split(' ')[2]} already exists`);
      }
    }
    
    console.log('✅ All columns added!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addMissingColumns();