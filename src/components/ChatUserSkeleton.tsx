import React from "react";
import { Skeleton } from "./ui/skeleton";

const ChatUserSkeleton = () => {
  return (
    <div className="my-6 px-4 flex justify-between items-center gap-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-80 h-6" />
      </div>
    </div>
  );
};

export default ChatUserSkeleton;
