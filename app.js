const morgan = require( "morgan" );
const path = require( "path" );
const cookieParser = require("cookie-parser");
const Config = require(`./config/config.js`);
const { existsSync } = require('fs');
const fileUpload = require('express-fileupload');

const express = require('express');
const debug = require('debug')('base:server');
const http = require('http');

const { port } = Config.app();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(fileUpload({
    limits: { fileSize: 500 * 1024 * 1024 }, //500MB
    useTempFiles : true,
    tempFileDir : `${__dirname}/public/uploaded`
}));

app.use(morgan('dev'));

app.get('/', function(req, res, next){
    return res.status(200).json({
        message: "The server was running"
    });
});

app.use(function(req, res, next) {
    // next(createError(404));
    res.status(422)
    res.json({
        status: -1,
        message: 'The path doesnt exists!'
    })
});

app.use(function(err, req, res, next) {
    console.error(`Internal Server Error: ${err}`);
    res.status(500);
    res.json({
        status: -1,
        message: 'Internal Server Error: '+err
    });
});

app.set('port', port);

/**
* Create HTTP server.
*/

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => console.log(`Server was running on port: ${port}`));
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
