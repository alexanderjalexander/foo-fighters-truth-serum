import React, {useState} from "react";
import {useRenamePersonQuery} from "../../query/people";
import {Button, Form, Modal} from "react-bootstrap";

export default function RenamePerson(refetch) {
    const [renamePerson, setRenamePerson] = useState({
        modalShow: false, id: '', old_name: '', name: '', renameDisabled: false, renameError: ''
    })
    const updateName = (newName) => {
        setRenamePerson({...renamePerson, name: newName, renameError: ''});
    }
    const HideModal = () => setRenamePerson({...renamePerson, modalShow: false});

    // Rename Person Form Mutation
    const RenamePersonMutation = useRenamePersonQuery();
    const onRenamePerson = async (e) => {
        e.preventDefault();
        try {
            setRenamePerson({...renamePerson, renameDisabled: true});
            await RenamePersonMutation.mutateAsync({personId:renamePerson.id, name:renamePerson.name});
            await refetch();
            setRenamePerson({
                modalShow: false, name: '', old_name: '', id: '',
                renameError: '', renameDisabled: false
            });
        } catch (e) {
            console.error('Rename Person Form Mutation Failed');
            setRenamePerson({...renamePerson, renameError: (e.message)});
        }
    };

    const renamePersonModal = (
        <div>
            {renamePerson.modalShow &&
                <Modal id='renamePersonModal' show={renamePerson.modalShow} onHide={HideModal} backdrop="static">
                    <Form onSubmit={onRenamePerson}>
                        <Modal.Header closeButton>
                            <Modal.Title>Rename Person: {renamePerson.old_name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control aria-label='Name Box'
                                              id='inputPersonName'
                                              value={renamePerson.name}
                                              onChange={e => updateName(e.target.value)}
                                              placeholder='Enter Name Here'
                                />
                            </Form.Group>
                            <div>
                                {renamePerson.renameError === '' ? <div></div> :
                                    <label id='renameError' className='text-danger'>{renamePerson.renameError}</label>}
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={HideModal}>
                                Cancel
                            </Button>
                            <Button type='submit'
                                    variant="primary"
                                    id='renamePersonSubmit'
                                    disabled={renamePerson.renameDisabled}>
                                {renamePerson.renameDisabled ? 'Renaming...' : 'Rename'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>}
        </div>
    )

    return {renamePerson, setRenamePerson, renamePersonModal};

}