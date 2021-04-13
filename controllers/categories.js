const { response } = require('express');
const { Categorie } = require('../models');

//Ver Categorias - paginado - total - populate
const getCategories = async ( req = request, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { state: true };
    
    const [ total, categories ] = await Promise.all([
        Categorie.countDocuments( query ),
        Categorie.find( query )
            .populate( 'user', 'name' )
            .skip( Number( desde ) )
            .limit( Number( limite ) )
    ]);

    res.json({
        total,
        categories
    });

}

//Ver Categoria - populate
const getCategorie = async ( req, res = response ) => {

    const { id } = req.params;

    const categorie = await Categorie.findById( id ).populate( 'user', ' name' );

    res.json( categorie );

}

//Crear Categoria
const createCategorie = async ( req, res = response ) => {

    const name = req.body.name.toUpperCase();

    //Revisar si existe ya una categoria con ese nombre
    const categorieDB = await Categorie.findOne( { name } );

    if ( categorieDB ) {
        return res.status(400).json({
            msg: `La vategoria ${ categorieDB.name } ya existe `
        });
    }

    //Generar la data a guardar
    const data = {
        name,
        user: req.user._id
    }

    const categorie = new Categorie( data );

    //Guardar en DB
    await categorie.save();

    res.status(201).json( categorie );

}

//ACtualizar Categoria
const updateCategorie = async ( req, res = response ) => {

    const { id } = req.params;

    const { state, user, ...data } = req.body;

    data.name = data.name.toUpperCase();

    data.user = req.user._id;

    const categorie = await Categorie.findByIdAndUpdate( id, data, { new: true } );

    res.json( categorie );

}

//Borrar Categoria - estado: false
const deleteCategorie = async ( req, res = response ) => {

    const { id } = req.params;

    const categorieDelete = await Categorie.findByIdAndUpdate( id, { state: false }, { new: true } );

    res.json( categorieDelete );

}


module.exports = {
    createCategorie,
    getCategories,
    getCategorie,
    updateCategorie,
    deleteCategorie
}