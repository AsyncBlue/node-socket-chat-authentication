const { Schema, model } = require('mongoose');

const UserSchema = Schema({

    name: {
        type: String,
        required: [ true, 'El nombre es requerido' ]
    },
    mail: {
        type: String,
        required: [ true, 'El correo es requerido' ],
        unique: true
    },
    password: {
        type: String,
        required: [ true, 'La contraseña es requerida' ],
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
/*         enum: ['ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'], */
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});

UserSchema.methods.toJSON = function() {

    const { __v, password, _id, ...user } = this.toObject(); //esta quitando _v ,password y almacenando todo el resto de argumentos en user

    user.uid = _id; //cambia visualmente el _id de mongo a uid

    return user;
    
}


module.exports = model( 'User', UserSchema );  //(nombre de la coleccion en singular, esquema)