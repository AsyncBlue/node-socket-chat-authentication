const validateFields = require('../middlewares/validate-fields');
const validateJWT = require('../middlewares/validate-jwt');
const validateRoles = require('../middlewares/validate-roles');
const validateArchive = require('../middlewares/validate-archive');

module.exports = {
    ...validateFields,
    ...validateJWT,
    ...validateRoles,
    ...validateArchive
}