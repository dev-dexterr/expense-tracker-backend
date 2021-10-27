import Transaction from "../models/Transaction.js";
import UserProfile from "../models/User.js";
import * as msg from "../utils/message.js";
import { meta } from "../utils/enum.js";

export async function listTransaction(req, res) {
    try {
        if (req.body.limit === undefined) {
            req.body.limit = 10;
        }
        let transaction = await Transaction.find({userprofile: req.body.userprofile}).limit(req.body.limit)
        transaction = transaction.map((p) => {
            return {
                id: p._id,
                userprofile: p.userprofile,
                name: p.name,
                datetime: p.datetime,
                type: p.type,
                amount: p.amount,
                iconName: p.iconName,
                remark: p.remark
            }
        })
        res.status(200).json({ meta: meta.OK, datas: transaction, total: transaction.length })
    } catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message })
    }
}

export async function getTransaction(req, res) {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (transaction == null) {
            res.status(200).json({ meta: meta.ERROR, message: msg.generalMsg.record_notexist });
        } else {
            res.status(200).json({ meta: meta.OK, data: transaction });
        }
    } catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function addTransaction(req, res) {
    try {
        const transaction = new Transaction(req.body);
        transaction.save()
            .then((data) => {
                res.status(200).json({ meta: meta.OK, message: msg.generalMsg.record_add })
            })
            .catch((err) => {
                res.status(200).json({ meta: meta.ERROR, message: err.message });
            })
    } catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function editTransaction(req, res) {
    try {
        Transaction.findByIdAndUpdate({ _id: req.body.id }, {amount: req.body.amount, userprofile: req.body.userprofile, remark: req.body.remark, datetime: req.body.date, type: req.body.type, name: req.body.name, iconName: req.body.iconName}).exec((err,data) => {    
            if(err){
                res.status(500).json({meta: meta.ERROR, message: err.message});
                return true;
            }
            if(data != null){
                res.status(200).json({ meta: meta.OK, message: msg.generalMsg.record_update });
            }else{
                res.status(200).json({meta: meta.ERROR, message: message.record_notexist});
            }
        })
    } catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

export async function deleteTransaction(req, res) {
    try {
        await Transaction.remove({_id: req.params.id}).exec((err, data) => {
            if (err) {
                res.status(404).json({ meta: meta.ERROR, message: err.message });
                return true
            }

            if (data != null) {
                res.status(200).json({ meta: meta.OK, message: msg.generalMsg.record_delete });
            } else {
                res.status(200).json({ meta: meta.NOTEXIST, message: msg.generalMsg.record_notexist });
            }
        })
    } catch (err) {
        res.status(404).json({ meta: meta.ERROR, message: err.message });
    }
}

