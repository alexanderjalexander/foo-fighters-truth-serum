import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useUser} from "../components/UserContext";
import {useMutation} from "@tanstack/react-query";
import Dashboard from "./dashboard";
import {Button} from "react-bootstrap";

const Home = (props) => {
    let user = useUser();
    const [loggedIn, setLoggedIn] = useState(user.data !== null);

    const navigate = useNavigate();

    const loginHandler = async () => {
        // Logic to handle the login button for the dashboard.
        if (loggedIn) {
            // Logged in, log the user out
            setLoggedIn(false);
            await logout();
        } else {
            // Logged out, start flow for logging in
            navigate('/login');
        }
    }

    const LogoutMutation = useMutation({
        mutationFn: () => {
            return fetch('/api/logout', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                }
            })
        }
    })

    const logout = async () => {
        const result = await LogoutMutation.mutateAsync(undefined, undefined);
        if (!result.ok) {
            console.log('Logout Form Mutation Failed');
        } else {
            console.log('Logout Form Mutation Succeeded');
            user.refetch();
        }
    }

    const register = () => {
        navigate('/register');
    }

    if (loggedIn) {
        return (
            <div>
                <Dashboard loginHandler={loginHandler}/>
            </div>
        )
    } else {
        return (
            <div className="d-flex vh-100 text-center justify-content-center align-items-center">
                <div>
                    <header id='home-title' className="fs-1">Truth Serum EEG</header>
                    <Button id='homeLoginButton'
                            variant='primary'
                            size='lg'
                            className='m-2 d-inline'
                            onClick={loginHandler}>
                        Log In
                    </Button>
                    <Button id='homeRegisterButton'
                            variant='primary'
                            size='lg'
                            className='m-2 d-inline'
                            onClick={register}>
                        Register
                    </Button>
                </div>
            </div>
        )
    }
}

export default Home