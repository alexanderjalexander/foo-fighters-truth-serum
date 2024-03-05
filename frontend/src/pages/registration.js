import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {checkEmail, checkPassword} from "../components/validation";

const Register = (props) => {
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    function updateEmail(em) {
        setEmail(em);
        setEmailError(checkEmail(em));
    }

    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    function updatePassword(ps) {
        setPassword(ps);
        setPasswordError(checkPassword(ps));
    }

    const [serverError, setServerError] = useState('')

    const navigate = useNavigate();

    const onRegister = async () => {
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
                <header className="fs-1 text-center">
                    Register
                </header>

                <div className="mb-3">
                    <label htmlFor="inputEmail" className="form-label">Email</label>
                    <input aria-label="Email Box"
                           value={email}
                           onChange={e => updateEmail(e.target.value)}
                           className="form-control" data-testid="inputEmail"
                           placeholder="Enter Email Here"></input>
                    {emailError !== "" ? <label className="text-danger">{emailError}</label>: <div></div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="inputPassword" className="form-label">Password</label>
                    <input aria-label="Password Box" type="password"
                           value={password}
                           onChange={e => updatePassword(e.target.value)}
                           className="form-control" data-testid="inputPassword"
                           placeholder="Enter Password Here"></input>
                    {passwordError !== "" ? <label className="text-danger">{passwordError}</label>: <div></div>}
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