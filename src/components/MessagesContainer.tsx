"use client";

import { User } from "@/models/user.model";
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import { pusherClient } from "@/lib/pusher";
import { MESSAGES_PAGE_SIZE } from "@/lib/constants";

export interface CustomMessage {
  _id: string;
  sender: User;
  recipient: User;
  createdAt: Date;
  updatedAt: Date;
  conversationId: string;
  content: string;
}

const MessagesContainer = ({ conversationId }: { conversationId: string }) => {
  const memoizedConversationId = useMemo(
    () => conversationId,
    [conversationId]
  );

  const [messages, setMessages] = useState<CustomMessage[]>([]);
  const [page, setPage] = useState<number>(1);

  const memoizedPage = useMemo(() => page, [page]);

  const getAllMessages = useCallback(async () => {
    if (!memoizedConversationId) return;
    try {
      const response = await axios.get(
        `/api/all-messages/${memoizedConversationId}?page=${memoizedPage}&pageSize=${MESSAGES_PAGE_SIZE}`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data?.success) {
        setMessages((prevMessages) => [
          ...prevMessages,
          ...response.data.data.messages,
        ]);
      }
    } catch (error) {
      console.log("Error fetching messages: ", error);
    }
  }, [memoizedPage]);

  useEffect(() => {
    getAllMessages();
  }, [getAllMessages]);

  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    pusherClient.subscribe(`messages-${conversationId}`);

    const handleIncomingMessage = async (newMessage: CustomMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    pusherClient.bind("new-message", handleIncomingMessage);

    return () => {
      pusherClient.unsubscribe(`messages-${conversationId}`);
      pusherClient.unbind("new-message", handleIncomingMessage);
    };
  }, []);

  if (!memoizedConversationId) return null;

  return (
    <div className="flex-1">
      <div className="grid gap-6 px-6 py-8">
        {messages?.map((message) => (
          <ChatMessage key={message._id} message={message} />
        ))}
      </div>
    </div>
  );
};

export default MessagesContainer;
