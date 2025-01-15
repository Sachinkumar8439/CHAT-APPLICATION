const express = require("express");
const User = require("./models/userModel");
const userrelation = require("./models/userrelationmodel");
const app = express();
const http = require("http").Server(app);
require("dotenv").config();
const path = require("path");
var mongoose = require("mongoose");
const chat = require('./models/chatModel')
const UserRelation =require('./models/userrelationmodel')

mongoose
  .connect("mongodb://localhost:27017/makechatapp", {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));

const userRoute = require("./routes/userRoute");
app.use("/", userRoute);

const io = require("socket.io")(http);

var usp = io.of("/user-namespace");
const usersockets={};

usp.on("connection", async (socket) => {
  console.log("user connected");
  const userid = socket.handshake.auth.token;
  usersockets[userid] = socket.id;

  

  await User.findByIdAndUpdate({ _id: userid }, { $set: { is_online: "1" } });
  socket.broadcast.emit("getOnlineUser", { user_id: userid });
  console.log("your id is", userid);
  socket.on("disconnect", async () => {

  
    console.log("user disconnected");
    await User.findByIdAndUpdate({ _id: userid }, { $set: { is_online: "0" } });

    socket.broadcast.emit("getOfflineUser", { user_id: userid });
  });
socket.on('newchat',(data)=>{
  socket.broadcast.emit('loadnewchat',data);

});

// followe requiest 
socket.on('newnottification', async (data)=>{
  // console.log("senderid : ",data.sender_id," and userid :",data.userId);

  const user = await User.findById(data.sender_id);
  const myrelation = await userrelation.findOne({userId:data.userId});
  // console.log("myrelation object is ",myrelation)
  data = {follower:user,myrelation:myrelation}

        socket.broadcast.emit('addnottification',data);

})

socket.on('getdata', async (data)=>{
  let id  = data.id;
 await UserRelation.updateOne(
             { userId:data.sender_id },
             { $addToSet: { following: data.id,
             } }, 
 
             { upsert: true } 
           );
  // console.log("it is here",id)
  const user = await User.findById(data.id)
  console.log("user found " ,user)
  socket.emit('dataIs',user);

})


socket.on('updatedata',async (data)=>{
  const sender_id = data.sender_id;
  const result = await UserRelation.updateOne(
    { userId: sender_id}, 
    { $set: { 'notifications.$[].read': true } } 
  );

})

// loading of old chts 
socket.on('typing',(data)=>{
       socket.broadcast.emit('loadtyping',data);
})

socket.on('existschat',async (data)=>{
  //  messageId = await chat.findOne({ _id: data._id});
  
  var chats = await chat.find({$or:[
    {sender_id:data.sender_id,receiver_id:data.receiver_id},
    {sender_id:data.receiver_id,receiver_id:data.sender_id}
  ]})

  socket.emit('loadchats',{chats:chats,sender_id:data.sender_id,receiver_id:data.receiver_id});

})
socket.on('seen',(data)=>{
  socket.broadcast.emit('loadseen',data)

})


});

http.listen(3000, () => {
  console.log("Server started on port 3000...");
});
