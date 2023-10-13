import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { setAvatarRoute } from "../utils/APIRoutes";
import {Buffer} from "buffer";

export default function SetAvatar() {

    const api = `https://api.multiavatar.com/4645646`;
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    const toastOptions =  {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    useEffect(()=> {
        if(!localStorage.getItem("chat-app-user")) {
            navigate("/login")
        }
    },[])
    const setProfilePicture = async () => {
        if(selectedAvatar === undefined) {
            toast.error("Please select an avatar or refresh the page for new options", toastOptions);
        } else {
            const user = await JSON.parse(localStorage.getItem("chat-app-user"));
            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar],
            });
            console.log(data);
            if(data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem("chat-app-user",JSON.stringify(user));
                navigate('/')
            } else {
                toast.error("Error setting avatar. Please try again", toastOptions);
            }
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            const data = [];
            for(let i = 0; i < 4; i++) {
                const image = await axios.get(
                    `${api}/${Math.round(Math.random() * 1000)}`
                );
                const buffer = Buffer.from(image.data);
                data.push(buffer.toString("base64"));
            }
            setAvatars(data);
            setIsLoading(false);
        };

        fetchData(); // Call the async function here
    }, []);

    return (
        <>
        {
                isLoading? <Container>
                    <img src={loader} alt ="loader" className='loader' />
                </Container> : (
                    <Container>
                <div className="title-container">
                    <h1>Pick an avatar as your profile picture!</h1>
                </div>
                <div className='avatars'> {
                    avatars.map((avatar,index)=> {
                        return (
                            <div 
                                key={index}
                                className={`avatar ${
                                    selectedAvatar === index ? "selected" : ""
                                }`}
                            >
                                <img 
                                    src={`data:image/svg+xml;base64,${avatar}`}
                                    alt="avatar"
                                    onClick={() => setSelectedAvatar(index)}
                                />
                            </div>
                        );
                    })
                } </div>
                <button className="submit-btn" onClick={setProfilePicture}>Set as Avatar</button>
            </Container>
            )}
            <ToastContainer />
        </>
    );
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 3rem;
    background-color: #4b77bd;
    height: 100vh;
    width: 100vw;
    .loader {
        max-inline-size: 100%;
    }
    .title-container {
        h1 {
            color: white;
        }
    }
    .avatars {
        display: flex;
        gap: 2rem;
        .avatar {
            border: 0.4rem solid transparent;
            padding: 0.4rem;
            border-radius: 5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.5s ease-in-out;
            img {
                height: 6rem;
            }
        }
        .selected {
            border: 0.4rem solid #cc123e;

        }
    }
    .submit-btn {
        background-color: #395a8f;
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
`;