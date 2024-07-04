import { createSlice } from "@reduxjs/toolkit";

const userConfigSlice = createSlice({
  name: "userConfig",
  initialState: {
    loading: true,
  },
  reducers: {
    setUserInfoLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUserInfoLoading } = userConfigSlice.actions;
export default userConfigSlice.reducer;
