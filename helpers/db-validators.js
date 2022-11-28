const Role = require('../models/role');
const User = require('../models/user');

const isValidRole = async(role = '') => {

    const existsRole = await Role.findOne({ role });
    if ( !existsRole ) {
        throw new Error(`El rol ${ role } no está registrado en la BD`);
    }
}

const existsEmail = async( email = '' ) => {

    // Verificar si el email existe
    const existsEmail = await User.findOne({ email });
    if ( existsEmail ) {
        throw new Error(`El correo: ${ email }, ya está registrado`);
    }
}

const existsUserById = async( id ) => {

    // Verificar si el usuario existe
    const existsUser = await User.findById(id);
    if ( !existsUser ) {
        throw new Error(`El id no existe ${ id }`);
    }
}



module.exports = {
    isValidRole,
    existsEmail,
    existsUserById
}

