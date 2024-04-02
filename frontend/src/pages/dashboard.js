import React, {useState} from "react";
import {Button, ListGroup, Form, Modal, Spinner, Badge} from "react-bootstrap";
import {useAddPersonMutation, useGetAllPeopleQuery} from "../query/people";

const Dashboard = ({loginHandler}) => {
    // Obtaining People Query
    const {isPending,
        isError,
        error,
        refetch,
        data} = useGetAllPeopleQuery();

    // Displaying the People
    let people;
    if (isPending) {
        people = (
            <Spinner animation='border' role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    }
    else if (isError) {
        people = (
            <div>
                <header className="fs-1">Error</header>
                <p>{error.status}: {error.message}</p>
            </div>
        )
    }
    else if (data === null) {
        people = (
            <div>
                <header className="fs-1">Error</header>
                <p>An error occurred while fetching people(data was null). Try logging out and back in.</p>
            </div>
        )
    }
    else {
        people = (
            <ListGroup className='w-100'>
                {data.length === 0
                    ? (<p>No people yet! Add a person with the 'Add' button at the top.</p>)
                    : data.map((person) => (
                        <ListGroup.Item id={`${person.name}`}
                                        className='text-start'
                                        href={`/${person._id}`}
                                        key={person.name}
                                        action>
                            {person.name}
                            <Badge className='m-1' bg='primary'>{person.numDetections}</Badge>
                        </ListGroup.Item>
                    ))}
            </ListGroup>
        )
    }

    // Modal States and Form Control
    const [modalShow, setModalShow] = useState(false);
    const [name, setName] = useState('');
    const updateName = (newName) => {
        setName(newName);
        setAddError('');
    }
    const [addDisabled, setAddDisabled] = useState(false);
    const [addError, setAddError] = useState('');
    const ShowModal = () => setModalShow(true);
    const HideModal = () => setModalShow(false);

    // Add Person Form Mutation
    const AddPersonMutation = useAddPersonMutation(name);
    const onAddPerson = async (e) => {
        e.preventDefault();
        setAddDisabled(true);
        try {
            await AddPersonMutation.mutateAsync(undefined, undefined);
            await refetch();
            updateName('');
            HideModal();
        } catch (e) {
            console.error('Add Person Form Mutation Failed');
            setAddError(e.status + ':' + e.message);
        }
        setAddDisabled(false);
    };

    return (
        <div>
            <div className="p-2 border border-top-0 border-start-0 border-end-0 border-3 ">
                <div className='container-fluid d-flex flex-row justify-content-between'>
                    <header id='dashboardHeader' className="fs-3">Dashboard</header>
                    <input type="button"
                           className="btn btn-primary"
                           onClick={loginHandler}
                           value="Log Out"
                    />
                </div>
            </div>
            <div className='container-fluid'>
                <div className='w-75 mx-auto py-2 d-flex flex-row justify-content-between'>
                    <header id='peopleHeader' className="fs-1">People</header>
                    <button id='addPersonButton'
                            type="button"
                            className="btn btn-lg btn-primary"
                            onClick={ShowModal}>
                        Add
                    </button>
                </div>
                <div className="d-flex gap-2 mx-auto w-75 text-center justify-content-center align-items-center">
                    {people}
                </div>
            </div>
            <Modal id='addPersonModal' show={modalShow} onHide={HideModal} backdrop="static">
                <Form onSubmit={onAddPerson}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Person</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control aria-label='Name Box'
                                          id='inputPersonName'
                                          value={name}
                                          onChange={e => updateName(e.target.value)}
                                          placeholder='Enter Name Here'
                            />
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
                                id='addPersonSubmit'
                                disabled={addDisabled || isError || isPending}
                                onClick={onAddPerson}>
                            {addDisabled ? 'Adding...' : 'Add'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    )
}

export default Dashboard