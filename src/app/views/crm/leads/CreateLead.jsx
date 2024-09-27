import React, { useEffect, useState } from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";
import { Button } from "../../../shared/components/button/Button";
import { AdvancedCard } from "../../../shared/components/cards/AdvancedCard";
import { Input } from "../../../shared/components/input/Input";
import { SelectInput } from "../../../shared/components/select/SelectInput";
import { Switch } from "../../../shared/components/switch/Switch";
import { TextArea } from "../../../shared/components/textArea/TextArea";

const CreateLead = () => {
  const [createLeadFormData, setCreateLeadFormData] = useState({
    // contactNumber:"",
    firstName: "",
    lastName: "",
    company: "",
    industry: "",
    leadSource: "",
    leadStatus: "",
    leadOwner: "",
    description: "",
    address: "",
    state: "",
    country: "",
    email: "",
    website: "",
    mobileNumber: "",
    twitterId: "",
    skypeId: "",
    notes: "",
    showNotes: false,
  });

  const [topbarButton, setTopbarButton] = useState(false);

  const onCrmContactFieldChange = (key, value) => {
    // newArticle[key] = value;
    setCreateLeadFormData({
      ...createLeadFormData,
      [key]: value,
    });
  };

  const handleFirstNameChange = (e) => {
    setCreateLeadFormData({
      ...createLeadFormData,
      firstName: e.target.value,
    });
  };

  const handleLastNameChange = (e) => {
    setCreateLeadFormData({
      ...createLeadFormData,
      lastName: e.target.value,
    });
  };
  const handleCompanyChange = (e) => {
    setCreateLeadFormData({
      ...createLeadFormData,
      company: e.target.value,
    });
  };
  const handleIndustryChange = (option) => {
    setCreateLeadFormData({
      ...createLeadFormData,
      industry: option.value,
    });
  };

  const handleLeadSourceChange = (option) => {
    setCreateLeadFormData({
      ...createLeadFormData,
      leadSource: option.value,
    });
  };

  const handleLeadStatusChange = (option) => {
    setCreateLeadFormData({
      ...createLeadFormData,
      leadStatus: option.value,
    });
  };
  const handleLeadOwnerChange = (e) => {
    setCreateLeadFormData({
      ...createLeadFormData,
      leadOwner: e.target.value,
    });
  };
  const handleDescriptionChange = (e) => {
    setCreateLeadFormData({
      ...createLeadFormData,
      description: e.target.value,
    });
  };
  const handleAddressChange = (e) => {
    setCreateLeadFormData({
      ...createLeadFormData,
      address: e.target.value,
    });
  };

  const handleStateChange = (e) => {
    setCreateLeadFormData({
      ...createLeadFormData,
      state: e.target.value,
    });
  };
  const handleCountryChange = (e) => {
    setCreateLeadFormData({
      ...createLeadFormData,
      country: e.target.value,
    });
  };
  const handleEmailChange = (e) => {
    setCreateLeadFormData({
      ...createLeadFormData,
      email: e.target.value,
    });
  };
  const handleWebsiteChange = (e) => {
    setCreateLeadFormData({
      ...createLeadFormData,
      website: e.target.value,
    });
  };

  const handleMobileNumberChange = (e) => {
    setCreateLeadFormData({
      ...createLeadFormData,
      mobileNumber: e.target.value,
    });
  };

  const handleTwitterIdChange = (e) => {
    setCreateLeadFormData({
      ...createLeadFormData,
      twitterId: e.target.value,
    });
  };

  const handleSkypeIdChange = (e) => {
    setCreateLeadFormData({
      ...createLeadFormData,
      skypeId: e.target.value,
    });
  };
  const handleNotesChange = (e) => {
    setCreateLeadFormData({
      ...createLeadFormData,
      notes: e.target.value,
    });
  };
  const handleShowNotesToggle = () => {
    setCreateLeadFormData({
      ...createLeadFormData,
      showNotes: !createLeadFormData.showNotes,
    });
  };

  const disableTopbarButton = () => {
    let isDisabled = false;
    if (!createLeadFormData.firstName) {
      isDisabled = true;
    }
    if (!createLeadFormData.lastName) {
      isDisabled = true;
    }
    setTopbarButton(isDisabled);
  };

  useEffect(() => {
    disableTopbarButton();
  }, [createLeadFormData]);

  return (
    <PageContent
      title={"Create Lead"}
      titleIsBreadCrumb
      breadCrumbData={["Home", "Crm", "Create Lead"]}
      titleActionContent={
        <Button onClick={() => alert("")} isSuccess isDisabled={topbarButton}>
          Save
        </Button>
      }
    >
      <div className="columns is-multiline">
        <div className="column is-7">
          <AdvancedCard type={"s-card"}>
            <h2 className="title is-5 is-bold">Lead Info</h2>
            <div className="columns is-multiline m-b-5">
              <div className="column is-6">
                <div className="field">
                  <label>First Name *</label>
                  <Input
                    onChange={handleFirstNameChange}
                    placeholder={"None"}
                    type={"text"}
                    value={createLeadFormData.firstName}
                  />
                </div>
              </div>
              <div className="column is-6">
                <div className="field">
                  <label>Last Name *</label>
                  <Input
                    onChange={handleLastNameChange}
                    type={"text"}
                    placeholder={"None"}
                    value={createLeadFormData.lastName}
                  />
                </div>
              </div>
            </div>

            <div className="columns is-multiline m-b-5">
              <div className="column is-6">
                <div className="field">
                  <label>Company</label>
                  <Input
                    onChange={handleCompanyChange}
                    type={"text"}
                    placeholder={"Enter company name"}
                    value={createLeadFormData.company}
                  />
                </div>
              </div>
              <div className="column is-6">
                <div className="field">
                  <label>Industry</label>
                  <SelectInput
                    options={[
                      { label: "Technology", value: "technology" },
                      { label: "Healthcare", value: "healthcare" },
                      { label: "Finance", value: "finance" },
                      { label: "Manufacturing", value: "manufacturing" },
                      { label: "Retail", value: "retail" },
                      { label: "Education", value: "education" },
                      { label: "Other", value: "other" },
                    ]}
                    placeholder={"None"}
                    onChange={handleIndustryChange}
                    value={createLeadFormData.industry}
                  />
                </div>
              </div>
            </div>

            <div className="columns is-multiline m-b-5">
              <div className="column is-6">
                <div className="field">
                  <label>Lead Source</label>
                  <SelectInput
                    options={[
                      { label: "Web Visitors", value: "webVisitors" },
                      { label: "Social Media", value: "socialMedia" },
                      { label: "Web Forms", value: "webForms" },
                      { label: "Import", value: "import" },
                      { label: "ChatBot", value: "chatBot" },
                      { label: "Manually Created", value: "manuallyCreated" },
                      { label: "Automations", value: "automations" },
                      { label: "Other", value: "other" },
                    ]}
                    placeholder={"None"}
                    onChange={handleLeadSourceChange}
                    value={createLeadFormData.leadSource}
                  />
                </div>
              </div>
              <div className="column is-6">
                <div className="field">
                  <label>Lead Status</label>
                  <SelectInput
                    options={[
                      { label: "New Lead", value: "newLead" },
                      { label: "Contacted", value: "contacted" },
                      { label: "Qualified", value: "qualified" },
                      { label: "Not Interested", value: "notInterested" },
                      { label: "Lost", value: "lost" },
                      { label: "Nurture", value: "nurture" },
                    ]}
                    placeholder={"None"}
                    onChange={handleLeadStatusChange}
                    value={createLeadFormData.leadStatus}
                  />
                </div>
              </div>
            </div>

            <div className="columns is-multiline m-b-5">
              <div className="column is-12">
                <div className="field">
                  <label>Lead Owner</label>
                  <Input
                    onChange={handleLeadOwnerChange}
                    type={"text"}
                    placeholder={"None"}
                    value={createLeadFormData.leadOwner}
                  />
                </div>
              </div>
            </div>

            <div className="columns is-multiline m-b-5">
              <div className="column is-12">
                <div className="field">
                  <label>Description</label>
                  <Input
                    onChange={handleDescriptionChange}
                    type={"text"}
                    placeholder={"None"}
                    value={createLeadFormData.description}
                  />
                </div>
              </div>
            </div>
          </AdvancedCard>

          <div className="m-t-20" />

          <AdvancedCard type={"s-card"}>
            <h2 className="title is-5 is-bold">Communication</h2>

            <div className="columns is-multiline m-b-5">
              <div className="column is-12">
                <div className="field">
                  <label>Address</label>
                  <Input
                    onChange={handleAddressChange}
                    type={"text"}
                    placeholder={"Enter company address"}
                    value={createLeadFormData.address}
                  />
                </div>
              </div>
            </div>
            <div className="m-t-15" />

            <div className="columns is-multiline m-b-5">
              <div className="column is-6">
                <div className="field">
                  <label>State</label>
                  <Input
                    onChange={handleStateChange}
                    placeholder={"Enter state"}
                    type={"text"}
                    value={createLeadFormData.state}
                  />
                </div>
              </div>
              <div className="column is-6">
                <div className="field">
                  <label>Country</label>
                  <Input
                    onChange={handleCountryChange}
                    placeholder={"Enter country"}
                    type={"text"}
                    value={createLeadFormData.country}
                  />
                </div>
              </div>
            </div>

            <div className="columns is-multiline m-b-5">
              <div className="column is-6">
                <div className="field">
                  <label>Email</label>
                  <Input
                    onChange={handleEmailChange}
                    placeholder={"Enter email address"}
                    type={"text"}
                    value={createLeadFormData.email}
                  />
                </div>
              </div>
              <div className="column is-6">
                <div className="field">
                  <label>Website</label>
                  <Input
                    onChange={handleWebsiteChange}
                    placeholder={"Enter website url"}
                    type={"text"}
                    value={createLeadFormData.website}
                  />
                </div>
              </div>
            </div>
            <div className="columns is-multiline m-b-5">
              <div className="column is-6">
                <div className="field">
                  <label>Mobile Number</label>
                  <Input
                    onChange={handleMobileNumberChange}
                    placeholder={"00000 00000"}
                    type={"text"}
                    value={createLeadFormData.mobileNumber}
                  />
                </div>
              </div>
              <div className="column is-6">
                <div className="field">
                  <label>Twitter ID</label>
                  <Input
                    onChange={handleTwitterIdChange}
                    placeholder={"Enter Twitter ID"}
                    type={"text"}
                    value={createLeadFormData.twitterId}
                  />
                </div>
              </div>
            </div>
            <div className="columns is-multiline m-b-5">
              <div className="column is-6">
                <div className="field">
                  <label>Skype Id</label>
                  <Input
                    onChange={handleSkypeIdChange}
                    type={"text"}
                    placeholder={"Enter Skype Id"}
                    value={createLeadFormData.skypeId}
                  />
                </div>
              </div>
            </div>
          </AdvancedCard>
        </div>

        {/* Notes section */}
        <div className="column is-5">
          <AdvancedCard
            type={"s-card"}
            footer
            footerContentLeft={"Show notes when creating new documents"}
            footerContentRight={
              <Switch
                onChange={handleShowNotesToggle}
                checked={createLeadFormData.showNotes}
                isSuccess
              />
            }
          >
            <h2 className="title is-5 is-bold">Notes</h2>
            <TextArea
              rows={3}
              placeholder="Enter notes here"
              onChange={handleNotesChange}
              value={createLeadFormData.notes}
            />
          </AdvancedCard>
        </div>
      </div>
    </PageContent>
  );
};

export default CreateLead;
