import React, { useState, useEffect } from 'react';
import Modal from '../../shared/components/modal/Modal';
import { Input } from '../../shared/components/input/Input';
import { SelectInput } from '../../shared/components/select/SelectInput';
import { InputAddons } from '../../shared/components/inputAddons/InputAddons';

const AddContactPersonModal = ({ setCompanyInfo, companyInfo, isActive = false, setIsActive, }) => {
  const [newContactPerson, setNewContactPerson] = useState({
    firstName: "",
    job: "",
    email: "",
    mobile: ""
  });

  const position = [{ value: "Head Of Department", label: "Head Of Department" },
  { value: "managing director", label: "Managing Director" }, { value: "owner", label: "Owner" }, { value: "ceo", label: "CEO" }, { value: "cfo", label: "CFO" }, { value: "cto", label: "CTO" }, { value: "others", label: "Others" }]
 
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewContactPerson((prevContactPerson) => ({
      ...prevContactPerson,
      [name]: value
    }));
  };
  const handlePositionChange = (options) => {
    setNewContactPerson((prevContactPerson) => ({
      ...prevContactPerson,
      job: options.value
    }));
  };

  const handleMobileChange = (e) => {
    const inputValue = e.target.value;
    const mobile = inputValue.slice(0, 10); // Extract the first 10 digits

    if (mobile.length === 10) {
      e.target.blur(); 
    }

    setNewContactPerson({ ...newContactPerson, mobile: mobile });
  };

  const handleSaveContactPerson = (event) => {
    event.preventDefault();

    let updatedContactPersons = [];

    if (Array.isArray(companyInfo.contactPersons)) {
      updatedContactPersons = [...companyInfo.contactPersons];
    } else {
      console.error("companyInfo.contactPersons is not an array. Initializing as an empty array.");
    }

    const updatedCompanyInfo = {
      ...companyInfo,
      contactPersons: [...updatedContactPersons, newContactPerson]
    };

    setCompanyInfo(updatedCompanyInfo);
    setIsActive(false);
  };

  return (
    <Modal
      title="Add Contact"
      submitBtnName="Save"
      isActive={isActive}
      setIsAcive={setIsActive}
      onSubmit={handleSaveContactPerson}
   
    >
      <form onSubmit={handleSaveContactPerson}>

        <div className="columns is-multiline m-b-5">
          <div className="column is-6">
            <div className="field">
              <label>Contact Name *</label>
              <Input
                type="text"
                name="firstName"
                placeholder="Enter Name"
                value={newContactPerson.firstName}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="column is-6">
            <div className="field">
              <label>Email *</label>
              <Input
                type="email"
                name="email"
                placeholder=" Enter email address"
                value={newContactPerson.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className="columns is-multiline m-b-5">
          <div className="column is-6">
            <div className="field">
              <label>Mobile Number</label>
              <InputAddons
                type="number"
                name="mobile"
                // left={"+91"}
                placeholder="Enter mobile number"
                value={newContactPerson.mobile}
                onChange={handleMobileChange}
              />
            </div>
          </div>
          <div className="column is-6">
            <div className="field">
              <label>Position</label>
              <SelectInput
                options={position}
                value={newContactPerson.job}
                onChange={handlePositionChange}
              />
            </div>
          </div>
        </div>
      </form>
    </Modal >
  );
};

export default AddContactPersonModal;
