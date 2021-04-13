const { response } = require('express');
const { Product } = require('../models');

//Ver Productos - paginado - total - populate
const getProducts = async ( req = request, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { state: true };
    
    const [ total, products ] = await Promise.all([
        Product.countDocuments( query ),
        Product.find( query )
            .populate( 'user', 'name' )
            .populate( 'categorie', 'name' )
            .skip( Number( desde ) )
            .limit( Number( limite ) )
    ]);

    res.json({
        total,
        products
    });

}

//Ver Producto - populate
const getProduct = async ( req, res = response ) => {

    const { id } = req.params;

    const product = await Product.findById( id ).populate( 'user', ' name' ).populate( 'categorie', ' name' );

    res.json( product );

}

//Crear Producto
const createProduct = async ( req, res = response ) => {

    const { state, user, ...body } = req.body;

    //Revisar si existe ya una categoria con ese nombre
    const productDB = await Product.findOne( { name: body.name } );

    if ( productDB ) {
        return res.status(400).json({
            msg: `El producto ${ productDB.name } ya existe `
        });
    }

    //Generar la data a guardar
    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id
    }

    const product = new Product( data );

    //Guardar en DB
    await product.save();

    res.status(201).json( product );

}

//ACtualizar Producto
const updateProduct = async ( req, res = response ) => {

    const { id } = req.params;

    const { state, user, ...data } = req.body;

    if( data.name ) {
        data.name = data.name.toUpperCase();
    }

    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate( id, data, { new: true } );

    res.json( product );

}

//Borrar Producto - estado: false
const deleteProduct = async ( req, res = response ) => {

    const { id } = req.params;

    const productDelete = await Product.findByIdAndUpdate( id, { state: false }, { new: true } );

    res.json( productDelete );

}


module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
}