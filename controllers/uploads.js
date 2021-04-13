const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { User, Product } = require('../models');

const uploadFile = async ( req, res = response ) => {
    
    try {

        //Imagenes
        //const nombre = await subirArchivo( req.files, ['txt', 'md'], 'textos' );
        const nombre = await subirArchivo( req.files, undefined, 'imgs' );

        res.json( { nombre } );
        
    } catch (msg) {
        res.status(400).json({ msg });
    }
    
}


const updateImage = async ( req, res = response ) => {

    const { id, collection } = req.params;

    let modelo;

    switch ( collection ) {

        case 'users':

            modelo = await User.findById( id );
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }

            break;

        case 'products':

            modelo = await Product.findById( id );
            if ( !modelo ) {
                return res.status(400).json({
                        msg: `No existe un producto con el id ${ id }`
                });
             }
    
            break;

        default:

            return res.status(500).json({ msg:'Se me olvido validar esto' });

    }

    //Limpiar imagenes previas
    if ( modelo.img ) {

        //Hay que borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads', collection, modelo.img );

        //Se comprueba que exista
        if ( fs.existsSync( pathImagen ) ) {
            //Se borra
            fs.unlinkSync( pathImagen );

        }

    }

    const nombre = await subirArchivo( req.files, undefined, collection );

    modelo.img = await nombre;

    await modelo.save();

    res.json( modelo );

}

const updateImageCloudinary = async ( req, res = response ) => {

    const { id, collection } = req.params;

    let modelo;

    switch ( collection ) {

        case 'users':

            modelo = await User.findById( id );
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }

            break;

        case 'products':

            modelo = await Product.findById( id );
            if ( !modelo ) {
                return res.status(400).json({
                        msg: `No existe un producto con el id ${ id }`
                });
             }
    
            break;

        default:

            return res.status(500).json({ msg:'Se me olvido validar esto' });

    }

    //Limpiar imagenes previas
    if ( modelo.img ) {
        //Se separa por /
        const nombreArr = modelo.img.split('/');
        //Se obtiene el ultimo elemento del arreglo luego del split
        const nombre = nombreArr[ nombreArr.length - 1 ];
        //Desestructuracion de arreglo para el primer elemento luego de separarlo por puntos y se obtiene el ID Publico
        const [ public_id ] = nombre.split('.');

        //Borrar de Cloudinary
        cloudinary.uploader.destroy( public_id );

    }

    const { tempFilePath } = req.files.archivo;

    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

    modelo.img = secure_url;

    await modelo.save();

    res.json( modelo );

}


const mostrarImagen = async ( req, res = response ) => {

    const { id, collection } = req.params;

    let modelo;

    switch ( collection ) {

        case 'users':

            modelo = await User.findById( id );
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }

            break;

        case 'products':

            modelo = await Product.findById( id );
            if ( !modelo ) {
                return res.status(400).json({
                        msg: `No existe un producto con el id ${ id }`
                });
             }
    
            break;

        default:

            return res.status(500).json({ msg:'Se me olvido validar esto' });

    }

    if ( modelo.img ) {

        const pathImagen = path.join( __dirname, '../uploads', collection, modelo.img );

        //Se comprueba que exista
        if ( fs.existsSync( pathImagen ) ) {
            //Se muestra la imagen
            return res.sendFile( pathImagen )

        }

    }

    //Mostrar imagen Not Found
    const pathImagenNotFound = path.join( __dirname, '../assets/no-image.jpg' );
    res.sendFile( pathImagenNotFound );

}


module.exports = {
    uploadFile,
    updateImage,
    mostrarImagen,
    updateImageCloudinary
}

