import React, {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useUser} from "../components/UserContext";
import {Badge, Button, ButtonGroup, ListGroup, Spinner} from "react-bootstrap";

const Person = () => {
    // Obtain the data on the user, however possible.
    const params = useParams();
    const name = params.name;
    const id = params.id;
    // console.log(name);
    // console.log(id);
    const {isPending,
        isError,
        error,
        refetch,
        data} = useQuery({
        queryKey: ['getAllDetections'],
        queryFn: async () => {
            const result = await fetch(`/api/getAllDetections/${id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            })
            if (!result.ok) {
                return null;
            }
            return await result.json();
        }
    });

    let detections;
    if (isPending) {
        detections = (
            <div className="d-flex gap-2 mx-auto w-75 text-center justify-content-center align-items-center">
                <Spinner animation='border' role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    } else if (isError) {
        detections = (
            <div className="d-flex gap-2 mx-auto w-75 text-center justify-content-center align-items-center">
                <div>
                    <header className="fs-1">Error</header>
                    <p>{error.toString()}</p>
                </div>
            </div>
        );
    } else if (data === null) {
        detections = (
            <div className="d-flex gap-2 mx-auto w-75 text-center justify-content-center align-items-center">
                <div>
                    <header className="fs-1">Error</header>
                    <p>An error occurred while fetching detections(data was null). Try logging out and back in.</p>
                </div>
            </div>
        );
    } else if (data.detectionArr.length === 0) {
        detections = (
            <div className="d-flex gap-2 mx-auto w-75 text-center justify-content-center align-items-center">
                <p>No detections yet! Add a detection session with the 'Add' button at the top.</p>
            </div>
        );
    } else {
        detections = (
            <div className="d-flex gap-2 mx-auto w-75 text-center justify-content-center align-items-center">
                <ListGroup>
                    {data.detectionArr.map((detection) => (
                        <ListGroup.Item className='text-start'
                                        href={`/${detection.name}`}
                                        key={detection.name}
                                        action>
                            {detection.name}
                            <p className='m-1'>{detection.data}</p>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        );
    }

    // Handle user not being logged in, redirect as needed
    const user = useUser();
    const navigate = useNavigate();
    useEffect(() => {
        if (user.data === null) {
            navigate('/');
        }
    }, [user.data]);

    // Handle going back to the main screen.
    const back = () => {
        navigate('/');
    };

    return (
        <div>
            <div className="p-2 d-flex flex-row border border-top-0 border-start-0 border-end-0 border-3 justify-content-between">
                <header id='dashboardHeader' className="fs-3">{name}</header>
                <div className='d-flex flex-row'>
                    <Button className='mx-1'
                            variant='secondary'
                            onClick={ back }>
                        Back
                    </Button>
                    <Button className='mx-1'
                            variant='primary'
                            onClick={ null }>
                        Log Out
                    </Button>
                </div>
            </div>
            <div className='w-75 mx-auto py-2 d-flex flex-row justify-content-between'>
                <header id='peopleHeader' className="fs-1">Detections</header>
                <button disabled
                        type="button"
                        className="btn btn-lg btn-primary"
                        onClick={ null }>
                    Add
                </button>
            </div>
            {detections}
        </div>
    )
}

export default Person