const { Pool } = require('pg')
/* --- V7: Using Dot Env ---
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '********',
  port: 5432,
})
*/
let database = null;

async function initDatabase() {
    const pool = await new Pool({
        connectionString: process.env.DATABASE_URL
    });
    database = pool;
    return database != null;
}

async function getDatabase() {
    let isConnected = (database != null);
    if(!isConnected) {
        isConnected = initDatabase();
    }
    return [isConnected, database];
}

module.exports = {
    getDatabase,
};
