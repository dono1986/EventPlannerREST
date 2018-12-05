/* Load modules */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");



/* Database configuration */
const database = require('./app/config/dbconfig');

startApp = async () => {

    /* Load command line parameters */
    var argv = require('minimist')(process.argv.slice(2));

    let cleanDBArgument = argv.cleanDB;

    /* Initialize database */
    await database.init(cleanDBArgument);

    /* Init server listening */
    let portArgument = argv.port;

    const port = portArgument || 3000;
    app.listen(port, function () {
        console.log("Server listening on port : " + port);
    });

    /* Swagger configuration */
    const expressSwagger = require('express-swagger-generator')(app);
    let options = {
        swaggerDefinition: {
            info: {
                description: 'Party event API',
                title: 'Swagger',
                version: '1.0.0',
            },
            host: `localhost:${port}`,
            basePath: '/v1',
            produces: [
                "application/json",
                "application/xml"
            ],
            schemes: ['http', 'https'],
            securityDefinitions: {
                JWT: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    description: "",
                }
            }
        },
        basedir: __dirname, //app absolute path
        files: ['./routes/**/*.js'] //Path to the API handle folder
    };
    expressSwagger(options)

    /* Express configuration */
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    /* Router configuration */
    const REST_API_ROOT = '/api';
    app.use(REST_API_ROOT, require('./app/routes/router'));
};

startApp();

