const { Router } = require('express');
const { check } = require('express-validator');

const {
    validateFields,
    validateJWT,
    isAdminRole,
    hasRole
} = require('../middlewares');

const { isValidRole, existsEmail, existsUserById } = require('../helpers/db-validators');

const { usersGet,
        usersPut,
        usersPost,
        usersDelete,
        usersPatch } = require('../controllers/users');

const router = Router();



router.get('/', usersGet );

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existsUserById ),
    check('rol').custom( isValidRole ), 
    validateFields
], usersPut);

router.post('/',[
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom( existsEmail ),
    // check('role', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('role').custom( isValidRole ), 
    validateFields
], usersPost);

router.delete('/:id',[
    validateJWT,
    // isAdminRole,
    hasRole('ADMIN_ROLE', 'VENTAS_ROLE','OTRO_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existsUserById ),
    validateFields
], usersDelete);

router.patch('/', usersPatch);


module.exports = router;