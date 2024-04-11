import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        currentUser: null,
        displayName: null,
        photoURL: null,
        file: null,
    },
    reducers: {
        setCurrentUser: (state, action) => {
            if (action.payload) {
                const { uid, displayName,photoURL, file } = action.payload;
                const fileData = file ? { name: file.name, size: file.size, type: file.type, lastModified: file.lastModified } : null;
                state.currentUser = uid;
                state.displayName = displayName;
                state.photoURL = photoURL;
                state.file = fileData;
            } else {
                state.currentUser = null;
                state.displayName = null;
                state.file = null;
            }
        },

    },
});

export const { setCurrentUser } = authSlice.actions;

export default authSlice.reducer;
