const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    groupname:{
        type:String,
        required:true,
    },
    users:[{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        joined:{
            type:Boolean,
            default:false,
        }
    }]
       

})

module.exports = mongoose.model("group", groupSchema);
