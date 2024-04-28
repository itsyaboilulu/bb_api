require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Constants = require('./../../constants.js');
const moment = require('moment');
const _ = require('lodash');
const { Op } = require("sequelize");

class AuthHelper {
    constructor(){
        this.model = null;
        this.loginAuditsModel = null;
    }

    _getModel(){
        //help reduce the number of new connections to db
        if (!this.model){
            this.model = require("../Databases/Models.js");
        }
        return this.model;
    }

    //PASSWORD
    hashPassword = async function(plaintextPassword) {
        return await bcrypt.hash(plaintextPassword, 10).then((hash) => {
            return hash.toString();
        });
    }

    comparePassword = async function(plaintextPassword, hash) {
        return await bcrypt.compare(plaintextPassword, hash);
    }
    
    // login 
    _getLoginAuditsModel(){
        if (!this.loginAuditsModel) {
            this.loginAuditsModel = this._getModel().getModel('LoginAuditModel');
        }
        return this.loginAuditsModel;
    }

    createFailedAudit = async function(req) {

        let params = req.body;
        let email = params.email ?? null;
        let password = params.password ?? null;

        return await (await this._getLoginAuditsModel()).create({
            la_ip_address: req.ip,
            la_success: false,
            la_email: email,
            la_with_password: !!password,
            la_datetime: moment().format('YYYY-MM-DD HH:mm:ss')
        });
    }   

    createSuccesfulAudit = async function(req){

        let params = req.body;
        let email = params.email ?? null;
        let password = params.password ?? null;

        return await this._getLoginAuditsModel().create({
            la_ip_address: req.ip,
            la_success: true,
            la_email: email,
            la_with_password: !!password,
            la_datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
        });
    }  

    loginAuditIsBanned = async function(req) {
        let params = req.body;
        let username = params.username ?? null;
        
        let ip = req.ip;

        let audit = await (await this._getLoginAuditsModel())
                        .orWhere('la_username', username)
                        .orWhere('la_ip_address', ip)
                        .get();

        if (_.filter(audit,{la_ip_address: ip}).length > 500){
            return 'Ip'
        }

        if (_.filter(audit,{la_username: username}).length > 500){
            return 'Username'
        }

        return false;

    }
    
    //JWT   
    createUserToken = async function(userModel) {
        return jwt.sign({
            user: {
                i: userModel.user_id,
                n: userModel.user_username,
                s: userModel.user_access_type
            },
            expire: moment().add(Constants.jwt.expire, 'seconds').unix()
        }, Constants.jwt.secret, { expiresIn: `${Constants.jwt.expire}s` });
    }

    getDecodedToken = token => {
        return jwt.verify(token, Constants.jwt.secret)
    }

    isTokenValid = token => {
        if (!token) return false;
        if (this.isTokenExpired(token)) return false;
        if (this.isTokenFalse(token)) return false;
        return true;
    }
    
    isTokenExpired = token => {
        return moment().unix() > this.getDecodedToken(token)?.expire
    }

    isTokenFalse = token => {
        let user =  this.getDecodedToken(token)?.user;
        if(!user) return true;
        if (!user.s || user?.i < 1) return true;
        return false;
    }
}

module.exports = new AuthHelper();




