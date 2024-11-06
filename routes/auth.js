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
      res.json({token,user:userWithoutPassword})
    }
}
    }
    catch (error)
    {
    res.status(500).json({error:e.message});
    }
});
//Put route for updating user's state, city and locality
authRouter.put('/api/users/:id',async(req,res)=>{
    try {
        //Extract the 'id' parameter from the request URL
        const {id}=req.params;
        //Extract the "state"."city" and locality fields from the request body
        const {state,city,locality}=req.body;
        //find the user by their ID and update the state ,city and locality
        //the {new:true} option ensures the updated document is returned
        const updatedUser=await User.findByIdAndUpdate(
            id,
            {state,city,locality},
            {new:true},
        );
        //if no user is found ,return 404 page not found status with an error message 
        if(!updatedUser)
        {
            return res.status(404).json({error:"User not found"});
        }
        return res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({error:e.message});
    }
});
//Fetch all users(exclude password)

authRouter.get('/api/users',async(req,res)=>{
    try {
      const users =  await User.find().select('-password');//Exclude password field
      return  res.status(200).json(users);
    } catch (e) {
        res.status(500).json({error:e.message});
    }
})
module.exports = authRouter;