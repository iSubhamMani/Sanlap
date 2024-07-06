"use client";

import { User } from "@/models/user.model";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import ChatMessage from "./ChatMessage";
import { pusherClient } from "@/lib/pusher";
import { MESSAGES_PAGE_SIZE } from "@/lib/constants";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "./Loader";

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

  const [shouldScroll, setShouldScroll] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const loadMessages = useCallback(async () => {
    if (!memoizedConversationId) return;
    setLoading(true);
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
        setHasMore(response.data.data.metadata.hasNextPage);
        setPage((prevPage) => prevPage + 1);
        setMessages((prevMessages) => [
          ...prevMessages,
          ...response.data.data.messages,
        ]);
        setShouldScroll(false);
      }
    } catch (error) {
      console.log("Error fetching messages: ", error);
    } finally {
      setLoading(false);
    }
  }, [memoizedPage]);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    if (shouldScroll) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [messages, shouldScroll]);

  useEffect(() => {
    pusherClient.subscribe(`messages-${conversationId}`);

    const handleIncomingMessage = async (newMessage: CustomMessage) => {
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
      setShouldScroll(true);
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
      <InfiniteScroll
        scrollThreshold={0.9}
        dataLength={messages.length}
        next={loadMessages}
        hasMore={hasMore}
        loader={
          loading && (
            <div className="flex justify-center">
              <Loader />
            </div>
          )
        }
      >
        <div className="grid gap-5 px-6 py-8">
          {messages.map((message) => {
            return <ChatMessage key={message._id} message={message} />;
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default MessagesContainer;
