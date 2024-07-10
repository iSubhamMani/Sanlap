"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import axios from "axios";
import { ArrowLeft, UserRound } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import ChatInput from "@/components/ChatInput";
import MessagesContainer from "@/components/MessagesContainer";
import { addConversationDetails } from "@/lib/features/conversationDetails/conversationDetailsSlice";
import ChatLangPrefs from "@/components/ChatLangPrefs";

export default function ChatDetails() {
  const { chatId } = useParams();
  const memoizedChatId = useMemo(() => chatId, [chatId]);

  const [otherMember, setOtherMember] = useState<any>();
  const { info } = useAppSelector((state) => state.user);
  const { conversationDetails } = useAppSelector(
    (store) => store.conversationDetails
  );
  const navigate = useRouter();
  const dispatcher = useAppDispatch();

  const getChatDetails = useCallback(async () => {
    if (!memoizedChatId) return;

    try {
      const response = await axios.get(
        `/api/chat-details/${memoizedChatId.toString()}`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data?.success) {
        dispatcher(addConversationDetails(response.data.data));
      }
    } catch (error) {
      console.error(error);
    }
  }, [memoizedChatId]);

  useEffect(() => {
    if (conversationDetails[memoizedChatId.toString()]) return;
    getChatDetails();
  }, [getChatDetails]);

  useEffect(() => {
    if (!conversationDetails[memoizedChatId.toString()] || !info) return;
    setOtherMember(
      conversationDetails[memoizedChatId.toString()].members.find(
        (member) => member._id !== info.uid
      )
    );
  }, [conversationDetails, info]);

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
              <AvatarImage src={otherMember?.photoURL} />
              <AvatarFallback>
                <UserRound />
              </AvatarFallback>
            </Avatar>
            <div className="text-sm font-medium">
              {otherMember?.displayName}
            </div>
          </div>
          {conversationDetails[memoizedChatId.toString()] && (
            <ChatLangPrefs
              conversationId={memoizedChatId.toString()}
              currentUser={info}
            />
          )}
        </div>
        <MessagesContainer conversationId={memoizedChatId.toString()} />
        <p className="mb-4 text-center text-sm text-slate-500">
          This is the start of your epic conversation with{" "}
          <span className="font-bold">{otherMember?.displayName}</span>
        </p>
        {otherMember && (
          <ChatInput
            sender={info}
            recipient={otherMember}
            conversationId={memoizedChatId.toString()}
          />
        )}
      </div>
    </div>
  );
}
