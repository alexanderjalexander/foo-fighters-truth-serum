import React from "react";
import {ListGroup, Spinner, Badge, Button, Pagination} from "react-bootstrap";
import {useGetAllPeopleQuery} from "../query/people";
import AddPerson from "../components/modal/addPerson";
import RenamePerson from "../components/modal/renamePerson";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from "react-router-dom";

const pageSize = 6;

const Dashboard = ({loginHandler}) => {
    const params = useParams();
    const navigate = useNavigate();
    let page = Math.max(+params.page || 1, 1);
    // Obtaining People Query
    const {isPending,
        isError,
        error,
        refetch,
        data} = useGetAllPeopleQuery();


    // Modal States and Form Control
    const addPersonComponents = AddPerson(refetch);
    const renamePersonComponents = RenamePerson(refetch);

    const nav = (href) => () => navigate(href);

    // Displaying the People
    let people;
    let pageButtons;
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
        if (data.length === 0) {
            people = (
                <ListGroup className='w-100'>
                    <p>No people yet! Add a person with the 'Add' button at the top.</p>
                </ListGroup>
            );
        } else {
            const index = page - 1;
            const lastPage = Math.floor((data.length - 1) / pageSize);
            page = Math.min(page, lastPage + 1);
            const start = Math.min(index, lastPage) * pageSize;
            const hasBack = index > 0;
            const hasForward = index < lastPage;
            pageButtons = (
                <Pagination>
                    {page > 2 && <Pagination.First onClick={nav("/1")} />}
                    {hasBack && <Pagination.Prev onClick={nav(`/${page - 1}`)} />}
                    {hasBack && <Pagination.Item onClick={nav(`/${page - 1}`)} >{page - 1}</Pagination.Item>}
                    <Pagination.Item active>{page}</Pagination.Item>
                    {hasForward && <Pagination.Item onClick={nav(`/${page + 1}`)} >{page + 1}</Pagination.Item>}
                    {hasForward && <Pagination.Next onClick={nav(`/${page + 1}`)} />}
                    {page < lastPage && <Pagination.Last onClick={nav(`/${lastPage + 1}`)} />}
                </Pagination>
            );
            people = (
                <ListGroup className='w-100'>
                    {data.slice(start, start + pageSize).map((person) => (
                        <div key={person._id} className='d-flex flex-row'>
                            <ListGroup.Item id={`${person.name}`}
                                            className='d-flex align-items-baseline justify-content-between'
                                            onClick={nav(`/person/${person._id}`)}
                                            key={person.name}
                                            action>
                                <span id={`${person.name} Name`} className='m-0'>
                                    {person.name}
                                    <Badge className='m-1' bg='primary'>{person.numDetections}</Badge>
                                </span>
                                <Button className='m-1 z-3' size='sm' variant='secondary' id={`${person.name} Rename`}
                                        onClickCapture={(event) => {
                                            event.stopPropagation();
                                            renamePersonComponents.setRenamePerson({
                                                ...renamePersonComponents.renamePerson,
                                                name:person.name, modalShow: true,
                                                old_name: person.name, id:person._id
                                            })}}>
                                    <FontAwesomeIcon icon={faPenToSquare}/>
                                </Button>
                            </ListGroup.Item>
                        </div>
                    ))}
                </ListGroup>
            );
        }
    }

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
                <div className="d-flex flex-column gap-2 mx-auto w-75 text-center justify-content-center align-items-center">
                    {people}
                    {pageButtons}
                </div>
            </div>
            {addPersonComponents.addPersonModal}
            {renamePersonComponents.renamePersonModal}
        </div>
    )
}

export default Dashboard