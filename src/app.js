const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const bcrypt = require('bcrypt');

// routers
const indexRouter = require('./index');
const lobbyRouter = require('./lobby/lobby.controller');
const gameRouter = require('./game/game.controller');
const loginRouter = require('./login/login.controller')

// middlewares
const authMiddleware = require('./login/login.validator')

// utils
const {initActiveLobbies} = require('./game/game.service')
const isDocker = require('./utils/docker_check')

// core server
const {server, app} = require('./server')

// database
const db = require('./db/database');
const authTokenValidator = require("./middleware/auth_token_verifier");


const port = 9000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

app.use((req, res, next) => {
    const ext = path.extname(req.path);
    switch (ext) {
        case '.html':
            res.setHeader('Content-Type', 'text/html');
            break;
        case '.css':
            res.setHeader('Content-Type', 'text/css');
            break;
        case '.js':
            res.setHeader('Content-Type', 'text/javascript');
            break;
        case '.png':
            res.setHeader('Content-Type', 'image/png');
            break;
        // Add more cases as needed
        default:
            break;
    }
    next();
});

app.use(express.static(path.join(__dirname, '../public')));

// Route for CSS.
app.get('/css/styles.css', (req, res) => {
    // res.setHeader('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, '../public/css/styles.css'));
});

// Route for JS.
app.get('/js/index.js', (req, res) => {
    // res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(path.join(__dirname, '../public/script.js'));
});

// Route for IMAGES.
app.get('/images/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    // res.setHeader('Content-Type', 'image/png');
    res.sendFile(path.join(__dirname, `../public/images/${imageName}`));
});

// Route for game assets.
app.get('/assets/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    // res.setHeader('Content-Type', 'image/png');
    res.sendFile(path.join(__dirname, `../public/game/assets/${imageName}`));
});

// Route for register page.
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/auth/register.html'));
});


// Route for home page.
app.use('/', indexRouter);
app.use('/login', loginRouter)
// validator to verify user, only logged-in users can access these paths
app.use('/api/lobby', authTokenValidator, lobbyRouter)
app.use('/game', authTokenValidator, gameRouter)

// Authentication index.
app.post('/account-reg', (req, res) => {
    const {username, password, passwordVerify} = req.body;

    if (!username || !password || !passwordVerify) {
        return res.status(400).json({message: 'Username and password are required'});
    }

    // Ensure that the password & passwordVerify match
    if (password !== passwordVerify) {
        return res.status(400).json({message: 'Passwords do not match.'});
    }
    // Before adding to the database, ensure the username doesn't already exist.
    db('users')
        .where({username})
        .first()
        .then((user) => {
            if (user) {
                return res.status(400).json({message: 'Username already exists.'});
            } else {
                // Hash the password & store user into database.
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if (err) {
                        return res.status(500).json({message: 'An error occurred.'});
                    }
                    // Add the user to the database
                    db('users')
                        .insert({username, password: hash})
                        .then(() => {
                            // Redirect to homepage.
                            res.redirect('/');
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(500).json({message: 'An error occurred.'});
                        });
                });
            }
        });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// TODO error handler
// app.use();

// Listen on 8080.
// setup lobbies then start the server
initActiveLobbies().then(() => {
        server.listen(port, () => {
            if (isDocker) {
                console.log(`App is running at localhost:8080 or the port defined in docker-compose.yml`)
                return
            }

            console.log(`App is running at localhost:${port}`)
        })
    }
).catch(
    function (err) {
        console.log('failed to start app')
        console.log(err)
    }
)


module.exports = app;
