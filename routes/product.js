const express=require('express');
const Product=require('../models/product');
const productRouter=express.Router();
const {auth,vendorAuth} = require('../middleware/auth');
const product = require('../models/product');

productRouter.post('/api/add-product',auth,vendorAuth,async(req,res)=>{
  try {
    const {productName,productPrice,quantity,description,category,vendorId,fullName,subCategory,images}=req.body;
    const product=new Product({productName,productPrice,quantity,description,category,vendorId,fullName,subCategory,images})
    await product.save();
    return res.status(201).send(product);
  } catch (e) {
    res.status(500).json({error:e.message});
  }
});
productRouter.get('/api/popular-products',async(req,res)=>{
  try {
    const product =await Product.find({popular:true});
    if(!product||product.length==0)
    {
        return res.status(404).json({msg:"không có sản phẩm nào hợp lệ "});
    }
    else
    {
        res.status(200).json(product);
    }
  } catch (e) {
    res.status(500).json({error:e.message});
  }
});

productRouter.get('/api/recommended-products',async(req,res)=>{
    try {
      const product =await Product.find({recommend:true});
      if(!product||product.length==0)
      {
          return res.status(404).json({msg:"không có sản phẩm nào hợp lệ "});
      }
      else
      {
          res.status(200).json({product});
      }
    } catch (e) {
      res.status(500).json({error:e.message});
    }
  });
  //new route for retrieving products by category
  productRouter.get('/api/products-by-category/:category',async (req,res)=>{
    try {
      const {category}=req.params;
      const products=await Product.find({category,popular:true});
      if(!products|| products.length==0)
      {
        return res.status(404).json({msg:"Product not found"});
      }
      else
      {
        return res.status(200).json(products);
      }
    } catch (e) {
      res.status(500).json({error:e.message});
    }
  });
  //new route for retrieving related products by subcategory
productRouter.get('/api/related-products-by-subcategory/:productId',async(req,res)=>{
  try {
    const {productId} = req.params;
    //first ,find the prduct to get its subcategory
  const product =  await Product.findById(productId);
  if(!product){
    return res.status(404).json({msg:"Product not found"});
  }else{
    //find related products base  on the subcategory  of the retrieved product
  const relatedProducts =  await Product.find({
      subCategory: product.subCategory,
      _id:{$ne:productId}//Exclude the current product
    });
  
   if(!relatedProducts || relatedProducts.length ==0){
    return res.status(404).json({msg:"No related products found"});
   } 
    
   return res.status(200).json(relatedProducts);
  
  }
  } catch (e) {
    return res.status(500).json({error:e.message});
  }
});


//route for retrieving the top 10 highest-rated products
productRouter.get('/api/top-rated-products',async(req,res)=>{
  try {
    //fetch all products and sort them by avaragerating in decending order(higest rating)
    //sort product by averageRating, with -1 indicating decending
  const topRatedProducts =  await Product.find({}).sort({averageRating: -1}).limit(10);//limit the result to the top highest rated product

  //check if there are any top-rated products  returned
  if(!topRatedProducts||topRatedProducts.length==0){
    return res.status(404).json({msg:"No top-rated products  found"});
  }

  //return the top-rated product as a response 
  return res.status(200).json(topRatedProducts);
  } catch (e) {
    //handle any server errors that occure during the request
    return res.status(500).json({error:e.message});
  }
});
productRouter.get('/api/products-by-subcategory/:subCategory', async (req, res) => {
  try {
    const { subCategory } = req.params;
    const products = await Product.find({ subCategory: subCategory });
    if (!products.length) {
      return res.status(404).json({ msg: "No products found in this subcategory" });
    }
    res.status(200).json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
//Route for searching product by name or description
productRouter.get('/api/search-products',async(req,res)=>{
  try {
    //extract the query parameter from the req Query String
    const {query}=req.query;
    //validate that a query parameter is provided
    //if missing return a 400 status with an error message 
    if(!query)
    {
      return res.status(400).json({msg:'Query parameter required'});
      //search for the Product collection for document where either 'ProductName' or 'descriptions'
      //contains the specified query String:
      
    }
    const products= await Product.find({
      $or:[
        //Redex will match any productName containing the query String 
        //if the user search for "apple ",the regex will check
        //if "apple" is part of any productName. so product name "Green apple pie"
        //or "fresh apples", would all match because they contaion thw wworld "apple"
        {productName:{$regex:query, $option:'i'}}, 
        {description:{$regex:query, $option:'i'}}, 
      ]
    });
     //check if any products were found , if no product match the query
     //return a 404 status 
     if(!products||products.length==0)
     {
      return res.status(404).json({msg:'No products found matching the query'})
     }
     return res.status(200).json(products);

    
  } catch (e) {
          return res.status(500).json({msg:e.message});

  }
});
module.exports=productRouter;