import mongoose from "mongoose";

const TransactionSchema = mongoose.Schema({
    userprofile:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'userprofile',
        requried: true
    },
    name: {
        type: String,
        requried: true
    },
    datetime:{
        type: String,
        requried: true,
    },
    type:{
        type: String,
        requried: true
    },
    amount:{
        type: String,
        requried: true
    },
    iconName:{
        type: Number,
        requried: true
    },
    remark: {
        type: String,
    }
},
{
    versionKey: false
});

export default mongoose.model("transaction", TransactionSchema, "transaction");