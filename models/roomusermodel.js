const mongoose = require('mongoose');
// const { type } = require('os');  

const userSchema =  new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    code:{
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

module.exports = mongoose.model('Roomuser', userSchema);
