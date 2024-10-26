const express=require('express');
const helloRoute=require('./routes/auth');
const mongoose =require("mongoose");
const authRouter = require('./routes/auth');
const bannerRouter=require('./routes/banner')
const categoryRouter=require('./routes/category');
const subCategoryRouter=require('./routes/sub_category');
const productRouter=require('./routes/product');
const productReviewRouter=require('./routes/product_review');
const cors= require('cors');

const PORT = 3000;

const app=express();
//mongodb String
const DB="mongodb+srv://tinnguyen2421:tinkhonghay2003@cluster0.qtzkf.mongodb.net/"
//middleware 
app.use(express.json());
app.use(cors()); //enable cors for all routes and origin 
app.use(authRouter);
app.use(bannerRouter);
app.use(categoryRouter);
app.use(subCategoryRouter);
app.use(productRouter);
app.use(productReviewRouter);

mongoose.connect(DB).then(()=>{
    console.log('mongoDB connected');
});

app.listen(PORT,"0.0.0.0",function(){
    console.log(`Server is running on port ${PORT}`);

} 
)
