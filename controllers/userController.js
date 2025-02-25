const User = require("../models/userModel");
const userinfo = require("../models/userinfo");
const Chat = require("../models/chatModel");
const Group = require("../models/groupmodel");
const perform = require("../controllers/common");
const UserRelation = require("../models/userrelationmodel");
const bcrypt = require("bcrypt");
const fetch = require('node-fetch');
// const { response } = require("express");
// const chatModel = require("../models/chatModel");
// const Room = require("../models/roomModel");
// Assuming you have a `roomModel`

// Render the registration page

const registerload = (req, res) => {
  try {
    console.log("point registerload");
    res.render("register");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

// Handle user registration
const registerhandle = async (req, res) => {
  try {
    console.log("point registerhandle");
    const { name, username, email, password } = req.body;
    console.log(password,email,username,name);
  //   let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // // Remove IPv6 prefix if present
  // if (ip.startsWith('::ffff:')) ip = ip.split(':').pop();

  // Replace localhost IPs for testing with a known public IP
  // if (ip === '127.0.0.1' || ip === '::1') {
  //   ip = '8.8.8.8'; // Example: Google's public DNS IP
  // }

    // Using a free API like ip-api.com
    // const response = await fetch(`http://ip-api.com/json/${ip}`);
    // const locationData = await response.json();
    // console.log("the location data",locationData);


    const userdata = await userinfo.findOne({email})
    if (!userdata) {
      const existusername = await User.findOne({ username });

      if (!existusername) {
        const passwordhash = await bcrypt.hash(password, 10);
        const user = new User({
          name,
          username,
        });

        await user.save();
        const thisuser  = await User.findOne({username:username})
        let userid = thisuser;
        console.log("this is user id", userid)
        const userinformation = new userinfo({
          userId:thisuser._id,
          email,
          password:passwordhash,
        });
        await userinformation.save()
        req.session.user = user; // Set session
        return res.redirect("/dashboard");
      } else {
        return res.render("register", { message: "Username allready taken" });
      }
    } else {
      return res.render("register", { message: "Email already exists!" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

// Render the login page
const loadlogin = async (req, res) => {
  try {
    // let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Remove IPv6 prefix if present
    // if (ip.startsWith('::ffff:')) ip = ip.split(':').pop();
  
    // // Replace localhost IPs for testing with a known public IP
    // if (ip === '127.0.0.1' || ip === '::1') {
    //   ip = '8.8.8.8'; // Example: Google's public DNS IP
    // }
  
      // Using a free API like ip-api.com
      // const response = await fetch(`http://ip-api.com/json/${ip}`);
      // const locationData = await response.json();
      // console.log("the location data",locationData);
    
    console.log("point loadlogin");

    res.render("login");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

// Handle user login
const login = async (req, res) => {
  try {
     console.log("point login");

    const { email, password } = req.body;

    const userdata = await userinfo.findOne({ email });

    if (userdata) {
      const passwordMatch = await bcrypt.compare(password, userdata.password);
      let user = await User.findOne({_id:userdata.userId})
      if (passwordMatch) {
        req.session.user = user;
        return res.redirect("/dashboard");
      } else {
        return res.render("login", { message: "Incorrect email or password!" });
      }
    } else {
      return res.render("login", { message: "Email does not exist!" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const loadforgetpage = async (req, res) => {
  try {
    console.log("point loadforgat");
    const message = req.session.message || ""; // Retrieve the message
    req.session.message = "";
    res.render("forget", { message: message });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const handleforget = async (req, res) => {
  console.log("point handleforget");
  try {
    const email = req.body.email;
    const user = await userinfo.findOne({ email: email });
    if (user) 
      {
      const otp = perform.genrateotp();
      console.log("this is the otp ", otp);
      const sending = perform.sendmail(email, otp);
      if (sending) {
        req.session.otp = otp;
        req.session.email = email;
        console.log("mail send succesfully check");
        res.redirect('/varification');
      } 
      else 
      {
        console.log("mail not sent");
      }
    } 
    else 
    {
      req.session.message =
        "email not found ensure you enter the correct email";
      res.redirect("/forgetpassword");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};


const loadvarifiactionpage = async(req,res)=>{
  console.log("point loadvarifocationpage");
  message = req.session.message || '';
  req.session.message ='';

  try {
    res.render('otppage',{message:message});
    
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
    
  }
};

const handleotp = async (req, res) => {
  console.log("point handle otp");
 try {
  const otp = req.body.otp;

  if (!otp) {
    return res.status(400).json({ success: false, message: 'OTP is required' });
  }

  if (req.session.otp && req.session.otp == otp) {
    req.session.otp = null; // Invalidate OTP after use
    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
  
 } catch (error) {
  console.log(error.message);
    res.status(500).send("Internal Server Error");
  
 }
};



const loadresetpasswordpage = async (req,res)=>{
  try {
    res.render('resetpassword');
    
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
    
  }

}


const resetpassword = async(req,res)=>{
  console.log("point reset password")
  try {
    const password = req.body.password;
    if(password)
    {
      const  hashpassword =  await bcrypt.hash(password,10)
     let hashed= await userinfo.updateOne({email:req.session.email},{
        $set:{password:hashpassword},
      });
      console.log("bolien hashed ",hashed);
      if(hashed)
      {
        
        console.log("password updated!" ,password);

      }
      else
      {
        console.log("password not updated due to error");
      }
      

    }
    
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
    
  }
}






// Render the dashboard
const loaddashboard = async (req, res) => {
  try {
    console.log("point loaddashoard");
    // let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Remove IPv6 prefix if present
  // if (ip.startsWith('::ffff:')) ip = ip.split(':').pop();

  // // Replace localhost IPs for testing with a known public IP
  // if (ip === '127.0.0.1' || ip === '::1') {
  //   ip = '8.8.8.8'; // Example: Google's public DNS IP
  // }

    // Using a free API like ip-api.com
    // const response = await fetch(`http://ip-api.com/json/${ip}`);
    // const locationData = await response.json();
    // console.log("the location data",locationData)


    if (req.session.user) {
      const users = await User.find({ _id: { $nin: [req.session.user._id] } });
      const myrelation = await UserRelation.findOne({
        userId: req.session.user._id,
      });
      // console.log('my relation on server dashboard ',myrelation);
      let notification_sender_users = {
        user: [],
        notification: [],
      };
      let unreaded = 0;
      if (myrelation) {
        // console.log(myrelation.notifications);
        for (let i = 0; i < myrelation.notifications.length; i++) {
          for (let j = 0; j < users.length; j++) {
            if (myrelation.notifications[i].sender == `${users[j]._id}`) {
              if (!myrelation.notifications[i].read) {
                unreaded++;
              }
              notification_sender_users.user.push(users[j]);
              notification_sender_users.notification.push(
                myrelation.notifications[i]
              );
            }
          }
        }
      }
      // console.log('notification sender user ',notification_sender_users.user);
      // console.log('notification sender user ',notification_sender_users.notification);
     let user= req.session.user;
      let ids = [];
      for (let i = 0; i < user.groups.length; i++) {
        ids.push(user.groups[i]);
        
      }
      console.log("group ids are ",ids);
      let groups=[];
      for (const id of ids)
      {
        let groupcoming = await Group.findById(id);
        console.log("coming id is ",groupcoming);
        groups.push(groupcoming);
      }
     
      
      console.log("groups are ",groups);
      

      res.render("dashboard", {
        groups,
        user,
        users,
        notification_sender_users,
        unreaded,
      });
    } else {
      return res.redirect("/login");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const deletechat = async (req, res) => {
  try {
    console.log("point deletechat");
    const chat = await Chat.findOne({ _id: req.body.message_id });
    let sender = chat.sender_id;
    let reciever = chat.receiver_id;
    await Chat.deleteOne({ _id: req.body.message_id });
    res.status(200).send({ success: true, data:{message_id:req.body.message_id,sender,reciever}});


  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

// // Render the join room page
// const joinroomform = async (req, res) => {
//   try {
//     const rooms = await Room.find(); // Fetch all available rooms
//     res.render("joinroom", { rooms });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send("Internal Server Error");
//   }
// };

// // Handle room joining
// const joinroom = async (req, res) => {
//   try {
//     const { roomId } = req.body;

//     if (roomId) {
//       const room = await Room.findById(roomId);
//       if (room) {
//         return res.redirect(`/room/${roomId}`); // Redirect to the room
//       } else {
//         return res.render("joinroom", { message: "Room not found!" });
//       }
//     } else {
//       return res.render("joinroom", { message: "Room ID is required!" });
//     }
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send("Internal Server Error");
//   }
// };

// // Render a specific room
// const room = async (req, res) => {
//   try {
//     const { roomId } = req.params;

//     const room = await Room.findById(roomId);

//     if (room) {
//       res.render("room", { room });
//     } else {
//       res.status(404).send("Room not found!");
//     }
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send("Internal Server Error");
//   }
// };

// Handle logout
const logout = async (req, res) => {
  try {
    console.log("point loagout");

    req.session.destroy((err) => {
      if (err) {
        console.log(err.message);
        return res.status(500).send("Failed to log out.");
      }
      res.redirect("/");
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};
const savechat = async (req, res) => {
  try {
    console.log("point save-chat");

    const { sender_id, receiver_id, message } = req.body;
    const chat = new Chat({ sender_id, receiver_id, message });
    const id = await User.find({ _id: receiver_id })._id;

    const savedChat = await chat.save();
    console.log("saved messageid", savedChat._id);

    res
      .status(200)
      .send({
        success: true,
        message: "Chat saved!",
        data: savedChat,
        userid: id,
      });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ success: false, message: error.message });
  }
};


const savereact = async (req, res) => {
  try {
    const { message_id, emojitext, sender_id } = req.body;
    let chat = await Chat.findOne({_id:message_id});
    console.log("chats are this",chat);
    let reactions = chat.reactions;
    if(reactions.length != 0)
    {
      reactions.forEach((reaction)=>{
        if(reaction)
        {
          if(reaction.senderId == sender_id)
          {
            console.log("reaction exist already");
            if(reaction.emoji == emojitext)
            {
              console.log("emoji metches");
              
            }
            else
            {
              console.log("emoji not matches");
              

            }
  
          }
        }
  
      })

    }
    else
    {
      console.log("no any reaction present");
      await Chat.updateOne(
        { _id: message_id },
        {
          $push: { reactions: { emoji: emojitext, senderId: sender_id } }
        }
      );
      let newChat = await Chat.findById(message_id);
    res.status(200).send({ success: true, message: "Emoji added", chat: newChat });
    }
    
    
   
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const saveedit = async (req,res)=>{
  try {
    const {username,extrainfo,sender_id} = req.body;
    const name  = req.body.Name;
    console.log(name,username,extrainfo,sender_id);
    // console.log("userfound",user);
    let message;
    let isusernameexist = await User.findOne({username:username});
    if(!isusernameexist)
      {
      await User.updateOne({_id:sender_id},
        {
          $set:{
            name:name,
            username:username,
            bio:extrainfo,
            
            
          }
        }
        
      )
      message = "saved data sucssefullly";
    }
    else{
      await User.updateOne({_id:sender_id},
        {
          $set:{
            name:name,
            bio:extrainfo,
          }
        }
      )
      message = "saved secssesfully but username not save please enter unique"
    }
    let user = await User.findById(sender_id);
    req.session.user=user;
    console.log("user",user);
    res.status(200).send({success:true,message:message,user});
 
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
}


const search = async (req, res) => {
  try {
    console.log("point search");

    const { sender_id, username } = req.body;
    const users = await User.find({
      username: { $regex: `^${username}` },
      _id: { $ne: sender_id },
    }).limit(10);
    if (users) {
      console.log("user exists in data");
      res
        .status(200)
        .send({ success: true, message: "user found", data: users });
    } else console.log("user not exists in data ");
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = {
  registerload,
  registerhandle,
  loadlogin,
  login,
  loadforgetpage,
  handleforget,
  loadvarifiactionpage,
  handleotp,
  loadresetpasswordpage,
  resetpassword,
  loaddashboard,
  savechat,
  deletechat,
  savereact,
  saveedit,
  // createroom,
  // createroomhandle,
  // joinroomform,
  // joinroom,
  // room,
  logout,
  search,
};
