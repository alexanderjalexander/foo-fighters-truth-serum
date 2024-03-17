import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {useUser} from "../components/UserContext";
import {Button, Form, ListGroup, Modal, Spinner} from "react-bootstrap";

const Person = () => {
    // Obtain the data on the user, however possible.
    const params = useParams();
    const id = params.id;

    // Handling Responses
    let response;

    // Obtaining People Query
    const peopleQuery = useQuery({
        queryKey: ['getAllPeople'],
        queryFn: async () => {
            const result = await fetch('/api/getAllPeople', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                }
            })
            if (!result.ok) {
                return null;
            }
            return await result.json();
        }
    });
    const detectionsQuery = useQuery({
        queryKey: ['getAllDetections'],
        queryFn: async () => {
            response = await fetch(`/api/getAllDetections/${id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            })
            console.log(response.status);
            if (!response.ok) {
                return null;
            } else {
                return await response.json();
            }
        }
    });

    // Person Name Displaying
    let people = peopleQuery.data;
    let person;
    let personName = (
        <Spinner animation='border' role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    );
    const updatePersonName = () => {
        if (peopleQuery.isPending) {
            personName = (
                <Spinner animation='border' role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            )
        } else if (peopleQuery.isError) {
            personName = 'Error';
        } else if (people !== undefined) {
            person = (people.peopleRes.find((person) => {
                return person.id === id;
            }));
            personName = person.name;
        }
    }

    let detections;

    // Detections Section Handling
    if (detectionsQuery.isPending) {
        detections = (
            <div className="d-flex gap-2 mx-auto w-75 text-center justify-content-center align-items-center">
                <Spinner animation='border' role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    } else if (detectionsQuery.isError) {
        personName = 'Error';
        detections = (
            <div className="d-flex gap-2 mx-auto w-75 text-center justify-content-center align-items-center">
                <div>
                    <header className="fs-1">Error</header>
                    <p>{detectionsQuery.error.toString()}</p>
                </div>
            </div>
        );
    } else if (detectionsQuery.data === null) {
        personName = 'Error';
        detections = (
            <div className="d-flex gap-2 mx-auto w-75 text-center justify-content-center align-items-center">
                <div>
                    <header className="fs-1">Error</header>
                    <p>An error occurred while fetching detections(data was null).</p>
                    <p>Ensure you are visiting the correct person, or log out and in again.</p>
                </div>
            </div>
        );
    } else if (detectionsQuery.data.length === 0) {
        updatePersonName();
        detections = (
            <div className="d-flex gap-2 mx-auto w-75 text-center justify-content-center align-items-center">
                <p>No detections yet! Add a detection session with the 'Add' button at the top.</p>
            </div>
        );
    } else {
        updatePersonName();
        detections = (
            <div className="d-flex gap-2 mx-auto w-75 text-center justify-content-center align-items-center">
                <ListGroup>
                    {detectionsQuery.data.map((detection) => (
                        <ListGroup.Item className='text-start'
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

        await detectionsQuery.refetch();
        HideModal();
        setDetectionName('');
        setAddDisabled(false);
    }

    // Handle going back to the main screen.
    const navigate = useNavigate();
    const back = () => {
        navigate('/');
    };

    // Handle not logged in case
    const user = useUser();
    useEffect(() => {
        if (user.data === null) {
            navigate('/');
        }
    }, [user.data]);

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
                <header id='dashboardHeader' className="fs-3">{personName}</header>
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