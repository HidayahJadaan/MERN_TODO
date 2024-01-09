const mongoose = require('mongoose');
const joi = require("joi");

// BOOK SCHEMA
const listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
  
    description: {
        type: String,
        required: true
    },
    user: [{
      type: mongoose.Schema.Types.ObjectId,
      ref:'User',
      required: true
  }]
},
{timestamps: true}
);

// Task MODEL
const Task = mongoose.model('List', listSchema);
// VALIDATE CREATE Task ==> POST
function ValidateTask(REQOBJECT) {
    const schema = joi.object({
      title: joi.string().min(3).max(200).required(),
      user: joi.string().length(24).required(),
      description: joi.string().required(),
      
    });
    return schema.validate(REQOBJECT);
  }
  // =================================================================
  // VALIDATE UPDATE TASK ==> PUT
  function ValidateUpdateTask(REQOBJECT) {
    const schema = joi.object({
      title: joi.string().min(3).max(200),
      user: joi.string().length(24), // Assuming ObjectId length is 24
      description: joi.string(),
    
    });
    return err = schema.validate(REQOBJECT);
  }
  
module.exports = {
    Task,
   ValidateTask,
   ValidateUpdateTask
};