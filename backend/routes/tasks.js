const express = require("express");
const router = express.Router();
const { VerifyTokenAndAuthorization, VerifyTokenAndAdmin } = require("../middlewares/verifyToken");

const 
{
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} = require ('../controllers/tasksController');
// =================================================================

// --> /api/tasks
router.route('/')
.get(getAllTasks)
.post(VerifyTokenAndAdmin,createTask);
// --> /api/tasks/:id
router.route('/:id')
.get(getTask)
.put(VerifyTokenAndAdmin,updateTask)
.delete(VerifyTokenAndAdmin,deleteTask);
// =================================================================


module.exports = router;
