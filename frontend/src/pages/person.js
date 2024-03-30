import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useUser} from "../components/UserContext";
import {Badge, Button, Form, ListGroup, Modal, Spinner} from "react-bootstrap";
import {useLogoutMutation} from "../query/auth";
import {useGetAllDetectionsQuery, useGetAllPeopleQuery, usePostAddDetectionMutation} from "../query/people";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import {useEditDetectionComment, useEditDetectionName} from "../query/detections";

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

    // ----------------------------------------------

    // Modal Handling for Editing Detections
    const [editDetection, setEditDetection] = useState({
        adding: false, error: '', showModal: false, id: '', name: '', comment: ''
    })

    const HideEditDetectionModal = () => setEditDetection({...editDetection, showModal: false})
    const editDetectionName = useEditDetectionName();
    const editDetectionComment = useEditDetectionComment();
    const onEditDetection = async (e) => {
        e.preventDefault();
        try {
            setEditDetection({...editDetection, adding:true})
            await editDetectionName.mutateAsync({json:false, name: editDetection.name, id:editDetection.id});
            await editDetectionComment.mutateAsync({json:false, comment: editDetection.comment, id:editDetection.id});
            await detectionsQuery.refetch();
            setEditDetection({id:'', name:'', comment:'', error:'', adding:false, showModal:false})
        } catch (e) {
            console.error('Edit Detection Form Mutation Failed');
            setEditDetection({...editDetection, error: (e.status + ':' + e.message)});
        }
    }

    // ----------------------------------------------

    // Modal Handling for Adding Detections
    const [addDetection, setAddDetection] = useState({
        adding: false, error: '', showModal: false, name: ''
    })
    const ShowAddDetectionModal = () => setAddDetection({...addDetection, showModal: true});
    const HideAddDetectionModal = () => setAddDetection({...addDetection, showModal: false})

    // Detection Addition Logic
    const AddDetectionMutation = usePostAddDetectionMutation();
    const onAddDetection = async (e) => {
        e.preventDefault();
        try {
            setAddDetection({...addDetection, adding: true});
            await AddDetectionMutation.mutateAsync({json: false, id: id, form: new FormData(e.target)});
            await detectionsQuery.refetch();
            setAddDetection({adding: false, name: '', error: '', showModal: false});
            console.log('Succeeded');
        } catch (e) {
            console.error('Add Detection Form Mutation Failed');
            setAddDetection({...addDetection, error: (e.status + ':' + e.message)});
        }
    }

    // ----------------------------------------------

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

    // ----------------------------------------------

    // Detections Section Handling
    let detections;
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
                                    key={detection._id}>
                        <div className='d-flex flex-row justify-content-between'>
                            <div className='fw-bold' id={detection.name}>{detection.name}</div>
                            <div>
                                <Badge id={detection.name + ' Result'} className='m-1' bg={detection.truth ? "success" : "danger"}>
                                    {detection.truth ? "TRUTH" : "LIE"}
                                </Badge>
                                <Button size='sm' variant='secondary'
                                        id={detection.name+' Edit'}
                                        onClick={() => {setEditDetection(
                                        {...editDetection,
                                            showModal: true,
                                            id: detection._id,
                                            name: detection.name,
                                            comment:detection.comment})
                                        }}>
                                    <FontAwesomeIcon icon={faPenToSquare}/>
                                </Button>
                            </div>
                        </div>
                        <div>Comment: {detection.comment}</div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        );
    }

    return (
        <div>
            <Modal show={editDetection.showModal} onHide={HideEditDetectionModal} backdrop="static">
                <Form onSubmit={onEditDetection}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Detection: {editDetection.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Detection Name</Form.Label>
                            <Form.Control aria-label='Detection Name Box' name="name" id='inputEditDetectionName'
                                          value={editDetection.name}
                                          onChange={e =>
                                              setEditDetection({...editDetection, error: '', name: e.target.value})}
                                          placeholder='Edit Detection Name Here'
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Detection Comment</Form.Label>
                            <Form.Control aria-label='Detection Comment Box' name="comment" id='inputEditDetectionComment'
                                          value={editDetection.comment}
                                          onChange={e =>
                                              setEditDetection({...editDetection, error: '', comment: e.target.value})}
                                          placeholder='Edit Detection Comment Here'
                            />
                        </Form.Group>
                        {editDetection.error === ''
                            ? <div></div>
                            : <label id='editError' className='text-danger'>{editDetection.error}</label>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setEditDetection({...editDetection, showModal: false})}>
                            Cancel
                        </Button>
                        <Button type='submit' variant="primary" id='editDetectionSubmit'
                                disabled={editDetection.adding}>
                            {editDetection.adding ? 'Editing...' : 'Edit'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Modal show={addDetection.showModal} onHide={HideAddDetectionModal} backdrop="static">
                <Form onSubmit={onAddDetection}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Detection</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Detection Name</Form.Label>
                            <Form.Control aria-label='Detection Name Box' name="name" id='inputDetectionName'
                                          value={addDetection.name}
                                          onChange={e => setAddDetection({...addDetection, error: '', name: e.target.value})}
                                          placeholder='Enter Detection Name Here'
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Detection File</Form.Label>
                            <Form.Control type="file" name="file" aria-label='Detection File Upload'
                                          id='inputDetectionFile' accept=".csv"
                                          placeholder='Place Detections .csv Here' />
                        </Form.Group>
                        {addDetection.error === ''
                            ? <div></div>
                            : <label id='addError' className='text-danger'>{addDetection.error}</label>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={HideEditDetectionModal}>
                            Cancel
                        </Button>
                        <Button type='submit' variant="primary" id='addDetectionSubmit'
                                disabled={addDetection.adding}>
                            {addDetection.adding ? 'Adding...' : 'Add'}
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
                        onClick={ShowAddDetectionModal}>
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