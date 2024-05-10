const Models = require("../Databases/Models.js");

const moment = require("moment");

const AllRolls = require('./../Engines/Dice/AllRolls.js');


class DiceController {

    //post
    async setRoll(req, res) {

        let user = req.loggedInUser

        let params = req.body;
        let target = params.target ?? user.i;
        let roll = params.roll ?? 6;
        let type = params.type ?? 'Shame';
        let parent = params.parent ?? 0;

        let DiceRollsModel = Models.getModel('DiceRollsModel');
        DiceRollsModel = await DiceRollsModel.create({
            roll_roll: roll,
            roll_type: type,
            roll_member: user.i,
            roll_target_member: target,
            roll_parent_roll: parent,
            roll_datetime: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        res.json({success: DiceRollsModel.roll_id})
    }

    async logMIAI(req, res) {
        //log money isnt an issue, (DOS: 2)

        let user = req.loggedInUser

        let params = req.body;
        let target = parseInt(params.target ?? user.i);

        let PotModel = Models.getModel('PotModel');
        PotModel.create({
            pot_amount: 20,
            pot_status: 'Debit',
            pot_created_by: user.i,
            pot_created_for: target,
            pot_created_datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
            pot_datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
            pot_reason_id: 1,
            pot_notes: `Rolled a 2 on dice of shame`
        })

        res.json({success: true})
    }

    async logFreeParking(req, res) {
        //log free parking, (KennyLoggins: 2)

        let user = req.loggedInUser

        let params = req.body;
        let target = parseInt(params.target ?? user.i);

        target = await ( await Models.getModel('UserModel')).find(target);

        let transactions = await AllTransactions();
        let amount = _.sumBy(transactions, t =>
            t.trans === 'Debit' ?
                parseFloat(t.amount) :
                (
                    t.trans === 'Spend' ?
                    0 - parseFloat(t.amount) : 0
                )
        );

        if (amount) {
            let SpendsModel = await Models.getModel('SpendsModel');
            await SpendsModel.create({
                spend_reference: `KL${moment().unixTime()}`,
                spend_vender: `Internal - ${target.user_username}`,
                spend_type: 'Bank',
                spend_amount: amount,
                spend_notes: `${target.user_username} rolled a 2 on the kenny loggins dice and chose to withdraw`,
                spend_date: moment().format('YYYY-MM-DD'),
                spend_datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
            })
        }
    }

    //get
    async getRolls(req, res) {
        res.json(await AllRolls());
    }
   
}

module.exports =  new DiceController();
