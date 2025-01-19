import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { Stack } from "react-bootstrap";
import moment from "moment";
import InputEmoji from "react-input-emoji"
import { AuthContext } from "../../context/AuthContext";
import { useFetchRecipientUser } from "../../utils/hooks/useFetchRecipient";

const ChatBox = () => {
    const {user} = useContext(AuthContext)
    const { currentChat, messages, isMessagesLoading} = useContext(ChatContext);
    const {recipientUser} = useFetchRecipientUser(currentChat, user)
    
    // Handle case where no chat is selected
    if (!currentChat) {
        return (
            <p style={{ textAlign: "center", width: "100%" }}>
                No Conversation selected yet...
            </p>
        );
    }

    // Handle loading state for messages
    if (isMessagesLoading) {
        return (
            <p style={{ textAlign: "center", width: "100%" }}>
                Loading messages...
            </p>
        );
    }

    return (
        <Stack gap={4} className="chat-box">
            {/* Chat Header */}
            <div className="chat-header">
                <strong>{recipientUser?.name||"Chat Box"}</strong>
            </div>

            {/* Messages */}
            <Stack gap={3} className="messages">
                {messages &&
                    messages.map((message, index) => (
                        <Stack
                            key={index}
                            
                            className={`message ${
                                message?.senderId === user?._id
                                    ? "self align-self-end flex-grow-0"
                                    : "align-self-start flex-grow-0"
                            }`}
                        >
                            <span>{message.text}</span>
                            <span className="message-footer">
                                {moment(message.createdAt).calendar()}
                            </span>
                        </Stack>
                    ))}
            </Stack>
            <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
                    <InputEmoji />
            </Stack>
        </Stack>
    );
};

export default ChatBox;
