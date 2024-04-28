const { Router } = require("express");

//Controllers
const AuthController = require("./App/Controllers/AuthController.js");
const UserController = require("./App/Controllers/UserController.js");
const BankController = require("./App/Controllers/BankController.js");
const ListsController = require("./App/Controllers/ListsController.js");

//Middleware
const JwtAuthMiddleware = require('./App/Middleware/JwtAuthMiddleware.js');
const IpMiddleware = require('./App/Middleware/IpMiddleware.js');




const MiddlewareRouter = () => {
    var router = Router();
    router.use(JwtAuthMiddleware);

    //routes
    router.use('/bank', BankRouter())
    router.use ('/users', UsersRouter());
    router.use('/lists', ListsRouter());
   
    return router;
}

//Routes
const AuthRouter = () => {
    var router = Router();

    router.use(IpMiddleware);
    router.post('/login', AuthController.login);
    //router.post('/register', AuthController.register);

    return router;
};

const BankRouter = () => {
    var router = Router();
    router.get('', BankController.getBank);
    router.post('/pot', BankController.addToPot);
    return router
}

const UsersRouter = () => {
    var router = Router();
    router.get('', UserController.getUsers);
    return router
}

const ListsRouter = () => {
    var router = Router();
    router.get('/users', ListsController.getUsers);
    router.get('/reasons', ListsController.getReasons);
    return router
}

//export
module.exports = function(){
    var router = Router();
    router.use('/auth', AuthRouter());
    router.use('/', MiddlewareRouter());
    return router;
}