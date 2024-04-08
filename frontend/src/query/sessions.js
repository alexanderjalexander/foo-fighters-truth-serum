import {useMutation} from "@tanstack/react-query";

export const useAddSessionMutation = () => useMutation({
    mutationFn: async ({id, name}) => {
        try {
            const res = await fetch(`/api/people/${id}/sessions`, {
                method: 'POST',
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
})

export const useEditSessionMutation = () => useMutation({
    mutationFn: async ({id, sessionId, name}) => {
        try {
            const res = await fetch(`/api/people/${id}/sessions/${sessionId}`, {
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
})