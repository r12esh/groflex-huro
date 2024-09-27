import React, { useState } from "react";
import { Input } from "../../shared/components/input/Input";
import Modal from "../../shared/components/modal/Modal";
import { FeatherIcon } from "../../shared/featherIcon/FeatherIcon";

const ChangeEmailModal = ({
  isActive = false,
  setIsActive,
  setProfileInfo,
  profileInfo,
}) => {
  // const [newEmail, setNewEmail] = useState("");
  // const [currentPassword, setCurrentPassword] = useState("");

  const handleEmailChange = (event) => {
    setProfileInfo({ ...profileInfo, newEmail: event.target.value });
  };
  const handlePasswordChange = (event) => {
    setProfileInfo({ ...profileInfo, currentPassword: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: handle form submission
    console.log("HI handleSUbmit here");
  };

  return (
    <Modal
      title="Change Email Address"
      submitBtnName="Change Email"
      isActive={isActive}
      setIsAcive={setIsActive}
      onSubmit={handleSubmit}
      isSmall
    >
      <form onSubmit={handleSubmit}>
        <div className="columns">
          <div className="field column is-9">
            <label>New Email Address</label>
            <Input
              value={profileInfo.newEmail}
              type="email"
              onChange={handleEmailChange}
            />
          </div>
        </div>
        <div className="columns">
          <div className="field column is-9">
            <label>Current Password</label>
            <Input
              value={profileInfo.currentPassword}
              type="password"
              onChange={handlePasswordChange}
            />
          </div>
        </div>
      </form>
      <div style={{ margin: "10px 0 0 0", display: "flex" }}>
        <span>
          <FeatherIcon
            style={{ margin: "5px 10px 0 0" }}
            name="Info"
            size={14}
          />
        </span>
        <span>
          <p>
            Please confirm your new mail by clicking confirmation link sent to
            your new email adress
          </p>
        </span>
      </div>
    </Modal>
  );
};

export default ChangeEmailModal;
