"use client";

import { Conversation } from "@/components/Conversations";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useAppSelector } from "@/lib/hooks";
import { User } from "@/models/user.model";
import axios from "axios";
import { ArrowLeft, Send, Settings, UserRound } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import languages from "@/utils/languages";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ChatInput from "@/components/ChatInput";
import MessagesContainer from "@/components/MessagesContainer";

export default function ChatDetails() {
  const { chatId } = useParams();
  const [chatDetails, setChatDetails] = useState<Conversation>();
  const [otherMember, setOtherMember] = useState<User>();
  const { info } = useAppSelector((state) => state.user);
  const navigate = useRouter();

  const getChatDetails = useCallback(async () => {
    if (!chatId) return;

    try {
      const response = await axios.get(
        `/api/chat-details/${chatId.toString()}`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data?.success) {
        setChatDetails(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [chatId]);

  useEffect(() => {
    getChatDetails();
  }, [getChatDetails]);

  useEffect(() => {
    if (!chatDetails || !info) return;
    setOtherMember(
      chatDetails.members.find((member) => member._id !== info?.uid)
    );
  }, [chatDetails, info]);

  if (!chatDetails || !otherMember) return null;

  return (
    <div className="w-full rounded-lg bg-background ">
      <div className="mx-auto w-full max-w-3xl min-h-[100dvh] flex flex-col shadow-lg">
        <div className="z-50 sticky top-0 flex items-center justify-between border-b bg-card px-6 py-4">
          <div className="flex items-center gap-3">
            <ArrowLeft
              className="cursor-pointer"
              onClick={() => navigate.back()}
            />
            <Avatar>
              <AvatarImage src={otherMember.photoURL} />
              <AvatarFallback>
                <UserRound />
              </AvatarFallback>
            </Avatar>
            <div className="text-sm font-medium">{otherMember.displayName}</div>
          </div>
          <div>
            <Drawer>
              <DrawerTrigger asChild>
                <Settings className="w-6 h-6 cursor-pointer" />
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-lg">
                  <DrawerHeader>
                    <DrawerTitle>Language preference</DrawerTitle>
                    <DrawerDescription>
                      Set your preferred language for this conversation
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 pb-0 flex flex-col gap-6">
                    <Select defaultValue="english">
                      <div>
                        <label className="font-bold text-sm" htmlFor="type-in">
                          Type in
                        </label>
                        <SelectTrigger id="type-in" className="w-full mt-2">
                          <SelectValue placeholder="Type in" />
                        </SelectTrigger>
                      </div>
                      <SelectContent>
                        <SelectGroup>
                          {languages.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              <SelectLabel>{lang}</SelectLabel>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="english">
                      <div>
                        <label
                          className="font-bold text-sm"
                          htmlFor="receive-in"
                        >
                          Receive in
                        </label>
                        <SelectTrigger id="receive-in" className="w-full mt-2">
                          <SelectValue placeholder="Receive in" />
                        </SelectTrigger>
                      </div>
                      <SelectContent>
                        <SelectGroup>
                          {languages.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              <SelectLabel>{lang}</SelectLabel>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        <MessagesContainer conversationId={chatId.toString()} />
        <ChatInput
          sender={info}
          recipient={otherMember}
          conversationId={chatId.toString()}
        />
      </div>
    </div>
  );
}
