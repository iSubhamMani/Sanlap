import { UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Conversation } from "./Conversations";
import { UserInfo } from "@/lib/features/user/userSlice";
import Link from "next/link";

const ChatUser = ({
  conversation,
  currentUser,
}: {
  conversation: Conversation;
  currentUser: UserInfo | null;
}) => {
  const { members } = conversation;
  const otherMember = members.find((member) => member._id !== currentUser?.uid);

  if (!otherMember || !currentUser) {
    return null;
  }

  return (
    <Link href={`/chats/${conversation._id}`}>
      <div className="py-2 px-2 flex justify-between items-center gap-3 cursor-pointer rounded-sm hover:bg-muted transition ease-in-out duration-200">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={otherMember.photoURL} />
            <AvatarFallback>
              <UserRound />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <p className="text-lg font-medium">{otherMember.displayName}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ChatUser;
