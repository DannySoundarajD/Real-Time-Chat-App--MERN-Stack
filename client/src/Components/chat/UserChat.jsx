import { useFetchRecipientUser } from "../../utils/hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import avatar from "../../assets/avarter.svg";

const UserChat = ({ chat, user }) => {
    const { recipientUser } = useFetchRecipientUser(chat, user); // Fetch recipient user

    return (
        <Stack
            direction="horizontal"
            gap={3}
            className="user-card align-items-center p-2 justify-content-between"
            role="button"
        >
            <div className="d-flex">
                <div className="me-2">
                    <img src={avatar} height="35px" alt="avatar" />
                </div>
                <div className="text-content">
                    <div className="name">{recipientUser?.name || "Loading..."}</div> {/* Display name */}
                    <div className="text">Text Message</div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className="date">18/01/2025</div>
                <div className="this-user-notifications">2</div>
                <span className="user-online"></span>
            </div>
        </Stack>
    );
};

export default UserChat;
