import { createSlice } from "@reduxjs/toolkit";

const invitationConfigSlice = createSlice({
  name: "invitationConfig",
  initialState: {
    hasMoreInvitations: true,
  },
  reducers: {
    setHasMoreInvitations: (state, action) => {
      state.hasMoreInvitations = action.payload;
    },
  },
});

export const { setHasMoreInvitations } = invitationConfigSlice.actions;
export default invitationConfigSlice.reducer;
