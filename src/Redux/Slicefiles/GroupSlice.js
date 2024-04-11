import { createSlice } from '@reduxjs/toolkit';

const groupSlice = createSlice({
    name: 'grp',
    initialState: {
        grpId: 'null',
        grpName: 'null',
        user: {},
    },
    reducers: {
        grouPId(state, action) {
            state.grpId = action.payload;      
            state.grpName = action.payload;      
        },
        grouPName(state, action) {
            state.grpName = action.payload;           
        },
    },
});
export const { grouPName, grouPId } = groupSlice.actions;
export default groupSlice.reducer;