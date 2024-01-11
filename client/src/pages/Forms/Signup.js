import React, { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom'
import './Style.css'

const Signup = () => {
    const navigate = useNavigate()
    const [cred, setcred] = useState({
        name: '',
        email: '',
        password: ''
    })
    const handleSubmit = (e) => {
        e.preventDefault()
        submitdata()
        setcred({
            name: '',
            email: '',
            password: ''
        })
    }
    const submitdata = async () => {
        try {
            const res = await axios.post('/user/signup', cred)
            const response = res.data
            // console.log(response)
            if (response.success) {
               
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
                    navigate('/login')
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
    return (
        <>
      <div className='body'>
         <h1>Manage Your Tasks Today</h1>
       
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
              <h3 class="title">Sign Up</h3>
              <div class="text-input">
                <i class="ri-user-fill"></i>
                <input id="name" type="name" placeholder="Name"
                required value={cred.name} onChange={(e) => setcred({
                  ...cred,
                  name: e.target.value
              })} 
              />
              </div>
             <div class="text-input">
              <i class="ri-user-fill"></i>
                 <input required value={cred.email} onChange={(e) => setcred({
                     ...cred,
                     email: e.target.value
                  })} id="email" type="email" placeholder="Email address"  />
                  
              </div>
      
             
              <div class="text-input">
                <i class="ri-lock-fill"></i>
                <input required value={cred.password} onChange={(e) => setcred({
                  ...cred,
                  password: e.target.value
              })} id="password" type="password" placeholder="Password" />
              </div>
      
              <button class="login-btn" type="submit">Sign Up</button>
              <div class="create">
                  Already have an account ?
                  <div className="link">

<Link to="/login"><span> Login <i class="ri-arrow-right-fill"></i> </span></Link>
</div>
              </div>

              <a href="#" class="forgot">Forgot Username/Password?</a>
             
            </form>
          </div>
      </div>
                     </>
    )
}

export default Signup