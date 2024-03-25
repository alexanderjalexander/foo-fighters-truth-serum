import {useBetterMutation} from "./useBetterMutation";
import {useBetterQuery} from "./useBetterQuery";

export const useGetAllPeopleQuery = () => useBetterQuery(
    'getAllPeople',
    true,
    '/api/people',
    {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    }
)

export const useAddPersonMutation = (name) => useBetterMutation(
    true,
    '/api/people',
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({personName: name})
    }
)

export const useGetAllDetectionsQuery = (id) => useBetterQuery(
    'getAllDetections',
    true,
    `/api/people/${id}/detections`,
    {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    }
);