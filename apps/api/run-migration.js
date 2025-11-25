const fs = require('fs');
const path = require('path');
const { query } = require('./src/config/database');

async function runMigration() {
  try {
    console.log('🚀 Running admin system migration...');
    
    const migrationPath = path.join(__dirname, 'migrations', '001_admin_system.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.substring(0, 50) + '...');
        await query(statement);
      }
    }
    
    console.log('✅ Migration completed successfully!');
    console.log('📧 Henry Maobughichi Ugochukwu has been set as Super Admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();