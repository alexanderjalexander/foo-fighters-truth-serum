import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";

const Home = (props) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    const loginHandler = () => {
        if (loggedIn) {
            // Logged in, log the user out

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
            <div>
                <header>Welcome!</header>
                <input type="button"
                       className="btn btn-primary"
                       onClick={ loginHandler }
                       value="Log Out"
                />
            </div>
        )
    } else {
        return (
            <div class="d-flex vh-100 text-center justify-content-center align-items-center">
                <div>
                    <header class="fs-1">Foo Fighters EEG</header>
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