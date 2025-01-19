import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";

export const ChatContext = createContext({
    userChats: null,
    isUserChatsLoading: false,
    userChatsError: null,
    potentialChats: [],
    currentChat: null, // Current selected chat
    recipientUser: null, // Recipient user profile
    messages: null,
    isMessagesLoading: false,
    messageError: null,
    handleChatClick: () => {}, // Handles when a chat is clicked
});

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [recipientUser, setRecipientUser] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messageError, setMessageError] = useState(null);

    // Fetch potential chats
    useEffect(() => {
        const getUsers = async () => {
            if (!user?._id) {
                console.error("User is not defined or _id is missing.");
                return; // Exit the function early
            }

            try {
                const response = await getRequest(`${baseUrl}/users`);

                if (response.error) {
                    console.error("Error fetching users", response);
                    return;
                }

                const pChats = response.filter((u) => {
                    let isChatCreated = false;

                    if (user._id === u._id) return false;

                    if (userChats) {
                        isChatCreated = userChats.some((chat) => {
                            return chat.members[0] === u._id || chat.members[1] === u._id;
                        });
                    }

                    return !isChatCreated;
                });

                setPotentialChats(pChats);
            } catch (error) {
                console.error("Error in fetching potential chats:", error);
            }
        };

        getUsers();
    }, [user, userChats]);

    // Fetch user chats
    useEffect(() => {
        const fetchUserChats = async () => {
            if (!user?._id) return;

            setIsUserChatsLoading(true);
            setUserChatsError(null);

            try {
                const response = await getRequest(`${baseUrl}/chats/${user._id}`);
                if (response.error) {
                    setUserChatsError(response.error);
                } else {
                    setUserChats(response);
                }
            } catch (error) {
                setUserChatsError(error.message);
            } finally {
                setIsUserChatsLoading(false);
            }
        };

        fetchUserChats();
    }, [user]);

    const createChat = async (firstId, secondId) => {
        try {
            const response = await postRequest(
                `${baseUrl}/chats`,
                JSON.stringify({
                    firstId,
                    secondId,
                })
            );

            if (response.error) {
                console.error("Error creating chat:", response);
            } else {
                console.log("Chat created successfully:", response);
                setUserChats((prev) => [...prev, response]); // Update user chats
            }
        } catch (error) {
            console.error("Error creating chat:", error);
        }
    };

    // Fetch recipient user when currentChat changes
    const fetchRecipientUser = async () => {
        if (!currentChat || !currentChat.members) {
            console.error("No current chat or chat members found.");
            return;
        }
    
        const recipientId = currentChat.members.find((id) => id !== user?._id);
        if (!recipientId) {
            console.error("Recipient ID not found.");
            setRecipientUser(null);
            return;
        }
    
        try {
            const response = await getRequest(`${baseUrl}/users/${recipientId}`);
    
            if (response.error) {
                console.error(`Error fetching recipient user for ID ${recipientId}:`, response.error);
                setRecipientUser(null);
            } else {
                setRecipientUser(response);
            }
        } catch (error) {
            console.error(`Unexpected error while fetching recipient user for ID ${recipientId}:`, error);
            setRecipientUser(null);
        }
    };
    

    // Fetch messages when currentChat changes
    useEffect(() => {
        const fetchMessages = async () => {
            if (!currentChat?._id) return;

            setIsMessagesLoading(true);
            setMessageError(null);

            
                const response = await getRequest(`${baseUrl}/chats/${user._id}`);
                if (response.error) {
                    setMessageError(response.error);
                } else {
                    setMessages(response);
                }
            
                
           
                setIsMessagesLoading(false);
            
        };

        fetchMessages();
    }, [currentChat]);

    // Handle chat click to set the current chat
    const handleChatClick = useCallback((chat) => {
        setCurrentChat(chat); // Update the selected chat
    }, []);

    return (
        <ChatContext.Provider
            value={{
                userChats,
                isUserChatsLoading,
                userChatsError,
                potentialChats,
                createChat,
                currentChat,
                recipientUser,
                messages,
                isMessagesLoading,
                messageError,
                handleChatClick,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
