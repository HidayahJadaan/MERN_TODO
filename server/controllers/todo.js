import Todo from '../models/Todo.js'
export const createTodo = async (req, res) => {
    try {
        const { title, createdAt } = req.body
        const user_id = req.user.userid._id
        if (!title) {
            return res.status(500).json({
                success: false,
                message: 'todo is empty'
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
                message: 'todo created successfully'
            })
        } else {
            res.status(200).json({
                success: false,
                message: 'cannot save todo in DB'
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
                message: "can't find todoid"
            })
        }
        const deletedTodo = await Todo.findByIdAndDelete(todoid)
        if (!deletedTodo) {
            res.status(500).json({
                success: false,
                message: 'todo deletion failed'
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'todo deleted successfully',
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
                message: "can't find todoid"
            })
        }
        // TODO: check if todo is present in DB
        const todo = await Todo.findByIdAndUpdate(todoid, {
            title: title
        })
        if (!todo) {
            res.status(500).json({
                success: false,
                message: 'todo updation failed'
            })
        }
        res.status(200).json({
            success: true,
            message: 'todo updated successfully'
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
                message: 'todos fetching failed'
            })
        }
        res.status(200).json({
            success: true,
            message: 'todos fetching successfully',
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
                message: "can't find todoid"
            })
        }
        const todo = await Todo.findById(todoid)
        if (!todo) {
            res.status(200).json({
                success: false,
                message: 'todo fetching failed'
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'todo fetching successfully',
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
                message: "can't find todoid"
            })
        }
        const todo = await Todo.findById(todoid)
        todo.tasks.push(task)
        await todo.save()
        res.status(200).json({
            success: true,
            message: "task added successfully",
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
            return res.status(404).json({
                success: false,
                message: "Todo not found",
            });
        }

        if (taskIndex >= todo.tasks.length || taskIndex < 0) {
            return res.status(400).json({
                success: false,
                message: "Task index out of bounds",
            });
        }

        // Remove the task at the specified index
        todo.tasks.splice(taskIndex, 1);
        await todo.save();

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};


export const getTasks = async (req, res) => {
    try {
        const { todoid } = req.params
        if (!todoid) {
            res.status(500).json({
                success: false,
                message: "can't find todoid"
            })
        }
        const todo = await Todo.findById(todoid)
        res.status(200).json({
            success: true,
            message: "task fethched successfully",
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
                message: "Can't find todoid",
            });
        }
        if (!oldTaskString || !newTaskString) {
            return res.status(400).json({
                success: false,
                message: "Missing task strings",
            });
        }

        const todo = await Todo.findById(todoid);
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found",
            });
        }

        const taskIndex = todo.tasks.indexOf(oldTaskString);
        if (taskIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Task not found in the todo",
            });
        }

        todo.tasks[taskIndex] = newTaskString;
        await todo.save();

        return res.status(200).json({
            success: true,
            message: "Task edited successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
}

// ================================

export const sortTodo = async (req, res) => {
    try {
        const user_id = req.user.userid._id
        const { order } = req.query
        const todos = await Todo.find({ user_id }).sort({ 'createdAt': order })
        res.status(200).json({
            success: true,
            message: "todos sorted successfully",
            todos
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}