import React, {useContext, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useUser} from "../components/UserContext";
import {useMutation} from "@tanstack/react-query";

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
                <div className="p-2 d-flex flex-row border border-top-0 border-start-0 border-end-0 border-3 justify-content-between">
                    <header id='dashboardHeader' className="fs-3">Dashboard</header>
                    <input type="button"
                           className="btn btn-primary"
                           onClick={ loginHandler }
                           value="Log Out"
                    />
                </div>
            </div>
        )
    } else {
        return (
            <div className="d-flex vh-100 text-center justify-content-center align-items-center">
                <div>
                    <header id='home-title' className="fs-1">Truth Serum EEG</header>
                    <input id='homeLoginButton'
                           type="button"
                           className="btn btn-lg btn-primary m-2 sd-inline"
                           onClick={ loginHandler }
                           value="Log In"
                    />
                    <input id='homeRegisterButton'
                           type="button"
                           className="btn btn-lg btn-primary m-2 d-inline"
                           onClick={ register }
                           value="Register"
                    />
                </div>
            </div>
        )
    }
}

export default Home