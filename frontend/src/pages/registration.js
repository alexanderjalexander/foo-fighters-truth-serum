import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";

const Register = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const navigate = useNavigate();

    const onRegister = () => {
        // Will contain routing implementations to log in
    }

    const login = () => {
        navigate('/login');
    }

    const back = () => {
        navigate('/');
    }

    return (
        <div className="d-flex flex-row vh-100 justify-content-center align-items-center">
            <title>Register</title>
            <div>
                <header class="fs-1 text-center">
                    Register
                </header>
                <div className="mb-3">
                    <label htmlFor="exampleFormControlInput1" className="form-label">Username</label>
                    <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="Enter Username Here"></input>
                </div>
                <div className="mb-3">
                    <label htmlFor="inputPassword" className="form-label">Password</label>
                    <input type="password" className="form-control" id="inputPassword" placeholder="Enter Password Here"></input>
                </div>
                <div className="d-flex justify-content-around align-items-center">
                    <button type="button"
                            className="btn btn-lg btn-outline-dark d-block"
                            onClick={login}>
                        Log In
                    </button>
                    <button type="button"
                            className="btn btn-lg btn-primary d-block"
                            onClick={onRegister}>
                        Register
                    </button>
                </div>
                <div className="d-flex w-100 m-2 justify-content-around align-items-center">
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

export default Register