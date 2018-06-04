"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = (req, res, err, done) => {
    err.statusCode = 404;
    err.toJSON = () => {
        return {
            message: err.message
        };
    };
    // switch (err.name) {
    //     case 'MongoError':
    //         if (err.code === "Internal") {
    //             err.statusCode = 400
    //         }
    //         break
    //     case 'ValidationError':
    //         err.statusCode = 400
    //         const messages: any[] = []
    //         for (let name in err.errors) {
    //             messages.push({ message: err.errors[name].message })
    //         }
    //         err.toJSON = () => ({
    //             errors: messages
    //         })
    //         break
    // }
    done();
};
//# sourceMappingURL=error.handler.js.map