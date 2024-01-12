import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import "./Style.css";

const Login = () => {
  const navigate = useNavigate();
  const [cred, setcred] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitdata();
    setcred({
      email: "",
      password: "",
    });
  };
  const submitdata = async () => {
    try {
      const res = await axios.post("/user/login", cred);
      const response = await res.data;
      if (response.success) {
        localStorage.setItem("token", response.token);

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
        setTimeout(() => {
          navigate("/todos");
        }, 1000);
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
      toast.error("user not exist", {
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
  return (
    <>
      <div className="body">
        <h1>Welcome Back</h1>
        <div class="container_">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <div class="design">
            <div class="pill-1 rotate-45"></div>
            <div class="pill-2 rotate-45"></div>
            <div class="pill-3 rotate-45"></div>
            <div class="pill-4 rotate-45"></div>
          </div>
          <form class="login" onSubmit={handleSubmit} noValidate="">
            <h3 class="title">Login</h3>

            <div class="text-input">
              <i class="ri-user-fill"></i>
              <input
                required
                value={cred.email}
                onChange={(e) =>
                  setcred({
                    ...cred,
                    email: e.target.value,
                  })
                }
                id="email"
                type="email"
                placeholder="Email address"
              />
            </div>

            <div class="text-input">
              <i class="ri-lock-fill"></i>
              <input
                required
                value={cred.password}
                onChange={(e) =>
                  setcred({
                    ...cred,
                    password: e.target.value,
                  })
                }
                id="password"
                type="password"
                placeholder="Password"
              />
            </div>

            <button class="login-btn" type="submit">
              Login
            </button>
            <div class="create">
              Don't have an account ?
              <div className="link">
                <Link to="/">
                  <span>
                    {" "}
                    Sign Up <i class="ri-arrow-right-fill"></i>{" "}
                  </span>
                </Link>
              </div>
            </div>

            <a href="#" class="forgot">
              Forgot Username/Password?
            </a>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
