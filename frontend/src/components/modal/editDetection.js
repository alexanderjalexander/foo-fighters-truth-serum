import React, {useState} from "react";
import {useEditDetection} from "../../query/detections";
import {Button, Form, Modal} from "react-bootstrap";

export default function EditDetection(id, personDataQuery, sessions) {
    const [editDetection, setEditDetection] = useState({
        editing: false, error: '', showModal: false,
        id: '', name: '', prev_name: '', comment: '', sessionId: ''
    })
    const HideEditDetectionModal = () => setEditDetection({...editDetection, showModal: false})
    const editDetectionMutation = useEditDetection();
    const onEditDetection = async (e) => {
        e.preventDefault();
        try {
            setEditDetection({...editDetection, editing:true})
            await editDetectionMutation.mutateAsync({
                json:false,
                name: editDetection.name,
                comment: editDetection.comment,
                id: editDetection.id,
                sessionId: (editDetection.sessionId),
            });
            await personDataQuery.refetch();
            setEditDetection({id:'', name:'', prev_name: '', comment:'', error:'', sessionId: '', editing:false, showModal:false})
        } catch (e) {
            console.error('Edit Detection Form Mutation Failed');
            setEditDetection({...editDetection, error: (e.status + ':' + e.message)});
        }
    }

    const editDetectionModal = (
        <div>
            {editDetection.showModal && <Modal show={editDetection.showModal} onHide={HideEditDetectionModal} backdrop="static">
                <Form onSubmit={onEditDetection}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Detection: {editDetection.prev_name}</Modal.Title>
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
                            <Form.Control aria-label='Detection Comment Box' name="comment"
                                          id='inputEditDetectionComment'
                                          value={editDetection.comment}
                                          onChange={e =>
                                              setEditDetection({...editDetection, error: '', comment: e.target.value})}
                                          placeholder='Edit Detection Comment Here'
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Detection Session</Form.Label>
                            <Form.Select name="select" id="inputEditDetectionSession"
                                         value={editDetection.sessionId} onChange={e => setEditDetection({
                                ...editDetection,
                                sessionId: e.target.value
                            })}>
                                <option value={''}>None</option>
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
                        <Button variant="secondary"
                                onClick={() => setEditDetection({...editDetection, showModal: false})}>
                            Cancel
                        </Button>
                        <Button type='submit' variant="primary" id='editDetectionSubmit'
                                disabled={editDetection.editing}>
                            {editDetection.editing ? 'Editing...' : 'Edit'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>}
        </div>
    )

    return {editDetection, setEditDetection, editDetectionModal}
}