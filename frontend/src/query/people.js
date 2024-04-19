import {useBetterMutation} from "./useBetterMutation";
import {useBetterQuery} from "./useBetterQuery";
import {useMutation} from "@tanstack/react-query";

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

export const useGetAllPersonDataQuery = (id) => useBetterQuery(
    'getAllDetections',
    true,
    `/api/people/${id}`,
    {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    }
);

export const useRenamePersonQuery = () => useMutation({
    mutationFn: async ({personId, name}) => {
        try {
            const res = await fetch(`/api/people/${personId}`, {
                method: 'PATCH',
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({name: name}),
            });
            if (!res.ok) {
                throw {
                    status: res.status,
                    message: (await res.json()).error
                }
            }
            return res;
        } catch (e) {
            if (e instanceof TypeError) {
                throw { status: 500, message: "Failed to get data, please try again in a moment." };
            }
            throw e;
        }
    }
});