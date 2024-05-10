const moment = require("moment");
const Models = require("../Databases/Models.js");

const _ = require("lodash");

//engins
const AllTransactions = require('../Engines/Transactions/AllTransactions.js')

class BankController {

    async getBank(req, res) {
        let transactions = await AllTransactions();
        console.log(transactions)
        res.json(
            _.orderBy(
                transactions,
                ['date'], ['desc']
            )
        );
    }
    

    async addToPot(req, res) {

        /*
            pot: '20.00',
            payee: props.user.user.id,
            reason: 1,
            notes: ''
        */


        let params = req.body;
        let pot = params.pot ?? null;
        let payee = params.payee ?? null;
        let reason = params.reason ?? null;
        let notes = params.notes ?? null;

        let user = req.loggedInUser

        let PotModel = Models.getModel('PotModel');
        PotModel.create({
            pot_amount: pot,
            pot_status: 'Debit',
            pot_created_by: user.i,
            pot_created_for: payee,
            pot_created_datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
            pot_datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
            pot_reason_id: reason,
            pot_notes: notes
        })
        res.json({success: true})
    }


}

module.exports =  new BankController();
