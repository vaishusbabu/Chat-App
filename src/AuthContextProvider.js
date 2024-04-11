import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { setCurrentUser } from './Redux/Slicefiles/AuthenticSlice';
import { auth } from './firebase';

const AuthContextProvider = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const { uid, email } = user;
                dispatch(setCurrentUser({ uid, email }));
            } else {
                dispatch(setCurrentUser(null));
            }
        });

        return () => {
            unsubscribe();
        };
    }, [dispatch]);

    return <>{children}</>;
};

export default AuthContextProvider;
