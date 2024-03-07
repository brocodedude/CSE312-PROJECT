const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes');
const lobbyRouter = require('./lobby/lobby.controller')
const authMiddleware = require('./middleware/auth.middleware')
const isDocker = require('./utils/docker_check')
const app = express();

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

app.use('/', indexRouter);
app.use('/api/lobby', authMiddleware, lobbyRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// TODO error handler
// app.use();

// Listen on 8080.
app.listen(port, () => {
    if (isDocker) {
        console.log(`App is running at the port defined in docker-compose.yml`)
    }

    console.log(`App is running at ${port}`)
})

module.exports = app;
