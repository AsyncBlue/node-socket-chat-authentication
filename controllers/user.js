const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');


const userGet = async ( req = request, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { state: true };

    //const users = await User.find( query )
    //    .skip( Number( desde ) )
    //    .limit( Number( limite ) );

    //const total = await User.countDocuments( query );
    
    const [ total, users ] = await Promise.all([ // desestructuracion de arreglos - por posiciones
        User.countDocuments( query ),
        User.find( query )
            .skip( Number( desde ) )
            .limit( Number( limite ) )
    ]);

    res.json({
        total,
        users
    });

}

const userPost = async ( req, res = response ) => {

    const { name, mail, password, role } = req.body;
    const user = new User( { name, mail, password, role } );

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(); // numero de vueltas de encriptacion, por defecto 10
    user.password = bcryptjs.hashSync( password, salt ); // encriptar en una sola via - ( contraseña, numero de vueltas)

    //Guardar en DB
    await user.save();

    res.json({
        user
    });

}

const userPut = async ( req, res = response ) => {

    const { id } = req.params; //id es el nombre puesto en la ruta ej: api/user/12
    const { _id, password, google, mail, ...resto } = req.body;

    //Validar contra base de datos
    if ( password ) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }
    
    const user = await User.findByIdAndUpdate( id, resto );

    res.json( user );

}

const userDelete = async ( req, res = response ) => {

    const { id } = req.params;
    
    //Borrar fisicamente
    //const user = await User.findByIdAndDelete( id );

    //Borrar cambiando el estado - para no perder posibles referenfcias dentro de la db
    const user = await User.findByIdAndUpdate( id, { state: false });

    res.json( user );

}

const userPatch = ( req, res = response ) => {
    res.json({
        msg: 'patch API - Controller'
    });
}


module.exports = {
    userGet,
    userPut,
    userPost,
    userDelete,
    userPatch
}