import * as restify from 'restify'
import * as jwt from 'jsonwebtoken'
import { environment } from '../common/environment'
import { User } from '../users/users.model'
import { NotAuthorizedError } from 'restify-errors'

export const authenticate: restify.RequestHandler = (req, res, next) => {
    const { email, password } = req.body
    User.findByEmail(email, '+password')
        .then(user => {
            if (user && user.matches(password)) {
                // gerar o token
                const token = jwt.sign({
                    sub: user.email,
                    iss: 'meat-api',
                }, environment.security.apiSecret)

                res.json({
                    name: user.name,
                    email: user.email,
                    accessToken: token
                })

                return next(false)

            } else {
                return next(new NotAuthorizedError('Invalid Credentials'))

            }
        }).catch(next)
}