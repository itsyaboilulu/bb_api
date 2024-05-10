const Models = require("../../Databases/Models.js");

const _ = require("lodash");
const moment = require("moment");

module.exports = async function (parms) {

    let SpendsModel = Models.getModel('SpendsModel');

    return await _.map( await SpendsModel.orderBy('spend_id','desc').get(), i=> {
        let ret = {
            id: i.spend_id,
            amount: i.spend_amount,
            status: i.spend_status,
            time: i.spend_datetime,
            date: i.spend_date,
            reference: i.spend_reference,
            note: i.spend_notes,
            added: i.spend_datetime,
            vender: i.spend_vender
        }
        return ret;
    })

}