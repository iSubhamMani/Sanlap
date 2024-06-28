import { Invitation } from "@/models/invitation.model";
import { createSlice } from "@reduxjs/toolkit";

interface CustomInvitation extends Invitation {
  sender: any;
}

const invitationSlice = createSlice({
  name: "invitation",
  initialState: {
    invitations: {} as Record<string, CustomInvitation>,
  },
  reducers: {
    setInvitations: (state, action) => {
      const invitationsList = action.payload as Array<any>;
      invitationsList.map((invitation) => {
        state.invitations[invitation._id] = invitation;
      });
    },
  },
});

export const { setInvitations } = invitationSlice.actions;
export default invitationSlice.reducer;
