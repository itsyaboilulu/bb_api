const Models = require("../../Databases/Models.js");

const _ = require("lodash");
const moment = require("moment");

module.exports = async function (parms) {

    let PotModel = Models.getModel('PotModel');

    PotModel = PotModel.with([
        'payee','reason'
    ]);

    if ( !parms?.allStatus ){
        PotModel = PotModel.whereNot('pot_status', 'cancelled');
    }

    return await _.map( await PotModel.orderBy('pot_id','desc').get(), i=> {
        let ret = {
            id: i.pot_id,
            amount: i.pot_amount,
            status: i.pot_status,
            time: i.pot_datetime,
            date: moment(i.pot_datetime).format('YYYY-MM-DD'),
            reason: i.reason.reason_name,
            icon: i.reason.reason_icon,
            note: i.pot_notes,
            payee: i.payee.user_username,
            payeeId: i.payee.user_id,
            added: i.pot_created_datetime
        }
        return ret;
    })

}