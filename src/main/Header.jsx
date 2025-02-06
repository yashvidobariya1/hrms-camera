import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { IoIosMenu } from "react-icons/io";
import { MdOutlineNotificationsActive } from "react-icons/md";
import "./Header.css";
import { useDispatch, useSelector } from "react-redux";
import { clearUserInfo } from "../store/userInfoSlice";
import { persistor } from "../store";
import { clearThemeColor, setThemeColor } from "../store/themeColorSlice";
import { clearNotificationCount } from "../store/NotificationCountSlice";

const Header = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [theme, setTheme] = useState("light");
  const user = useSelector((state) => state.userInfo.userInfo);
  const themeColor = useSelector((state) => state.themeColor.themeColor);
  const Notificationscount = useSelector(
    (state) => state.notificationCount.notificationCount
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
    dispatch(setThemeColor(selectedTheme));
    document.documentElement.setAttribute("data-theme", selectedTheme);
  };

  const handleLogout = async () => {
    dispatch(clearUserInfo());
    dispatch(clearNotificationCount());
    dispatch(clearThemeColor());
    persistor.pause();
    await persistor.purge();
    persistor.persist();
    navigate("/");
    localStorage.clear();
  };

  const handleClickOutside = useCallback(
    (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    },
    [dropdownRef]
  );

  const HandleShowNotification = () => {
    navigate("/notification");
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    setTheme(themeColor);
    document.documentElement.setAttribute("data-theme", themeColor);
  }, []);

  return (
    <section className="home-section">
      <div className="home-content">
        <IoIosMenu className="Header-Toggle-menu" onClick={toggleSidebar} />

        <span className="text">
          <div
            className="header-notification-flex"
            onClick={HandleShowNotification}
          >
            <MdOutlineNotificationsActive className="header-notification" />
            <div className="header-notification-count">
              <span>{Notificationscount}</span>
            </div>
          </div>
          <div className="profile-name">
            <p>{user?.personalDetails?.firstName}</p>
            <h6>{user?.role}</h6>
          </div>
          <img
            src={process.env.PUBLIC_URL + "/image/profile.png"}
            alt="Profile"
            onClick={toggleDropdown}
          />
        </span>

        {isDropdownOpen && (
          <div className="profile-dropdown-menu" ref={dropdownRef}>
            <ul>
              <Link to="/profile">
                <li>Profile</li>
              </Link>
              <Link to="/changepassword">
                <li>Change Password</li>
              </Link>
              <li>
                Theme{" "}
                <select
                  className="header-theme"
                  value={theme}
                  onChange={handleThemeChange}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </li>

              <Link to="/" onClick={handleLogout}>
                <li>Logout</li>
              </Link>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default Header;
