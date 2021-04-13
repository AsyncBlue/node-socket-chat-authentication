const { Categorie, Product } = require('../models');
const Role = require('../models/role');
const User = require('../models/user');

const isValidateRole = async ( role = '' ) => {

    const existsRole = await Role.findOne( { role } );
    if ( !existsRole ) {
        throw new Error(`El rol ${ role } no esta registrado en la DB`);
    }

}

const mailExists = async ( mail = '' ) => {

    const existsMail = await User.findOne( { mail } );
    if ( existsMail ) {
        throw new Error( `El correo: ${ mail } ya esta registrado` );
    }

}

const existsUserId = async ( id ) => {

    const existsMail = await User.findById( id );
    if ( !existsMail ) {
        throw new Error( `El ID: ${ id } no existe` );
    }

}

const existsCategorieId = async ( id ) => {

    const existsCategorie = await Categorie.findById( id );
    if ( !existsCategorie ) {
        throw new Error( `El ID: ${ id } no existe` );
    }

}

const existsProductId = async ( id ) => {

    const existsProduct = await Product.findById( id );
    if ( !existsProduct ) {
        throw new Error( `El ID: ${ id } no existe` );
    }

}

//Validar colecciones permitidas
const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {

    const incluida = colecciones.includes( coleccion );

    if ( !incluida ) {
        throw new Error( `La coleccion ${ coleccion } no es permitida. Colecciones permitidas: ${ colecciones }` );
    }

    return true;

};


module.exports = {
    isValidateRole,
    mailExists,
    existsUserId,
    existsCategorieId,
    existsProductId,
    coleccionesPermitidas
}