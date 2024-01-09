const mongoose = require("mongoose");

// CONNECTING TO THE DATABSE
async function connectionToDB(){
try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB--- Todo App DB")
}
   catch(err){
    console.log("Could not Connect To MongoDB -- Todo App DB", err.message)
   }
}


module.exports= connectionToDB;