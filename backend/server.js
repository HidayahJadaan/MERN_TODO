const express = require('express');
const connectionToDB =require('./connection/DB')
const dotenv = require('dotenv').config();


// Connect to the database
connectionToDB();

// Init App
const app =express();

// Middlewares
app.use(express.json());


// Routes
app.use("/api/auth", require("./routes/authRoute"))

// Running The Server
const PORT = process.env.PORT ||4000;
app.listen(PORT, (req,res)=>{
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});