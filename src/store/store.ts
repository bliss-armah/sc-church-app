import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import membersReducer from "./slices/membersSlice";
import themeReducer from "./slices/themeSlice";
import usersReducer from "./slices/usersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    members: membersReducer,
    theme: themeReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
