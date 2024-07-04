"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InvitationCard from "@/components/InvitationCard";
import { Mail } from "lucide-react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useCallback, useEffect, useState } from "react";
import {
  addInvitation,
  CustomInvitation,
  setInvitations,
} from "@/lib/features/invitation/invitationSlice";
import Loader from "./Loader";
import { setHasMoreInvitations } from "@/lib/features/invitation/invitationConfigSlice";
import { pusherClient } from "@/lib/pusher";

const InvitationBox = () => {
  const invitation = useAppSelector((state) => state.invitation);
  const { hasMoreInvitations } = useAppSelector(
    (state) => state.invitationConfig
  );
  const user = useAppSelector((state) => state.user);
  const dispatcher = useAppDispatch();

  const [loading, setLoading] = useState(false);

  const getAllInvitations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/invitations`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });

      if (response.data?.success) {
        dispatcher(setInvitations(response.data.data));
        dispatcher(setHasMoreInvitations(false));
      }
    } catch (error) {
      console.log("Error getting invitations: ", error);
    } finally {
      setLoading(false);
    }
  }, [dispatcher]);

  useEffect(() => {
    if (!user.info) return;
    pusherClient.subscribe(`invitations-${user.info.uid}`);

    const handleNewInvitations = async (newInvitation: CustomInvitation) => {
      dispatcher(addInvitation(newInvitation));
    };

    pusherClient.bind("new-invitation", handleNewInvitations);

    return () => {
      pusherClient.unsubscribe("invitations");
      pusherClient.unbind("new-invitation", handleNewInvitations);
    };
  }, [user.info]);

  useEffect(() => {
    if (!user.info) return;
    if (!hasMoreInvitations) return;
    getAllInvitations();
  }, [user.info, getAllInvitations, hasMoreInvitations]);

  return (
    <div>
      <Card className="sticky top-6">
        <CardHeader>
          <CardTitle className="text-xl flex gap-3 items-center">
            <span>Your Invitations</span>
            <Mail className="w-6 h-6" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {loading ? (
            <div className="mt-4 flex justify-center">
              <Loader />
            </div>
          ) : Object.entries(invitation.invitations).length > 0 ? (
            Object.entries(invitation.invitations).map(([, invitation]) => {
              return (
                <InvitationCard
                  invitation={invitation}
                  key={invitation?._id as string}
                />
              );
            })
          ) : (
            <p className="text-slate-500 text-sm text-center">No invitations</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvitationBox;
