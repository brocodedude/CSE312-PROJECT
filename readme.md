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
    
### Directory structure

```

| Project
| -> src -> core application logic here (eg. database, auth etc). accessible only using the /api/* path
      |
      | -> routes -> define different routers here

| -> public -> frontend stuff with each directory as its own page
               e.g login dir will contain css,html,js for login page 
```