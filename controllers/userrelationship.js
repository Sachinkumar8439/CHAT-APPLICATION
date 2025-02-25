const UserRelation = require("../models/userrelationmodel");
const User = require("../models/userModel");
const Group = require("../models/groupmodel");
// const { request } = require("express");

const addfollower = async(req,res)=>{
    
    try {
        const {sender_id,userId} = req.body;
     await UserRelation.updateOne(
            { userId:userId },
            { $addToSet: { follower: sender_id ,
                notifications: {
                    sender: sender_id, 
                    type: 'follow', 
                    message: ' has started to following you.',
                    timestamp: new Date(),
                    read: false,
                    status:'requested',
                    
                },

            } }, 

            { upsert: true } 
          );
          user_followed = await User.findById(userId);
     await UserRelation.updateOne(
            { userId : sender_id },
            { $addToSet: { following: userId } }, 
            { upsert: true } 
          );
        // const userdata = await User.findById(sender_id);  
        console.log(user_followed);

        res.status(200).send({ success: true, message: 'requested', data:user_followed,type:'follow'});
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ success: false, message: error.message });
    }

}
const addnottification = async (req,res)=>{
    try {
        const {sender_id,type,message,members} = req.body;
        console.log(sender_id);
        // console.log(user);
        for(const memberid of members)
        {

            await UserRelation.updateOne(
                { userId:memberid },
                { $addToSet: {
                    notifications: {
                        sender: sender_id, 
                        type:`${type}`, 
                        message: `${message}`,
                        timestamp: new Date(),
                        read: false,
                        status:'requested',
                        
                    },
                    
                } }, 
                
                { upsert: true } 
            );
        }

        res.status(200).send({success:true,message:"notification saved"});


        
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ success: false, message: error.message });
        
    }
}

const creategroup =  async(req,res)=>{
    try {
        const members = req.body.groupmembers;
        const groupname = req.body.groupname;
        const sender_id = req.body.sender_id;
        const formattedMembers = members.map(memberId => ({
            id: memberId,
            joined: false, // Default value (can be omitted as default is already set in the schema)
        }));
        formattedMembers.push({id:sender_id,joined:true});

        let group = new Group({
            groupname,
            users:formattedMembers,
            })
            req.session.group = group; // Set session
            console.log("this is group ",group);

       await group.save();
       for (const member of members) {
        console.log(member);        
        await UserRelation.updateOne(
            { userId: member },
            {
                $addToSet: {
                    notifications: {
                        sender: sender_id,
                        type: 'group',
                        message: 'want to join in a group',
                        timestamp: new Date(),
                        read: false,
                        status: 'requested',
                    },
                },
            },
            { upsert: true } 
        );
    }
  await User.updateOne({_id:sender_id},
        {
            $push:{
                groups:group._id,
            }
        }
    )
    const user = await User.findById(sender_id);
    req.session.user = user;
    
    let data = {groupname,members,group}
    console.log(data)
    console.log("user is",user);

       res.status(200).send({ success: true, message: 'requested', data:data});




        
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: error.message });
        
    }

}



module.exports = {
    addfollower,
    creategroup,
    addnottification,
}