import { Invitation } from "@/models/invitation.model";
import { createSlice } from "@reduxjs/toolkit";

export interface CustomInvitation extends Invitation {
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
    deleteInvitation: (state, action) => {
      delete state.invitations[action.payload as string];
    },
  },
});

export const { setInvitations, deleteInvitation } = invitationSlice.actions;
export default invitationSlice.reducer;
