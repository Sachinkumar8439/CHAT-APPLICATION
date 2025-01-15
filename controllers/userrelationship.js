const UserRelation = require("../models/userrelationmodel");
const User = require("../models/userModel");

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
// const addnottification = async (req,res)=>{
//     try {
//         const {sender_id,userId} = req.body;
//         console.log(sender_id);
//         // console.log(user);
//         await UserRelation.updateOne(
//             {userId:sender_id},
//             {
//                 $push: {
//                     notifications: {
//                         sender: userId, 
//                         type: 'follow', 
//                         message: ' has started to following you.',
//                         timestamp: new Date(),
//                         read: false, 
//                     },
//                 },
                
//             }
            
//         )
//         const user = await  UserRelation.findOne({userId:sender_id});

//         res.status(200).send({success:true,data:user,message:"nottification saved "});


        
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send({ success: false, message: error.message });
        
//     }
// }



module.exports = {
    addfollower,
    // addnottification,
}