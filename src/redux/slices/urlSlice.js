import { createSlice } from "@reduxjs/toolkit";

export const urlSlice = createSlice({
    name: 'url',
    initialState: {
        urlId: null
    },
    reducers: {
        setUrlId: (state, action) => {
            state.urlId = action.payload.urlId
        },
        clearUrlId: (state, action) => {
            state.urlId = null
        }
    }
})

export const {setUrlId, clearUrlId} = urlSlice.actions
export default urlSlice.reducer