import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useUser} from "../components/UserContext";
import {Badge, Button, Form, ListGroup, Modal, Spinner} from "react-bootstrap";
import {useLogoutMutation} from "../query/auth";
import {useGetAllDetectionsQuery, useGetAllPeopleQuery, usePostDetectionMutation} from "../query/people";

const Person = () => {
    // Obtain the data on the user, however possible.
    const params = useParams();
    const id = params.id;

    const peopleQuery = useGetAllPeopleQuery();
    const detectionsQuery = useGetAllDetectionsQuery(id);

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
            person = (people.find((person) => {
                return person._id === id;
            }));
            personName = person.name;
        }
    }

    let detections;

    // Detections Section Handling
    if (detectionsQuery.isPending) {
        detections = (
            <Spinner animation='border' role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    }
    else if (detectionsQuery.isError) {
        personName = 'Error';
        detections = (
            <div>
                <header className="fs-1">Error</header>
                <p>{detectionsQuery.error.status}: {detectionsQuery.error.message}</p>
            </div>
        );
    }
    else if (detectionsQuery.data === null) {
        personName = 'Error';
        detections = (
            <div>
                <header className="fs-1">Error</header>
                <p>An error occurred while fetching detections(data was null).</p>
                <p>Ensure you are visiting the correct person, or log out and in again.</p>
            </div>
        );
    }
    else if (detectionsQuery.data.length === 0) {
        updatePersonName();
        detections = (
            <p>No detections yet! Add a detection session with the 'Add' button at the top.</p>
        );
    }
    else {
        updatePersonName();
        detections = (
            <ListGroup className='w-100'>
                {detectionsQuery.data.map((detection) => (
                    <ListGroup.Item className='text-start'
                                    key={detection._id}
                                    action>
                        {detection.name}
                        <Badge id={detection.name + ' Result'} className='m-1' bg={detection.truth ? "success" : "danger"}>
                            {detection.truth ? "TRUTH" : "LIE"}
                        </Badge>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        );
    }

    // Modal Handling for Adding Detections
    const [modalShow, setModalShow] = useState(false);
    const ShowModal = () => {
        setModalShow(true);
    }
    const HideModal = () => {
        setAddError('');
        setModalShow(false);
    }
    const [detectionNameField, setDetectionNameField] = useState('');
    const updateDetectionNameField = (newName) => {
        setDetectionNameField(newName);
        setAddError('');
    }

    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState('');

    // Add Detection Form Mutation
    const AddDetectionMutation = usePostDetectionMutation();

    // Detection Addition Logic
    const onAddDetection = async (e) => {
        e.preventDefault();
        setAdding(true);

        try {
            await AddDetectionMutation.mutateAsync({json: false, id: id, form: new FormData(e.target)});
            await detectionsQuery.refetch();
            setModalShow(false);
            setDetectionNameField('');
            console.error('Add Detection Form Mutation Succeeded');
        } catch (e) {
            console.error('Add Detection Form Mutation Failed');
            setAddError(e.status + ':' + e.message);
        }
        setAdding(false);
    }

    // Handle going back to the main screen.
    const navigate = useNavigate();
    const back = () => {
        navigate('/');
    };

    // Handling logging out
    const LogoutMutation = useLogoutMutation();

    // Handle not logged in case
    const user = useUser();
    useEffect(() => {
        if (user.data === null) {
            navigate('/');
        }
    }, [user.data, navigate]);

    // Log Out Button Function.
    const logout = async () => {
        try {
            await LogoutMutation.mutateAsync(undefined);
            console.log('Logout Form Mutation Succeeded');
            await user.refetch();
            navigate('/');
        } catch(e) {
            console.error('Logout Form Mutation Failed');
            console.error(e);
        }
    }

    return (
        <div>
            <Modal show={modalShow} onHide={HideModal} backdrop="static">
                <Form onSubmit={onAddDetection}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Detection</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Detection Name</Form.Label>
                            <Form.Control aria-label='Detection Name Box'
                                          name="name"
                                          id='inputDetectionName'
                                          value={detectionNameField}
                                          onChange={e => updateDetectionNameField(e.target.value)}
                                          placeholder='Enter Detection Name Here'
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Detection File</Form.Label>
                            <Form.Control type="file"
                                          name="file"
                                          aria-label='Detection File Upload'
                                          id='inputDetectionFile'
                                          accept=".csv"
                                          placeholder='Place Detections .csv Here' />
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
                                disabled={adding}>
                            {adding ? 'Adding...' : 'Add'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <div className="p-2 d-flex flex-row border border-top-0 border-start-0 border-end-0 border-3 justify-content-between">
                <header id='personHeader' className="fs-3">{personName}</header>
                <div className='d-flex flex-row'>
                    <Button className='mx-1'
                            variant='secondary'
                            onClick={ back }>
                        Back
                    </Button>
                    <Button className='mx-1'
                            variant='primary'
                            onClick={ logout }>
                        Log Out
                    </Button>
                </div>
            </div>
            <div className='w-75 mx-auto py-2 d-flex flex-row justify-content-between'>
                <header id='detectionsHeader' className="fs-1">Detections</header>
                <button id='addDetectionButton'
                        type="button"
                        className="btn btn-lg btn-primary"
                        onClick={ShowModal}>
                    Add
                </button>
            </div>
            <div className="d-flex gap-2 mx-auto w-75 text-center justify-content-center align-items-center">
                {detections}
            </div>
        </div>
    )
}

export default Person