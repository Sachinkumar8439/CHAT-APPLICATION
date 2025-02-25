const mongoose = require('mongoose');
// const { type } = require('os');

const chatSchema =  new mongoose.Schema({
    sender_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    receiver_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    message:{
        type:String,
        required:true

    }
    
},
{timestamps:true}
);

module.exports = mongoose.model('roomchat', chatSchema);
