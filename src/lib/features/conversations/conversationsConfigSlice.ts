import { createSlice } from "@reduxjs/toolkit";

const conversationsConfigSlice = createSlice({
  name: "conversationsConfig",
  initialState: {
    hasMoreConversations: true,
    loading: true,
  },
  reducers: {
    setHasMoreConversations: (state, action) => {
      state.hasMoreConversations = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setHasMoreConversations, setLoading } =
  conversationsConfigSlice.actions;
export default conversationsConfigSlice.reducer;
