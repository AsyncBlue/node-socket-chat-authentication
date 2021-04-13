const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require('../models');

const chatMensajes = new ChatMensajes();

const socketController = async ( socket = new Socket, io ) => {

    const user = await comprobarJWT( socket.handshake.headers['x-token'] );

    if ( !user ) {
        return socket.disconnect();
    }

    //Agregar al usuario conectado
    chatMensajes.conectarUsuario( user );
    io.emit( 'usuarios-activos', chatMensajes.usuariosArr );
    socket.emit( 'recibir-mensajes', chatMensajes.ultimos10 );

    //Conectarlo a una sala especial
    socket.join( user.id ); //global, socket.id, user.id

    //Limpiar cuando alguien se desconecta
    socket.on( 'disconnect', () => {
        chatMensajes.desconectarUsuario( user.id );
        io.emit( 'usuarios-activos', chatMensajes.usuariosArr );
    });

    socket.on( 'enviar-mensaje', ( { uid, mensaje } ) => {

        if ( uid ) {
            //Mensaje Privado
            socket.to( uid ).emit( 'mensaje-privado', { de: user.name, mensaje } );

        } else {

            chatMensajes.enviarMensaje( user.id, user.name, mensaje );
            io.emit( 'recibir-mensajes', chatMensajes.ultimos10 );

        }
        
    });

}


module.exports = {
    socketController
}