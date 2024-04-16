import {Button, Form, Modal} from "react-bootstrap";
import React, {useState} from "react";
import {useEditSessionMutation} from "../../query/sessions";

export function EditSession(id, personDataQuery) {
    const [editSession, setEditSession] = useState({
        editing: false, error: '', showModal: false, sessionId: '', prev_name: '', name: ''
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
            setEditSession({name: '', showModal: false, sessionId: '', prev_name: '', error: '', editing: false});
        } catch (e) {
            console.error('Edit Session Form Mutation Failed');
            setEditSession({...editSession, error: (e.status + ':' + e.message)});
        }
    }

    const editSessionModal = (
        <div>
            {editSession.showModal && <Modal show={editSession.showModal} onHide={HideEditSessionModal} backdrop="static">
                <Form onSubmit={onEditSession}>
                    <Modal.Header closeButton><Modal.Title>Edit Session: {editSession.prev_name}</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Session Name</Form.Label>
                            <Form.Control aria-label='Session Name Box' name="name" id='inputEditSessionName'
                                          value={editSession.name}
                                          onChange={e => setEditSession({
                                              ...editSession,
                                              error: '',
                                              name: e.target.value
                                          })}
                                          placeholder='Enter Session Name Here'
                            />
                        </Form.Group>
                        {editSession.error === ''
                            ? <div></div>
                            : <label id='editError' className='text-danger'>{editSession.error}</label>}
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
            </Modal>}
        </div>
    )

    return {editSession, setEditSession, editSessionModal}
}