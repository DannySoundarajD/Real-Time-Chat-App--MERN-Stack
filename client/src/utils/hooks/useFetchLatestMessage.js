import { useContext, useState, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import { baseUrl, getRequest } from "../services";

export const useFetchLatestMessage = (chat) => {
  const { newMessage, notifications } = useContext(ChatContext);
  const [latestMessage, setLatestMessage] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);

        if (response.error) {
          console.error("Error getting messages:", response.error);
          return;
        }

        const lastMessage = response?.[response.length - 1];
        setLatestMessage(lastMessage);
      } catch (err) {
        console.error("Error getting messages:", err); // Catch and log the actual error
      }
    };

    getMessages();
  }, [newMessage, notifications, chat]);

  return { latestMessage };
};
