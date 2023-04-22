import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const saveMailToDB = createAsyncThunk(
  'mail/saveMailToDB',
  async (arg, { getState }) => {
    const mail = getState().mail;
    const emails = JSON.parse(localStorage.getItem('mails')) || [];
    const index = emails.findIndex((item) => item.id === mail.id);
    const updatedEmails = [...emails];
    
    if (index === -1) {
      updatedEmails.push({
        id: mail.id,
        name: mail.name,
        template: mail.template,
        from: mail.from,
        receivers: mail.receivers,
        cname: mail.cname,
        date: mail.date,
        subject: mail.subject,
        content: mail.content,
        type: mail.type,
        sent: arg
      });
    } else {
        if(arg) {
            updatedEmails.splice(index, 1)
            updatedEmails.push({
                id: mail.id,
                name: mail.name,
                template: mail.template,
                from: mail.from,
                receivers: mail.receivers,
                cname: mail.cname,
                date: mail.date,
                subject: mail.subject,
                content: mail.content,
                type: mail.type,
                sent: arg
            });
        } else {
            updatedEmails[index] = {
                ...updatedEmails[index],
                name: mail.name,
                template: mail.template,
                from: mail.from,
                receivers: mail.receivers,
                cname: mail.cname,
                date: mail.date,
                subject: mail.subject,
                content: mail.content,
                type: mail.type,
                sent: arg
              };
        }
      
    }

    
    
    localStorage.setItem('mails', JSON.stringify(updatedEmails));
  }
);

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
        type: null,
        sent: false
    },
    reducers : {
        saveMail: (state, action) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.template = action.payload.template;
            state.from = action.payload.from;
            state.receivers = action.payload.receivers;
            state.cname = action.payload.cname;
            state.date = action.payload.date;
            state.subject = action.payload.subject;
            state.content = action.payload.content;
            state.type = action.payload.type;
            state.sent = action.payload.sent;
        },
        clearMail: (state, action) => {
                state.id = null;
                state.name = '';
                state.template = '';
                state.from = 'Qmeter';
                state.receivers = [];
                state.cname = '';
                state.date = 'Select date';
                state.subject = '';
                state.content = '';
                state.type = null;
                state.sent = false;
        }
    }
});

export const { saveMail, clearMail } = mailsSlice.actions;
export default mailsSlice.reducer;
