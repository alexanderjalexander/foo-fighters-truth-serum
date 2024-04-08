import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Accordion, AccordionBody, Badge, Button, Form, Modal, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";

import {useUser} from "../components/UserContext";
import {useLogoutMutation} from "../query/auth";
import {useGetAllPersonDataQuery} from "../query/people";
import {usePostAddDetectionMutation} from "../query/detections";
import {useEditDetection} from "../query/detections";
import {useAddSessionMutation, useEditSessionMutation} from "../query/sessions";

const Person = () => {
    // Obtain the data on the user, however possible.
    const params = useParams();
    const id = params.id;

    const personDataQuery = useGetAllPersonDataQuery(id);

    // Person Name Displaying
    let personName = (
        <Spinner animation='border' role="status"><span className="visually-hidden">Loading...</span></Spinner>
    );

    // ----------------------------------------------
    // ADDING AND EDITING DETECTIONS

    // Modal Handling for Adding Detections
    const [addDetection, setAddDetection] = useState({
        adding: false, error: '', showModal: false, name: '', sessionId: '',
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
            await personDataQuery.refetch();
            setAddDetection({adding: false, name: '', error: '', sessionId: '', showModal: false});
            console.log('Succeeded');
        } catch (e) {
            console.error('Add Detection Form Mutation Failed');
            setAddDetection({...addDetection, error: (e.status + ':' + e.message)});
        }
    }

    // Modal Handling for Editing Detections
    const [editDetection, setEditDetection] = useState({
        editing: false, error: '', showModal: false,
        id: '', name: '', comment: '', sessionId: ''
    })
    const HideEditDetectionModal = () => setEditDetection({...editDetection, showModal: false})
    const editDetectionMutation = useEditDetection();
    const onEditDetection = async (e) => {
        e.preventDefault();
        try {
            console.log(editDetection);
            setEditDetection({...editDetection, editing:true})
            await editDetectionMutation.mutateAsync({
                json:false,
                name: editDetection.name,
                comment: editDetection.comment,
                id: editDetection.id,
                sessionId: (editDetection.sessionId !== '' ? editDetection.sessionId : undefined),
            });
            await personDataQuery.refetch();
            setEditDetection({id:'', name:'', comment:'', error:'', sessionId: '', editing:false, showModal:false})
        } catch (e) {
            console.error('Edit Detection Form Mutation Failed');
            setEditDetection({...editDetection, error: (e.status + ':' + e.message)});
        }
    }

    // ----------------------------------------------
    // ADDING AND EDITING SESSIONS

    const [addSession, setAddSession] = useState({
        adding: false, error: '', showModal: false, name: ''
    })
    const ShowAddSessionModal = () => setAddSession({...addSession, showModal: true});
    const HideAddSessionModal = () => setAddSession({...addSession, showModal: false});
    const addSessionMutation = useAddSessionMutation();
    const onAddSession = async (e) => {
        e.preventDefault();
        try {
            setAddSession({...addSession, adding: true});
            await addSessionMutation.mutateAsync({id: id, name: addSession.name});
            await personDataQuery.refetch();
            setAddSession({name: '', error: '', showModal: false, adding: false});
        } catch (e) {
            console.error('Add Session Form Mutation Failed');
            setAddSession({...addSession, error: (e.status + ':' + e.message)});
        }
    }

    const [editSession, setEditSession] = useState({
        editing: false, error: '', showModal: false, sessionId: '', name: ''
    })
    const HideEditSessionModal = () => setEditSession({...editSession, showModal: false});
    const editSessionMutation = useEditSessionMutation();
    const onEditSession = async (e) => {
        e.preventDefault();
        try {
            setEditSession({...editSession, editing: true});
            console.log(editSession.sessionId);
            await editSessionMutation.mutateAsync({
                id: id, sessionId: editSession.sessionId, name: editSession.name
            });
            await personDataQuery.refetch();
            setEditSession({name: '', showModal: false, sessionId: '', error: '', editing: false});
        } catch (e) {
            console.error('Edit Session Form Mutation Failed');
            setEditSession({...editSession, error: (e.status + ':' + e.message)});
        }
    }

    // ----------------------------------------------

    // Handle going back to the main screen.
    const navigate = useNavigate();
    const back = () => { navigate('/'); };

    // Handling logging out
    const LogoutMutation = useLogoutMutation();

    // Handle not logged in case
    const user = useUser();
    useEffect(() => {
        if (user.data === null) { navigate('/'); }
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

    // Repeated Detection Item Abstraction
    const detectionItem = (detection, index) => (
        <Accordion.Item eventKey={detection} index={index} className='text-start'>
            <Accordion.Header id={detection.name}>
                <div className='d-flex flex-row justify-content-between w-100 align-items-center'>
                    <div className='fw-bold'>{detection.name}</div>
                    <Badge id={detection.name + ' Result'} className='m-1'
                           bg={detection.truth ? "success" : "danger"}>
                        <h5 className='m-0'>{detection.truth ? "TRUTH" : "LIE"}</h5>
                    </Badge>
                </div>
            </Accordion.Header>
            <Accordion.Body className='d-flex flex-row justify-content-between'>
                <div>
                    <div id={detection.name + ' Confidence'}>
                        Confidence: {Math.round(detection.confidence * 100)}%
                    </div>
                    <div id={detection.name + ' Comment'}>
                        { (detection.comment === '')
                            ? ('') : `Comment: ${detection.comment}`}
                    </div>
                </div>
                <div className='d-flex align-items-start justify-content-center'>
                    <Button className='m-1' size='sm' variant='secondary'
                            id={detection.name+' Edit'}
                            onClick={() => {setEditDetection(
                                {...editDetection,
                                    showModal: true, id: detection._id, name: detection.name,
                                    comment:detection.comment})
                            }}>
                        <FontAwesomeIcon icon={faPenToSquare}/>
                    </Button>
                </div>
            </Accordion.Body>
        </Accordion.Item>
    )

    let detections;
    let sessions;
    if (personDataQuery.isPending) {
        detections = (
            <Spinner animation='border' role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    }
    else if (personDataQuery.isError) {
        personName = 'Error';
        detections = (
            <div>
                <header className="fs-1">Error</header>
                <p>{personDataQuery.error.status}: {personDataQuery.error.message}</p>
            </div>
        );
    }
    else if (personDataQuery.data === null) {
        personName = 'Error';
        detections = (
            <div>
                <header className="fs-1">Error</header>
                <p>An error occurred while fetching detections(data was null).</p>
                <p>Ensure you are visiting the correct person, or log out and in again.</p>
            </div>
        );
    }
    else if (personDataQuery.data.length === 0) {
        personName = personDataQuery.data.name;
        detections = (
            <p>No detections yet! Add a detection or a session with the 'Add' button at the top.</p>
        );
    }
    else {
        personName = personDataQuery.data.name;
        sessions = personDataQuery.data.sessions;
        detections = (
            <div className='w-100'>
                <Accordion alwaysOpen className='w-100'>
                    {personDataQuery.data.detections['Not In A Session'] === undefined
                        ? <div></div>
                        : <Accordion.Item eventKey={'Not In A Session'} id='Not In A Session' className='text-start'>
                            <Accordion.Header>
                                <div className='fw-bold'>Not In A Session</div>
                            </Accordion.Header>
                            <AccordionBody>
                                <Accordion alwaysOpen className='w-100'>
                                    { personDataQuery.data.detections['Not In A Session'].length === 0
                                        ? <div>No detections yet.</div>
                                        : personDataQuery.data.detections['Not In A Session'].map((detection, index) => (
                                            detectionItem(detection, index)
                                        )) }
                                </Accordion>
                            </AccordionBody>
                        </Accordion.Item>
                    }
                    {personDataQuery.data.sessions.map((session, index) => (
                        <Accordion.Item eventKey={session.name} id={session.name} key={index} className='text-start'>
                            <Accordion.Header>
                                <div className='d-flex flex-row justify-content-between w-100 align-items-center'>
                                    <div className='fw-bold'>{session.name}</div>
                                    {session.name === 'Not In A Session' ? <div></div> :
                                        <Button className='m-1' size='sm' variant='secondary'
                                                id={session.name+' Edit'}
                                                onClick={() => {setEditSession(
                                                    {...editSession,
                                                        showModal: true,
                                                        sessionId: session._id,
                                                        name:session.name})
                                                }}>
                                            <FontAwesomeIcon icon={faPenToSquare}/>
                                        </Button>}
                                </div>
                            </Accordion.Header>
                            <AccordionBody>
                                <Accordion alwaysOpen className='w-100'>
                                    { personDataQuery.data.detections[session.name] === undefined
                                        ? <div>No detections yet.</div>
                                        : personDataQuery.data.detections[session.name].map((detection, index) => (
                                            detectionItem(detection, index)
                                        )) }
                                </Accordion>
                            </AccordionBody>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </div>
        )
    }

    return (
        <div>
            <div className="p-2 border border-top-0 border-start-0 border-end-0 border-3">
                <div className='container-fluid d-flex flex-row justify-content-between'>
                    <header id='personHeader' className="fs-3">{personName}</header>
                    <div className='d-flex flex-row'>
                        <Button className='mx-1' variant='secondary' onClick={back}> Back </Button>
                        <Button className='mx-1' variant='primary' onClick={logout}> Log Out </Button>
                    </div>
                </div>
            </div>
            <div className='container-fluid'>
                <div className='w-75 mx-auto py-2 d-flex flex-row justify-content-between'>
                    <header id='detectionsHeader' className="fs-1">Detections</header>
                    <div className='d-flex gap-2'>
                        <button id='addSessionButton' type="button" className="btn btn-lg btn-primary"
                                onClick={ShowAddSessionModal}>
                            Add Session
                        </button>
                        <button id='addDetectionButton' type="button" className="btn btn-lg btn-primary"
                                onClick={ShowAddDetectionModal}>
                            Add Detection
                        </button>
                    </div>
                </div>
                <div className="d-flex gap-2 mx-auto w-75 text-center justify-content-center align-items-center">
                    {detections}
                </div>
            </div>
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
                        <Form.Group>
                            <Form.Label>Detection Session</Form.Label>
                            <Form.Select name="select" id="inputEditDetectionSession"
                                         value={editDetection.sessionId} onChange={e => setEditDetection({...editDetection, sessionId: e.target.value})}>
                                <option value={null}>None</option>
                                {sessions === undefined
                                    ? null
                                    : sessions.map((session) => (
                                        <option value={session._id}>{session.name}</option>
                                    ))}
                            </Form.Select>
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
                                disabled={editDetection.editing}>
                            {editDetection.editing ? 'Editing...' : 'Edit'}
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
                        <Form.Group>
                            <Form.Label>Detection Session</Form.Label>
                            <Form.Select name="sessionId" id="inputDetectionSession"
                                         value={addDetection.sessionId} onChange={e => setAddDetection({...addDetection, sessionId: e.target.value})}>
                                <option value="">None</option>
                                {sessions === undefined
                                    ? null
                                    : sessions.map((session) => (
                                        <option value={session._id}>{session.name}</option>
                                    ))}
                            </Form.Select>
                        </Form.Group>
                        {addDetection.error === ''
                            ? <div></div>
                            : <label id='addError' className='text-danger'>{addDetection.error}</label>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={HideAddDetectionModal}>
                            Cancel
                        </Button>
                        <Button type='submit' variant="primary" id='addDetectionSubmit'
                                disabled={addDetection.adding}>
                            {addDetection.adding ? 'Adding...' : 'Add'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Modal show={editSession.showModal} onHide={HideEditSessionModal} backdrop="static">
                <Form onSubmit={onEditSession}>
                    <Modal.Header closeButton><Modal.Title>Edit Session: {editSession.name}</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Session Name</Form.Label>
                            <Form.Control aria-label='Session Name Box' name="name" id='inputEditSessionName'
                                          value={editSession.name}
                                          onChange={e => setEditSession({...editSession, error: '', name: e.target.value})}
                                          placeholder='Enter Session Name Here'
                            />
                        </Form.Group>
                        {editSession.error === ''
                            ? <div></div>
                            : <label id='addError' className='text-danger'>{editSession.error}</label>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={HideEditSessionModal}>
                            Cancel
                        </Button>
                        <Button type='submit' variant="primary" id='editSessionSubmit'
                                disabled={editSession.editing}>
                            {editSession.editing ? 'Editing...' : 'Edit'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Modal show={addSession.showModal} onHide={HideAddSessionModal} backdrop="static">
                <Form onSubmit={onAddSession}>
                    <Modal.Header closeButton><Modal.Title>Add New Session</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Session Name</Form.Label>
                            <Form.Control aria-label='Session Name Box' name="name" id='inputSessionName'
                                          value={addSession.name}
                                          onChange={e => setAddSession({...addSession, error: '', name: e.target.value})}
                                          placeholder='Enter Session Name Here'
                            />
                        </Form.Group>
                        {addSession.error === ''
                            ? <div></div>
                            : <label id='addError' className='text-danger'>{addSession.error}</label>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={HideAddSessionModal}>
                            Cancel
                        </Button>
                        <Button type='submit' variant="primary" id='addSessionSubmit'
                                disabled={addSession.adding}>
                            {addSession.adding ? 'Adding...' : 'Add'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    )
}

export default Person