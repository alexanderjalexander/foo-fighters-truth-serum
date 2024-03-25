import React, {createContext, useContext} from 'react';
import {useMeQuery} from "../query/auth";
import FlexCenterWrapper from "./FlexCenterWrapper";

const UserContext = createContext(null);

export function useUser() {
    return useContext(UserContext);
}

export const AuthWrapper = ({children}) => {
    let me = useMeQuery();

    if (me.isPending) {
        return (
            <FlexCenterWrapper>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </FlexCenterWrapper>
        )
    }
    else if (me.isError) {
        return (
            <FlexCenterWrapper>
                <div>
                    <header className="fs-1">Error</header>
                    <p>{me.error.toString()}</p>
                </div>
            </FlexCenterWrapper>
        )
    }

    return (
        <UserContext.Provider value={{data: me.data, refetch: me.refetch}}>
            {children}
        </UserContext.Provider>
    )
}