const express=require('express');
const Vendor=require('../models/vendor');
const bcrypt=require('bcryptjs');
const VendorRouter=express.Router();
const jwt=require ('jsonwebtoken');

VendorRouter.post('/api/vendor/signup',async (req,res)=>{
    try {
        //get value from API
        const{fullName, email, password}=req.body;
        //find the email are corect with the email be sent and wait for the respond
        //save result in var existingEmail
       const existingEmail= await Vendor.findOne({email});
       if(existingEmail)
       {
        return res.status(400).json({msg:"email này đã được sử dụng"});
       }
       else
       {
        //generate a salt with a cost factor of 10 
        const salt = await bcrypt.genSalt(10);
        //hash the password using generated salt
        const hashedPassword= await bcrypt.hash(password,salt);
        
        //creating new user 
        let vendor=new Vendor({fullName,email, password:hashedPassword});
        // save results to MongoDB until the process completes
        vendor=await vendor.save();
        //send respond to client
        res.json({vendor});
       }
    }
    catch (e)
    {
       res.status(500).json({error:e.message}); 
    }
});


//singing api endpoint 
VendorRouter.post('/api/vendor/signin',async(req,res)=>{
    try{
       const {email,password}=req.body;
       const findUser=await Vendor.findOne({email});
if (!findUser)
{
    return res.status(400).json({msg:"Người bán hàng không hợp lệ với email"})
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
      const {password, ...vendorWithoutPassword}=findUser._doc;
      //send the respones
      res.json({token,vendor:vendorWithoutPassword})
    }
}
    }
    catch (error)
    {
    res.status(500).json({error:e.message});
    }
});
//fetch all vendors(exclude password)
VendorRouter.get('/api/vendors',async(req,res)=>{
    try {
     const vendors =  await Vendor.find().select('-password');//Exclude password field
      return res.status(200).json(vendors);
    } catch (e) {
      return res.status(500).json({error:e.message});
    }
   });
module.exports=VendorRouter;