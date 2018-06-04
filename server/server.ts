import * as restify from 'restify'
import * as fs from 'fs'
import * as mongoose from 'mongoose'
import { environment } from '../common/environment'
import { Router } from '../common/router'
import { handleError } from './error.handler'
import { tokenParser } from '../security/token.parser'


export class Server {

    application: restify.Server

    initDb(): Promise<typeof mongoose> {
        (<any>mongoose).Promise = global.Promise
        return mongoose.connect(environment.db.url, {
        })
    }

    initRoutes(routers: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {

                const options: restify.ServerOptions = {
                    name: 'meat-api',
                    version: '1.0.0'
                }
                if (environment.security.enableHTTPS) {
                    options.certificate = fs.readFileSync(environment.security.certificate),
                        options.key = fs.readFileSync(environment.security.key)
                }

                this.application = restify.createServer(options)


                // plugins
                this.application.use(restify.plugins.bodyParser({
                    mapParams: false
                }))
                this.application.use(restify.plugins.queryParser())
                this.application.use(tokenParser)


                // routes
                for (const router of routers) {
                    router.applyRoutes(this.application)
                }

                this.application.listen(environment.server.port, () => {
                    resolve(this.application)

                })

                this.application.on('restifyError', handleError)

            } catch (error) {
                reject(error)
            }
        })
    }



    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initDb().then(() =>
            this.initRoutes(routers).then(() => this))
    }

    shutdown() {
        return mongoose.disconnect().then(() => this.application.close())
    }
}