import React, {useContext, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {UserContext} from "../components/UserContext";
import {checkEmail, checkPassword} from "../components/validation";
import {useMutation} from "@tanstack/react-query";

const Login = (props) => {
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    function updateEmail(em) {
        setEmail(em);
        setEmailError(checkEmail(em));
        setLoginMessage('');
        setServerError('');
    }

    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    function updatePassword(ps) {
        setPassword(ps);
        setPasswordError(checkPassword(ps));
        setLoginMessage('');
        setServerError('');
    }


    const navigate = useNavigate();

    const {user, setUser} = useContext(UserContext);

    const [loginMessage, setLoginMessage] = useState('')
    const [serverError, setServerError] = useState('')

    const FormMutation = useMutation({
        mutationFn: () => {
            return fetch('/api/login', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, password})
            })
        }
    })

    const onLogin = async () => {
        // Will contain routing implementations to log in
        setLoginMessage('');
        setServerError('');
        const result = await FormMutation.mutateAsync(undefined, undefined);
        const response = await result.json();
        if (!result.ok) {
            console.log("Login Form Mutation Failed");
            if (result.status === 500) {
                setServerError(`An error occurred sending your request: ${FormMutation.error}`);
            } else if (result.status === 400) {
                setServerError(`Registration Error: ${response.error}`)
            }
        } else {
            console.log("Login Form Mutation Succeeded");
            if (result.status === 200) {
                console.log(result.message);
                setUser(true);
                navigate('/');
            }
        }
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

                <div>
                    {loginMessage === '' ? <div></div> : <label>{loginMessage}</label>}
                    {serverError === '' ? <div></div> : <label className='text-danger'>{serverError}</label>}
                </div>

                <div className="d-flex justify-content-around align-items-center">
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

export default Login