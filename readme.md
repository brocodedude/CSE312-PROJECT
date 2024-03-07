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
const db = require('../db/database');
```

Use db according to [docs](https://knexjs.org/guide/query-builder.html)

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

## Api endpoints

All api endpoints are behind the ``/api`` path

These are current implemented endpoints

### Lobby

* ```/api/lobby``` => all endpoints are require user to be authenticated
  * ``GET /api/lobby`` => returns list of all lobbies
    * request - no data expected all body params will be ignored
    * response - list of lobbies in json 
      * ```json
        [
         {
          "id": 4,
          "uid": 1,
          "lobby_name": "lobby3"
         },
         {
          "id": 5,
          "uid": 1,
          "lobby_name": "lobby1"
         },
         {
          "id": 3,
          "uid": 1,
          "lobby_name": "lobby2"
         }
        ]
        ```
  * ``POST /api/lobby`` => returns created lobby id
    * request - JSON body in the following format
      *  ```json
         {
         "lobby_name": "lobby7",
         "uid": "2" // id of the user creating the lobby
         }
         ```
    * response - Created lobby ID in json
      * ```json
         {
          "id": 4
         }
        ```
  * ``GET /api/lobby/:id`` => Get a specific ```lobby_id``` to connect to game
    * request - id of the lobby in the path
      * ```/api/lobby/4```
    * response - lobby_id can be used to connect to particular game
      * ```json
         {
          	"lobby_id": "3934cb5c-e404-4ecd-953d-b7db4623862d"
         }
        ```
  * ``DELETE /api/lobby/:id`` => deletes a lobby
    * request - id of the lobby in the path
      * ```/api/lobby/4```
    * response - lobby that was deleted in list. Empty list if the id doesn't exist
      * ```json
         [
          {
          "id": 4,
          "uid": 1,
          "lobby_name": "lobby3"
          }
         ]
        ```
  * ``PATCH /api/lobby/:id`` => Update a lobby name
    * request - id of the lobby in the path and the updated lobby name in JSON body
      * ```/api/lobby/4```
      * ```json
         {
          "lobby_name": "New lobby name"
         }
        ```
    * response - lobby id that was updated
      * ```json
         {
          "lobby_id": "4"
         }
        ```
    
      
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