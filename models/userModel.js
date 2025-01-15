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
    password:{
        type:String,
        required:true
    },
    username:{
        type :String,
        required:true,

    },
    photo: {
         type: String, 
         default:'',
        },
    is_online:{
        type:String,
        default:'0'
    }
},
{timestamps:true}
);

module.exports = mongoose.model('User', userSchema);
