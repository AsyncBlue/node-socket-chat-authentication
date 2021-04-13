const { Router } = require('express');
const { check } = require('express-validator');
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/products');
const { existsProductId, existsCategorieId } = require('../helpers/db-validators');


const { validateJWT, validateFields, isAdminRole } = require('../middlewares');

const router = Router();

//Obtener todas los productos - publico
router.get( '/', getProducts );

//Obtener producto por id - publico
router.get( '/:id', [
    check( 'id' , 'No es un id valido' ).isMongoId(),
    check( 'id' ).custom( existsProductId ),
    validateFields
], getProduct );

//Crear producto - privado - cualquier persona con un token valido
router.post( '/', [ 
    validateJWT, 
    check( 'name', 'El nombre es obligatorio' ).not().isEmpty(),
    check( 'categorie', 'No es un ID valido de Mongo' ).isMongoId(),
    check( 'categorie' ).custom( existsCategorieId ),
    validateFields
], createProduct );

//Actualizar preoducto - privado - cualquier persona con un token valido
router.put( '/:id', [
    validateJWT,
    /* check( 'categorie', 'No es un ID valido de Mongo' ).isMongoId(), */
    check( 'id' ).custom( existsProductId ),
    validateFields
], updateProduct );

//Borrar producto - ADMIN 
router.delete( '/:id', [
    validateJWT,
    isAdminRole,
    check( 'id' , 'No es un id valido' ).isMongoId(),
    check( 'id' ).custom( existsProductId ),
    validateFields
], deleteProduct );


module.exports = router;