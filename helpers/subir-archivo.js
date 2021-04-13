const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extensionesPermitidas = [ 'png', 'jpg', 'jpeg', 'gif' ], carpeta = '' ) => {

    return new Promise( ( resolve, reject ) => {

        const { archivo } = files;

        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length - 1 ];

        //Validar la extension
        if ( !extensionesPermitidas.includes( extension ) ) {

            return reject( `La extension ${ extension } no es permitida. Las extensiones permitidas son: ${ extensionesPermitidas }` );
           
        }

        const nombreTemporal = uuidv4() + '.' + extension;

        //PATH donde se guardara el archivo
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemporal );

        //Mover el archivo hacia donde queremos guardarlo
        archivo.mv( uploadPath, (err) => {

            if (err) {
                reject(err);
            }
        
            resolve( nombreTemporal );

        });

    });

}

module.exports = {
    subirArchivo
}