import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { Link, useNavigate } from 'react-router-dom';
import Logo from "../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { registerRoute } from "../utils/APIRoutes";

function Register() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const toastOptions =  {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    useEffect(()=> {
        if(localStorage.getItem("chat-app-user")) {
            navigate("/")
        }
    },[])
  const handleSubmit = async(event)=> {
    event.preventDefault();
    if(handleValidation()) {
        const {password, username, email} = values;
        const {data} = await axios.post(registerRoute, {
            username,
            email,
            password,
        });
        if(data.status === false) {
            toast.error(data.msg, toastOptions);
        }
        if(data.status === true) {
            localStorage.setItem('chat-app-user',JSON.stringify(data.user));
            navigate("/");
        }
    }
  };
  
  const handleValidation =() => {
    const {password, confirmPassword, username, email} = values;
    if(password !== confirmPassword) {
        toast.error(
            "Your passwords should be matching", 
            toastOptions
        );
        return false;
    } else if (username.length < 3) {
        toast.error("Your username is too short", toastOptions);
        return false;
    } else if (password.length < 8) {
        toast.error(
            "Your password should be at least eight characters", 
            toastOptions
        );
        return false;
    } else if(email === "") {
        toast.error("An email is required", toastOptions);
        return false;
    }
    return true;
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <>
        <FormContainer>
            <form onSubmit={(event)=>handleSubmit(event)}>
                <div className='brand'>
                    <img src={Logo} alt="Logo" />
                    <h1>eMotion</h1>
                </div>
                <input 
                    type='text' 
                    placeholder="Username" 
                    name="username" 
                    onChange={(e) =>handleChange(e)}
                />
                <input 
                    type='email' 
                    placeholder="Email" 
                    name="email" 
                    onChange={(e) =>handleChange(e)}
                />
                <input 
                    type='password' 
                    placeholder="Password" 
                    name="password" 
                    onChange={(e) =>handleChange(e)}
                />
                <input 
                    type='password' 
                    placeholder="Confirm Password" 
                    name="confirmPassword" 
                    onChange={(e) =>handleChange(e)}
                />
                <button type="submit">Create User</button>
                <span>
                    Already have an account? <Link to="/login">Login</Link>
                </span>
            </form>
        </FormContainer>
        <ToastContainer/>
    </>
  );

}

const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #4b77bd;
    .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        img {
            height: 5rem;
        }
        h1 {
            color: white;
        }
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background-color: #395a8f;
        border-radius: 2rem;
        padding: 3rem 5rem;
        input {
            background-color: transparent;
            padding: 1rem;
            border: 0.1rem solid #4b77bd;
            border-radius: 0.4rem;
            color: white;
            width: 100%;
            font-size: 1rem;
            &:focus {
                border: 0.1rem solid #768294;
                outline: none;
            }
        }
        button {
            background-color: #4b77bd;
            color: white;
            padding: 1rem 2rem;
            border: none;
            font-weight: bold;
            cursor: pointer;
            border-radius: 0.4rem;
            font-size: 1rem;
            text-transform: uppercase;
            transition: 0.4s ease-in-out;
            &:hover {
                background-color: #768294;
            }
        }
        span {
            color: white;
            //text-transform: uppercase;
            a {
                color: #768294;
                text-decoration: none;
                font-weight: bold
            }
        }
    }
`;

export default Register;