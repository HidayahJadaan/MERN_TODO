const express = require('express')
const dotenv = require('dotenv');
const logger = require('./middlewares/logger');
const {notFound, errorsHandler} = require('./middlewares/errors');
const connectionToDB = require('./config/db');
const path = require('path');
dotenv.config();
// CONNECTING TO THE DATABSE
connectionToDB();

// Init application   
const app = express();

// Static Folder
app.use(express.static(path.join(__dirname, 'images')));

// Apply Middleware
app.use(express.json());
// CUSTOM MIDDLEWARE
app.use(logger);
app.use(express.urlencoded({ extended: true }));

// Template Engine
app.set('view engine', 'ejs');

// Routes
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/users',  require('./routes/users'));
app.use('/password', require('./routes/password'));

// ERROR HANDLER MIDDLEWARE
app.use(notFound);
app.use(errorsHandler);

// Running The Server
const PORT = process.env.PORT ||4000;
app.listen(PORT, (req,res)=>{
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});