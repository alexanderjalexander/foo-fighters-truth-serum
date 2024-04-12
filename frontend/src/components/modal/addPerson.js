import React, {useState} from "react";
import {useAddPersonMutation} from "../../query/people";
import {Button, Form, Modal} from "react-bootstrap";

export default function AddPerson(refetch) {
    const [addPerson, setAddPerson] = useState({
        modalShow: false, name: '', addDisabled: false, addError: ''
    })
    const updateName = (newName) => {
        setAddPerson({...addPerson, name: newName, addError: ''});
    }
    const ShowModal = () => setAddPerson({...addPerson, modalShow: true});
    const HideModal = () => setAddPerson({...addPerson, modalShow: false});

    // Add Person Form Mutation
    const AddPersonMutation = useAddPersonMutation(addPerson.name);
    const onAddPerson = async (e) => {
        e.preventDefault();
        setAddPerson({...addPerson, addDisabled: true});
        try {
            await AddPersonMutation.mutateAsync(undefined, undefined);
            await refetch();
            setAddPerson({modalShow: false, name: '', addError: '', addDisabled: false});
        } catch (e) {
            console.error('Add Person Form Mutation Failed');
            setAddPerson({...addPerson, addError: (e.status + ':' + e.message)});
        }
    };

    const addPersonButton = (
        <button id='addPersonButton'
                type="button"
                className="btn btn-lg btn-primary"
                onClick={ShowModal}>
            Add
        </button>
    )

    const addPersonModal = (
        <div>
            {addPerson.modalShow &&
                <Modal id='addPersonModal' show={addPerson.modalShow} onHide={HideModal} backdrop="static">
                    <Form onSubmit={onAddPerson}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Person</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control aria-label='Name Box'
                                          id='inputPersonName'
                                          value={addPerson.name}
                                          onChange={e => updateName(e.target.value)}
                                          placeholder='Enter Name Here'
                            />
                        </Form.Group>
                        <div>
                            {addPerson.addError === '' ? <div></div> :
                                <label id='addError' className='text-danger'>{addPerson.addError}</label>}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={HideModal}>
                            Cancel
                        </Button>
                        <Button type='submit'
                                variant="primary"
                                id='addPersonSubmit'
                                disabled={addPerson.addDisabled}
                                onClick={onAddPerson}>
                            {addPerson.addDisabled ? 'Adding...' : 'Add'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>}
        </div>
    )

    return {addPersonButton, addPersonModal};
}