const knex = require('knex')

/**
 * Creates the Lobby table
 *
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function (knex) {
    return knex.schema.createTable('users', function (table) {
          table.increments('id').primary();
          table.string('username').unique().notNullable();
          table.string('password').notNullable();
          table.string('auth_token').index(),
          table.string('profile_image_url');
        }
    ).createTable('lobbies', function (table) {
        table.increments('id').primary();
        table.integer('uid').unsigned().notNullable();
        table.foreign('uid').references('id').inTable('users');
        table.string('lobby_name').notNullable();
        table.string('lobby_id').unique().notNullable();
        table.string('pcm').nullable();
        table.string('gh1').nullable();
        table.string('gh2').nullable();
        table.string('gh3').nullable();
        table.boolean('joinable').defaultTo(true);
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function (knex) {
    return knex.schema.dropTable('lobbies').dropTable('users');
};
