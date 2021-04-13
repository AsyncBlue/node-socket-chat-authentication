const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validateJWT = async ( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        //Leer el usuario correspontiende al uid y ponerlo en la req
        const user = await User.findById( uid );

        if ( !user ) {
            return res.status(401).json({
                msg: 'Token no valido - USER no exists in DB'
            });
        }

        //Verificar si el uid tiene estado en true
        if ( !user.state ) {
            return res.status(401).json({
                msg: 'Token no valido - USER STATE FALSE'
            });
        }

        req.user = user;


        next(); // para continuar con lo que sigue, controller , middlewares etc
        
    } catch (error) {

        console.log(error);

        res.status(401).json({
            msg: 'Token no valido'
        });

    }

}

module.exports = {
    validateJWT
}