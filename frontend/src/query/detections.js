import {useMutation} from "@tanstack/react-query";

/**
 * POST /api/detections/:detectionId/name
 */
export const useEditDetectionName = () => useMutation({
    mutationFn: async ({json, id, name}) => {
        try {
            const res = await fetch(`/api/detections/${id}/name`, {
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
 * POST /api/detections/:detectionId/comment
 */
export const useEditDetectionComment = () => useMutation({
    mutationFn: async ({json, id, comment}) => {
        try {
            const res = await fetch(`/api/detections/${id}/comment`, {
                method: 'POST',
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({comment: comment}),
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