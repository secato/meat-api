import * as restify from 'restify'
import { ModelRouter } from '../common/model-router'
import { User } from './users.model'
import { authenticate } from '../security/auth.handler'
import { authorize } from '../security/authz.handler'

class UsersRouter extends ModelRouter<User> {


    constructor() {
        super(User)
        this.on('beforeRender', document => {
            document.password = undefined
        })
    }
    findByEmail = (req, res, next) => {
        if (req.query.email) {
            User.findByEmail(req.query.email)
                .then(user => {
                    if (user) {
                        return [user]
                    } else {
                        return []
                    }
                })
                .then(this.renderAll(res, next))
                .catch(next)
        } else {
            next()
        }
    }

    applyRoutes(application: restify.Server) {
        application.get({ path: `${this.basePath}`}, [authorize('admin'), this.findByEmail, this.findAll])
        // application.get({ path: '/users', version: '1.0.0' }, this.findAll)
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
        application.post(`${this.basePath}`, this.save)
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace])
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update])
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete])

        application.post(`${this.basePath}/authenticate`, authenticate)
    }
}

export const usersRouter = new UsersRouter()