const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateJWT = ( uid = '' ) => {  // uid = user id-entification

    return new Promise( ( resolve, reject ) => {  // se necesita trabajar en base a promesas y jwt trabaja en base a callbacks

        const payload = { uid }; // info que guarda el jwt - en este caso solo el id

        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, ( err, token ) => {

            if ( err ) {
                console.log(err);
                reject( 'No se pudo generar el Token' );
            } else {
                resolve( token );
            }
            
        });

    }); 

}

const comprobarJWT = async ( token = '' ) => {

    try {

        if ( token.length < 10 ) {
            return null;
        }

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        const user = await User.findById( uid );

        if ( user ) {
            if ( user.state ) {
                return user;
            } else {
                return null;
            }
        } else {
            return null;
        }

    } catch (error) {
        return null;
    }

}


module.exports = {
    generateJWT,
    comprobarJWT
}