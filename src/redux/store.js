import { configureStore } from "@reduxjs/toolkit";
import {mailsSlice }from "./slices/mailsSlice";
import { modalSlice } from "./slices/modalSlice";

const store = configureStore({
    reducer :{
        mail: mailsSlice.reducer,
        modal: modalSlice.reducer
    }
})

export default store