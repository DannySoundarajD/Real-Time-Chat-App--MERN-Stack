import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import moment from "moment";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const {
    notifications,
    allUsers,
    markAllNotificationsAsRead,
    markNotificationsAsRead,
  } = useContext(ChatContext);

  const unreadNotifications = unreadNotificationsFunc(notifications);
  const modifiedNotifications = notifications.map((n) => {
    const sender = allUsers.find((user) => user._id === n.senderId);

    return {
      ...n,
      senderName: sender?.name,
    };
  });

  return (
    <div className="notifications">
      {/* Notification Icon */}
      <div
        className="notifications-icons"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-chat-left-text-fill"
          viewBox="0 0 16 16"
        >
          <path d="M16 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9.586a1 1 0 0 1 .707.293l2.853 2.853a.5.5 0 0 0 .854-.353zM3.5 3h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1m0 
          2.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1m0 2.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1" />
        </svg>
        {unreadNotifications?.length > 0 && (
          <span className="notification-count">
            {unreadNotifications?.length}
          </span>
        )}
      </div>

      {/* Notifications Panel */}
      {isOpen && (
        <div className="notifications-box">
          {/* Header */}
          <div className="notifications-header">
            <h3>Notifications</h3>
            <div
              className="mark-as-read"
              onClick={() =>markAllNotificationsAsRead(notifications)}
            >
              Mark all as read
            </div>
          </div>

          {/* Notifications */}
          {modifiedNotifications.length === 0 ? (
            <div className="notification-empty">No notifications yet...</div>
          ) : (
            modifiedNotifications.map((n, index) => (
              <div
                key={index}
                className={n.isRead ? "notification" : "not-read"}
                onClick={() => {
                    markNotificationsAsRead(n, userChats, user, notifications);
                    setIsOpen(false)
                }}
              >
                <span>{`${n.senderName} sent you a new message`}</span>
                <span className="notification-time">
                  {moment(n.date).calendar()}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
