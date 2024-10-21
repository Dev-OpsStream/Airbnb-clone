import axios from "axios";
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!user) {
            axios.get('/profile')
                .then(({ data }) => {
                    setUser(data);
                    setReady(true);  
                })
                .catch((error) => {
                    if (error.message === 'Network Error') {
                        setUser(null); 
                    } else {
                        console.error("Error fetching profile data:", error);
                    }
                    setReady(true); 
                });
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, ready }}>
            {children}
        </UserContext.Provider>
    );
}