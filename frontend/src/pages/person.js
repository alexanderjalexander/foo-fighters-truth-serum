import React, {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Accordion, AccordionBody, Badge, Button, OverlayTrigger, Spinner, Tooltip} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFlag, faPenToSquare} from "@fortawesome/free-solid-svg-icons";

import {useUser} from "../components/UserContext";
import {useLogoutMutation} from "../query/auth";
import {useGetAllPersonDataQuery} from "../query/people";
import {AddSession} from "../components/modal/addSession";
import {EditSession} from "../components/modal/editSession";
import FlagDetection from "../components/modal/flagDetection";
import EditDetection from "../components/modal/editDetection";
import AddDetection from "../components/modal/addDetection";

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
                    <div>
                        {detection.flagged
                            ?
                            <OverlayTrigger overlay={<Tooltip id="button-tooltip">
                                This detection was marked as incorrect.
                            </Tooltip>}>
                                <Badge id={detection.name + ' Flagged'} className='m-1' bg='danger'>
                                    <h6 className='m-0'><FontAwesomeIcon icon={faFlag}/></h6>
                                </Badge>
                            </OverlayTrigger>
                            :
                            <div></div>}
                        <Badge id={detection.name + ' Result'} className='m-1'
                               bg={detection.truth ? "success" : "danger"}>
                            <h5 className='m-0'>{detection.truth ? "TRUTH" : "LIE"}</h5>
                        </Badge>
                    </div>
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
                    {!detection.flagged
                        ? <Button className='m-1' size='sm' variant='danger'
                                  id={detection.name+' Flag'}
                                  onClick={() => flagDetectionComponents.setFlagDetection({
                                      ...flagDetectionComponents.flagDetection, showModal: true,
                                      id: detection._id, name: detection.name
                                  })}>
                        <FontAwesomeIcon icon={faFlag}/>
                        </Button>
                        : <div></div>}
                    <Button className='m-1' size='sm' variant='secondary'
                            id={detection.name+' Edit'}
                            onClick={() => {editDetectionComponents.setEditDetection(
                                {...editDetectionComponents.editDetection,
                                    showModal: true, id: detection._id, name: detection.name,
                                    sessionId: detection.sessionId,
                                    prev_name: detection.name, comment:detection.comment})
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
                <p>{personDataQuery.error.message}</p>
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
    else if (Object.keys(personDataQuery.data.detections).length === 0 && personDataQuery.data.sessions.length === 0) {
        personName = personDataQuery.data.name;
        sessions = personDataQuery.data.sessions;
        detections = (
            <p>No sessions/detections yet! Add a detection or a session with the 'Add' button at the top.</p>
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
                                                onClick={() => {editSessionComponents.setEditSession(
                                                    {...editSessionComponents.editSession,
                                                        showModal: true,
                                                        sessionId: session._id,
                                                        name:session.name, prev_name: session.name})
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

    // ----------------------------------------------
    // ADDING AND EDITING DETECTIONS

    // Modal Handling for Adding Detections
    const addDetectionComponents = AddDetection(id, personDataQuery, sessions);

    // Modal Handling for Editing Detections
    const editDetectionComponents = EditDetection(id, personDataQuery, sessions);

    // Modal Handling for Flagging Detections
    const flagDetectionComponents = FlagDetection(id, personDataQuery);

    // ----------------------------------------------
    // ADDING AND EDITING SESSIONS

    const addSessionComponents = AddSession(id, personDataQuery);
    const editSessionComponents = EditSession(id, personDataQuery);

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
                        {addSessionComponents.addSessionButton}
                        {addDetectionComponents.addDetectionButton}
                    </div>
                </div>
                <div className="d-flex gap-2 mx-auto w-75 text-center justify-content-center align-items-center">
                    {detections}
                </div>
            </div>
            {flagDetectionComponents.flagDetectionModal}
            {editDetectionComponents.editDetectionModal}
            {addDetectionComponents.addDetectionModal}
            {editSessionComponents.editSessionModal}
            {addSessionComponents.addSessionModal}
        </div>
    )
}

export default Person
