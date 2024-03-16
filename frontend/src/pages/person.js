import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {useUser} from "../components/UserContext";
import {Button, Form, ListGroup, Modal, Spinner} from "react-bootstrap";

const Person = () => {
    // Obtain the data on the user, however possible.
    const params = useParams();
    const name = params.name;
    const id = params.id;

    // Handling Responses
    let response;
    const {isPending,
        isError,
        error,
        refetch,
        data} = useQuery({
        queryKey: ['getAllDetections'],
        queryFn: async () => {
            response = await fetch(`/api/getAllDetections/${id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            })
            if (!response.ok) {

            } else {
                return await response.json();
            }
        }
    });

    // Handling Detection Displaying
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
    } else if (data.length === 0) {
        detections = (
            <div className="d-flex gap-2 mx-auto w-75 text-center justify-content-center align-items-center">
                <p>No detections yet! Add a detection session with the 'Add' button at the top.</p>
            </div>
        );
    } else {
        detections = (
            <div className="d-flex gap-2 mx-auto w-75 text-center justify-content-center align-items-center">
                <ListGroup>
                    {data.map((detection) => (
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

    // Add Detection Form Mutation


    // Modal Handling for Adding Detections
    const [modalShow, setModalShow] = useState(false);
    const ShowModal = () => setModalShow(true);
    const HideModal = () => setModalShow(false);
    const [detectionName, setDetectionName] = useState('');
    const [addDisabled, setAddDisabled] = useState(false);
    const [addError, setAddError] = useState('');
    const updateDetectionName = (newName) => {
        setDetectionName(newName);
        setAddError('');
    }

    const onAddSession = async (e) => {
        e.preventDefault();
        setAddDisabled(true);

        await refetch();
        HideModal();
        setDetectionName('');
        setAddDisabled(false);
    }

    // TODO: Component Separation
    return (
        <div>
            <Modal show={modalShow} onHide={HideModal} backdrop="static">
                <Form onSubmit={onAddSession}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Detection</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Detection Name</Form.Label>
                            <Form.Control aria-label='Detection Name Box'
                                          id='inputDetectionName'
                                          value={detectionName}
                                          onChange={e => updateDetectionName(e.target.value)}
                                          placeholder='Enter Detection Name Here'
                            />
                        </Form.Group>
                        <div>
                            {addError === '' ? <div></div> : <label id='addError' className='text-danger'>{addError}</label>}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={HideModal}>
                            Cancel
                        </Button>
                        <Button type='submit'
                                variant="primary"
                                id='addDetectionSubmit'
                                disabled={addDisabled}
                                onClick={onAddSession}>
                            {addDisabled ? 'Adding...' : 'Add'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
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
                        id='addDetectionButton'
                        type="button"
                        className="btn btn-lg btn-primary"
                        onClick={ ShowModal }>
                    Add
                </button>
            </div>
            {detections}
        </div>
    )
}

export default Person