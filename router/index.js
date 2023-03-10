const ROUTER = require('express').Router;
const USER_CONTROLLER = require('../controllers/user-controller');

const router = new ROUTER();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/registration',
body('username').isLength({min: 6, max: 16}),
body('email').isEmail(),
body('password').isLength({min: 6, max: 16}),
USER_CONTROLLER.registration);

router.post('/login', USER_CONTROLLER.login);
router.post('/logout', USER_CONTROLLER.logout);
router.get('/activate/:link', USER_CONTROLLER.activate);
router.get('/refresh', USER_CONTROLLER.refresh);
router.get('/users', authMiddleware ,USER_CONTROLLER.getUsers);  //test endpoint
router.post('/settings', 
body('username').isLength({min: 6, max: 16}),
USER_CONTROLLER.changeAccountSettings);
router.post('/setter', USER_CONTROLLER.accountSetter);
router.get('/user', USER_CONTROLLER.getUser);

module.exports = router;