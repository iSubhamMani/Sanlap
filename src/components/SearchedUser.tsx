import { UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/models/user.model";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { UserInfo } from "@/lib/features/user/userSlice";
import { useEffect, useState } from "react";

const SearchedUser = ({
  user,
  currentUser,
}: {
  user: User;
  currentUser: UserInfo | null;
}) => {
  const [inviteStatus, setInviteStatus] = useState<string>("");

  useEffect(() => {
    if (!currentUser || !user) return;

    const checkInvitation = async () => {
      try {
        const response = await axios.get(
          `/api/check-invitation/${currentUser?.uid}?recipient=${user._id}`
        );

        if (response.data?.success) {
          setInviteStatus(response.data.data?.inviteStatus as string);
        }
      } catch (error: any) {
        console.log("Error checking invitation: ", error);
      }
    };

    checkInvitation();
  }, [currentUser, user]);

  const sendInvitation = async () => {
    // send invitation to the user
    try {
      const response = await axios.post("/api/invitation", {
        sender: currentUser?.uid,
        recipient: user._id,
      });

      if (response.data?.success) {
        setInviteStatus("pending");
        console.log("Invitation sent");
      }
    } catch (error) {
      console.log("Something went wrong: ", error);
    }
  };

  const cancelInvitation = async () => {
    console.log("Cancel invitation");
  };

  return (
    inviteStatus &&
    currentUser &&
    user && (
      <div className="my-8">
        <AlertDialog>
          <AlertDialogTrigger className="w-full">
            <div className="py-2 flex justify-between items-center gap-3 cursor-pointer rounded-sm">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user?.photoURL} />
                  <AvatarFallback>
                    <UserRound />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <p className="text-base font-medium">{user?.displayName}</p>
                  <p className="text-xs font-light">{user?.email}</p>
                </div>
              </div>
              <div className="">
                <span
                  className={`text-sm font-medium ${
                    inviteStatus === "pending"
                      ? "text-red-500"
                      : inviteStatus === "accepted"
                      ? "text-green-500"
                      : "text-primary"
                  }`}
                >
                  {inviteStatus === "pending"
                    ? "Cancel"
                    : inviteStatus === "accepted"
                    ? "Accepted"
                    : "Invite"}
                </span>
              </div>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {inviteStatus === "pending"
                  ? "Cancel Invite"
                  : inviteStatus === "accepted"
                  ? "Accepted"
                  : "Send an Invite"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {inviteStatus === "pending"
                  ? `This will cancel the invitation sent to ${user?.displayName}`
                  : inviteStatus === "accepted"
                  ? `${user.displayName} has already accepted the invitation`
                  : `This will send an invite to ${user?.displayName} to join the conversation`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            {(inviteStatus === "pending" || inviteStatus === "unsent") && (
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={
                    inviteStatus === "pending"
                      ? cancelInvitation
                      : sendInvitation
                  }
                >
                  Yes
                </AlertDialogAction>
              </AlertDialogFooter>
            )}
            {inviteStatus === "accepted" && (
              <AlertDialogFooter>
                <AlertDialogAction>OK</AlertDialogAction>
              </AlertDialogFooter>
            )}
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  );
};

export default SearchedUser;
