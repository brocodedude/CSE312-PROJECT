# Multiplayer Pacman

Link: https://multipacman.live

## Quick Start

Run the following commands ( assuming you are in project root )

* In production
  * With docker
    * ```
      docker compose up
      ```
    * Server will be accessible at [localhost:8080](http://localhost:9006)
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


## TODO
