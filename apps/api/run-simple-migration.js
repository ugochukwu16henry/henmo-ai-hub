const fs = require('fs');
const path = require('path');
const { query } = require('./src/config/database');

async function runSimpleMigration() {
  try {
    console.log('🚀 Running simple admin migration...');
    
    const migrationPath = path.join(__dirname, 'migrations', '002_simple_admin.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolon and execute each statement separately
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        try {
          console.log(`Executing statement ${i + 1}/${statements.length}...`);
          await query(statement);
        } catch (error) {
          if (error.message.includes('already exists') || error.message.includes('duplicate')) {
            console.log(`Skipping: ${error.message}`);
            continue;
          }
          throw error;
        }
      }
    }
    
    console.log('✅ Migration completed successfully!');
    console.log('📧 Henry Maobughichi Ugochukwu created as Super Admin');
    console.log('🔑 Username: ugochukwuhenry');
    console.log('📧 Email: ugochukwuhenry16@gmail.com');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runSimpleMigration();