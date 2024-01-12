import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "react-toastify/dist/ReactToastify.css";
import "./landing.css";
import TodoForm from "../../components/TodoForm";

import "./landing.css";
const MySwal = withReactContent(Swal);


const Landing = () => {
  const [isFakeDark, setIsFakeDark] = useState(false);
  const [openTodoId, setOpenTodoId] = useState(null);
const [toggleingCheckbox, setToggleingCheckbox] = useState(false)
  const [username, setUserName] = useState(null);
  // fetching user todos
  const [todos, settodos] = useState([]);
  // creating todo
  const [todo, settodo] = useState("");
  // tasks state on todo fetch
  const [tasks, settasks] = useState([]);
  // task state on create task
  const [task, settask] = useState("");
  // state for saving todoid on todo task btn click
  const [taskid, settaskid] = useState(null);
  // state for toogle task div
  const [showtask, setshowtask] = useState(false);
  // current task's todo title
  const [title, settitle] = useState("");
  const [todoAdded, setTodoAdded] = useState(false);
  const [todoDeleted, setTodoDeleted] = useState(false);
  const [todoEditted, setTodoEditted] = useState(false);
  const [taskAdded, setTaskAdded] = useState(false);
  const [taskDeleted, setTaskDeleted] = useState(false);
  const [taskEdited, setTaskEdited] = useState(false);

  const loadTodos = async () => {
    const response = await axios.get("/todo/gettodos", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const { todos, username } = await response.data;
  
    // Load completion status for each todo
    const updatedIsChecked = {};
    todos.forEach((todo) => {
      updatedIsChecked[todo._id] = todo.completed || false;
    });
  
    setUserName(username);
    setIsChecked(updatedIsChecked);
    settodos(todos);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    submitData();
    settodo("");
  };
  const submitData = async () => {
    try {
      const data = {
        title: todo,
        createdAt: Date.now(),
      };
      const res = await axios.post("/todo/createtodo", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const response = await res.data;
      if (response.success) {
        setTodoAdded(true);
        toast.success(response.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error(response.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  const handleDelete = async (id) => {
    try {
      // Show SweetAlert for completing the todo
      const result = await MySwal.fire({
        title: "Delete This Todo?",
        text: "If You Click Yes This Todo Will Be Deleted Permanently",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#008000",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel", // This line was missing
      });
  
      if (result.isConfirmed) {
        // User clicked "Yes," delete the todo
        const deleteResult = await axios.delete(`/todo/deletetodo/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        if (deleteResult.data.success) {
          setTodoDeleted(true);
          toast.success(deleteResult.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          toast.error(deleteResult.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      } else {
        // User clicked "Cancel," do nothing
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  
  const handleEdit = async (id) => {
    try {
      const newtodo = window.prompt("Enter new Todo");
      settodo(newtodo);
      const res = await axios.put(
        `/todo/edittodo/${id}`,
        {
          title: newtodo,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const response = res.data;
      if (response.success) {
        setTodoEditted(true);
        toast.success(response.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error(response.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      settodo("");
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  // =============================================
  const handleEditTask = async (index) => {
    const newText = window.prompt("Enter new task");
    if (newText !== null && newText !== "") {
      const updatedTasks = [...tasks];
      updatedTasks[index] = newText;

      try {
        const res = await axios.put(
          `/todo/edittask/${taskid}`,
          {
            oldTaskString: tasks[index], // Sending the old task string for identification
            newTaskString: newText, // Sending the new task string for updating
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const response = res.data;

        if (response.success) {
          setTaskEdited(true);
          toast.success(response.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          // Update state with the modified tasks
          settasks(updatedTasks);
        } else {
          toast.error(response.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      } catch (error) {
        toast.error(error.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };
  // =============================================
  const addTask = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post(
        `/todo/createtask/${taskid}`,
        { task: task },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const response = await res.data;
      settask("");
      if (response.success) {
        setTaskAdded(true);
        toast.success(response.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setOpenTodoId(null);
        setshowtask(false);
      } else {
        toast.error(response.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  const handleTaskClick = async (id) => {
    if (showtask && taskid === id) {
      setshowtask(false);
      setOpenTodoId(null); // Close the currently opened todo
    } else {
      const res = await axios.get(`/todo/gettodo/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      settasks(res.data.todo.tasks);
      setshowtask(true);
      settaskid(id);
      settitle(res.data.todo.title);
      setOpenTodoId(id); // Set the ID of the opened todo
    }
  };
  const handleTaskDelete = async (index) => {
    try {
      const res = await axios.delete(`/todo/deletetask/${taskid}/${index}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const response = await res.data;
      if (response.success) {
        // Update the tasks list in the todo
        const updatedTasks = [...tasks]; // Create a copy of tasks array
        updatedTasks.splice(index, 1); // Remove the task at the specified index
        settasks(updatedTasks);
        loadTodos();
        toast.success(response.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error(response.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const sort = async (n) => {
    const response = await axios.get("/todo/sortTodo", {
      params: { order: n },
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const todoarray = await response.data.todos;
    settodos(todoarray);
  };



  useEffect(() => {
    loadTodos();
    // Toggle the fake dark mode class on the root element
    document.documentElement.classList.toggle("fake-dark-mode", isFakeDark);

    setTodoAdded(false);
    setTodoDeleted(false);
    setTaskAdded(false);
    setTaskDeleted(false);
    setTodoEditted(false);
  }, [
    showtask,
    todoAdded,
    todoDeleted,
    taskAdded,
    taskDeleted,
    todoEditted,
    isFakeDark,toggleingCheckbox
  ]);

  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const [isChecked, setIsChecked] = useState({});

  const handleCheckboxChange = async (todoId) => {
    try {
      const updatedIsChecked = { ...isChecked };
      updatedIsChecked[todoId] = !updatedIsChecked[todoId];
      setIsChecked(updatedIsChecked);
  
      if (updatedIsChecked[todoId]) {
        // Show SweetAlert for completing the todo
        const result = await MySwal.fire({
          title: "Mark as Completed?",
          text: "Do you want to delete this todo, and all its tasks? If you click cancel, you only mark it as completed.",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#008000",
          confirmButtonText: "Yes, delete all tasks!",
          cancelButtonText: "Mark As Completed Only",
        });
  
        if (result.isConfirmed) {
          // Update the completion status using the separate function
          await updateTodoCompletion(todoId, updatedIsChecked[todoId]);
          // Call handleDelete only if the user confirms
          await handleDelete(todoId);
        } else {
          // If "Cancel" is clicked, update the todo's completion status without deleting it
          await updateTodoCompletion(todoId, updatedIsChecked[todoId]);
        }
      } else {
        // If the checkbox is unchecked (todo marked as incomplete), update the todo's completion status without showing the SweetAlert
        await updateTodoCompletion(todoId, updatedIsChecked[todoId]);
      }
  
      setToggleingCheckbox(!toggleingCheckbox);
    } catch (error) {
      console.error("Error handling checkbox change:", error);
    }
  };
  
  

const updateTodoCompletion = async (todoId, completed) => {
  try {
    const response = await axios.put(
      `/todo/completetodo/${todoId}`,
      { completed },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const responseData = response.data;

    if (!responseData.success) {
      // Handle the API call failure
      console.error(responseData.message);
      // Optionally, you can revert the isChecked state if the API call fails
      const updatedIsChecked = { ...isChecked };
      updatedIsChecked[todoId] = !completed;
      setIsChecked(updatedIsChecked);
    }
  } catch (error) {
    console.error("Error updating completion status:", error);
    // Optionally, you can revert the isChecked state if an error occurs
    const updatedIsChecked = { ...isChecked };
    updatedIsChecked[todoId] = !completed;
    setIsChecked(updatedIsChecked);
  }
};




  const handleCloseTasksPopup = () => {
    setshowtask(false);
    setOpenTodoId(null);
  };





  const sortCompletedTodos = async () => {
    try {
      const response = await axios.get("/todo/sortcompletedtodos", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const sortedTodos = response.data.todos;
      settodos(sortedTodos);
    } catch (error) {
      // Handle error
      console.error("Error sorting todos based on completion:", error);
    }
  };

  const handleDeleteConfirmation = (id) => {
    // Show the delete confirmation dialog and call handleDelete if confirmed
    MySwal.fire({
      title: "Delete Confirmation",
      text: "Are you sure you want to delete this todo?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#008000",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, call handleDelete
        handleDelete(id);
      }
    });
  };
  

  return (
    <div className={`TodoWrapper ${isFakeDark ? "fake-dark-mode" : ""}`}>
      <button
        onClick={() => setIsFakeDark((isFakeDark) => !isFakeDark)}
        className="btn-fake-dark-mode"
      >
        {isFakeDark ? "☀️" : "🌙"}
      </button>
      <div className="SortingBtns">
        <button onClick={() => sort(1)}>Oldest</button>
        <button onClick={() => sort(-1)}>Newest</button>
        <button onClick={sortCompletedTodos}>Completed First</button>
      </div>
      <button className="navBtn" onClick={() => logout()}>
        <i class="ri-shut-down-line"></i>{" "}
      </button>
      <div>
        <h1>📝✍️ Welcom, {username} 🎯⏰</h1>

        <TodoForm handleSubmit={handleSubmit} settodo={settodo} todo={todo} />
        <div className="Todo-List">
          {todos.length > 0 &&
            todos.map((todo, index) => (
              <div className="Todo">
                <label
                  htmlFor={`my-task-${index}`}
                  className={todo.completed ? "completed" : ""}
                >
                  <input
                    type="checkbox"
                    id={`my-task-${index}`}
                    checked={isChecked[todo._id] || false}
                    onChange={() => handleCheckboxChange(todo._id)}
                  />

                  <div>
                    <h3>{todo.title}</h3>
                    <p>
                      <b>Created: </b>
                      {new Date(todo.createdAt).toDateString()}
                    </p>
                    {/* <p>
                      <b>Last Update:</b>{" "}
                      {new Date(todo.updatedAt).toLocaleString()}
                    </p> */}
                  </div>
                </label>

                <div className="TodoIcons">
                  <span
                    onClick={() => handleTaskClick(todo._id)}
                    className={todo.completed ? "TodoIconsCompleted" : ""}
                  >
                    { !todo.completed
                      ? ` Tasks ${todo.tasks.length}`
                      : "Completed"}
                  </span>

                  <i
                    onClick={() => handleDeleteConfirmation(todo._id)}
                    class="Icon ri-delete-bin-6-line"
                  ></i>
                  <i
                    onClick={() => handleEdit(todo._id)}
                    className=" Icon ri-edit-2-fill"
                  ></i>
                </div>
              </div>
            ))}
        </div>
        {todos.length > 0 ? (
          <h1>🔥 Completd Todos: {todos.filter(todo => todo.completed).length} 🔥</h1>
        ) : (
          <h4>Add Your First Todo 🔥</h4>
        )}
      </div>

      {showtask && (
        <div className={`${showtask ? "TasksPopup" : ""}`}>
          <div className="TasksPopupContent">
            <h2 className="title">{title}</h2>
            <form onSubmit={addTask} className="TodoForm">
              <input
                required
                value={task}
                onChange={(e) => settask(e.target.value)}
                type="text"
                name="Search"
                placeholder="ADD NEW TASK"
                className="todo-input"
              />

              <button type="submit" className="todo-btn">
                +
              </button>
            </form>

            <ul>
              {tasks.map((task, index) => (
                <li className="Todo" key={index}>
                  <h3>{task}</h3>
                  <div className="TodoIcons">
                    <i
                      class="Icon ri-delete-bin-6-line"
                      onClick={() => handleTaskDelete(index)}
                    ></i>
                    <i
                      className="Icon ri-edit-2-fill"
                      onClick={() => handleEditTask(index)}
                    ></i>
                  </div>
                </li>
              ))}
            </ul>
            <div className="SortingBtns">
              <button onClick={handleCloseTasksPopup}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
