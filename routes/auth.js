const express =require("express");
const User = require ('../models/user');
const bcrypt=require('bcryptjs');
const authRouter = express.Router();
const jwt=require ('jsonwebtoken');


authRouter.post('/api/signup',async (req,res)=>{
    try {
        //get value from API
        const{fullName, email, password}=req.body;
        //find the email are corect with the email be sent and wait for the respond
        //save result in var existingEmail
       const existingEmail= await User.findOne({email});
       if(existingEmail)
       {
        return res.status(400).json({msg:"Email này đã được sử dụng"});
       }
       else
       {
        //generate a salt with a cost factor of 10 
        const salt = await bcrypt.genSalt(10);
        //hash the password using generated salt
        const hashedPassword= await bcrypt.hash(password,salt);
        
        //creating new user 
        let user=new User({fullName,email, password:hashedPassword});
        // save results to MongoDB until the process completes
        await user.save();
        //send respond to client
        res.json({user});
       }
    }
    catch (e)
    {
       res.status(500).json({error:e.message}); 
    }
});
//singing api endpoint 
authRouter.post('/api/signin',async(req,res)=>{
    try{
       const {email,password}=req.body;
       const findUser=await User.findOne({email});
if (!findUser)
{
    return res.status(400).json({msg:"Người dùng không hợp lệ với email"})
}
else
{
    const isMatch=await bcrypt.compare(password,findUser.password);
    if(!isMatch)
    {  
          return res.status(400).json({msg:'Mật khẩu không chính xác'});
    }
    else
    {
      const token=jwt.sign({id:findUser._id},"PasswordKey");
      //remove sensitive information
      const {password, ...userWithoutPassword}=findUser._doc;
      //send the respones
      res.json({token,...userWithoutPassword})
    }
}
    }
    catch (error)
    {
    res.status(500).json({error:e.message});
    }
})
module.exports = authRouter;