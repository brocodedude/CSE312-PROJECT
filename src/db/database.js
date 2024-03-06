const pgPromise = require('pg-promise');
require('dotenv').config(); // Load variables from .env file
const isDocker = require('../utils/docker_check')

const user = process.env.DB_USER
const pass = process.env.DB_PASS
const dbName = process.env.DB_NAME

// docs
// https://vitaly-t.github.io/pg-promise/index.html
// https://github.com/vitaly-t/pg-promise?tab=readme-ov-file#methods

const connectionOptions = {
    host: isDocker ? 'db' : 'localhost', // set host according to env
    port: 5432,
    database: dbName,
    user: user,
    password: pass,
};

const pgp = pgPromise();
const db = pgp(connectionOptions);

async function connectWithTimeout(timeout) {
    const startTime = Date.now();
    while (true) {
        try {
            await db.connect();
            console.log(`Database connected at host: ${connectionOptions.host}`);
            return db; // Connection successful, return the database instance
        } catch (error) {
            console.error(`Waiting for database connection at host: ${connectionOptions.host}`);
        }
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime >= timeout) {
            console.error('Connection timed out');
            console.error('Please check if database is running and the database options are correctly defined')
            process.exit(1); // Exit the process if connection times out
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
    }
}

const timeout = 30000; // 30 seconds

// wait until postgres docker is ready or timeout the connection
connectWithTimeout(timeout)
    .then(db => {
        // Do something with the connected database
        module.exports = db;
    });
