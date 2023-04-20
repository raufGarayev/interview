import { createSlice } from "@reduxjs/toolkit";

export const mailsSlice = createSlice({
    name: 'mail',
    initialState: {
        id: null,
        name: '',
        template: '',
        from: 'Qmeter',
        receivers: [],
        cname: '',
        date: 'Select date',
        subject: '',
        content: '',
        sent: false
    },
    reducers : {
        saveMail: (state, action) => {
        return {
            ...state,
            id: action.payload.id,
            name: action.payload.name,
            template: action.payload.template,
            from: action.payload.from,
            receivers: action.payload.receivers,
            cname: action.payload.cname,
            date: action.payload.date,
            subject: action.payload.subject,
            content: action.payload.content,
        }
        },
        clearMail: (state, action) => {
            return {
                ...state,
                id: null,
                name: '',
                template: '',
                from: 'Qmeter',
                receivers: [],
                cname: '',
                date: 'Select date',
                subject: '',
                content: '',
                sent: false
            }
        }

    }
})

export const {saveMail, clearMail} = mailsSlice.actions
export default mailsSlice.reducer