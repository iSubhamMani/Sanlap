import { UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { User } from "@/models/user.model";

const Invitation = ({ sender }: { sender: User }) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={sender?.photoURL} />
          <AvatarFallback>
            <UserRound />
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium text-sm line-clamp-1">
            {sender?.displayName}
          </div>
          <div className="text-xs text-muted-foreground line-clamp-1">
            {sender?.email}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          className="text-xs text-primary font-bold hover:text-primary"
          variant="outline"
          size="sm"
        >
          Accept
        </Button>
        <Button
          className="text-xs font-bold text-red-500 hover:text-red-500"
          variant="ghost"
          size="sm"
        >
          Reject
        </Button>
      </div>
    </div>
  );
};

export default Invitation;
