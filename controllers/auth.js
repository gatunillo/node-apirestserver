const { response, json } = require('express');
const bcryptjs = require('bcryptjs')

const User = require('../models/user');

const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
      
        // Verificar si el email existe
        const user = await User.findOne({ email });
        if ( !user ) {
            return res.status(400).json({
                msg: 'User / Password no son correctos - email'
            });
        }

        // SI el user está activo
        if ( !user.status ) {
            return res.status(400).json({
                msg: 'User / Password no son correctos - status: false'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, user.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'User / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }   

}

const googleSignIn = async(req, res = response) => {

    const { id_token } = req.body;

    try {
        const { name, email, img } = await googleVerify(id_token);

        let user = await User.findOne({ email });

        if(!user){
            // Crearlo
            const data = {
                name,
                email,
                password: ':P',
                img,
                role: 'USER_ROLE',
                google: true
            };
            
            user = new User(data);
            await user.save();
        }

        // Si el user en DB
        if(!user.status){
            return res.status(401).json({
                msg: 'Hable con el administrador - Usuario bloqueado'
            });
        }


        // Generar JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

    
}



module.exports = {
    login,
    googleSignIn
}
