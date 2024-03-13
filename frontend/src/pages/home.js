import React, {useContext, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {UserContext} from "../components/UserContext";

const Home = (props) => {
    const {user, setUser} = useContext(UserContext);
    const [loggedIn, setLoggedIn] = useState(!!user);

    const navigate = useNavigate();

    const loginHandler = () => {
        // Logic to handle the login button for the dashboard.
        if (loggedIn) {
            // Logged in, log the user out
            setLoggedIn(false);
            setUser(null);
        } else {
            // Logged out, start flow for logging in
            navigate('/login');
        }
    }

    const register = () => {
        navigate('/register');
    }

    if (loggedIn) {
        return (
            <div className="d-flex vh-100 text-center justify-content-center align-items-center">
                <header className="fs-1">Welcome!</header>
                <input type="button"
                       className="btn btn-lg btn-primary"
                       onClick={ loginHandler }
                       value="Log Out"
                />
            </div>
        )
    } else {
        return (
            <div className="d-flex vh-100 text-center justify-content-center align-items-center">
                <div>
                    <header className="fs-1">Truth Serum EEG</header>
                    <input type="button"
                           className="btn btn-lg btn-primary m-2 sd-inline"
                           onClick={ loginHandler }
                           value="Log In"
                    />
                    <input type="button"
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