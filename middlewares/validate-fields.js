const { validationResult } = require('express-validator');

const validateFields = ( req, res, next ) => { // next es lo que hay que llamar si el middleware pasa

    const errors = validationResult( req ); // capta los errores del middleware express-validator
    if ( !errors.isEmpty() ) { // si el error existe
        return res.status(400).json( errors );
    }

    next();

}

module.exports = {
    validateFields
}