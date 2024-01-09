const joi = require("joi");
const asyncHandler = require("express-async-handler");
const { Task,
  ValidateTask,
  ValidateUpdateTask } = require("../models/Task");
const { User } = require("../models/User");
// =================================================================
/*
@desc Get All Tasks
@method GET
@route /api/tasks
@access public
*/
const getAllTasks = asyncHandler(async(req, res) => {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  });
// =================================================================
/*
@desc GET certain Task
@method GET
@route /api/tasks/:id
@access public
*/
 const getTask =  asyncHandler( async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (task) {
      res.status(200).json(task);
    } else {
      // return value is null
      res.status(404).json({ message: "Book not found" });
    }
  });

  // =================================================================
/*
@desc Create a new Task
@method POST
@route /api/tasks/:id
@access public 
*/
const createTask = asyncHandler( async (req, res) => {
    const { err } = ValidateTask(req.body);
    if (err) {
      return res.status(400).json({ message: err.details[0].message });
    }
  
    
    const newTask = new Task({
      title: req.body.title,
      user: req.body.user,
      description: req.body.description,
      
    });
  
    const NewTask = await newTask.save();
  
     // Update the user's tasks list
  await User.findByIdAndUpdate(req.body.user, {
    $push: { list: NewTask._id },
  });

    
    res.status(201).json(NewTask);
  });
// =================================================================
/*
@desc Update Certain Task
@method PUT
@route /api/tasks/:id
@access public
*/
  const updateTask =  asyncHandler( async(req, res) => {
    const { err } = ValidateUpdateTask(req.body);
    if (err) {
      return res.status(400).json({ message: err.details[0].message });
    }
  
    const task = await Task.findByIdAndUpdate(
      req.params.id,
  
      {
        $set: {
          title: req.body.title,
          user: req.body.user,
          description: req.body.description,
        
        },
      },
      { new: true }
    );
    
  if (!task) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the associated user has changed
  if (req.body.user !== task.user.toString()) {
    // Remove the task from the previous user's list
    await User.findByIdAndUpdate(task.user, {
      $pull: { list: task._id },
    });

    // Update the user's tasks list with the updated book ID
    await User.findByIdAndUpdate(req.body.user, {
      $push: { list: task._id },
    });
  }

  res.status(200).json({
    message: "Task Updated Successfully",
  });
  });

// =================================================================
/*
@desc Delete Certain Task
@method DELETE
@route /api/tasks/:id
@access public --> private
*/

 const deleteTask =  asyncHandler( async(req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (task) {
    // Remove the task from the user's list when deleted
    await User.findByIdAndUpdate(task.user, {
      $pull: { list: task._id },
    });

    res.status(200).json({
      message: "Task Deleted Successfully",
    });
  } else {
    res.status(404).json({ message: "Task not found" });
  }
  });

  module.exports={
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
  }