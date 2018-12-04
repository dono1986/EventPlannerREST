/* Load modules */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

/* Database configuration */
const database = require('./app/config/dbconfig');

startApp = async () => {

    /* Load command line parameters */
    var argv = require('minimist')(process.argv.slice(2));

    let cleanDBArgument = true; //argv.cleanDB;

    /* Initialize database */
    await database.init(cleanDBArgument);

    /* Init server listening */
    let portArgument = argv.port;

    const port = portArgument || 3000;
    app.listen(port, function () {
        console.log("Server listening on port : " + port);
    });

    /* Express configuration */
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    /* Router configuration */
    const REST_API_ROOT = '/api';
    app.use(REST_API_ROOT, require('./app/routes/router'));
};

startApp();

