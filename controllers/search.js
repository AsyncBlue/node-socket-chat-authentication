const { response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { User, Categorie, Product } = require('../models');

const collectionsAllowed = [
    'users',
    'categories',
    'products',
    'roles'
]

const searchUsers = async ( termino = '', res = response ) => {

    const isMongoID = ObjectId.isValid( termino ); // si es un id de mongo regresa un true 

    if ( isMongoID ) {

        const user = await User.findById( termino );

        return res.json({
            results: ( user ) ? [ user ] : [] // si existe el user regreso un array con el user si no regreso un array vacio
        });

    }

    const regex = new RegExp( termino, 'i' ); // RegExp expresion regular de JS 'i' = insensible a las mayusculas

    const users = await User.find( { 
        $or: [ { name: regex }, { mail: regex } ],
        $and: [ { state: true } ]
     } );

    return res.json({
        results: users
    });

}


const searchCategories = async ( termino = '', res = response ) => {

    const isMongoID = ObjectId.isValid( termino ); // si es un id de mongo regresa un true 

    if ( isMongoID ) {

        const categorie = await Categorie.findById( termino );

        return res.json({
            results: ( categorie ) ? [ categorie ] : [] // si existe el user regreso un array con el user si no regreso un array vacio
        });

    }

    const regex = new RegExp( termino, 'i' ); // RegExp expresion regular de JS 'i' = insensible a las mayusculas

    const categories = await Categorie.find( { name: regex, state: true } );

    return res.json({
        results: categories
    });

}


const searchProducts = async ( termino = '', res = response ) => {

    const isMongoID = ObjectId.isValid( termino ); // si es un id de mongo regresa un true 

    if ( isMongoID ) {

        const product = await Product.findById( termino ).populate( 'categorie', 'name' );

        return res.json({
            results: ( product ) ? [ product ] : [] // si existe el user regreso un array con el user si no regreso un array vacio
        });

    }

    const regex = new RegExp( termino, 'i' ); // RegExp expresion regular de JS 'i' = insensible a las mayusculas

    const products = await Product.find( { name: regex, state: true } ).populate( 'categorie', 'name' );

    return res.json({
        results: products
    });

}

const search = ( req, res = response ) => {

    const { collection, termino } = req.params;

    //Verificar si la coleccion a buscar esta dentro de las colecciones permitidas
    if ( !collectionsAllowed.includes( collection ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ collectionsAllowed }`
        });
    }

    switch ( collection ) {

        case 'users':
            searchUsers( termino, res );
            break;
        
        case 'categories':
            searchCategories( termino, res );
            break;
        
        case 'products':
            searchProducts( termino, res );
            break;

        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda xd'
            });

    }

}


module.exports = {
    search
}