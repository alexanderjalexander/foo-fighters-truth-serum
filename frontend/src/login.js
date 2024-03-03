import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";

const Login = (props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const navigate = useNavigate();

    const onLogin = () => {
        // Will contain routing implementations to log in
    }

    return (
        <div className="max-w-3/5">
            <title>Login</title>
            <header>
                Login
            </header>
            <div class="mb-3">
                <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
                <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com"></input>
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
        </div>
    )
}

export default Login