# Multiplayer Pacman

## Quick Start

Run the following commands ( assuming you are in project root )

* In production
  * With docker
    * ```
      docker compose up
      ```
    * Server will be accessible at [localhost:9006](http://localhost:9006)
  * Without docker
    * ```
      npm install
      npm run start
      ```
    * Server will be accessible at [localhost:9000](http://localhost:9000)

* for development server
  * ```
      npm install
      npm run dev
      ```
  * Server will be accessible at [localhost:9000](http://localhost:9000)

## Database stuff

We are using knex library for connecting with our postgres backend

### Usage 

To call the database anywhere in the app use

```
const pg = require('knex')({client: 'pg'});
```

Use pg according to [docs](https://knexjs.org/guide/query-builder.html)

### Table management

To create a table or "migration" go to ```src/db/migrations/20240307003739_lobbies.js```

Add your table structure according to [docs](https://knexjs.org/guide/migrations.html#transactions-in-migrations) or use chatGPT

```
return knex.schema.createTable('users', function (table) {
            table.increments('id').primary();
    }).createTable('lobbies', function (table) {
        table.increments('id').primary();
        table.integer('uid').unsigned();
        table.foreign('uid').references('id').inTable('users');
        table.string('lobby_name').unique().notNullable();
        table.string('lobby_id').unique().notNullable();
        table.timestamps(true, true);
    }).createTable('new_table', function (table) {
      .... define your table here
    });
```

Use 

```
docker compose up --build
```

To automatically create the tables inside the database.

## Directory structure

```

| Project
| -> src -> core application logic here (eg. database, auth etc). accessible only using the /api/* path
      |
      | -> routes -> define different routers here
      |
      | -> app.js -> entry point for app

| -> public -> frontend stuff with each directory as its own page
               e.g login dir will contain css,html,js for login page 
```

## TODO

- Ensure content types show all the time in response headers
- Add nosniff