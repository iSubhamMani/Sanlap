import { Message } from "@/models/message.model";
import { User } from "@/models/user.model";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";

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

  if (!conversationId) return null;

  return (
    <div>
      <div className="grid gap-6 px-6 py-8">
        {messages?.map((message) => (
          <ChatMessage key={message._id} message={message} />
        ))}
      </div>
    </div>
  );
};

export default MessagesContainer;
