import React, { useEffect, useState } from "react";
import PageContent from "../../shared/components/pageContent/PageContent";
import FontAwesomeIcon from "../../shared/fontAwesomeIcon/FontAwesomeIcon";
import SortIcon from "@mui/icons-material/Sort";
import { SelectInput } from "../../shared/components/select/SelectInput";
import Accordion from "../../shared/components/accordion/Accordion";
import oldConfig from "../../../../oldConfig";
import groflexService from "../../services/groflex.service";
import { FeatherIcon } from "../../shared/featherIcon/FeatherIcon";
import moment from "moment";
import config from "../../../../newConfig";
import { useNavigate } from "react-router-dom";
const Notifications = ({ isNotificationsActive, setIsNotificationsActive }) => {
  const [notificationType, setNotificationType] = useState("sort-by-new");
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (isNotificationsActive) {
      fetchNotification();
    }
  }, [isNotificationsActive]);

  useEffect(() => {
    filterNotification();
  }, [notificationType, notifications]);

  const fetchNotification = () => {
    groflexService
      .request(`${oldConfig.resourceHost}/notification`, { auth: true })
      .then((res) => {
        setNotifications(res.body.data.notifications);
      });
  };

  const handleNotificationTypeChange = (option) => {
    setNotificationType(option.value);
  };

  const filterNotification = () => {
    let filteredResponse = [];
    const YESTERDAY = moment().subtract(1, "days").startOf("day");
    notifications.map((item) => {
      if (notificationType === "sort-by-new") {
        if (moment(item.createdAt).isSame(moment(), "day")) {
          filteredResponse.push(item);
        }
      } else if (notificationType === "sort-by-old") {
        filteredResponse.push(item);
      }
    });

    setFilteredNotifications(filteredResponse);
  };
  const CreateLeftHeader = ({ notification }) => {
    let icon = "AlertCircle";
    const url = notification.link.split("/");
    const heading = url[url.length - 2];
    console.log(notification);
    switch (notification.icon) {
      case "alert":
        icon = "AlertCircle";
        break;
      case "at":
        icon = "AtSign";
        break;
    }
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <FeatherIcon name={icon} />
        <span>{heading.charAt(0).toUpperCase() + heading.slice(1)}</span>
      </div>
    );
  };
  const markAsRead = (id) => {
    groflexService
      .request(`${oldConfig.resourceHost}notification/${id}/read`, {
        auth: true,
        method: "PUT",
      })
      .then((res) => {
        setIsNotificationsActive(false);
        setFilteredNotifications([]);
      });
  };

  const CreateAccordianBody = ({ notification }) => {
    const linkParts = notification.link.split("/");
    const documentId = linkParts[linkParts.length - 1];
    const notificationId = notification.id;
    const viewUrl = `/sales/invoices/${documentId}`;

    console.log(viewUrl);
    return (
      <div>
        <div>{notification.text}</div>
        <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
          {!notification.readDate && (
            <span
              style={{ color: "rgb(0, 163, 83)", cursor: "pointer" }}
              onClick={() => markAsRead(notificationId)}
            >
              Mark as read
            </span>
          )}

          <span
            style={{ color: "rgb(0, 163, 83)", cursor: "pointer" }}
            onClick={() => navigate(viewUrl)}
          >
            view
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      id="search-panel"
      className={`right-panel-wrapper is-search is-left notifications-wrapper ${
        isNotificationsActive ? "is-active" : ""
      }`}
    >
      <div className="panel-overlay"></div>
      <div className="right-panel">
        <div className="right-panel-head">
          <h1>Notifications</h1>
          <a
            className="close-panel"
            onClick={() => setIsNotificationsActive(false)}
          >
            <FontAwesomeIcon name={"xmark"} color="#00A353" />
          </a>
        </div>
        <div className="notification-type-dropdown">
          <SortIcon style={{ marginRight: "12px", marginTop: "4px" }} />
          <SelectInput
            options={[
              { label: "sort by: new first", value: "sort-by-new" },
              { label: "sort by: old first", value: "sort-by-old" },
            ]}
            placeholder={""}
            onChange={handleNotificationTypeChange}
            value={notificationType}
          />
        </div>
        <div className="notifications-container">
          {filteredNotifications.map((notification) => (
            <Accordion
              accordionLeftHeader={
                <CreateLeftHeader notification={notification} />
              }
              accordianRightHeader={moment(notification.createdAt).format(
                "LLL"
              )}
              accordionBody={
                <CreateAccordianBody notification={notification} />
              }
            />
          ))}
        </div>

        <div className="right-panel-body has-slimscroll"></div>
      </div>
    </div>
  );
};

export default Notifications;
