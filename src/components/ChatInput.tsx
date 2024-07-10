"use client";

import React, { useMemo, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import axios from "axios";
import { UserInfo } from "@/lib/features/user/userSlice";
import { User } from "@/models/user.model";
import { useAppSelector } from "@/lib/hooks";
import { UserDetailsAndPrefs } from "@/types/UserDetailsAndPrefs";

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
  const { conversationDetails } = useAppSelector(
    (state) => state.conversationDetails
  );

  const { source_lang, target_lang } = useMemo(() => {
    if (!conversationDetails[conversationId])
      return { source_lang: "", target_lang: "" };

    const { type_in_lang } = conversationDetails[conversationId].members.find(
      (member) => member._id === sender?.uid
    ) as UserDetailsAndPrefs;

    const { receive_in_lang } = conversationDetails[
      conversationId
    ].members.find(
      (member) => member._id === recipient._id
    ) as UserDetailsAndPrefs;

    return { source_lang: type_in_lang, target_lang: receive_in_lang };
  }, [conversationDetails]);

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
          source_lang,
          target_lang,
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
    <div className="sticky bottom-0 flex items-center gap-2 border-t bg-card p-4">
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
