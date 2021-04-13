const { Router } = require('express');
const { check } = require('express-validator');
const { createCategorie, getCategories, getCategorie, updateCategorie, deleteCategorie } = require('../controllers/categories');
const { existsCategorieId } = require('../helpers/db-validators');

const { validateJWT, validateFields, isAdminRole } = require('../middlewares');

const router = Router();

//Obtener todas las categorias - publico
router.get( '/', getCategories );

//Obtener categoria por id - publico
router.get( '/:id', [
    check( 'id' , 'No es un id valido' ).isMongoId(),
    check( 'id' ).custom( existsCategorieId ),
    validateFields
], getCategorie );

//Crear categoria - privado - cualquier persona con un token valido
router.post( '/', [ 
    validateJWT, 
    check( 'name', 'El nombre es obligatorio' ).not().isEmpty(),
    validateFields
], createCategorie );

//Actualizar categoria - privado - cualquier persona con un token valido
router.put( '/:id', [
    validateJWT,
    check( 'name', 'El nombre es obligatorio' ).not().isEmpty(),
    check( 'id' ).custom( existsCategorieId ),
    validateFields
], updateCategorie );

//Borrar categoria - ADMIN 
router.delete( '/:id', [
    validateJWT,
    isAdminRole,
    check( 'id' , 'No es un id valido' ).isMongoId(),
    check( 'id' ).custom( existsCategorieId ),
    validateFields
], deleteCategorie );


module.exports = router;