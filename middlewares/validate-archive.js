const { response } = require("express")

const validateArchive = ( req, res = response, next ) => {

    //Verificar si viene vacio la peticion
    if ( !req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {

        return res.status(400).json({
            msg: 'No hay archivos que subir - validateArchive'
        });
      
    }

    next();

}


module.exports = {
    validateArchive
}