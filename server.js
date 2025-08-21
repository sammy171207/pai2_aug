const express=require('express');
require('dotenv').config();
const connectDb = require('./config/db');
const authRoutes=require('./routes/authroutes');
const postRoutes=require('./routes/postroutes');
const analyticsRoutes=require('./routes/analysticsroutes');

const app=express();
app.use(express.json());
connectDb();

app.use('/api/auth',authRoutes);
app.use('/api/posts',postRoutes);
app.use('/api/analytics',analyticsRoutes);

app.get('/test',(req,res)=>{
    res.json({message:'Test Route Running'})
});

const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`backend running on port ${PORT}`)
});