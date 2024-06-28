import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/user/userSlice";
import invitationSlice from "./features/invitation/invitationSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userSlice,
      invitation: invitationSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
