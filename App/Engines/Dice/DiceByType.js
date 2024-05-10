const Models = require("../../Databases/Models.js");

const _ = require("lodash");
const moment = require("moment");

module.exports = async function (parms) {

    let DiceModel = Models.getModel('DiceModel');

    let ret = {};

    await _.each(await  DiceModel.get(), i => {
        if(!ret[i.dice_type]){
            ret[i.dice_type] = [];
        }
        ret[i.dice_type].push({
            id: i.dice_id,
            value: i.dice_value,
            title: i.dice_title,
            desc: i.dice_desc
        })
    })

    return ret

}