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

export const usePostAddDetectionMutation = () => useMutation({
    mutationFn: async ({json, id, form}) => {
        try {
            const res = await fetch(`/api/people/${id}/detections`, {
                method: 'POST',
                headers: {

                },
                body: form,
            });
            if (!res.ok) {
                throw {
                    status: res.status,
                    message: (await res.json()).error
                }
            }
            if (json) { return await res.json(); }
            else { return res; }
        } catch (e) {
            if (e instanceof TypeError) {
                throw { status: 500, message: "Failed to get data, please try again in a moment." };
            }
            throw e;
        }
    }
})