import React, { useEffect, useState } from "react";
import PageContent from "../../../shared/components/pageContent/PageContent";
import { AdvancedCard } from "../../../shared/components/cards/AdvancedCard";
import { Input } from "../../../shared/components/input/Input";
import { SelectInput } from "../../../shared/components/select/SelectInput";
import { TextArea } from "../../../shared/components/textArea/TextArea";
import { Switch } from "../../../shared/components/switch/Switch";
import { Button } from "../../../shared/components/button/Button";

const CrmCreateContact = () => {
  const [createCrmContactFormData, setCreateCrmContactFormData] = useState({
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
    setCreateCrmContactFormData({
      ...createCrmContactFormData,
      [key]: value,
    });
  };

  const handleFirstNameChange = (e) => {
    setCreateCrmContactFormData({
      ...createCrmContactFormData,
      firstName: e.target.value,
    });
  };

  const handleLastNameChange = (e) => {
    setCreateCrmContactFormData({
      ...createCrmContactFormData,
      lastName: e.target.value,
    });
  };
  const handleCompanyChange = (e) => {
    setCreateCrmContactFormData({
      ...createCrmContactFormData,
      company: e.target.value,
    });
  };
  const handleIndustryChange = (option) => {
    setCreateCrmContactFormData({
      ...createCrmContactFormData,
      industry: option.value,
    });
  };

  const handleLeadSourceChange = (option) => {
    setCreateCrmContactFormData({
      ...createCrmContactFormData,
      leadSource: option.value,
    });
  };

  const handleLeadStatusChange = (option) => {
    setCreateCrmContactFormData({
      ...createCrmContactFormData,
      leadStatus: option.value,
    });
  };
  const handleLeadOwnerChange = (e) => {
    setCreateCrmContactFormData({
      ...createCrmContactFormData,
      leadOwner: e.target.value,
    });
  };
  const handleDescriptionChange = (e) => {
    setCreateCrmContactFormData({
      ...createCrmContactFormData,
      description: e.target.value,
    });
  };
  const handleAddressChange = (e) => {
    setCreateCrmContactFormData({
      ...createCrmContactFormData,
      address: e.target.value,
    });
  };

  const handleStateChange = (e) => {
    setCreateCrmContactFormData({
      ...createCrmContactFormData,
      state: e.target.value,
    });
  };
  const handleCountryChange = (e) => {
    setCreateCrmContactFormData({
      ...createCrmContactFormData,
      country: e.target.value,
    });
  };
  const handleEmailChange = (e) => {
    setCreateCrmContactFormData({
      ...createCrmContactFormData,
      email: e.target.value,
    });
  };
  const handleWebsiteChange = (e) => {
    setCreateCrmContactFormData({
      ...createCrmContactFormData,
      website: e.target.value,
    });
  };

  const handleMobileNumberChange = (e) => {
    setCreateCrmContactFormData({
      ...createCrmContactFormData,
      mobileNumber: e.target.value,
    });
  };

  const handleTwitterIdChange = (e) => {
    setCreateCrmContactFormData({
      ...createCrmContactFormData,
      twitterId: e.target.value,
    });
  };

  const handleSkypeIdChange = (e) => {
    setCreateCrmContactFormData({
      ...createCrmContactFormData,
      skypeId: e.target.value,
    });
  };
  const handleNotesChange = (e) => {
    setCreateCrmContactFormData({
      ...createCrmContactFormData,
      notes: e.target.value,
    });
  };
  const handleShowNotesToggle = () => {
    setCreateCrmContactFormData({
      ...createCrmContactFormData,
      showNotes: !createCrmContactFormData.showNotes,
    });
  };

  const disableTopbarButton = () => {
    let isDisabled = false;
    if (!createCrmContactFormData.firstName) {
      isDisabled = true;
    }
    if (!createCrmContactFormData.lastName) {
      isDisabled = true;
    }
    setTopbarButton(isDisabled);
  };

  useEffect(() => {
    disableTopbarButton();
  }, [createCrmContactFormData]);

  return (
    <PageContent
      title={"Create Contact"}
      titleIsBreadCrumb
      breadCrumbData={["Home", "Crm", "Create Contact"]}
      titleActionContent={
        <Button onClick={() => alert("")} isSuccess isDisabled={topbarButton}>
          Save
        </Button>
      }
    >
      <div className="columns is-multiline">
        <div className="column is-7">
          <AdvancedCard type={"s-card"}>
            <h2 className="title is-5 is-bold">Contact Info</h2>
            <div className="columns is-multiline m-b-5">
              <div className="column is-6">
                <div className="field">
                  <label>First Name *</label>
                  <Input
                    onChange={handleFirstNameChange}
                    placeholder={"None"}
                    type={"text"}
                    value={createCrmContactFormData.firstName}
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
                    value={createCrmContactFormData.lastName}
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
                    value={createCrmContactFormData.company}
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
                    value={createCrmContactFormData.industry}
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
                    value={createCrmContactFormData.leadSource}
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
                    value={createCrmContactFormData.leadStatus}
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
                    value={createCrmContactFormData.leadOwner}
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
                    value={createCrmContactFormData.description}
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
                    value={createCrmContactFormData.address}
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
                    value={createCrmContactFormData.state}
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
                    value={createCrmContactFormData.country}
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
                    value={createCrmContactFormData.email}
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
                    value={createCrmContactFormData.website}
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
                    value={createCrmContactFormData.mobileNumber}
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
                    value={createCrmContactFormData.twitterId}
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
                    value={createCrmContactFormData.skypeId}
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
                checked={createCrmContactFormData.showNotes}
                isSuccess
              />
            }
          >
            <h2 className="title is-5 is-bold">Notes</h2>
            <TextArea
              rows={3}
              placeholder="Enter notes here"
              onChange={handleNotesChange}
              value={createCrmContactFormData.notes}
            />
          </AdvancedCard>
        </div>
      </div>
    </PageContent>
  );
};

export default CrmCreateContact;
