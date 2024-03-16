import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {checkEmail, checkPassword} from "../components/validation";
import {useMutation} from "@tanstack/react-query";
import './pages.css';
import {useUser} from "../components/UserContext";
import {Button, Form} from "react-bootstrap";

const Register = (props) => {
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    function updateEmail(em) {
        setEmail(em);
        setEmailError('');
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

    const navigate = useNavigate();

    const login = () => {
        navigate('/login');
    }

    const [buttonDisabled, setButtonDisabled] = useState(false);

    const onRegister = async (e) => {
        e.preventDefault();
        setButtonDisabled(true);
        setRegisMessage('');
        setServerError('');
        const result = await FormMutation.mutateAsync(undefined, undefined);
        const response = await result.json();
        console.log(result);
        if (!result.ok) {
            console.error("Registration Form Mutation Failed");
            if (result.status === 500) {
                setServerError(`An error occurred sending your request: ${FormMutation.error}`);
            } else if (result.status === 400) {
                setServerError(`Registration Error: ${response.error}`)
            }
        } else {
            console.log("Registration Form Mutation Succeeded");
            if (result.status === 201) {
                console.log(result.message);
                login();
            }
        }
        setButtonDisabled(false);
    }

    const back = () => {
        navigate('/');
    }

    const user = useUser();

    useEffect(() => {
        if (user.data !== null) {
            navigate('/');
        }
    }, [user.data]);

    return (
        <div className="d-flex flex-row vh-100 justify-content-center align-items-center">
            <title>Register</title>
            <div className="container-sm-only">
                <header data-testid="registerHeader"
                        id='registerHeader'
                        className="fs-1 text-center">
                    Register
                </header>

                <Form onSubmit={onRegister}>
                    <Form.Group className='mb-3'>
                        <Form.Label htmlFor='inputEmail'>Email</Form.Label>
                        <Form.Control aria-label="Email Box"
                                      value={email}
                                      onBlur={e => setEmailError(checkEmail(email))}
                                      onChange={e => updateEmail(e.target.value)}
                                      data-testid="inputEmail" id='inputEmail'
                                      placeholder="Enter Email Here" />
                        {emailError !== "" ? <label className="text-danger">{emailError}</label> : <div></div>}
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Form.Label htmlFor='inputPassword'>Password</Form.Label>
                        <Form.Control aria-label="Email Box"
                                      type='password'
                                      value={password}
                                      onChange={e => updatePassword(e.target.value)}
                                      data-testid="inputPassword" id='inputPassword'
                                      placeholder="Enter Password Here" />
                        {passwordError !== "" ? <label className="text-danger">{passwordError}</label> : <div></div>}
                    </Form.Group>

                    <div>
                        {regisMessage === '' ? <div></div> : <label>{regisMessage}</label>}
                        {serverError === '' ? <div></div> : <label className='text-danger'>{serverError}</label>}
                    </div>

                    <div className="d-flex justify-content-around align-items-center">
                        <Button type="button"
                                size='lg'
                                variant='outline-dark'
                                className="btn btn-lg btn-outline-dark"
                                id='loginRedirect'
                                onClick={login}>
                            Log In
                        </Button>
                        <Button type="submit"
                                disabled={buttonDisabled}
                                size='lg'
                                variant='primary'
                                id='registerButton'
                                data-testid="registerButton">
                            {buttonDisabled ? 'Registering...' : 'Register'}
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

export default Register