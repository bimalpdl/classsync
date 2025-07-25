import SQLiteStorage from './sqliteStorage.js';

async function migrateToSQLite() {
  console.log('🚀 Starting migration from JSON files to SQLite database...');
  
  const storage = new SQLiteStorage();
  
  try {
    // Perform the migration
    await storage.migrateFromJSON();
    
    console.log('✅ Migration completed successfully!');
    console.log('📊 Database file created at: ./data/classsync.db');
    console.log('💡 You can now safely delete the JSON files if needed.');
    console.log('🔧 To use SQLite storage, update your server configuration.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    storage.close();
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateToSQLite();
}

export default migrateToSQLite; 