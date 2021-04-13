const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer( this.app );
        this.io = require('socket.io')(this.server);

        this.paths = {
            auth: '/api/auth',
            user: '/api/user',
            categories: '/api/categories',
            products: '/api/products',
            search: '/api/search',
            uploads: '/api/uploads'
        }

        //Conectar a la base de datos
        this.connectDB();

        //Middlewares
        this.middlewares();

        //Rutas de la aplicación
        this.routes();

        //Sockets
        this.sockets();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {

        //CORS
        this.app.use( cors() );

        //Lectura y parseo del Body
        this.app.use( express.json() );

        //Directorio publico
        this.app.use( express.static('public') );

        //FileUpload - Carga de archivos
        this.app.use( fileUpload ( {
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        } ) );

    }

    routes() {

        this.app.use( this.paths.auth, require('../routes/auth') );
        this.app.use( this.paths.user, require('../routes/user') );
        this.app.use( this.paths.categories, require('../routes/categories') );
        this.app.use( this.paths.products, require('../routes/products') );
        this.app.use( this.paths.search, require('../routes/search') );
        this.app.use( this.paths.uploads, require('../routes/uploads') );

    }

    sockets() {

        this.io.on("connection", ( socket ) => socketController( socket, this.io) );

    }

    listen() {
        this.server.listen( this.port, () => {
            console.log( 'Servidor corriendo en puerto', this.port );
        });
    }

}

module.exports = Server;