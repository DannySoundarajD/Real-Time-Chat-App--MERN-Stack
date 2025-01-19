import { useContext } from "react";
import { Container, Stack } from "react-bootstrap";
import { ChatContext } from "../context/ChatContext";
import UserChat from "../Components/chat/UserChat";
import PotentialChats from "../Components/chat/PotentialChats";
import ChatBox from "../Components/chat/ChatBox";
import { AuthContext } from "../context/AuthContext";

const Chat = () => {
    const { userChats, isUserChatsLoading, handleChatClick, currentChat } = useContext(ChatContext);
    const { user } = useContext(AuthContext); // Get the current user from AuthContext

    return (
        <Container>
            <PotentialChats />
            {userChats?.length < 0 ? null : (
                <Stack direction="horizontal" gap={4} className="align-items-start">
                    {/* User Chats */}
                    <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
                        {isUserChatsLoading && <p>Loading Chats...</p>}
                        {userChats?.map((chat, index) => (
                            <div
                                key={index}
                                className="chat-item"
                                onClick={() => handleChatClick(chat)} // Pass the clicked chat
                            >
                                <UserChat chat={chat} user={user}/> {/* Pass chat data */}
                            </div>
                        ))}
                    </Stack>
                    
                    <ChatBox  /> 
               </Stack>
            )}
        </Container>
    );
};

export default Chat;
