const { response } = require("express");
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async ( req, res = response) => {

    const { mail, password } = req.body;

    try {

        //Verificar si el correo existe
        const user = await User.findOne( { mail } );

        if ( !user ) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - EMAIL'
            });
        }

        //Verificar si el usuario esta activo en la BD
        if ( !user.state ) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - ESTADO FALSE'
            });
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, user.password ); // compara la pass que viene en el body con la pass del user en la bd

        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - PASSWORD'
            });
        }

        //Generar el JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Algo salio mal hable con el Administrador'
        });
    }

}

const googleSignIn = async ( req, res = response ) => {

    const { id_token } = req.body;

    try {

        const { name, img, mail } = await googleVerify( id_token );

        let user = await User.findOne( { mail } );

        if ( !user ) {
            //Tengo que crearlo
            const data = {
                name,
                img,
                mail,
                password: ':P',
                google: true
            };

            user = new User( data );

            await user.save();

        }

        //Si el usuario en DB figura con estado en false
        if ( !user.state ) {

            res.status(401).json({
                msg: ' Hable con el administrador, usuario bloqueado'
            });

        }

        //Generar el JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        });
        
    } catch (error) {

        res.status(400).json({
            msg: 'Token de Google no es valido'
        });
        
    }

}


const renovarToken = async ( req, res = response ) => {

    const { user } = req;

    //Generar el JWT
    const token = await generateJWT( user.id );

    res.json({
        user,
        token
    });

}


module.exports = {
    login,
    googleSignIn,
    renovarToken
}