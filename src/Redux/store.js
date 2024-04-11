import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slicefiles/AuthenticSlice'
import chatReducer from './Slicefiles/ChatSlice'
import groupReducer from './Slicefiles/GroupSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        grp: groupReducer,
    },
});

export default store;