import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import './pages.css';
import {useUser} from "../components/UserContext";
import {Button, Form} from "react-bootstrap";

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
    const user = useUser();
    const onLogin = async (e) => {
        e.preventDefault();
        setButtonDisabled(true);
        setLoginMessage('');
        setServerError('');
        const result = await LoginMutation.mutateAsync(undefined, undefined);
        const response = await result.json();
        if (!result.ok) {
            console.error("Login Form Mutation Failed");
            if (result.status === 500) {
                setServerError(`An error occurred sending your request: ${LoginMutation.error}`);
            } else if (result.status === 400) {
                setServerError(`Registration Error: ${response.message}`)
            }
        } else {
            console.log("Login Form Mutation Succeeded");
            if (result.status === 200) {
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

    useEffect(() => {
        if (user.data !== null) {
            navigate('/');
        }
    }, [user.data]);

    return (
        <div className="d-flex flex-row gap-2 vh-100 justify-content-center align-items-center">
            <title>Log In</title>
            <div className="container-sm-only">
                <header data-testid="loginHeader"
                        id='loginHeader'
                        className="fs-1 text-center">
                    Log In
                </header>

                <Form onSubmit={onLogin}>
                    <Form.Group className='mb-3'>
                        <Form.Label htmlFor='inputEmail'>Email</Form.Label>
                        <Form.Control aria-label="Email Box"
                                      value={email}
                                      onChange={e => updateEmail(e.target.value)}
                                      data-testid="inputEmail" id='inputEmail'
                                      placeholder="Enter Email Here" />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label htmlFor='inputPassword'>Password</Form.Label>
                        <Form.Control aria-label="Email Box"
                                      type='password'
                                      value={password}
                                      onChange={e => updatePassword(e.target.value)}
                                      data-testid="inputPassword" id='inputPassword'
                                      placeholder="Enter Password Here" />
                    </Form.Group>
                    <div>
                        {loginMessage === '' ? <div></div> : <label>{loginMessage}</label>}
                        {serverError === '' ? <div></div> : <label className='text-danger'>{serverError}</label>}
                    </div>
                    <div className="d-flex justify-content-around align-items-center">
                        <Button type="button"
                                size='lg'
                                variant='outline-dark'
                                className="btn btn-lg btn-outline-dark"
                                id='registerRedirect'
                                onClick={register}>
                            Register
                        </Button>
                        <Button type="submit"
                                disabled={buttonDisabled}
                                size='lg'
                                variant='primary'
                                id='loginButton'
                                data-testid="loginButton">
                            {buttonDisabled ? 'Logging In...' : 'Log In'}
                        </Button>
                    </div>
                </Form>

                <div className="d-flex w-100 m-2 justify-content-around align-items-center">
                    <Button type="button"
                            variant='outline-secondary'
                            id='backButton'
                            onClick={back}>
                        Back
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Login