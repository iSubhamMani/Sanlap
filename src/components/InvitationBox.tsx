"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InvitationCard from "@/components/InvitationCard";
import { Mail } from "lucide-react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useCallback, useEffect } from "react";
import {
  addInvitation,
  CustomInvitation,
  deleteInvitation,
  setInvitations,
} from "@/lib/features/invitation/invitationSlice";
import {
  setHasMoreInvitations,
  setInvitationLoading,
} from "@/lib/features/invitation/invitationConfigSlice";
import { pusherClient } from "@/lib/pusher";
import InvitationCardSkeleton from "./InvitationCardSkeleton";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserRound } from "lucide-react";

const InvitationBox = () => {
  const invitation = useAppSelector((state) => state.invitation);
  const { hasMoreInvitations, invitationLoading } = useAppSelector(
    (state) => state.invitationConfig
  );
  const { info } = useAppSelector((state) => state.user);
  const dispatcher = useAppDispatch();

  const getAllInvitations = useCallback(async () => {
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
      dispatcher(setInvitationLoading(false));
    }
  }, [dispatcher]);

  useEffect(() => {
    if (!info) return;
    pusherClient.subscribe(`invitations-${info.uid}`);
    pusherClient.subscribe(`cancel-invitation-${info.uid}`);

    const handleNewInvitations = async (newInvitation: CustomInvitation) => {
      dispatcher(addInvitation(newInvitation));
      const sender = newInvitation.sender;
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <Avatar>
                  <AvatarImage src={sender?.photoURL} />
                  <AvatarFallback>
                    <UserRound />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {sender?.displayName}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  sent you an invitation
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      ));
    };

    const handleInvitationCancel = async (
      deletedInvitation: CustomInvitation
    ) => {
      dispatcher(deleteInvitation(deletedInvitation._id));
    };

    pusherClient.bind("cancel-invitation", handleInvitationCancel);
    pusherClient.bind("new-invitation", handleNewInvitations);

    return () => {
      pusherClient.unsubscribe(`invitations-${info?.uid}`);
      pusherClient.unbind("new-invitation", handleNewInvitations);
      pusherClient.unsubscribe(`cancel-invitation-${info?.uid}`);
      pusherClient.unbind("cancel-invitation", handleInvitationCancel);
    };
  }, [info]);

  useEffect(() => {
    if (!info) return;
    if (!hasMoreInvitations) return;
    getAllInvitations();
  }, [info, getAllInvitations, hasMoreInvitations]);

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
          {invitationLoading ? (
            <>
              <InvitationCardSkeleton />
              <InvitationCardSkeleton />
              <InvitationCardSkeleton />
            </>
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
