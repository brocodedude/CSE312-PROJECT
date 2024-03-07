// Import the knexfile.js configuration
const knexConfig = require('./knexfile');

const environment = 'production';
const config = knexConfig[environment];

// Initialize Knex with the selected configuration
const db = require('knex')(config);

module.exports = db


