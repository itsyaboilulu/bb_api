let _ = require('lodash');
let moment = require('moment');

class DashboardHelper extends require('./BaseHelper.js') {
    constructor(props) {
        super(props);
    }

    getDashboard = async () => {

        await this.spoofData()

        return {
            bat: await this.#getBattery(),
            temp: await this.#getTemp(),
            settings: await this.#getSettings()
        }
    }

    //private
    #getBattery = async () => {
        let battery = await (this._getModel('battery')).last();
        return {
            v: battery.b_v / 10000,
            a: battery.b_a,
            i: battery.b_a_in,
            o: battery.b_a_out,
        }
    }

    #getTemp = async () => {
        let temp = await (this._getModel('TempratureModel')).last();
        return {
            t: ( ( parseInt(temp.t_temp1) + parseInt(temp.t_temp2) + parseInt(temp.t_temp3) ) / 3 ) / 100,
            f: parseInt(temp.t_temp1) / 100,
            m: parseInt(temp.t_temp2) / 100,
            b: parseInt(temp.t_temp3) / 100,
            c: parseInt(temp.t_temp4) / 100
        }
    }

    #getSettings = async () => {
        let settings = await (this._getModel('VanSettingsModel')).get();
        let ret = {};
        settings.map(i =>
            ret[i.name] = i.value    
        )
        return ret;
    }

    spoofData = async () => {
       
        let dateTime = moment().format('YYYY-MM-DD HH:mm:ss');

        //spoof
        let volt = parseInt((12.6 + Math.random()) * 10000)
        let percentage = volt / ( 14  * 10000 )
        const batteryRecord = {
            b_v: volt,
            b_w: parseInt(4620 * percentage),
            b_a: parseInt(330 * percentage),
            b_a_in: Math.random() * 3,
            b_a_out: Math.random() * 3,
            b_datetime: dateTime
        };

        const tempratureRecord  = {
            t_temp1: parseInt((Math.random() * 32) * 100),
            t_temp2: parseInt((Math.random() * 32) * 100),
            t_temp3: parseInt((Math.random() * 32) * 100),
            t_temp4: parseInt((Math.random() * 32) * 100),
            t_datetime: dateTime
        };

        await this._getModel('battery').create(batteryRecord);
        await this._getModel('temprature').create(tempratureRecord);

        return;
    }

}

module.exports = DashboardHelper