import {useMutation} from "@tanstack/react-query";

export const useBetterMutation = (json, ...fetchArgs) => {
    return useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(...fetchArgs);
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
}