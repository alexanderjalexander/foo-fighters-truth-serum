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

    const back = () => {
        navigate('/');
    }

    return (
        <div className="d-flex flex-row gap-2 vh-100 justify-content-center align-items-center">
            <title>Log In</title>
            <div>
                <header className="fs-1 text-center">
                    Log In
                </header>
                <div className="mb-3">
                    <label htmlFor="exampleFormControlInput1" className="form-label">Username</label>
                    <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="Enter Username Here"></input>
                </div>
                <div className="mb-3">
                    <label htmlFor="inputPassword" className="form-label">Password</label>
                    <input type="password" className="form-control" id="inputPassword" placeholder="Enter Password Here"></input>
                </div>
                <div class="d-flex justify-content-around align-items-center">
                    <button type="button"
                            className="btn btn-lg btn-outline-dark"
                            onClick={register}>
                        Register
                    </button>
                    <button type="button"
                            className="btn btn-lg btn-primary"
                            onClick={onLogin}>
                        Login
                    </button>
                </div>
                <div class="d-flex w-100 m-2 justify-content-around align-items-center">
                    <button type="button"
                            className="btn"
                            onClick={back}>
                        Back
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login