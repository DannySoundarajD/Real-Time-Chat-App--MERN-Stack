import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import {io} from "socket.io-client"

export const ChatContext = createContext({
    userChats: null,
    isUserChatsLoading: false,
    userChatsError: null,
    potentialChats: [],
    currentChat: null,
    recipientUser: null,
    messages: null,
    isMessagesLoading: false,
    messageError: null,
    handleChatClick: () => {}, 
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
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [notifications, setNotifications] = useState([])
    const [allUsers, setAllUsers] = useState([])

    console.log("Notifications",notifications)

    // initial socket

    useEffect(() => {
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket);

        return() =>{
            newSocket.disconnect()
        }
    },[user])

    useEffect(() =>{
        if(socket === null) return
        socket.emit("addNewUser",user?._id)
        socket.on("getOnlineUsers", (res) => {
            setOnlineUsers(res)
        })

        return () => {
            socket.off("getOnlineUsers")        }
    }, [socket])

    //send message

    useEffect(() =>{
        if(socket === null) return;

        const recipientId = currentChat?.members.find((id) => id !== user?._id);

        socket.emit("sendMessage",{...newMessage, recipientId})
        
    }, [newMessage])

   //receive Message and notification

   useEffect(() =>{
    if(socket === null) return;
    socket.on("getMessage", res =>{
        if(currentChat?._id !== res.chatId) return

        setMessages((prev) => [...prev, res])
    })

    socket.on("getNotification", (res) => {
        const isChatOpen = currentChat?.members.some(id => id === res.senderId )

        if(isChatOpen){
            setNotifications(prev => [{...res, isRead: true}, ...prev])
        }else{
            setNotifications(prev => [res, ...prev])
        }
    })


    return () => {
        socket.off("getMessage")
        socket.off("getNotification")
    }
    
}, [socket, currentChat])

    // Fetch potential chats
    useEffect(() => {
        const getUsers = async () => {
            if (!user?._id) {
                console.error("User is not defined or _id is missing.");
                return;
            }

            try {
                const response = await getRequest(`${baseUrl}/users`);
                if (response.error) return;

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
                setAllUsers(response)
            } catch (error) {
                console.error("Error in fetching potential chats:", error);
            }
        };

        getUsers();
    }, [user, userChats]);

    // Fetch user chats
    useEffect(() => {
        const getUserChats = async () => {
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

        getUserChats();
    }, [user]);

    // Handle sending text message and updating state
    

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
                return console.error("Error creating chat:", response);
            } else {
                setUserChats((prev) => [...prev, response]);
            }
        } catch (error) {
            console.error("Error creating chat:", error);
        }
    };

    // Fetch messages for the current chat when it changes
    useEffect(() => {
        const getMessages = async () => {
            if (!currentChat?._id) return;

            setIsMessagesLoading(true);
            setMessageError(null);

            try {
                const response = await getRequest(`${baseUrl}/messages/${currentChat._id}`);
                if (response.error) {
                    setMessageError(response.error);
                } else {
                    setMessages(response); // Update with the fetched messages
                }
            } catch (error) {
                setMessageError(error.message);
            } finally {
                setIsMessagesLoading(false);
            }
        };

        getMessages();
    }, [currentChat]);


    const sendTextMessage = useCallback(
        async (textMessage, sender, currentChatId, setTextMessage) => {
            if (!textMessage) return console.log("You must type something...");



            const response = await postRequest(
                `${baseUrl}/messages`,
                
                JSON.stringify({
                    chatId: currentChatId,
                    senderId: sender._id,
                    text: textMessage,
                })
                
            );
            if (response.error) {
                setSendTextMessageError(response);
                return;
            }

            setNewMessage(response)
            setMessages((prev) => [...prev, response]); 
            setTextMessage("");

        },
        []
    );

    // Handle chat click to set the current chat
    const handleChatClick = useCallback((chat) => {
        setCurrentChat(chat); 
    }, []);

    const markAllNotificationsAsRead = useCallback((notifications) => {
        const mNotifications = notifications.map((n) => {
            return {...n, isRead: true };
        });

        setNotifications(mNotifications)
    },[]);

    const markNotificationsAsRead = useCallback((n, userChats, user, notifications) => {
        const desiredChat = userChats.find(chat => {
            const chatMembers = [user._id ,n.senderId ]
            const isDesiredChat = chat?.members.every((member) => {
                return chatMembers.includes(member);
            });

            return isDesiredChat
        });
        const mNotifications = notifications.map(el => {
            if(n.senderId === el.senderId){
                return {...n, isRead: true}
            } else{
                return el
            }
        }
    )

        handleChatClick(desiredChat)
        setNotifications(mNotifications)
    }, [])


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
                sendTextMessage,
                onlineUsers,
                notifications,
                allUsers,
                markAllNotificationsAsRead,
                markNotificationsAsRead,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
