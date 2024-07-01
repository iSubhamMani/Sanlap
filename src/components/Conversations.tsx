import axios from "axios";
import ChatUser from "./ChatUser";
import { useEffect, useState } from "react";
import { User } from "@/models/user.model";
import { useAppSelector } from "@/lib/hooks";

export interface Conversation {
  _id: string;
  members: [User];
  lastMessageAt: Date;
}

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const { info } = useAppSelector((state) => state.user);

  useEffect(() => {
    getAllConversations();
  }, []);

  const getAllConversations = async () => {
    try {
      const response = await axios.get("/api/conversations", {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });

      if (response.data?.success) {
        console.log("Conversations: ", response.data.data);
        setConversations(response.data.data);
      }
    } catch (error) {
      console.log("Error fetching conversations: ", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {conversations?.map((conversation: Conversation) => (
        <ChatUser
          key={conversation._id}
          currentUser={info}
          conversation={conversation}
        />
      ))}
    </div>
  );
};

export default Conversations;
