const { Router } = require('express');
const { check } = require('express-validator');
const { uploadFile, updateImage, mostrarImagen, updateImageCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

const { validateFields, validateArchive } = require('../middlewares');

const router = Router();


router.post( '/', validateArchive, uploadFile );

router.put( '/:collection/:id', [
    validateArchive,
    check( 'id', 'El id debe ser de mongo' ).isMongoId(),
    check( 'collection' ).custom( c => coleccionesPermitidas( c, [ 'users', 'products' ] ) ),
    validateFields
], updateImageCloudinary );
//], updateImage );

router.get( '/:collection/:id', [
    check( 'id', 'El id debe ser de mongo' ).isMongoId(),
    check( 'collection' ).custom( c => coleccionesPermitidas( c, [ 'users', 'products' ] ) ),
    validateFields
], mostrarImagen );


module.exports = router;