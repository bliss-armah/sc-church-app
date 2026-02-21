import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import membersReducer from "./slices/membersSlice";
import themeReducer from "./slices/themeSlice";
import usersReducer from "./slices/usersSlice";
import attendanceReducer from "./slices/attendanceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    members: membersReducer,
    theme: themeReducer,
    users: usersReducer,
    attendance: attendanceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
