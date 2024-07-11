"use client";

import { Separator } from "@/components/ui/separator";
import InvitationBox from "@/components/InvitationBox";
import Conversations from "@/components/Conversations";
import Search from "@/components/Search";
import UserInfo from "@/components/UserInfo";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Mail, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/lib/hooks";

const ChatsPage = () => {
  const { info } = useAppSelector((state) => state.user);
  const { invitations } = useAppSelector((state) => state.invitation);

  return (
    <div className="min-h-[100dvh] flex flex-col px-6 md:px-16 pt-4 md:pt-6 pb-8">
      <header className="mb-2 lg:mb-8 lg:sticky top-6">
        <div>
          <h1 className="text-primary text-2xl font-bold tracking-tighter sm:text-3xl xl:text-4xl/none">
            Sync
          </h1>
        </div>
      </header>
      <main className="flex flex-col lg:flex-row flex-1">
        <section className="lg:w-1/3 lg:pr-6">
          <div className="sticky top-24 flex flex-col-reverse gap-2 sm:gap-4 lg:gap-0 lg:flex-col h-full">
            <Search />
            <div className="lg:hidden flex items-center justify-end gap-6">
              <div>
                <Popover>
                  <PopoverTrigger>
                    <div className="relative">
                      <Mail className="w-6 h-7" />
                      {Object.entries(invitations).length > 0 && (
                        <div className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-primary"></div>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 border-none mr-2 mt-2">
                    <InvitationBox />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Popover>
                  <PopoverTrigger>
                    <Avatar>
                      <AvatarImage src={info?.photoURL} />
                      <AvatarFallback>
                        <UserRound />
                      </AvatarFallback>
                    </Avatar>
                  </PopoverTrigger>
                  <PopoverContent className="mr-2 mt-2">
                    <UserInfo />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="hidden lg:inline-block">
              <UserInfo />
            </div>
          </div>
        </section>
        <section className="lg:w-2/3 flex gap-6 flex-1">
          <div className="hidden lg:inline-block">
            <Separator orientation="vertical" />
          </div>
          <div className="w-full mt-6 lg:mt-0 lg:ml-4">
            <h2 className="font-bold text-slate-500 text-2xl lg:text-3xl">
              Your conversations
            </h2>
            <div className="lg:flex lg:justify-between lg:gap-6">
              <Conversations />
              <div className="hidden lg:inline-block">
                <InvitationBox />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ChatsPage;
