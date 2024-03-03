import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";

const Login = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const navigate = useNavigate();

    const onLogin = () => {
        // Will contain routing implementations to log in
    }

    const register = () => {
        navigate('/register');
    }

    return (
        <div className="max-w-3/5">
            <title>Log In</title>
            <header>
                Log In
            </header>
            <div class="mb-3">
                <label htmlFor="exampleFormControlInput1" className="form-label">Username</label>
                <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="Enter Username Here"></input>
            </div>
            <div className="mb-3">
                <label htmlFor="inputPassword" className="form-label">Password</label>
                <input type="password" className="form-control" id="inputPassword" placeholder="Enter Password Here"></input>
            </div>
            <button type="button"
                    className="btn btn-primary"
                    onClick={onLogin}>
                Login
            </button>
            <button type="button"
                    className="btn btn-secondary"
                    onClick={register}>
                Register
            </button>
        </div>
    )
}

export default Login