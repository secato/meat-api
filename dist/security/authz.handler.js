"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
exports.authorize = (...profiles) => {
    return (req, res, next) => {
        if (req.authenticated !== undefined && req.authenticated.hasAny(...profiles)) {
            next();
        }
        else {
            next(new restify_errors_1.ForbiddenError('Permission denied'));
        }
    };
};
//# sourceMappingURL=authz.handler.js.map