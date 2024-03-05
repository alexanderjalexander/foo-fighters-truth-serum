import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {checkEmail, checkPassword} from "../components/validation";
import {useMutation} from "@tanstack/react-query";

const Register = (props) => {
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    function updateEmail(em) {
        setEmail(em);
        setEmailError(checkEmail(em));
        setRegisMessage('');
        setServerError('');
    }

    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    function updatePassword(ps) {
        setPassword(ps);
        setPasswordError(checkPassword(ps));
        setRegisMessage('');
        setServerError('');
    }

    const [regisMessage, setRegisMessage] = useState('')
    const [serverError, setServerError] = useState('')

    const FormMutation = useMutation({
        mutationFn: () => {
            return fetch('/api/registration', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, password})
            })
        }
    })

    const onRegister = async () => {
        setRegisMessage('');
        setServerError('');
        const result = await FormMutation.mutateAsync(undefined, undefined);
        const response = await result.json();
        console.log(result);
        if (!result.ok) {
            console.log("Registration Form Mutation Failed");
            if (result.status === 500) {
                setServerError(`An error occurred sending your request: ${FormMutation.error}`);
            } else if (result.status === 400) {
                setServerError(`Registration Error: ${response.error}`)
            }
        } else {
            console.log("Registration Form Mutation Succeeded");
            if (result.status === 200) {
                console.log(result.message);
                setRegisMessage('Registration successful! Head over to the Log In page to access the app.')
            }
        }
    }

    const navigate = useNavigate();

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
                    {emailError !== "" ? <label className="text-danger">{emailError}</label> : <div></div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="inputPassword" className="form-label">Password</label>
                    <input aria-label="Password Box" type="password"
                           value={password}
                           onChange={e => updatePassword(e.target.value)}
                           className="form-control" data-testid="inputPassword"
                           placeholder="Enter Password Here"></input>
                    {passwordError !== "" ? <label className="text-danger">{passwordError}</label> : <div></div>}
                </div>

                <div>
                    {regisMessage === '' ? <div></div> : <label>{regisMessage}</label>}
                    {serverError === '' ? <div></div> : <label className='text-danger'>{serverError}</label>}
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