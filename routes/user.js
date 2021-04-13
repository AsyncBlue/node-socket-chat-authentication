const { Router } = require('express');
const { check } = require('express-validator');

//const { validateFields } = require('../middlewares/validate-fields');
//const { validateJWT } = require('../middlewares/validate-jwt');
//const { isAdminRole, tieneRole } = require('../middlewares/validate-roles');
const { validateFields, validateJWT, isAdminRole, tieneRole } = require('../middlewares'); // optimizacion de importaciones de arriba

const { isValidateRole, mailExists, existsUserId } = require('../helpers/db-validators');

const { userGet, userPut, userPost, userDelete, userPatch } = require('../controllers/user');



const router = Router();


router.get( '/', userGet );

router.put( '/:id', [
    check( 'id', 'No es un ID valido').isMongoId(),
    check( 'id' ).custom( existsUserId ),
    check( 'role' ).custom( isValidateRole ),
    validateFields
], userPut );

router.post( '/', [
    check( 'name', 'El nombre es obligatorio' ).not().isEmpty(), // isEmpty = si viene el campo vacio  - not = la negacion de isEmpty
    check( 'password', 'El password debe poseer mas de 6 caracteres' ).isLength( { min: 6 } ),
    check( 'mail', 'El correo no es valido' ).isEmail(),
    check( 'mail' ).custom( mailExists ),
    //check( 'role', 'El rol no es valido' ).isIn( ['ADMIN_ROLE', 'USER_ROLE'] ), // isIn = debe existir en la lista del arreglo
    check( 'role' ).custom( isValidateRole ),
    validateFields
],userPost );

router.delete('/:id', [
    validateJWT,
    //isAdminRole,
    tieneRole( 'ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE' ),
    check( 'id', 'No es un ID valido').isMongoId(),
    check( 'id' ).custom( existsUserId ),
    validateFields
], userDelete );

router.patch('/', userPatch );


module.exports = router;