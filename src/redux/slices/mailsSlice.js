import { createSlice } from "@reduxjs/toolkit";

export const mailsSlice = createSlice({
    name: 'mail',
    initialState: {
        name: '',
        template: '',
        to: [],
        date: '',
        subject: '',
        content: '',
        sent: false
    },
    reducers : {
        saveMail: (state, action) => {
            state.name = action.payload.name;
            state.template = action.payload.template;
            state.to = action.payload.to;
            state.date = action.payload.date;
            state.subject = action.payload.subject;
            state.content = action.payload.content;
            state.content = action.payload.sent;
        }
    }
})

export const {saveMail} = mailsSlice.actions
export default mailsSlice.reducer