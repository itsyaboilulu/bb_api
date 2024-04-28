const Validator = require('./Validator.js');

module.exports = class AutheValidator extends Validator {
    constructor(props){
        super(props)
    }

    validateLogin = (password, username) => {
    
        if (this.validateIsset(password)) {
            this.ErrorHelper.addError(
                'missing password',
                'Password is required',
                'password'
            )
        }
    
        if (this.validateIsset(username)) {
            this.ErrorHelper.addError(
                'missing username',
                'Username is required',
                'username'
            )
        }
    
        return this.ErrorHelper;
    
    }

    validateRegister = (username, password, password2) => {

        if (this.validateIsset(password)) {
            this.ErrorHelper.addError(
                'missing password',
                'Password is required',
                'password'
            )
        }

        if (this.validateLength(password, 7)){
            this.ErrorHelper.addError(
                'password_short',
                'Password needs to be 7 characters or more',
                'password'
            )
        }

        if (this.validateIsset(password2)) {
            this.ErrorHelper.addError(
                'missing password',
                'Password is required',
                'password2'
            )
        }

        if (!this.ErrorHelper.hasErrors()){
            if ( password2 !== password) {
                this.ErrorHelper.addError(
                    'mismatch password',
                    'Passwords do not match',
                    'password2'
                )
            }
        }

        if (this.validateIsset(username)) {
            this.ErrorHelper.addError(
                'missing username',
                'Username is required',
                'username'
            )
        }

        return this.ErrorHelper;

    }

}   