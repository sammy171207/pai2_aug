const mongoose=require('mongoose');

const connectDb=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database Connected")
    } catch (error) {
        console.log('fail to connect',error)
    }
}
module.exports=connectDb;