const mongoose = require('mongoose');
// const { type } = require('os');  

const userSchema =  new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type :String,
        required:true,

    },
    image: {
         type: String,
         default:"man.png",
        },
    is_online:{
        type:String,
        default:'0'
    },
    bio:{
        type:String,
        default:'hey there i am using this chat app',
    },

    groups:[ {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        }]
},
{timestamps:true}
);

module.exports = mongoose.model('User', userSchema);
