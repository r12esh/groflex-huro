import React, { useEffect, useState } from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";

import config from "../../../../../config";
import groflexService from "../../../services/groflex.service";

import { Button } from "../../../shared/components/button/Button";

import { AdvancedCard } from "../../../shared/components/cards/AdvancedCard";
import { Switch } from "../../../shared/components/switch/Switch";
import { TextArea } from "../../../shared/components/textArea/TextArea";
import RadioButton from "../../../shared/components/button/RadioButton";
import { SelectInput } from "../../../shared/components/select/SelectInput";
import { Input } from "../../../shared/components/input/Input";
import TaskInformation from "./TaskInformation";
import MeetingInformation from "./MeetingInformation";
import ToDoInformation from "./ToDoInformation";
import EmailInformation from "./EmailInformation";
import CallInformation from "./CallInformation";

const TaskDetails = () => {
  const [taskType, setTaskType] = useState("task");

  const [cardInfo, setCardInfo] = useState({
    assignedUser: "",
    lead: "",
    description: "",
    startDate: "",
    dueDate: "",
    status: "",
    label: "",
    host: "",
    location: "",
    date: "",
    time: "",
    attendees: "",
    email: "",
    contact: "",
  });
  const [reminder, setReminder] = useState({
    remind: false,
    reminderDate: "",
    reminderTime: "",
    notificationType: "",
    repeat: "",
  });
  const [notes, setNotes] = useState({
    showNotes: false,
    notesContent: "",
  });

  //funtions to manage cardInfo states
  const handleTaskTypeChange = (e) => {
    setTaskType(e);
  };

  const handleRemindeToggle = () => {
    setReminder({
      ...reminder,
      remind: !reminder.remind,
    });
  };

  const handleReminderDateChange = (e) => {
    setReminder({
      ...reminder,
      reminderDate: e.target.value,
    });
  };

  const handleReminderTimeChange = (e) => {
    setReminder({
      ...reminder,
      reminderTime: e.target.value,
    });
  };

  const handleReminderNotificationTypeChange = (option) => {
    setReminder({
      ...reminder,
      notificationType: option.value,
    });
  };

  const handleReminderRepeatChange = (option) => {
    setReminder({
      ...reminder,
      repeat: option.value,
    });
  };

  const handleNotesChange = (e) => {
    setNotes({
      ...notes,
      notesContent: e.target.value,
    });
  };
  const handleShowNotesToggle = () => {
    setNotes({
      ...notes,
      showNotes: !notes.showNotes,
    });
  };

  const handleAssignedUserChange = (option) => {
    setCardInfo({
      ...cardInfo,
      assignedUser: option.value,
    });
  };

  const handleLeadChange = (option) => {
    setCardInfo({
      ...cardInfo,
      lead: option.value,
    });
  };

  const handleDecriptionChange = (e) => {
    setCardInfo({
      ...cardInfo,
      description: e.target.value,
    });
  };

  const handleStartDateChange = (e) => {
    setCardInfo({
      ...cardInfo,
      startDate: e.target.value,
    });
  };

  const handleDueDateChange = (e) => {
    setCardInfo({
      ...cardInfo,
      dueDate: e.target.value,
    });
  };

  const handleStatusChange = (option) => {
    setCardInfo({
      ...cardInfo,
      status: option.value,
    });
  };

  const handleLabelChange = (option) => {
    setCardInfo({
      ...cardInfo,
      label: option.value,
    });
  };

  const handleHostChange = (option) => {
    setCardInfo({
      ...cardInfo,
      host: option.value,
    });
  };

  const handleLocationsChange = (option) => {
    setCardInfo({
      ...cardInfo,
      location: option.value,
    });
  };

  const handleDateChange = (e) => {
    setCardInfo({
      ...cardInfo,
      date: e.target.value,
    });
  };

  const handleTimeChange = (e) => {
    setCardInfo({
      ...cardInfo,
      time: e.target.value,
    });
  };

  const handleAttendeesChange = (option) => {
    setCardInfo({
      ...cardInfo,
      attendees: option.value,
    });
  };

  const handleEmailChange = (option) => {
    setCardInfo({
      ...cardInfo,
      email: option.value,
    });
  };

  const handleContactChange = (option) => {
    setCardInfo({
      ...cardInfo,
      contact: option.value,
    });
  };

  //function to create info card
  const createInfoCard = () => {
    let card = "";
    switch (taskType) {
      case "meeting":
        card = (
          <MeetingInformation
            cardInfo={cardInfo}
            handleHostChange={(e) => handleHostChange(e)}
            handleDecriptionChange={(e) => handleDecriptionChange(e)}
            handleLocationsChange={(e) => handleLocationsChange(e)}
            handleLabelChange={(e) => handleLabelChange(e)}
            handleDateChange={(e) => handleDateChange(e)}
            handleTimeChange={(e) => handleTimeChange(e)}
            handleAttendeesChange={(e) => handleAttendeesChange(e)}
          />
        );

        break;
      case "task":
        card = (
          <TaskInformation
            cardInfo={cardInfo}
            handleAssignedUserChange={(e) => handleAssignedUserChange(e)}
            handleLeadChange={(e) => handleLeadChange(e)}
            handleDecriptionChange={(e) => handleDecriptionChange(e)}
            handleStartDateChange={(e) => handleStartDateChange(e)}
            handleDueDateChange={(e) => handleDueDateChange(e)}
            handleStatusChange={(e) => handleStatusChange(e)}
            handleLabelChange={(e) => handleLabelChange(e)}
          />
        );
        break;
      case "toDo":
        card = (
          <ToDoInformation
            cardInfo={cardInfo}
            handleAssignedUserChange={(e) => handleAssignedUserChange(e)}
            handleDecriptionChange={(e) => handleDecriptionChange(e)}
            handleStartDateChange={(e) => handleStartDateChange(e)}
            handleDueDateChange={(e) => handleDueDateChange(e)}
            handleLabelChange={(e) => handleLabelChange(e)}
          />
        );
        break;
      case "email":
        card = (
          <EmailInformation
            cardInfo={cardInfo}
            handleAssignedUserChange={(e) => handleAssignedUserChange(e)}
            handleEmailChange={(e) => handleEmailChange(e)}
            handleDecriptionChange={(e) => handleDecriptionChange(e)}
            handleDateChange={(e) => handleDateChange(e)}
            handleTimeChange={(e) => handleTimeChange(e)}
            handleLabelChange={(e) => handleLabelChange(e)}
          />
        );
        break;
      case "call":
        card = (
          <CallInformation
            cardInfo={cardInfo}
            handleAssignedUserChange={(e) => handleAssignedUserChange(e)}
            handleContactChange={(e) => handleContactChange(e)}
            handleDecriptionChange={(e) => handleDecriptionChange(e)}
            handleDateChange={(e) => handleDateChange(e)}
            handleTimeChange={(e) => handleTimeChange(e)}
            handleLabelChange={(e) => handleLabelChange(e)}
          />
        );

        break;
    }
    return card;
  };

  //funtion to create info card title
  const cardInfoTitle = () => {
    let title = "";
    switch (taskType) {
      case "meeting":
        title = <h2 className="title is-5">Meeting Informations</h2>;
        break;
      case "task":
        title = <h2 className="title is-5">Task Informations</h2>;
        break;

      case "toDo":
        title = <h2 className="title is-5">To-Do Informations</h2>;
        break;
      case "email":
        title = <h2 className="title is-5">Email Informations</h2>;
        break;
      case "call":
        title = <h2 className="title is-5">Call Informations</h2>;
        break;
    }

    return title;
  };

  //values for radio buttons
  const taskTypes = [
    {
      label: "Meeting",
      value: "meeting",
      class: "radio is-outlined is-success",
    },
    {
      label: "Task",
      value: "task",
      class: "radio is-outlined is-success",
    },
    {
      label: "To-do",
      value: "toDo",
      class: "radio is-outlined is-success",
    },
    {
      label: "E-mail",
      value: "email",
      class: "radio is-outlined is-success",
    },
    {
      label: "Call",
      value: "call",
      class: "radio is-outlined is-success",
    },
  ];

  //dropdown options for leads input
  const leads = [
    { label: "Lead A", value: "leadA" },
    { label: "Lead B", value: "leadB" },
  ];
  // console.log(cardInfo, "Hello");

  return (
    <PageContent
      title="Create"
      titleIsBreadCrumb
      breadCrumbData={["Home", "CRM", "Leads"]}
      titleActionContent={
        <Button onClick={() => console.log("Saved")} isSuccess>
          Save
        </Button>
      }
    >
      <div className="crm-task-details-wrapper">
        <div className="columns is-multiline">
          <div className="column is-7 type-info-card">
            <div className="task-info-card">
              <AdvancedCard type={"s-card"}>
                {/* <h2 className="title is-5"></h2> */}
                {cardInfoTitle()}
                <div className="task-info">
                  <div className="columns is-multiline m-b-5">
                    <RadioButton
                      choices={taskTypes}
                      selectedOption={taskType}
                      onChange={handleTaskTypeChange}
                      name="kind"
                    />
                  </div>
                  {createInfoCard()}
                </div>
              </AdvancedCard>
            </div>
          </div>

          <div className="column is-5">
            <div className="reminder-card">
              <AdvancedCard type={"s-card"}>
                <h2 className="title is-5">Reminder</h2>
                <div className="toggle-reminder">
                  <h5>Do you want a reminder?</h5>
                  <Switch
                    onChange={handleRemindeToggle}
                    checked={reminder.remind}
                    isSuccess
                  />
                </div>

                <div className="columns is-multiline m-b-5">
                  <div className="column is-6">
                    <div className="field">
                      <label>Choose Date *</label>
                      <Input
                        onChange={handleReminderDateChange}
                        type={"text"}
                        placeholder={"None"}
                        value={reminder.reminderDate}
                      />
                    </div>
                  </div>
                  <div className="column is-6">
                    <div className="field">
                      <label>Time *</label>
                      <Input
                        onChange={handleReminderTimeChange}
                        type={"text"}
                        placeholder={"None"}
                        value={reminder.reminderTime}
                      />
                    </div>
                  </div>
                </div>

                <div className="columns is-multiline m-b-5">
                  <div className="column is-12">
                    <div className="field">
                      <label>Notify *</label>
                      <SelectInput
                        options={leads}
                        placeholder={<p>Search or type lead</p>}
                        onChange={handleReminderNotificationTypeChange}
                        value={reminder.notificationType}
                      />
                    </div>
                  </div>
                </div>

                <div className="columns is-multiline m-b-5">
                  <div className="column is-12">
                    <div className="field">
                      <label>Repeat *</label>
                      <SelectInput
                        options={leads}
                        placeholder={<p>Search or type lead</p>}
                        onChange={handleReminderRepeatChange}
                        value={reminder.repeat}
                      />
                    </div>
                  </div>
                </div>
              </AdvancedCard>
            </div>
            <div className="m-t-20" />

            <div className="notes-card">
              <AdvancedCard
                type={"s-card"}
                footer
                footerContentLeft={"Show notes when creating new documents"}
                footerContentRight={
                  <Switch
                    onChange={handleShowNotesToggle}
                    checked={notes.showNotes}
                    isSuccess
                  />
                }
              >
                <h2 className="title is-5 is-bold">Notes</h2>
                <TextArea
                  rows={3}
                  placeholder="Enter notes here"
                  onChange={handleNotesChange}
                  value={notes.notesContent}
                />
              </AdvancedCard>
            </div>
          </div>
        </div>
      </div>
    </PageContent>
  );
};

export default TaskDetails;
