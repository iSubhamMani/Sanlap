import React, { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import axios from "axios";
import { UserInfo } from "@/lib/features/user/userSlice";
import { User } from "@/models/user.model";

const ChatInput = ({
  sender,
  recipient,
  conversationId,
}: {
  sender: UserInfo | null;
  recipient: User;
  conversationId: string;
}) => {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (!message) return;
    setMessage("");

    // Send message to the server
    try {
      const response = await axios.post(
        "/api/send-message",
        {
          sender: sender?.uid,
          recipient: recipient._id,
          content: message,
          conversationId: conversationId,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data?.success) {
        console.log("Message sent successfully");
      }
    } catch (error) {
      console.log("Error sending message: ", error);
    }
  };

  return (
    <div className="flex items-center gap-2 border-t bg-card p-4">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="h-10 flex-1 resize-none rounded-2xl border-none bg-muted px-4 text-sm focus:outline-none focus:ring-0"
      />
      <Button
        onClick={sendMessage}
        variant="ghost"
        size="icon"
        className="rounded-full"
      >
        <Send className="w-6 h-6 text-primary" />
      </Button>
    </div>
  );
};

export default ChatInput;
