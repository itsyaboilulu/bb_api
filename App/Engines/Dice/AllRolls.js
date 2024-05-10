const Models = require("../../Databases/Models.js");

const _ = require("lodash");
const moment = require("moment");

module.exports = async function (parms) {

    let DiceRollsModel = Models.getModel('DiceRollsModel');

    DiceRollsModel = PotModel.with([
        'secondRoll','member','targetMember'
    ]).orderBy('roll_id', 'desc');

    let ret = {};

    await _.each(await DiceRollsModel.get(), i => {
        ret = {
            ...ret,
            [i.roll_id] : {
                id: i.roll_id,
                roll: i.roll_roll,
                type: i.roll_type,
                time: i.roll_datetime,
                parent: i.roll_parent_roll,
                member: {
                    id: i.targetMember.user_id,
                    name: i.targetMember.user_username
                },
                roller: {
                    id: i.member.user_id,
                    name: i.member.user_username
                },
                child: null
            }
        }
    })

    let keys = _.keys(ret);

    let _ret = [];

    await _.each(
        _.orderBy(keys, i=>i, 'desc'),
        k => {
            if (parseInt(ret[k].parent)>0){
                ret[ret[k].parent].child = ret[k];
            } else {
                _ret.push(ret[k])
            }
        }
    )

    return _ret

}