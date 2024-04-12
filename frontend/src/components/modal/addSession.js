import React, {useState} from "react";
import {useAddSessionMutation} from "../../query/sessions";
import {Button, Form, Modal} from "react-bootstrap";

export function AddSession(id, personDataQuery) {
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

    const addSessionModal = (
        <div>
            {addSession.showModal && <Modal show={addSession.showModal} onHide={HideAddSessionModal} backdrop="static">
                <Form onSubmit={onAddSession}>
                    <Modal.Header closeButton><Modal.Title>Add New Session</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Session Name</Form.Label>
                            <Form.Control aria-label='Session Name Box' name="name" id='inputSessionName'
                                          value={addSession.name}
                                          onChange={e => setAddSession({
                                              ...addSession,
                                              error: '',
                                              name: e.target.value
                                          })}
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
            </Modal>}
        </div>
    )

    const addSessionButton = (
        <button id='addSessionButton' type="button" className="btn btn-lg btn-primary"
                onClick={ShowAddSessionModal}>
            Add Session
        </button>
    )

    return {addSessionModal, addSessionButton}
}