import { createSlice } from '@reduxjs/toolkit';


const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chatId: 'null',
        user: {},
    },
    reducers: {
        changeUser(state, action) {
            const { currentUser } = action.payload;
            state.user = action.payload;
            state.chatId =
                currentUser.currentUser > currentUser.uid
                    ? currentUser.currentUser + currentUser.uid
                    : currentUser.uid + currentUser.currentUser;
            // state.chatId = currentUser.currentUser

        },
    },
});

export const { changeUser } = chatSlice.actions;
export default chatSlice.reducer;