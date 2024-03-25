import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useUser} from "../components/UserContext";
import Dashboard from "./dashboard";
import {Button} from "react-bootstrap";
import {useLogoutMutation} from "../query/auth";
import FlexCenterWrapper from "../components/FlexCenterWrapper";

const Home = () => {
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

    const LogoutMutation = useLogoutMutation();

    const logout = async () => {
        try {
            await LogoutMutation.mutateAsync(undefined, undefined);
            console.log('Logout Form Mutation Succeeded');
            await user.refetch();
        } catch (e) {
            console.error('Logout Form Mutation Failed');
            console.error(e);
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
            <FlexCenterWrapper>
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
            </FlexCenterWrapper>
        )
    }
}

export default Home