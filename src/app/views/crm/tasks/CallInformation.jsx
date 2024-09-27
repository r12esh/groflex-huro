import React from "react";
import { SelectInput } from "../../../shared/components/select/SelectInput";
import { Input } from "../../../shared/components/input/Input";

const CallInformation = ({
  cardInfo,
  handleAssignedUserChange,
  handleContactChange,
  handleDecriptionChange,
  handleDateChange,
  handleTimeChange,
  handleLabelChange,
}) => {
  const label = [
    { label: "Hot", value: "hot" },
    { label: "Warm", value: "warm" },
    { label: "Cold", value: "cold" },
  ];

  const assignedUsers = [
    { label: "User A", value: "userA" },
    { label: "User B", value: "userB" },
  ];

  const contacts = [
    { label: "contact A", value: "contactA" },
    { label: "contact B", value: "contactB" },
  ];
  return (
    <div className="email-information-wrapper">
      <div className="columns is-multiline m-b-5">
        <div className="column is-12">
          <div className="field">
            <label>Assigned User</label>
            <SelectInput
              options={assignedUsers}
              placeholder={<p>Search or type assigned user</p>}
              onChange={handleAssignedUserChange}
              value={cardInfo.assignedUser}
            />
          </div>
        </div>
      </div>

      <div className="columns is-multiline m-b-5">
        <div className="column is-12">
          <div className="field">
            <label>Contact</label>
            <SelectInput
              options={contacts}
              placeholder={<p>Search or type contact</p>}
              onChange={handleContactChange}
              value={cardInfo.contact}
            />
          </div>
        </div>
      </div>

      <div className="columns is-multiline m-b-5">
        <div className="column is-12">
          <div className="field">
            <label>Description</label>
            <Input
              onChange={handleDecriptionChange}
              type={"text"}
              placeholder={"Enter description"}
              value={cardInfo.description}
            />
          </div>
        </div>
      </div>

      <div className="columns is-multiline m-b-5">
        <div className="column is-6">
          <div className="field">
            <label>Date*</label>
            <Input
              onChange={handleDateChange}
              type={"text"}
              placeholder={"None"}
              value={cardInfo.date}
            />
          </div>
        </div>
        <div className="column is-6">
          <div className="field">
            <label>Time *</label>
            <Input
              onChange={handleTimeChange}
              type={"text"}
              placeholder={"None"}
              value={cardInfo.time}
            />
          </div>
        </div>
      </div>

      <div className="columns is-multiline m-b-5">
        <div className="column is-6">
          <div className="field">
            <label>Label</label>
            <SelectInput
              options={label}
              placeholder={<p>Search or type article name</p>}
              onChange={handleLabelChange}
              value={cardInfo.label}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallInformation;
