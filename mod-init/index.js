const swaggerRunner = require('swagger-express-mw');
const swaggerTools = require('swagger-tools');

module.exports = (app, __dirname, config) => {

    return new Promise((resolve, reject) => {

        var serviceConfig = {
            appRoot: __dirname,
            swaggerFile: __dirname + "/swagger.yaml",
            configDir: __dirname + "/configuration"
        };

        var options = {
            controllers: __dirname + '/controllers'
        };

        swaggerRunner.create(serviceConfig, function (err, server) {

            if (err) reject(err);

            server.register(app);

            var swaggerObject = server.runner.swagger;

            swaggerTools.initializeMiddleware(swaggerObject, function (middleware) {

                app.use(middleware.swaggerMetadata());

                // Validate Swagger requests
                app.use(middleware.swaggerValidator());

                // Serve the Swagger documents and Swagger UI
                app.use(middleware.swaggerUi());

                // apply controllers
                app.use(middleware.swaggerRouter(options));

                app.listen(config.port);

                resolve(server);

            });

        });

    });
}