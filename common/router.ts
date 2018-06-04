import * as restify from 'restify'
import { EventEmitter } from 'events'

export abstract class Router extends EventEmitter {
    abstract applyRoutes(application: restify.Server)

    envelope(document: any): any {
        return document
    }

    evenlopeAll(document: any[], options: any = {}): any {
        return document
    }

    render(response: restify.Response, next: restify.Next) {
        return (document) => {
            if (document) {
                this.emit('beforeRender', document)
                response.json(this.envelope(document))
            } else {
                response.send(404)
            }
            return next()
        }
    }

    renderAll(response: restify.Response, next: restify.Next, options: any = {}) {
        return (documents: any[]) => {
            if (documents) {
                documents.forEach((document, index, array) => {
                    this.emit('beforeRender', document)
                    array[index] = this.envelope(document)
                })
                response.json(this.evenlopeAll(documents, options))
            } else {
                response.json(this.evenlopeAll([]))
            }
            return next()
        }
    }
}