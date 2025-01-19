import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () => {
    const { user } = useContext(AuthContext);
    const { potentialChats, createChat } = useContext(ChatContext);

    
    return (
        <div className="all-users">
            {potentialChats.map((u, index) => (
                <div
                    className="single-user"
                    key={index}
                    onClick={() => createChat(user._id, u._id)} // Trigger chat creation
                >
                    <div className="user-name">{u.name}</div>
                    <span className="user-online"></span>
                </div>
            ))}
        </div>
    );
};

export default PotentialChats;
