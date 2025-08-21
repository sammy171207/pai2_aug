const express=require('express');
const connectDb = require('./config/db');
const authRoutes=require('./routes/authroutes')
require('dotenv').config()
const app=express();
app.use(express.json());
connectDb();

app.use('/api/auth',authRoutes)
app.get('/test',(req,res)=>{
    res.json({'message':'Test Route Running'})
})
app.listen(process.env.PORT,()=>{
    console.log(`backend runing on port ${process.env.PORT}`)
})