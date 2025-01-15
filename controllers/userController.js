const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const UserRelation = require("../models/userrelationmodel");
const bcrypt = require("bcrypt");
const { response } = require("express");
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

    const { name,username, email, password } = req.body;
    console.log(password);

    const userdata = await User.findOne({ email });
    if (!userdata) {
      const existusername = await User.findOne({ username });

      if(!existusername){

        const passwordhash = await bcrypt.hash(password, 10);
        const user = new User({
          name,
          email,
          password: passwordhash,
          username,
        });
  
        await user.save();
        req.session.user = user; // Set session
        return res.redirect("/dashboard");
      }
      else {
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

    const userdata = await User.findOne({ email });

    if (userdata) {
      const passwordMatch = await bcrypt.compare(password, userdata.password);
      if (passwordMatch) {
        req.session.user = userdata;
       return  res.redirect("/dashboard");
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

// Render the dashboard
const loaddashboard = async (req, res) => {
  try {
    console.log("point loaddashoard");

    if (req.session.user) {
      const users = await User.find({ _id: { $nin: [req.session.user._id] } });
      const myrelation = await UserRelation.findOne({ userId: req.session.user._id });
      // console.log('my relation on server dashboard ',myrelation);
      let notification_sender_users = {
        user : [],
        notification:[],
      };
      let  unreaded =0;
      if(myrelation)
        {
        // console.log(myrelation.notifications);
        for (let i = 0; i < myrelation.notifications.length; i++) {
          for (let j = 0; j < users.length; j++) {
            if(myrelation.notifications[i].sender == `${users[j]._id}`)
            {
              if(!myrelation.notifications[i].read){unreaded++}
              notification_sender_users.user.push(users[j]);
              notification_sender_users.notification.push(myrelation.notifications[i]);
               
            }

            
          }
          
        }
      }
      // console.log('notification sender user ',notification_sender_users.user);
      // console.log('notification sender user ',notification_sender_users.notification);

      
      res.render("dashboard", { user: req.session.user,users,notification_sender_users,unreaded });
    } else {
      return res.redirect("/login");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};


const deletechat = async (req,res)=>{
  try {
    console.log("point deletechat");

    await Chat.deleteOne({_id:req.body.id});  
  } catch (error) {
    res.status(400).send({success:false , msg:error.message});
    
  }
}



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
      const username = await User.find({ _id: receiver_id }).name;

      const savedChat = await chat.save();
      console.log("saved messageid",savedChat._id);

      res.status(200).send({ success: true, message: 'Chat saved!', data: savedChat ,username:username});
  } catch (error) {
      console.error(error.message);
      res.status(500).send({ success: false, message: error.message });
  }
};

const search = async(req,res)=>{
  try {
    console.log("point search");

    const {sender_id , username} = req.body;
    const users = await User.find({ username: { $regex: `^${username}` },_id: { $ne: sender_id }, })
                                 .limit(10); 
    if(users){
      console.log("user exists in data")
      res.status(200).send({ success: true, message: 'user found', data:users});
    }
    else console.log("user not exists in data ");
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ success: false, message: error.message });
  }

}

module.exports = {
  registerload,
  registerhandle,
  loadlogin,
  login,
  loaddashboard,
  savechat,
  deletechat,
  // createroom,
  // createroomhandle,
  // joinroomform,
  // joinroom,
  // room,
  logout,
  search,
};
