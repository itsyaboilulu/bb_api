const _ = require('lodash');

//engins
const AllPot = require(".././Pot/AllPot.js");
const AllPayment = require(".././Payment/AllPayment.js");
const AllSpend = require(".././Spend/AllSpend.js");

module.exports = async function() {
    return [
        ..._.map(await AllPot(), p => ({
            id: `d${p.id}`,
            amount: p.amount,
            date: p.date,
            type: p.reason,
            payee: p.payee,
            payeeId: p.payeeId, 
            trans: 'Debit',
            icon: p.icon,
            data: {
                added: p.added,
                reason: p.reason,
                notes: p.note
            }
        })),
        ..._.map(await AllPayment(), p => ({
            id: `p${p.id}`,
            amount: p.amount,
            date: p.date,
            type: p.type,
            trans: 'Payment',
            payee: p.payee,
            payeeId: p.payeeId, 
            icon: 'Add',
            data: {
                added: p.added,
                reference: p.reference,
                notes: p.note
            }
        })),
        ..._.map(await AllSpend(), p => ({
            id: `s${p.id}`,
            amount: p.amount,
            date: p.date,
            type: p.type,
            trans: 'Spend',
            icon: 'PaidIcon',
            vender: p.vender,
            data: {
                added: p.added,
                reference: p.reference,
                notes: p.note
            }
        }))
    ];
}