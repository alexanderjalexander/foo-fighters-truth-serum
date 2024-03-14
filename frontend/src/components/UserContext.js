import React, {createContext, useContext, useState} from 'react';
import {useQuery} from "@tanstack/react-query";

const UserContext = createContext(null);

export function useUser() {
    return useContext(UserContext);
}

export const AuthWrapper = ({children}) => {
    // await stuff here and then hopefully get stuff back?????
    const {isPending,
        status,
        error,
        refetch,
        data} = useQuery({
        queryKey: ['userSession'],
        queryFn: async () => {
            const result = await fetch('/api/checkSession', {
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

    if (isPending) {
        return (
            <div className="d-flex vh-100 text-center justify-content-center align-items-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="d-flex vh-100 text-center justify-content-center align-items-center">
                <div>
                    <header className="fs-1">Error</header>
                    <p>{error}</p>
                </div>
            </div>
        )
    }

    return (
        <UserContext.Provider value={{data, refetch}}>
            {children}
        </UserContext.Provider>
    )
}