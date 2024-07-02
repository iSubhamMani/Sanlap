import { UserRound } from "lucide-react";
import { CustomMessage } from "./MessagesContainer";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatMongoDate } from "@/utils/ConvertMongoDate";
import { useAppSelector } from "@/lib/hooks";

const ChatMessage = ({ message }: { message: CustomMessage }) => {
  const { info } = useAppSelector((state) => state.user);

  return (
    <div
      className={`flex items-start gap-3 ${
        message.sender._id === info?.uid && "justify-end" && "flex-row-reverse"
      }`}
    >
      <Avatar className="border">
        <AvatarImage src={message?.sender.photoURL} />
        <AvatarFallback>
          <UserRound />
        </AvatarFallback>
      </Avatar>
      <div className="bg-muted rounded-lg p-3 max-w-[70%]">
        <div>{message?.content}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {formatMongoDate(message?.createdAt.toString())}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
