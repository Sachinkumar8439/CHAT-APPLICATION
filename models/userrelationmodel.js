const mongoose = require('mongoose');

const UserRelationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  follower: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  notifications: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        
      },
      type: {
        type: String,
        enum: ['follow', 'like', 'comment'], // Add types of notifications
      },
      message: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
      read: {
        type: Boolean,
        default: false,
      },
      status:{
        type:String,
        enum:['','requested','ok'],
        default: '',
      }
    },
  ],
});

module.exports = mongoose.model('UserRelation', UserRelationSchema);
