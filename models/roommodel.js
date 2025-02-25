const mongoose = require('mongoose');
// const { type } = require('os');  

const userSchema =  new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    roomname:{
        type:String,
        required:true
    },
    roomcode:{
        type:String,
        required:true
     },
    is_online:{
        type:String,
        default:'0'
    }
},
{timestamps:true}
);

module.exports = mongoose.model('room', userSchema);
