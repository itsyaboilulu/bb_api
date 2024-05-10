const Models = require("../Databases/Models.js");
const AuthHelper = require("../Helpers/AuthHelper.js");
const ErrorHelper = require("../Helpers/ErrorHelper.js");
const AuthValidator = require("../Validators/AuthValidator.js");
const moment = require("moment");

class AuthController {

    // register = async (req, res) => {

    //     let params = req.body;
    //     let username = params.username ?? null;
    //     let password = params.password ?? null;
    //     let password2 = params.password2 ?? null;

    //     let errorHelper = new AuthValidator().validateRegister(username, password, password2);
    //     if ( errorHelper.hasErrors() ) {
    //         return errorHelper.getErrorResponse(res);
    //     } 
        
    //     try {
    //         let userModel = Models.getModel('userModel');
    //         let newUser = await userModel.create({
    //             user_username: username,
    //             user_password: await AuthHelper.hashPassword(password),
    //             user_access_type: 'BB'
    //         })
    //         res.json({
    //             success: true,
    //             jwt: await AuthHelper.createUserToken(newUser)
    //         });
    //         return;
    //     } catch (err) {
    //         errorHelper.addError(
    //             'username_taken',
    //             'username is taken',
    //             'username'
    //         );
    //         return errorHelper.getErrorResponse(res);
    //     }
    // }

    login = async (req, res) => {

        let params = req.body;
        let username = params.username ?? null;
        let password = params.password ?? null;

        let errorHelper = new ErrorHelper();
        
        let isBanned = await AuthHelper.loginAuditIsBanned(req); 
        if (isBanned) {
            errorHelper.addError(
                'banned',
                'this username or ip address is banned',
                'ip'
            )
            return errorHelper.getErrorResponse(res);
        }

        errorHelper = new AuthValidator(errorHelper).validateLogin( password, username );

        if ( errorHelper.hasErrors() ){
            await AuthHelper.createFailedAudit(req);
            return errorHelper.getErrorResponse(res);
        }   
        
        let UserModel = Models.getModel('UserModel');
        let user = await UserModel.where('user_username', username).first();

        if (!user) {
            await AuthHelper.createFailedAudit(req);
            errorHelper.addError(
                'invalid_user',
                'the entered usernanme or password was not found',
                'password'
            )
            return errorHelper.getErrorResponse(res);
        }

        if (await AuthHelper.comparePassword(password, user.user_password)){

            await AuthHelper.createSuccesfulAudit(req);
            res.json({
                success: true,
                jwt: await AuthHelper.createUserToken(user),
                user: {
                    id: user.user_id,
                    username: user.user_username
                }
            });
            return;
        } else {
            errorHelper.addError(
                'invalid_user',
                'the entered usernanme or password was not found',
                'password'
            )
            return errorHelper.getErrorResponse(res);
        };

    }

}

module.exports =  new AuthController();
