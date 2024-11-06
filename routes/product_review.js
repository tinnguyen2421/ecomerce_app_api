const express=require('express');
const ProductReview=require('../models/product_review');
const productReviewRouter=express.Router();
const Product=require('../models/product');

productReviewRouter.post('/api/product-review',async(req,res)=>{
 try {
    const {buyerId,email,fullName,productId,rating,review}=req.body;
    //check if the user already reviewed the product 
    const existingReview=await ProductReview.findOne({buyerId,productId});
    if(existingReview)
    {
      return res.status(400).json({msg:"You have already reviewed this product"});
    }
    const reviews=new ProductReview({buyerId,email,fullName,productId,rating,review});
    await reviews.save();
    //find the product associated with the review using the productId
    const product=await Product.findById(productId);
    //if the product was not found , return a 404 error response
    if(!product)
    {
      return res.status(404).json({msg:"product not found "}); 
    }
    //Update the totalRating by incrementing it by 1
    product.totalRatings+=1;
    product.averageRating=((product.averageRating*(product.totalRatings-1))+rating)/product.totalRatings;
    //save the updated product back to the database
    await product.save();
    return res.status(201).send({reviews});
 } catch (e) {
    res.status(500).json({"error":e.message});
 }
});
productReviewRouter.get('/api/reviews',async(req,res)=>{
    try {
       const reviews=await ProductReview.find();
       return res.status(200).json({reviews});
    } catch (e) {
       res.status(500).json({"error":e.message});
    }
   });
module.exports=productReviewRouter;