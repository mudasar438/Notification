import { useEffect, useState } from "react";
import io from "socket.io-client";

const userId = "673082fe6f27bb68b1c64a66"; // Example user ID

const NotificationsComponent = () => {
  const [userNotification, setUserNotification] = useState([]);
  useEffect(() => {
    // Connect to Socket.io server
    const socket = io("http://localhost:5000");

    // Join the user's room
    socket.emit("joinRoom", userId);

    // Listen for notifications for this specific user
    socket.on("receiveNotification", (notification) => {
      setUserNotification((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
      console.log("New notification received:", notification);
    });

    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Notifications</h1>
      <div>
        {userNotification.map((notification) => (
          <div key={notification._id}>
            <p>{notification.message}</p>
            <small>
              Received at: {new Date(notification.createdAt).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
      {/* Render notifications here */}
    </div>
  );
};

export default NotificationsComponent;
