import {useBetterMutation} from "./useBetterMutation";
import {useQuery} from "@tanstack/react-query";

export const useMeQuery = () => useQuery({
    queryKey: ['userSession'],
    queryFn: async () => {
        const result = await fetch('/api/me', {
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

export const useLoginMutation = (email, password) => useBetterMutation(
true,
    '/api/login',
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password})
    }
)

export const useRegistrationMutation = (email, password) => useBetterMutation(
    false,
    '/api/register',
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password})
    }
)

export const useLogoutMutation = () => useBetterMutation(
    false,
    '/api/logout',
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        }
    }
)