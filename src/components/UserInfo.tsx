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
    <div className="flex flex-col gap-4 justify-end lg:flex-row lg:gap-0 lg:justify-between lg:items-center lg:w-full">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={info?.photoURL} />
          <AvatarFallback>
            <UserRound />
          </AvatarFallback>
        </Avatar>
        <div className="">
          <p className="text-xs font-light">Currently logged in as</p>
          <p className="text-base font-medium">{info?.displayName}</p>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="lg:hidden">
          <p className="text-lg font-medium">Logout</p>
        </div>
        <LogOut />
      </div>
    </div>
  );
};

export default UserInfo;
