import { configureStore } from "@reduxjs/toolkit";
import {mailsSlice }from "./slices/mailsSlice";
import { modalSlice } from "./slices/modalSlice";
import { urlSlice } from "./slices/urlSlice";

const store = configureStore({
    reducer :{
        mail: mailsSlice.reducer,
        modal: modalSlice.reducer,
        url: urlSlice.reducer
    }
})

export default store