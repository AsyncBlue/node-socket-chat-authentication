const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn, renovarToken } = require('../controllers/auth');
const { validateFields, validateJWT } = require('../middlewares');

const router = Router();


router.post( '/login', [
    check( 'mail', 'El correo no es valido' ).isEmail(),
    check( 'password', 'La contraseña es obligatoria' ).not().isEmpty(),
    validateFields
],login );

router.post( '/google', [
    check( 'id_token', 'El id_token es necesario' ).not().isEmpty(),
    validateFields
], googleSignIn );

router.get( '/', validateJWT, renovarToken );


module.exports = router;