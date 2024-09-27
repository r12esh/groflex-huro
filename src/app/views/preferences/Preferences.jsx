import React, { useState } from "react";
import { Input } from "../../shared/components/input/Input";
import { Button } from "../../shared/components/button/Button";
import { TextArea } from "../../shared/components/textArea/TextArea";
import { AdvancedCard } from "../../shared/components/cards/AdvancedCard";
import { Switch } from "../../shared/components/switch/Switch";
import PageContent from "../../shared/components/pageContent/PageContent";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import groflexService from "../../services/groflex.service";
import config from "../../../../config";
import { FeatherIcon } from "../../shared/featherIcon/FeatherIcon";
import FontAwesomeIcon from "../../shared/fontAwesomeIcon/FontAwesomeIcon";

const isEmail = (email) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

function Preferences() {
  const tenantData = useSelector((state) => state.accountData.tenantData);
  const accountInfo = useSelector((state) => state.accountData.accountInfoData);

  const [changePasswordData, setChangePasswordData] = useState({
    registerEmail: "",
    currentPassword: "",
    newPassword: "",
    changePasswordBtn: false,
  });

  const [changePasswordError, setChangePasswordError] = useState({
    registerEmailErrorText: "",
    currentPasswordErrorText: "",
  });

  const [newPasswordChecker, setNewPasswordChecker] = useState({
    length: false,
    capitalLetter: false,
    containSymbol: false,
  });

  const [emailPreference, setEmailPreference] = useState({
    senderEmail: accountInfo?.senderEmail,
    senderEmailName: accountInfo?.senderEmailName,
  });

  const [emailPreferenceErrorText, setEmailPreferenceErrortext] = useState({
    senderEmailErrorText: "",
    senderNameErrortext: "",
  });

  const handleRegisterEmailChange = (e) => {
    let email = e.target.value;
    if (isEmail(email) && email === tenantData?.email) {
      setChangePasswordData({ ...changePasswordData, registerEmail: email });
      setChangePasswordError({
        ...changePasswordError,
        registerEmailErrorText: "",
      });
      return;
    }
    setChangePasswordError({
      ...changePasswordError,
      registerEmailErrorText: "Invalid Email ID",
    });
    setChangePasswordData({ ...changePasswordData, registerEmail: "" });
  };

  const handleNewPasswordChange = (e) => {};

  const handleEmailPreferenceEmail = (e) => {
    const email = e.target.value;

    if (isEmail(email)) {
      setEmailPreference({ ...emailPreference, senderEmail: email });
      setEmailPreferenceErrortext({
        ...emailPreferenceErrorText,
        senderEmailErrorText: "",
      });
      return;
    }

    setEmailPreference({ ...emailPreference, senderEmail: email });
    setEmailPreferenceErrortext({
      ...emailPreferenceErrorText,
      senderEmailErrorText: "Invalid Email ID",
    });
  };
  const handleEmailPreferenceName = (e) => {
    const name = e.target.value.replace(/[^a-z]/gi, "");

    setEmailPreference({ ...emailPreference, senderEmailName: name });
    setEmailPreferenceErrortext({
      ...emailPreferenceErrorText,
      senderNameErrortext: "",
    });

    //check for empty field
    if (!name) {
      setEmailPreference({ ...emailPreference, senderEmailName: "" });
      setEmailPreferenceErrortext({
        ...emailPreferenceErrorText,
        senderNameErrortext: "This should not be empty",
      });
      return;
    }
  };

  const handlePreferenceEmailBtn = () => {
    groflexService.request(config.resourceUrls.accountSettings, {
      auth: true,
      method: "Post",
      data: {
        senderEmail: emailPreference.senderEmail,
        senderEmailName: emailPreference.senderEmailName,
      },
    });
  };

  return (
    <PageContent
      loading={!tenantData}
      title="Preferences"
      breadCrumbData={["Home", "Account Settings", "Account details"]}
    >
      <div className="page-content-inner">
        <div className="tabs-wrapper">
          <div className="tabs-inner">
            <div className="tabs">
              <ul>
                <li data-tab="account-details-tab">
                  <Link to="/account-settings">Account Details</Link>
                </li>
                <li data-tab="preferences-tab" className="is-active">
                  <Link to="/preferences">Preferences</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="tabs-wrapper m-t-5">
            <div id="account-preference-tab" className="tab-content is-active">
              <div className="columns is-multiline">
                <div className="column is-7">
                  {/* <form> */}
                  <AdvancedCard
                    type={"s-card"}
                    footer
                    footerContentRight={<Button isSuccess>Save</Button>}
                  >
                    <h2 className="title is-5 is-bold">Change Password</h2>
                    <>
                      <div className="columns is-multiline m-b-5">
                        <div className="column is-6">
                          <div className="field">
                            <label>Registered E-mail Address *</label>
                            <Input
                              placeholder={"Enter email"}
                              type={"email"}
                              name={"email"}
                              value={tenantData?.email}
                              onChange={handleRegisterEmailChange}
                              hasError={
                                changePasswordError.registerEmailErrorText
                              }
                              helpText={
                                changePasswordError.registerEmailErrorText
                              }
                            />
                          </div>
                        </div>

                        <div className="column is-6">
                          <div className="field">
                            <label>Current Password *</label>
                            <Input
                              type={"password"}
                              placeholder={"Enter Password"}
                              name={"password"}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="columns is-multiline m-b-10">
                        <div className="column is-12">
                          <div className="field">
                            <label>New password *</label>
                            <div className="control">
                              <Input
                                type="password"
                                className="input"
                                name="password"
                                placeholder="Enter Password"
                                onChange={handleNewPasswordChange}
                                maxLength={8}
                                required
                              />
                            </div>
                            <label>
                              Your password must have
                              <FontAwesomeIcon name={"check-circle"} />8 letters
                              <FontAwesomeIcon name={"check-circle"} />1 capital
                              letter <FontAwesomeIcon name={"check-circle"} />1
                              number/symbol
                            </label>
                          </div>
                        </div>
                      </div>
                    </>
                  </AdvancedCard>
                  {/* </form> */}
                  <div className="m-t-15" />
                  {/* <form className="m-t-20"> */}
                  <AdvancedCard
                    type={"s-card"}
                    footer
                    footerContentRight={<Button isSuccess>Delete</Button>}
                  >
                    <h3 className="title is-5 is-bold">Delete Account</h3>
                    <p className="title is-6 is-narrow is-thin m-1 m-b-2">
                      If you delete your groflex account all your data will be
                      lost,
                    </p>
                    <>
                      <div className="columns is-multiline m-b-5">
                        <div className="column is-6">
                          <div className="field">
                            <label>Registered E-mail Address *</label>
                            <Input
                              placeholder={"Enter email"}
                              type={"email"}
                              name={"email"}
                            />
                          </div>
                        </div>

                        <div className="column is-6">
                          <div className="field">
                            <label>Your Password *</label>
                            <Input
                              type={"password"}
                              placeholder={"Enter Password"}
                              name={"password"}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="columns is-multiline">
                        <div className="column is-12">
                          <div className="field">
                            <label>Reason</label>
                            <div className="control">
                              <TextArea
                                rows={3}
                                placeholder={
                                  "Enter reason to delete account (Your feedback will help us make groflex even better)"
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="columns is-multiline m-b-10">
                        <div className="column is-12">
                          <p className="title is-6 is-thin">
                            <i className="fa-sharp fa-regular fa-circle-exclamation"></i>{" "}
                            Please confirm "Delete Account" by clicking
                            confirmation link sent to your email address.
                          </p>
                        </div>
                      </div>
                    </>
                  </AdvancedCard>
                  {/* </form> */}
                </div>
                <div className="column is-5">
                  <AdvancedCard type={"s-card"}>
                    <div className="columns is-multiline">
                      <div className="column is-8">
                        <h3 className="title is-5 is-bold">
                          Your Notifications
                        </h3>
                        <p>Receive your notifications</p>
                      </div>
                      <div className="column is-4 m-t-35">
                        <Switch isSuccess></Switch>
                      </div>
                    </div>
                  </AdvancedCard>
                  <div className="m-t-15" />
                  {/* <form> */}
                  <AdvancedCard
                    type={"s-card"}
                    footer
                    footerContentRight={
                      <Button onClick={handlePreferenceEmailBtn} isSuccess>
                        Save
                      </Button>
                    }
                  >
                    <h3 className="title is-5 is-bold">
                      Send Email Preferences
                    </h3>
                    <p className="title is-6 is-thin">
                      Your customer emails will be sent under this name and
                      email address
                    </p>
                    <div className="columns is-multiline">
                      <div className="column is-8">
                        <div className="field">
                          <label>
                            Sender Name{" "}
                            <span
                              className="is-rounded  hint--light hint--rounded hint--right"
                              data-hint="This will be your default sender name for all in-platform communications"
                            >
                              <i className="fa-regular fa-circle-question"></i>
                            </span>
                          </label>

                          <div className="control">
                            <Input
                              className="input"
                              placeholder="username@gmail.com"
                              value={
                                emailPreference.senderEmailName
                                  ? emailPreference.senderEmailName
                                  : ""
                              }
                              onChange={handleEmailPreferenceName}
                              hasError={
                                emailPreferenceErrorText.senderNameErrortext
                              }
                              helpText={
                                emailPreferenceErrorText.senderNameErrortext
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="column is-8 m-b-10">
                        <div className="field">
                          <label>
                            Recipient Email Address{" "}
                            <span
                              className="is-rounded  hint--light hint--rounded hint--right"
                              data-hint="Recipient email address is your default email address for all in-platform communications"
                            >
                              <i className="fa-regular fa-circle-question"></i>
                            </span>
                          </label>
                          <div className="control">
                            <Input
                              className="input"
                              placeholder="groflex@gmail.com"
                              value={
                                emailPreference.senderEmail
                                  ? emailPreference.senderEmail
                                  : ""
                              }
                              onChange={handleEmailPreferenceEmail}
                              hasError={
                                emailPreferenceErrorText.senderEmailErrorText
                              }
                              helpText={
                                emailPreferenceErrorText.senderEmailErrorText
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </AdvancedCard>
                  {/* </form> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContent>
  );
}

export default Preferences;
