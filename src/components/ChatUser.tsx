import { UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Conversation } from "./Conversations";
import { UserInfo } from "@/lib/features/user/userSlice";
import Link from "next/link";
import useLangPrefsUpdate from "@/hooks/useLangPrefsUpdate";
import { useAppDispatch } from "@/lib/hooks";
import useNewMessage from "@/hooks/useNewMessage";
import { CustomMessage } from "./MessagesContainer";
import { updateLastMessage } from "@/lib/features/conversations/conversationsSlice";
import { LastMessage } from "@/models/conversation.model";

const ChatUser = ({
  conversation,
  currentUser,
}: {
  conversation: Conversation;
  currentUser: UserInfo | null;
}) => {
  const { members } = conversation;
  const otherMember = members.find((member) => member._id !== currentUser?.uid);
  const dispatcher = useAppDispatch();

  useLangPrefsUpdate({ dispatcher, conversationId: conversation._id });

  const handleLastMessage = async (newMessage: CustomMessage) => {
    const lastMessage: LastMessage = {
      lastMessageSender: newMessage.sender._id.toString(),
      lastMessageContent: newMessage.content,
      lastMessageTranslatedContent: newMessage.translated_content,
      lastMessageCreatedAt: newMessage.createdAt,
    };

    dispatcher(
      updateLastMessage({
        lastMessage,
        conversationId: conversation._id,
      })
    );
  };

  useNewMessage({
    conversationId: conversation._id,
    handler: handleLastMessage,
  });

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
            <div>
              {conversation.lastMessageSender &&
              conversation.lastMessageSender === currentUser?.uid ? (
                <p className="text-sm font-medium text-gray-500">
                  You: {conversation.lastMessageContent}
                </p>
              ) : (
                <p className="text-sm font-medium text-gray-500">
                  {conversation.lastMessageTranslatedContent}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ChatUser;
