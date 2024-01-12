import Todo from '../models/Todo.js'
export const createTodo = async (req, res) => {
    try {
        const { title, createdAt } = req.body
        const user_id = req.user.userid._id
        if (!title) {
            return res.status(500).json({
                success: false,
                message: 'Todo Should Not Be Empty'
            })
        }
        const todo = new Todo({
            title: title,
            user_id: user_id,
            createdAt: createdAt
        })
        const response = await todo.save()
        if (response) {
            res.status(200).json({
                success: true,
                message: 'Todo Created Successfully'
            })
        } else {
            res.status(200).json({
                success: false,
                message: 'Cannot Save Todo In DB, Somthing Went Wrong'
            })
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}
export const deleteTodo = async (req, res) => {
    try {
        const { todoid } = req.params
        if (!todoid) {
            res.status(500).json({
                success: false,
                message: "Invalid Todo ID"
            })
        }
        const deletedTodo = await Todo.findByIdAndDelete(todoid)
        if (!deletedTodo) {
            res.status(500).json({
                success: false,
                message: 'Todo Deletion Failed, Somthing Went Wrong'
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Todo Deleted Successfully',
                deletedTodo
            })
        }
    } catch (error) {
        throw new Error(error.message || 'Error')
    }
}
export const editTodo = async (req, res) => {
    try {
        const { todoid } = req.params
        const { title } = req.body
        if (!todoid) {
            res.status(500).json({
                success: false,
                message: "Invalid Todo ID"
            })
        }
        // TODO: check if todo is present in DB
        const todo = await Todo.findByIdAndUpdate(todoid, {
            title: title
        })
        if (!todo) {
            res.status(500).json({
                success: false,
                message: 'Todo Updation Failed'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Todo Updated Successfully'
        })
    } catch (error) {
        throw new Error(error.message)
    }
}
export const getTodos = async (req, res) => {
    try {
        const user_id = req.user.userid._id
        const username = req.user.name
        const todos = await Todo.find({ user_id })
        if (!todos) {
            res.status(500).json({
                success: false,
                message: 'Todos Fetching Failed'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Todos fetching Successfully',
            todos,
            username
        })
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
}
export const getTodo = async (req, res) => {
    try {
        const { todoid } = req.params
        if (!todoid) {
            res.status(200).json({
                success: false,
                message: "Can't Find Todoid, Invalid ID"
            })
        }
        const todo = await Todo.findById(todoid)
        if (!todo) {
            res.status(200).json({
                success: false,
                message: 'Todo Fetching Failed'
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Todo Fetching Successfully',
                todo
            })
        }
    } catch (error) {
        throw new Error(error.message)
    }
}
export const createTask = async (req, res) => {
    try {
        const { todoid } = req.params
        const { task } = req.body
        if (!todoid) {
            res.status(500).json({
                success: false,
                message: "Can't Find Todo ID For This Task"
            })
        }
        const todo = await Todo.findById(todoid)
        todo.tasks.push(task)
        await todo.save()
        res.status(200).json({
            success: true,
            message: "Task Added Successfully",
            task
        })
    } catch (error) {
        throw new Error(error.message)
    }
}
export const deleteTask = async (req, res) => {
    try {
        const { todoid, taskIndex } = req.params;

        // Validation checks...

        // Find and update the todo tasks
        const todo = await Todo.findById(todoid);
        if (!todo) {
            return res.status(500).json({
                success: false,
                message: "Todo Not Found, Invalid ID",
            });
        }

        if (taskIndex >= todo.tasks.length || taskIndex < 0) {
            return res.status(400).json({
                success: false,
                message: "Task Index Out of Bounds",
            });
        }

        // Remove the task at the specified index
        todo.tasks.splice(taskIndex, 1);
        await todo.save();

        return res.status(200).json({
            success: true,
            message: "Task Deleted Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server ERROR",
        });
    }
};


export const getTasks = async (req, res) => {
    try {
        const { todoid } = req.params
        if (!todoid) {
            res.status(500).json({
                success: false,
                message: "Can't Find TodoID For This Task, INVALID ID"
            })
        }
        const todo = await Todo.findById(todoid)
        res.status(200).json({
            success: true,
            message: "Task Fethched Successfully",
            tasks: todo.tasks,
            title: todo.title
        })
    } catch (error) {
        throw new Error(error.message)
    }
}
// ================================
export const editTask = async (req, res) =>{
    try {
        const { todoid } = req.params;
        const { oldTaskString, newTaskString } = req.body;

        if (!todoid) {
            return res.status(400).json({
                success: false,
                message: "Can't Find TodoID For This Task, INVALID ID",
            });
        }
        if (!oldTaskString || !newTaskString) {
            return res.status(400).json({
                success: false,
                message: "Missing Task Strings, Should Not Be Empty",
            });
        }

        const todo = await Todo.findById(todoid);
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Can't Find TodoID For This Task, INVALID ID",
            });
        }

        const taskIndex = todo.tasks.indexOf(oldTaskString);
        if (taskIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Task Not Found In The Todo",
            });
        }

        todo.tasks[taskIndex] = newTaskString;
        await todo.save();

        return res.status(200).json({
            success: true,
            message: "Task Edited Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}

// ================================
export const completeTodo = async (req, res) => {
    try {
      const { todoid } = req.params;
      const { completed } = req.body;
  
      if (!todoid) {
        return res.status(400).json({
          success: false,
          message: "Invalid Todo ID",
        });
      }
  
      // Find and update the todo completion status
      const todo = await Todo.findByIdAndUpdate(
        todoid,
        { completed },
        { new: true }
      );
  
      if (!todo) {
        return res.status(404).json({
          success: false,
          message: "Todo Not Found, Invalid ID",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Todo Completion Status Updated Successfully",
        todo,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
  
export const sortCompletedTodos = async (req, res) => {
    try {
        const user_id = req.user.userid._id;

        // Fetch todos sorted based on completion status
        const todos = await Todo.find({ user_id }).sort({ completed: -1 });

        res.status(200).json({
            success: true,
            message: "Todos Sorted Successfully",
            todos,
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};


export const sortTodo = async (req, res) => {
    try {
        const user_id = req.user.userid._id
        const { order } = req.query
        const todos = await Todo.find({ user_id }).sort({ 'createdAt': order })
        res.status(200).json({
            success: true,
            message: "Todos Sorted Successfully",
            todos
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}