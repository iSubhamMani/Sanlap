import { createSlice } from "@reduxjs/toolkit";

const invitationConfigSlice = createSlice({
  name: "invitationConfig",
  initialState: {
    hasMoreInvitations: true,
    invitationLoading: true,
  },
  reducers: {
    setHasMoreInvitations: (state, action) => {
      state.hasMoreInvitations = action.payload;
    },
    setInvitationLoading: (state, action) => {
      state.invitationLoading = action.payload;
    },
  },
});

export const { setHasMoreInvitations, setInvitationLoading } =
  invitationConfigSlice.actions;
export default invitationConfigSlice.reducer;
