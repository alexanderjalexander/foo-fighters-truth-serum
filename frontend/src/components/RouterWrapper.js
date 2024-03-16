import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login";
import Register from "../pages/registration";
import Person from "../pages/person";

export default function RouterWrapper() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Home />,
        },
        {
            path: '/login',
            element: <Login />,
        },
        {
            path: '/register',
            element: <Register />,
        },
        {
            path: '/:name/:id',
            element: <Person />
        }
    ])

    return (<RouterProvider router={router} />)
}