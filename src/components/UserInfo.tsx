"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, UserRound } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import { setUserInfoLoading } from "@/lib/features/user/userConfig";
import UserInfoSkeleton from "./UserInfoSkeleton";

const UserInfo = () => {
  const { info } = useAppSelector((state) => state.user);
  const { loading } = useAppSelector((state) => state.userConfig);
  const dispatcher = useAppDispatch();

  useEffect(() => {
    if (info) dispatcher(setUserInfoLoading(false));
  }, [info]);

  return loading ? (
    <UserInfoSkeleton />
  ) : (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={info?.photoURL} />
          <AvatarFallback>
            <UserRound />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-xs font-light">Currently logged in as</p>
          <p className="text-base font-medium">{info?.displayName}</p>
        </div>
      </div>
      <div>
        <LogOut />
      </div>
    </div>
  );
};

export default UserInfo;
