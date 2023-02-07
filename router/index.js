const ROUTER = require('express').Router;
const USER_CONTROLLER = require('../controllers/user-controller');

const router = new ROUTER();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/registration',
body('email').isEmail(),
body('password').isLength({min: 6, max: 16}), //валидация по длине пароля
USER_CONTROLLER.registration);
router.post('/login', USER_CONTROLLER.login);
router.post('/logout', USER_CONTROLLER.logout);
router.get('/activate/:link', USER_CONTROLLER.activate);
router.get('/refresh', USER_CONTROLLER.refresh);
router.get('/users', authMiddleware ,USER_CONTROLLER.getUsers);  //test endpoint

module.exports = router;