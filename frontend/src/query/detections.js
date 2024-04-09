import {useMutation} from "@tanstack/react-query";

/**
 * POST /api/people/:peopleId/detections
 */
export const usePostAddDetectionMutation = () => useMutation({
    mutationFn: async ({json, id, form}) => {
        try {
            const res = await fetch(`/api/people/${id}/detections`, {
                method: 'POST',
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

/**
 * POST /api/detections/:detectionId
 */
export const useEditDetection = () => useMutation({
    mutationFn: async ({json, id, name, comment, sessionId}) => {
        try {
            const res = await fetch(`/api/detections/${id}`, {
                method: 'PATCH',
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({name, comment, sessionId}),
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

export const useFlagDetection = () => useMutation({
    mutationFn: async ({id}) => {
        try {
            const res = await fetch(`/api/detections/${id}/flag`, {
                method: 'POST',
                headers: { "Content-Type": "application/json", }
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