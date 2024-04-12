import React from "react";
import {ListGroup, Spinner, Badge} from "react-bootstrap";
import {useGetAllPeopleQuery} from "../query/people";
import AddPerson from "../components/modal/addPerson";

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
    const addPersonComponents = AddPerson(refetch);

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
                    {addPersonComponents.addPersonButton}
                </div>
                <div className="d-flex gap-2 mx-auto w-75 text-center justify-content-center align-items-center">
                    {people}
                </div>
            </div>
            {addPersonComponents.addPersonModal}
        </div>
    )
}

export default Dashboard