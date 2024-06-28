import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InvitationCard from "@/components/InvitationCard";
import { Mail } from "lucide-react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useCallback, useEffect, useState } from "react";
import { setInvitations } from "@/lib/features/invitation/invitationSlice";
import Loader from "./Loader";

const InvitationBox = () => {
  const { user, invitation } = useAppSelector((state) => state);
  const dispatcher = useAppDispatch();

  const [loading, setLoading] = useState(true);

  const getAllInvitations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/invitation?userId=${user.info?.uid}`
      );

      if (response.data?.success) {
        dispatcher(setInvitations(response.data.data));
      }
    } catch (error) {
      console.log("Error getting invitations: ", error);
    } finally {
      setLoading(false);
    }
  }, [dispatcher, user.info?.uid]);

  useEffect(() => {
    if (!user.info) return;
    getAllInvitations();
  }, [user.info, getAllInvitations]);

  return (
    <div className="w-full">
      <h2 className="font-bold text-slate-500 text-3xl">Your chats</h2>
      <div className="flex justify-between gap-6">
        <div className="flex-1 flex flex-col gap-6"></div>
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
                <p className="text-slate-500 text-sm text-center">
                  No invitations
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvitationBox;
