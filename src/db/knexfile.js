// Update with your config settings.
require('dotenv').config({path:'../../.env'}); // Load variables from .env file
const isDocker = require('../utils/docker_check')

const user = process.env.DB_USER
const pass = process.env.DB_PASS
const dbName = process.env.DB_NAME
const host = isDocker ? 'db' : 'localhost'

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  production: {
    client: 'pg',
    connection: {
      database: dbName,
      user:     user,
      password: pass,
      host: host,
      port: 5432
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
};
