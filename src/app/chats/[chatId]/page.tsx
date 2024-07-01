"use client";

import { Conversation } from "@/components/Conversations";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ChatDetails() {
  const { chatId } = useParams();
  const [chatDetails, setChatDetails] = useState<Conversation>();
  const [otherMember, setOtherMember] = useState<User>();
  const { info } = useAppSelector((state) => state.user);
  const navigate = useRouter();

  const getChatDetails = useCallback(async () => {
    if (!chatId) return;

    try {
      const response = await axios.get(`/api/chat-details/${chatId}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
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
        <div className="flex items-center justify-between border-b bg-card px-6 py-4">
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
                  <div className="p-4 pb-0 flex flex-col gap-3">
                    <Select defaultValue="english">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Type in" />
                      </SelectTrigger>
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
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Receive in" />
                      </SelectTrigger>
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
        <ScrollArea className="flex-1"></ScrollArea>
        <div className="flex items-center gap-2 border-t bg-card p-4">
          <Textarea
            placeholder="Type your message..."
            className="h-10 flex-1 resize-none rounded-2xl border-none bg-muted px-4 text-sm focus:outline-none focus:ring-0"
          />
          <Button variant="ghost" size="icon" className="rounded-full">
            <Send className="w-6 h-6 text-primary" />
          </Button>
        </div>
      </div>
    </div>
  );
}
