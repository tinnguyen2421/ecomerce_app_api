const express=require('express');
const helloRoute=require('./routes/auth');
const mongoose =require("mongoose");
const authRouter = require('./routes/auth');

const PORT = 3000;
const app=express();
//mongodb String
const DB="mongodb+srv://tinnguyen2421:tinkhonghay2003@cluster0.qtzkf.mongodb.net/"
//middleware 
app.use(express.json());
app.use(authRouter);

mongoose.connect(DB).then(()=>{
    console.log('mongoDB connected');
});

app.listen(PORT,"0.0.0.0",function(){
    console.log(`Server is running on port ${PORT}`);

} 
)
