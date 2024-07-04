"use client";

import { User } from "@/models/user.model";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import { pusherClient } from "@/lib/pusher";

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
  const [messages, setMessages] = useState<CustomMessage[]>([]);

  const getAllMessages = useCallback(async () => {
    if (!conversationId) return;
    try {
      const response = await axios.get(`/api/all-messages/${conversationId}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      if (response.data?.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.log("Error fetching messages: ", error);
    }
  }, [conversationId]);

  useEffect(() => {
    getAllMessages();
  }, [getAllMessages]);

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

  if (!conversationId) return null;

  return (
    <div className="flex-1 overflow-auto">
      <div className="grid gap-6 px-6 py-8">
        {messages?.map((message) => (
          <ChatMessage key={message._id} message={message} />
        ))}
      </div>
    </div>
  );
};

export default MessagesContainer;
