import { createSlice } from "@reduxjs/toolkit";

const conversationsConfigSlice = createSlice({
  name: "conversationsConfig",
  initialState: {
    hasMoreConversations: true,
  },
  reducers: {
    setHasMoreConversations: (state, action) => {
      state.hasMoreConversations = action.payload;
    },
  },
});

export const { setHasMoreConversations } = conversationsConfigSlice.actions;
export default conversationsConfigSlice.reducer;
