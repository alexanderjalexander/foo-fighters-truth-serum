import {createBrowserRouter, RouterProvider, useRouteError} from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login";
import Register from "../pages/registration";
import Person from "../pages/person";
import React from "react";
import {Button} from "react-bootstrap";

function ErrorBoundary() {
    let route_error = useRouteError();
    console.error(route_error);
    return (
        <div className="d-flex vh-100 text-center justify-content-center align-items-center">
            <div>
                <header className="fs-1">Error</header>
                <p>{route_error.data}</p>
                <Button href='/' variant='danger'>Back to Main Screen</Button>
            </div>
        </div>
    )
}

export default function RouterWrapper() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Home />,
            errorElement: <ErrorBoundary />
        },
        {
            path: '/login',
            element: <Login />
        },
        {
            path: '/register',
            element: <Register />
        },
        {
            path: '/:id',
            element: <Person />,
            errorElement: <ErrorBoundary />
        }
    ])

    return (
        <RouterProvider router={router} />
    )
}