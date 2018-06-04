"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class Router extends events_1.EventEmitter {
    envelope(document) {
        return document;
    }
    evenlopeAll(document, options = {}) {
        return document;
    }
    render(response, next) {
        return (document) => {
            if (document) {
                this.emit('beforeRender', document);
                response.json(this.envelope(document));
            }
            else {
                response.send(404);
            }
            return next();
        };
    }
    renderAll(response, next, options = {}) {
        return (documents) => {
            if (documents) {
                documents.forEach((document, index, array) => {
                    this.emit('beforeRender', document);
                    array[index] = this.envelope(document);
                });
                response.json(this.evenlopeAll(documents, options));
            }
            else {
                response.json(this.evenlopeAll([]));
            }
            return next();
        };
    }
}
exports.Router = Router;
//# sourceMappingURL=router.js.map