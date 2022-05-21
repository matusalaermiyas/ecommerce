const _404 = require('./404');
const adminGuard = require('./guard_admin_route');
const checkIfUserLogged = require('./check_if_user_logged');
const error = require('./error');
const guardAdminRoute = require('./guard_admin_route');
const guardUserRoute = require('./guard_user_routes');

module.exports = {
    _404,
    adminGuard,
    checkIfUserLogged,
    error,
    guardAdminRoute,
    guardUserRoute,
}