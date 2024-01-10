import express from 'express'
const router = express.Router()

import {
    createTodo,
    deleteTodo,
    getTodo,
    getTodos,
    editTodo,
    createTask,
    deleteTask,
    getTasks,
    editTask,
    sortTodo
} from '../controllers/todo.js'

import auth from '../middlewares/auth.js'
router.use(auth)

router.post('/createtodo', createTodo)
router.delete('/deletetodo/:todoid', deleteTodo)
router.get('/gettodo/:todoid', getTodo)
router.get('/gettodos', getTodos)
router.put('/editTodo/:todoid', editTodo)
router.post('/createtask/:todoid', createTask)
router.delete('/deletetask/:todoid/:taskIndex', deleteTask);
router.put('/edittask/:todoid', editTask)
router.get('/gettasks/:todoid', getTasks)
router.get('/sortTodo', sortTodo)

export default router