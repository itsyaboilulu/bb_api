const Models = require("../../Databases/Models.js");

const _ = require("lodash");
const moment = require("moment");

module.exports = async function (parms) {

    let PaymentModel = Models.getModel('PaymentModel');

    return await _.map( await  PaymentModel.with(['payee']).orderBy('payment_id','desc').get(), i=> {
        let ret = {
            id: i.payment_id,
            type: i.payment_type,
            amount: i.payment_amount,
            date: moment(i.payment_datetime).format('YYYY-MM-DD'),
            payee: i.payee.user_username,
            payeeId: i.payee.user_id,
            added: i.payment_datetime,
            reference: i.payment_reference,
            note: i.payment_notes,
        }
        return ret;
    })

}