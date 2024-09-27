import React from "react";
import { SelectInput } from "../../../shared/components/select/SelectInput";
import { Input } from "../../../shared/components/input/Input";

const TaskInformation = ({
  cardInfo,
  handleAssignedUserChange,
  handleLeadChange,
  handleDecriptionChange,
  handleStartDateChange,
  handleDueDateChange,
  handleStatusChange,
  handleLabelChange,
}) => {
  const leads = [
    { label: "Lead A", value: "leadA" },
    { label: "Lead B", value: "leadB" },
  ];
  const label = [
    { label: "Hot", value: "hot" },
    { label: "Warm", value: "warm" },
    { label: "Cold", value: "cold" },
  ];

  const taskStatus = [
    { label: "Due Today", value: "dueToday" },
    { label: "Overdue", value: "overdue" },
    { label: "Upcoming Tasks", value: "upcomingTasks" },
    { label: "Completed", value: "completed" },
    { label: "Not Started", value: "notStarted" },
  ];

  const assignedUsers = [
    { label: "User A", value: "userA" },
    { label: "User B", value: "userB" },
  ];
  return (
    <div className="task-information-wrapper">
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
            <label>Lead *</label>
            <SelectInput
              options={leads}
              placeholder={<p>Search or type lead</p>}
              onChange={handleLeadChange}
              value={cardInfo.lead}
            />
          </div>
        </div>
      </div>

      <div className="columns is-multiline m-b-5">
        <div className="column is-12">
          <div className="field">
            <label>Task Description</label>
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
            <label>Starting Date *</label>
            <Input
              onChange={handleStartDateChange}
              type={"text"}
              placeholder={"None"}
              value={cardInfo.startDate}
            />
          </div>
        </div>
        <div className="column is-6">
          <div className="field">
            <label>Due Date *</label>
            <Input
              onChange={handleDueDateChange}
              type={"text"}
              placeholder={"None"}
              value={cardInfo.dueDate}
            />
          </div>
        </div>
      </div>

      <div className="columns is-multiline m-b-5">
        <div className="column is-6">
          <div className="field">
            <label>Status</label>
            <SelectInput
              options={taskStatus}
              placeholder={<p>Search or type article name</p>}
              onChange={handleStatusChange}
              value={cardInfo.status}
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
    </div>
  );
};

export default TaskInformation;
