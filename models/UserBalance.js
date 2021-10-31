import mongoose from "mongoose";

const UserBalanceSchema = mongoose.Schema({
    income:{
        type: String,
        required: true,
    },
    expense:{
        type: String,
        required: true,
    },
    totalBalance:{
        type: String,
        required: true,
    }
},{
    versionKey: false
});

export default mongoose.model("UserBalance", UserBalanceSchema);