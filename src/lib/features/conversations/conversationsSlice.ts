import { Conversation } from "@/components/Conversations";
import { createSlice } from "@reduxjs/toolkit";

const conversationsSlice = createSlice({
  name: "conversations",
  initialState: {
    conversations: {} as Record<string, Conversation>,
  },
  reducers: {
    setConversations: (state, action) => {
      const conversationsList = action.payload as Array<any>;
      conversationsList.map((conversation) => {
        state.conversations[conversation._id] = conversation;
      });
    },
  },
});

export const { setConversations } = conversationsSlice.actions;
export default conversationsSlice.reducer;
