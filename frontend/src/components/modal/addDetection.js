import {Button, Form, Modal} from "react-bootstrap";
import React, {useState} from "react";
import {usePostAddDetectionMutation} from "../../query/detections";

export default function AddDetection(id, personDataQuery, sessions) {
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
            setAddDetection({...addDetection, error: e.message});
        }
    }

    const addDetectionButton = (
        <button id='addDetectionButton' type="button" className="btn btn-lg btn-primary"
                onClick={ShowAddDetectionModal}>
            Add Detection
        </button>
    )

    const addDetectionModal = (
        <div>
            {addDetection.showModal &&
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
                                          onChange={e => setAddDetection({
                                              ...addDetection,
                                              error: '',
                                              name: e.target.value
                                          })}
                                          placeholder='Enter Detection Name Here'
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Detection File</Form.Label>
                            <Form.Control type="file" name="file" aria-label='Detection File Upload'
                                          id='inputDetectionFile' accept=".csv"
                                          placeholder='Place Detections .csv Here'/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Detection Session</Form.Label>
                            <Form.Select name="sessionId" id="inputDetectionSession"
                                         value={addDetection.sessionId}
                                         onChange={e => setAddDetection({...addDetection, sessionId: e.target.value})}>
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
            </Modal>}
        </div>
    )

    return {addDetectionButton, addDetectionModal}
}
