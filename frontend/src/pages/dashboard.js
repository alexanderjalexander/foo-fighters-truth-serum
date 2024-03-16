import React, {useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Button, ListGroup, CardBody, CardText, CardTitle, Form, Modal, Spinner, Badge} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const Dashboard = ({loginHandler}) => {
    // Obtaining People Query
    const {isPending,
        isError,
        error,
        refetch,
        data} = useQuery({
        queryKey: ['getAllPeople'],
        queryFn: async () => {
            const result = await fetch('/api/getAllPeople', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                }
            })
            if (!result.ok) {
                return null;
            }
            return await result.json();
        }
    });

    // Displaying the People
    let people;
    if (isPending) {
        people = (
            <div className="d-flex gap-2 mx-auto w-75 text-center justify-content-center align-items-center">
                <Spinner animation='border' role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    } else if (isError) {
        people = (
            <div className="d-flex gap-2 mx-auto w-75 text-center justify-content-center align-items-center">
                <div>
                    <header className="fs-1">Error</header>
                    <p>{error.toString()}</p>
                </div>
            </div>
        );
    } else if (data === null) {
        people = (
            <div className="d-flex gap-2 mx-auto w-75 text-center justify-content-center align-items-center">
                <div>
                    <header className="fs-1">Error</header>
                    <p>An error occurred while fetching people(data was null). Try logging out and back in.</p>
                </div>
            </div>
        )
    } else if (data.peopleRes.length === 0) {
        people = (
            <div className="d-flex gap-2 mx-auto w-75 text-center justify-content-center align-items-center">
                <p>No people yet! Add a person with the 'Add' button at the top.</p>
            </div>
        )
    } else {
        people = (
            <div className="d-flex gap-2 mx-auto w-75 text-center justify-content-center align-items-center">
                <ListGroup className='w-100'>
                    {data.peopleRes.map((person) => (
                        <ListGroup.Item id={`${person.name}`}
                                        className='text-start'
                                        href={`/${person.name}/${person.id}`}
                                        key={person.name}
                                        action>
                            {person.name}
                            <Badge className='m-1' bg='primary'>{person.numDetections}</Badge>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        )
    }

    // Add Person Form Mutation
    const AddPersonMutation = useMutation({
        mutationFn: () => {
            return fetch('/api/addNewPerson', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({personName: name}),
            })
        }
    });

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

    const onAddPerson = async (e) => {
        e.preventDefault();
        setAddDisabled(true);
        const result = await AddPersonMutation.mutateAsync(undefined, undefined);
        const response = await result.json();
        if (!result.ok) {
            console.error('Add Person Form Mutation Failed');
            console.error(response.error);
            setAddError(response.error);
            setAddDisabled(false);
        } else {
            console.log(response.message);
            setAddDisabled(false);
            updateName('');
            HideModal();
            await refetch();
        }
    };

    return (
        <div>
            <Modal show={modalShow} onHide={HideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Person</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
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
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={HideModal}>
                        Cancel
                    </Button>
                    <Button type='submit'
                            variant="primary"
                            id='addPersonSubmit'
                            disabled={addDisabled}
                            onClick={onAddPerson}>
                        {addDisabled ? 'Adding...' : 'Add'}
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="p-2 d-flex flex-row border border-top-0 border-start-0 border-end-0 border-3 justify-content-between">
                <header id='dashboardHeader' className="fs-3">Dashboard</header>
                <input type="button"
                       className="btn btn-primary"
                       onClick={ loginHandler }
                       value="Log Out"
                />
            </div>
            <div className='w-75 mx-auto py-2 d-flex flex-row justify-content-between'>
                <header id='peopleHeader' className="fs-1">People</header>
                <button id='addPersonButton'
                        type="button"
                        className="btn btn-lg btn-primary"
                        onClick={ShowModal}>
                    Add
                </button>
            </div>
            {people}
        </div>
    )
}

export default Dashboard