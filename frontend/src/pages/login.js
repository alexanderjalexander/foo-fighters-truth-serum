import React, {useContext, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import './pages.css';
import {useUser} from "../components/UserContext";

const Login = (props) => {
    const [loginMessage, setLoginMessage] = useState('')
    const [serverError, setServerError] = useState('')

    const [email, setEmail] = useState('');
    function updateEmail(em) {
        setEmail(em);
        setLoginMessage('');
        setServerError('');
    }

    const [password, setPassword] = useState('');
    function updatePassword(ps) {
        setPassword(ps);
        setLoginMessage('');
        setServerError('');
    }

    const navigate = useNavigate();
    const user = useUser();

    const LoginMutation = useMutation({
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

    const register = () => {
        navigate('/register');
    }

    const [buttonDisabled, setButtonDisabled] = useState(false);

    const onLogin = async (e) => {
        e.preventDefault();
        setButtonDisabled(true);
        setLoginMessage('');
        setServerError('');
        const result = await LoginMutation.mutateAsync(undefined, undefined);
        const response = await result.json();
        if (!result.ok) {
            console.log("Login Form Mutation Failed");
            if (result.status === 500) {
                setServerError(`An error occurred sending your request: ${LoginMutation.error}`);
            } else if (result.status === 400) {
                setServerError(`Registration Error: ${response.message}`)
            }
        } else {
            console.log("Login Form Mutation Succeeded");
            if (result.status === 200) {
                console.log(result.message);
                console.log(response);
                await user.refetch();
                navigate('/');
            }
        }
        setButtonDisabled(false);
    }



    const back = () => {
        navigate('/');
    }

    return (
        <div className="d-flex flex-row gap-2 vh-100 justify-content-center align-items-center">
            <title>Log In</title>
            <div className="container-sm-only">
                <header data-testid="loginHeader"
                    className="fs-1 text-center">
                    Log In
                </header>

                <form onSubmit={onLogin}>
                    <div className="mb-3">
                        <label htmlFor="inputEmail" className="form-label">Email</label>
                        <input aria-label="Email Box"
                               value={email}
                               onChange={e => updateEmail(e.target.value)}
                               className="form-control" data-testid="inputEmail"
                               placeholder="Enter Email Here"></input>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="inputPassword" className="form-label">Password</label>
                        <input aria-label="Password Box" type="password"
                               value={password}
                               onChange={e => updatePassword(e.target.value)}
                               className="form-control" data-testid="inputPassword"
                               placeholder="Enter Password Here"></input>
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
                        <button type="submit"
                                disabled={buttonDisabled}
                                className="btn btn-lg btn-primary"
                                data-testid="loginButton">
                            {buttonDisabled ? 'Logging In...' : 'Log In'}
                        </button>
                    </div>
                </form>


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