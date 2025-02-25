const Room = require("../models/roommodel");
const Roomuser = require("../models/roomusermodel");
const bcrypt = require("bcrypt");

// Render the create room page
const createroom = async (req, res) => {
  try {
    return res.render("createroom");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};



// Handle room creation
const createroomhandle = async (req, res) => {
   try {
    const roomcode = req.body.roomcode;
    if(roomcode.length < 6)
    {
        return res.render("createroom",{message : "please enter atleast 6 digit Code"})
    }
    else 
    {
        console.log("point 1")
    
          const { name, email, roomname} = req.body;
          console.log("point 2")
      
          const userdata = await Room.findOne({ email });
          if (!userdata) {
            console.log("point 3")
    
            const codehash = await bcrypt.hash(roomcode, 10);
            console.log("point 12")
    
            const room = new Room({
              name,
              email,
              roomname,
              roomcode: codehash,
              
            });
            console.log("point 4")
    
            await room.save();
            req.session.room = room; // Set session
            console.log("point 5")
    
            return res.render("room",{roomdata:room});
    
          } else {
            console.log("point 7")
    
            return res.render("createroom", { message: "room by this email already exists!" });
          }

    }

    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
};

const loadjoinroom = async (req, res) => {
    try {
     return res.render("joinroom");
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  };

  // Handle user login
  const joinroomhandle  = async (req, res) => {
    try {
      const { username, code} = req.body;
  
      const userdata = await Room.findOne({roomcode:code });
  
      if (userdata) {
        const codehash = await bcrypt.hash(code, 10);


        const roomuser = new Roomuser({
              username,
              code: codehash,
              
            });
            console.log("point 4")
    
          await roomuser.save();
          req.session.roomuser= roomuser;
          return res.redirect("/room");
        } 
      else {
        return res.render("joinroom", { message: "INCORRECT CODE" });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  };

  const loadroom = async (req,res)=>{
    try {
         if (req.session.roomuser) {
              res.render("room", { roomuser: req.session.roomuser});
            } else {
              return res.redirect("/joinroom");
            }

        
    } catch (error) {
        console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }




module.exports = {
    createroom,
    createroomhandle,
    loadjoinroom,
    joinroomhandle,
    loadroom,
}