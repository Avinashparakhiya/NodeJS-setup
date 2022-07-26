const passport = require('passport');
const APIError = require('../utils/APIError');
const { capitalize } = require('../utils/helper');
const logger = require('../utils/logger');
const { admin_permissions, client_permissions } = require('../Middleware/permissions')

 /**
 * To authenticate user as well as their roles
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} roles Roles can be string or array of string
 */
const handleJWT = (req, res, next, permission) => async (err, user, info) => {
  try {
    if (err || info || !user) {
      const error = err || info.message;
      throw new APIError({ status: 401, message: error ? error : 'Unauthorized access' })
    }
    logger.info(`========user===== :: ${JSON.stringify(user)}`);

    if (permission !== undefined) {
      if ((user.role == "admin" && !admin_permissions.includes(permission)) || (user.role == "client" && !client_permissions.includes(permission))) {
        throw new APIError({ status: 403, message: "You don't have sufficient access permission!" });
      }
      // if (!roles.includes(user.role))
      //   throw new APIError({ status: 403, message: "You don't have sufficient access permission!" });
    }
    req.user = user;
    return next();
  } catch (err) { next(err) }
};

/**
 * Authentication middleware
 * @param {*} roles Roles can be string or array of string
 */
exports.isAuth = (permission) => (req, res, next) => {
  passport.authenticate('authentication', { session: false }, handleJWT(req, res, next, permission))(req, res, next)
};
