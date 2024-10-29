const express=require('express');
const SubCategory=require('../models/sub_category');
const e = require('express');
const subCategoryRouter=express.Router();

subCategoryRouter.post('/api/subcategories',async(req,res)=>{
  try {
    const {categoryId,categoryName,image,subCategoryName} =req.body;
    const subcategory=new SubCategory({categoryId,categoryName,image,subCategoryName});
    await subcategory.save();
    res.status(201).send(subcategory);
  } catch (e) {
    res.status(200).json({error:e.message});
  }
});


subCategoryRouter.get('/api/category/:categoryName/subcategories',async(req,res)=>{
  try {
    ///extract the categoriesName from the req Url using bestructuring
  const {categoryName}=req.params;

  const subCategories = await SubCategory.find({categoryName:categoryName});
  //check if any subcategories were found
  if(!subCategories||subCategories.length==0)
  {
    //if no subcategories are found, respons with a status code 404 error
    return res.status(404).json({msg:"subcategories not found "});
  }
  else
  {
    res.status(200).json(subCategories);
  }
  } catch (e) {
    res.status(500).json({error:e.message});
  }
});


subCategoryRouter.get('/api/subcategories',async (req,res)=>{
  try {
   const subcategories= await SubCategory.find();
   return res.status(200).json({subcategories});
  } catch (error) {
    res.status(500).json({error:e.message});
  }
})
module.exports=subCategoryRouter;