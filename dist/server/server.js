"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const fs = require("fs");
const mongoose = require("mongoose");
const environment_1 = require("../common/environment");
const error_handler_1 = require("./error.handler");
const token_parser_1 = require("../security/token.parser");
class Server {
    initDb() {
        mongoose.Promise = global.Promise;
        return mongoose.connect(environment_1.environment.db.url, {});
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                const options = {
                    name: 'meat-api',
                    version: '1.0.0'
                };
                if (environment_1.environment.security.enableHTTPS) {
                    options.certificate = fs.readFileSync(environment_1.environment.security.certificate),
                        options.key = fs.readFileSync(environment_1.environment.security.key);
                }
                this.application = restify.createServer(options);
                // plugins
                this.application.use(restify.plugins.bodyParser({
                    mapParams: false
                }));
                this.application.use(restify.plugins.queryParser());
                this.application.use(token_parser_1.tokenParser);
                // routes
                for (const router of routers) {
                    router.applyRoutes(this.application);
                }
                this.application.listen(environment_1.environment.server.port, () => {
                    resolve(this.application);
                });
                this.application.on('restifyError', error_handler_1.handleError);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    bootstrap(routers = []) {
        return this.initDb().then(() => this.initRoutes(routers).then(() => this));
    }
    shutdown() {
        return mongoose.disconnect().then(() => this.application.close());
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map