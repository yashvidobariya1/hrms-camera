import React, { useEffect, useState } from "react";
import "./ShowNotification.css";
import { GetCall } from "../../ApiServices";
import Loader from "../Helper/Loader";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { IoEyeSharp } from "react-icons/io5";
import { setNotificationCount } from "../../store/NotificationCountSlice";
import { showToast } from "../../main/ToastManager";

const ShowNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const UserId = useSelector((state) => state.userInfo.userInfo._id);
  const dispatch = useDispatch();
  console.log("userid user", UserId);

  const GetNotification = async () => {
    try {
      setLoading(true);
      const response = await GetCall("/getNotifications");

      if (response?.data?.status === 200) {
        setNotifications(response.data.notifications);
        const unreadCount = response.data.unreadNotificationsCount;
        console.log("unreadCount", response.data.unreadNotificationsCount);
        dispatch(setNotificationCount(unreadCount));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const ReadNotification = async (id) => {
    try {
      const response = await GetCall(`/readNotification/${id}`);
      if (response?.data?.status === 200) {
        console.log("Notification read", response?.data);
      } else {
        showToast(response?.data?.message);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    } finally {
    }
  };

  const handleViewClick = (id, index, isRead) => {
    console.log("unread", isRead);
    toggleDropdown(index);
    if (!isRead) {
      ReadNotification(id, index);
    }
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const cancelDelete = () => {
    GetNotification();
    setOpenDropdown(null);
  };

  useEffect(() => {
    GetNotification();
  }, []);

  return (
    <div className="notifications-page">
      <div className="notifications-title">
        <h2>Notifications</h2>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <table className="notifications-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Message</th>
              <th>Time</th>
              <th>Read</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification, index) => (
              <React.Fragment key={index}>
                <tr
                  className={`${
                    notification.isRead
                      ? "read-notification"
                      : "unread-notification"
                  } ${openDropdown === index ? "dropdown-open" : ""}`}
                >
                  <td>{notification.userName}</td>
                  <td>{notification.type}</td>
                  <td className="Notification-message-overflow">
                    {notification.message}
                  </td>
                  <td>{moment(notification.createdAt).format("DD/MM/YYYY")}</td>
                  <td>
                    <button
                      className="View-notification-button"
                      onClick={() =>
                        handleViewClick(
                          notification._id,
                          index,
                          notification.isRead
                        )
                      }
                    >
                      <IoEyeSharp
                        size={20}
                        className={`View-notification ${
                          !notification.isRead
                            ? "unread-notification"
                            : "read-notification"
                        }`}
                      />
                      View
                    </button>
                  </td>
                </tr>
                {/* Add dropdown content outside of the <tbody> */}
                {openDropdown === index && (
                  <tr>
                    <td colSpan="5">
                      <div className="dropdown-box">
                        <div className="dropdown-content">
                          <div className="notification-flex">
                            <p>Notification</p>
                          </div>
                          <div className="notification-message">
                            <div className="notification-message-flex">
                              <div className="notification-div">
                                <h4>{notification.userName}</h4>
                              </div>
                              <div className="notification-div">
                                <h4>{notification.type}</h4>
                                <p>
                                  {moment(notification.createdAt).format(
                                    "hh:mm A"
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="notification-message-show">
                              <p>{notification.message}</p>
                            </div>
                            <div className="notification-cancel-button">
                              <button
                                onClick={cancelDelete}
                                className="notifiction-cancel"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShowNotification;
