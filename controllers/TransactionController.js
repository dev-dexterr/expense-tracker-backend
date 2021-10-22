import Transaction from "../models/Transaction";
import UserProfile from "../models/User.js";
import * as msg from "../utils/message.js";
import { meta } from "../utils/enum.js";

export async function listTransaction(req,res){
    try{
        if(req.body.limit === undefined){
            req.body.limit = 10;
        }
        let transaction = await Transaction.find().populate("userprofile").limit(req.body.limit)
        transaction = transaction.map((p)=> {
            return{
                id: p._id,
                userprofile: p.userprofile,
                name: p.name,
                datetime: p.datetime,
                type: p.type,
                amount: p.amount,
                iconname: p.iconname,
                remark: p.remark
            }
        })
        res.status(200).json({meta: meta.OK, datas: transaction, total: transaction.length})
    }catch(err){
        res.status(404).json({meta: meta.ERROR,message: err.message})
    }
}

