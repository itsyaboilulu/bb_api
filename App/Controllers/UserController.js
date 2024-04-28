const Models = require("../Databases/Models.js");
const _ = require("lodash");

class UserController {

    async getUsers(req, res) {
        let PotModel = Models.getModel('UserModel');

        res.json(
            _.map(await PotModel.get(), i => ({
                id: i.user_id,
                name: i.user_username
            }))
        );
    }
   
}

module.exports =  new UserController();
