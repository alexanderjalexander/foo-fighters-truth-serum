import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";

const Home = (props) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    const loginHandler = () => {
        if (loggedIn) {

        } else {
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
            <div>
                <header>Welcome!</header>
                <input type="button"
                       class="btn btn-primary"
                       onClick={ loginHandler }
                       value="Log In"
                />
                <input type="button"
                       className="btn btn-primary"
                       onClick={ register }
                       value="Register"
                />
            </div>
        )
    }


}

export default Home