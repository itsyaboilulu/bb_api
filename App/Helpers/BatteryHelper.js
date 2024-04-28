let _ = require('lodash');
let moment = require('moment');

class BatteryHelper extends require('./BaseHelper.js') {
    constructor(props) {
        super(props);
    }

    getCurrent = async () => {
        let battery = await (this._getModel('battery')).last();
        return {
            v: battery.b_v / 10000,
            a: battery.b_a,
            i: battery.b_a_in,
            o: battery.b_a_out,
        }
    }

    getBatteryRecords = async () => {
        let battery = await this.#getBattery();
        return battery.map(i=>({
            v: parseFloat(i.b_v / 10000).toFixed(3),
            a: parseFloat(i.b_a).toFixed(3),
            i: parseFloat(i.b_a_in).toFixed(3),
            o: parseFloat(i.b_a_out).toFixed(3),
            d: moment(i.b_datetime).format('YYYY-MM-DD HH:mm:ss')
        }))
    }

    //private
    #getBattery = async () => {
        return await (this._getModel('battery')).get();
    }

}

module.exports = BatteryHelper