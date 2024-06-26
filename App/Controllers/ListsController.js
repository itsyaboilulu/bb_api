const Models = require("../Databases/Models.js");
const _ = require("lodash");

const DiceByType = require("../Engines/Dice/DiceByType.js");

class ListsController {

    async getUsers(req, res) {
        let UserModel = Models.getModel('UserModel');

        res.json(
            _.map(await UserModel.get(), i => ({
                id: i.user_id,
                name: i.user_username
            }))
        );
    }
   
    async getReasons(req, res) {
        let ReasonModel = Models.getModel('ReasonsModel');

        res.json(
            _.map(await ReasonModel.get(), i => ({
                id: i.reason_id,
                name: i.reason_name,
                icon: i.reason_icon
            }))
        );
    }

    async getDice(req, res) {
        res.json(await DiceByType())
    }
}

module.exports =  new ListsController();
