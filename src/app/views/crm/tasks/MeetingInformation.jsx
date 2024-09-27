import React from "react";
import { SelectInput } from "../../../shared/components/select/SelectInput";
import { Input } from "../../../shared/components/input/Input";

const MeetingInformation = ({
  cardInfo,
  handleHostChange,
  handleDecriptionChange,
  handleLocationsChange,
  handleLabelChange,
  handleDateChange,
  handleTimeChange,
  handleAttendeesChange,
}) => {
  const hosts = [
    { label: "User A", value: "userA" },
    { label: "User B", value: "userB" },
  ];

  const locations = [
    { label: "Location A", value: "locA" },
    { label: "Location B", value: "locB" },
  ];

  const label = [
    { label: "Hot", value: "hot" },
    { label: "Warm", value: "warm" },
    { label: "Cold", value: "cold" },
  ];

  const attendees = [
    { label: "User A", value: "userA" },
    { label: "User B", value: "userB" },
  ];
  return (
    <div className="meeting-information-wrapper">
      <div className="columns is-multiline m-b-5">
        <div className="column is-12">
          <div className="field">
            <label>Host</label>
            <SelectInput
              options={hosts}
              placeholder={<p>Search or type assigned user</p>}
              onChange={handleHostChange}
              value={cardInfo.host}
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
              placeholder={"Enter task description"}
              value={cardInfo.description}
            />
          </div>
        </div>
      </div>

      <div className="columns is-multiline m-b-5">
        <div className="column is-6">
          <div className="field">
            <label>Location</label>
            <SelectInput
              options={locations}
              placeholder={<p>Search or type article name</p>}
              onChange={handleLocationsChange}
              value={cardInfo.location}
            />
          </div>
        </div>
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

      <div className="columns is-multiline m-b-5">
        <div className="column is-6">
          <div className="field">
            <label>Date</label>
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
            <label>Time</label>
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
        <div className="column is-12">
          <div className="field">
            <label>Attendees</label>
            <SelectInput
              options={attendees}
              placeholder={<p>Search or type lead</p>}
              onChange={handleAttendeesChange}
              value={cardInfo.attendees}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingInformation;
