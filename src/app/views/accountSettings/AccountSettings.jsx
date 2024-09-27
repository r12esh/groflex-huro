import React, { useEffect, useState } from "react";
import { Button } from "../../shared/components/button/Button";
import { AdvancedCard } from "../../shared/components/cards/AdvancedCard";
import { FileInput } from "../../shared/components/fileInput/FileInput";
import { Input } from "../../shared/components/input/Input";
import { InputAddons } from "../../shared/components/inputAddons/InputAddons";
import { SelectInput } from "../../shared/components/select/SelectInput";
import { TextArea } from "../../shared/components/textArea/TextArea";
import ApexChart from "../../shared/components/apexChart/ApexChart";
import PageContent from "../../shared/components/pageContent/PageContent";
import { Link } from "react-router-dom";
import { FeatherIcon } from "../../shared/featherIcon/FeatherIcon";
import ChangeEmailModal from "./ChangeEmailModal";
import ChangePhoneNoModal from "./ChangePhoneNoModal";
import groflexService from "../../services/groflex.service";
import config from "../../../../config";
import { getCountries } from "../../helpers/getCountries";
import { useSelector } from "react-redux";

const countriesOptions = getCountries().map((country) => ({
  label: country.label,
  value: country.iso2,
}));

const isEmail = (email) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

const AccountSettings = () => {
  const tenantData = useSelector((state) => state.accountData.tenantData);
  const userData = useSelector((state) => state.accountData.userData);
  const [changeEmailModalActive, setChangeEmailModalActive] = useState(false);
  const [changePhoneNoModalActive, setChangePhoneNoModalActive] =
    useState(false);
  const [sizeLimit, setSizeLimit] = useState(true);
  const [logoUploadErrorMsg, setLogoUploadErrorMsg] = useState("");
  const [stateOptions, setStateOptions] = useState([]);

  //states to store/update data in profile section
  const [profileInfo, setProfileInfo] = useState({
    registerEmail: "",
    newEmail: "",
    currentPassword: "",
    phoneNo: "",
    firstName: "",
    lastName: "",
  });

  //states to store/update data in company section
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "",
    companyPhoneNo: "",
    logoPath: null,
    companyAddress: "",
    country: "",
    state: "",
    companyEmail: "asfv",
    gstType: "",
    gstNo: null,
    cin: null,
  });

  useEffect(() => {
    groflexService
      .request(`${config.resourceHost}india/states`, { auth: true })
      .then((res) => {
        // console.log(res.data);
        const newStateOptions = res.body.data.map((state) => ({
          label: state.stateName,
          value: state.id,
        }));
        setStateOptions([...newStateOptions]);
      });
  }, []);

  useEffect(() => {
    if (tenantData && stateOptions.length > 0 && userData) {
      // console.log(userData);
      setProfileInfo({
        registerEmail: userData.email,
        newEmail: "",
        currentPassword: "",
        phoneNo: tenantData.mobile,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });
      setCompanyInfo({
        companyName: tenantData.companyAddress.companyName,
        companyPhoneNo: tenantData.mobile,
        logoPath: tenantData.logoPath,
        companyAddress: tenantData.companyAddress.street,
        country:
          tenantData.companyAddress.country === "Indien"
            ? "IN"
            : tenantData.companyAddress.country,
        state: stateOptions.find((indianState) => {
          // console.log(indianState.value, tenantData.indiaStateId);
          return indianState.value === tenantData.indiaStateId;
        }).value,
        companyEmail: "rgupta@groflex.io",
        gstType: tenantData.companyAddress.gstType,
        gstNo: tenantData.companyAddress.gstNumber,
        cin: tenantData.companyAddress.cinNumber,
      });
    }
  }, [tenantData, stateOptions, userData]);

  //states for error handling in profile section
  const [profileError, setProfileError] = useState({
    firstNameError: "",
    lastNameError: "",
    phoneNoError: "",
    profileEmailError: "",
  });

  //states for error handling in company section
  const [companyError, setCompanyError] = useState({
    companyNameError: "",
    companyPhoneNoError: "",
    companyEmailError: "",
    cinError: "",
    gstError: "",
  });

  //error handling for profile section

  const handleProfileFirstnameChange = (e) => {
    const firstName = e.target.value.replace(/[^a-z]/gi, "");

    setProfileInfo({ ...profileInfo, firstName: firstName });
    setProfileError({
      ...profileError,
      firstNameError: "",
    });

    //check for empty field
    if (!firstName) {
      setProfileInfo({ ...profileInfo, firstName: "" });
      setProfileError({
        ...profileError,
        firstNameError: "This should not be empty",
      });
      return;
    }
  };

  //error handling for profile section last name
  const handleProfileLastnameChange = (e) => {
    const lastName = e.target.value.replace(/[^a-zA-Z]/gi, "");
    setProfileInfo({ ...profileInfo, lastName: lastName });
    setProfileError({ ...profileError, lastNameError: "" });

    //check for empty field
    if (!lastName) {
      setProfileInfo({ ...profileInfo, lastName: "" });
      setProfileError({
        ...profileError,
        lastNameError: "This should not be empty",
      });
      return;
    }
  };

  const profileSaveBtn = () => {
    groflexService
      .request(config.resourceUrls.changeProfileName, {
        auth: true,
        method: "PUT",
        data: {
          firstName: profileInfo.firstName,
          lastName: profileInfo.lastName,
        },
      })
      .then((res) => console.log(res));
  };

  //error handling for company section

  const handleCompanyNameChange = (e) => {
    const companyName = e.target.value.replace(/[^a-z]/gi, "");
    setCompanyError({ ...companyError, companyNameError: "" });
    setCompanyInfo({ ...companyInfo, companyName: companyName });

    //check for empty field
    if (!companyName) {
      setCompanyInfo({ ...companyInfo, companyName: "" });
      setCompanyError({
        ...companyError,
        companyNameError: "This should not be empty",
      });

      return;
    }
  };

  const handleCompanyLogoChange = (e) => {
    if (e.target.files[0].size > 2000000) {
      setLogoUploadErrorMsg("File size exceeding 2 MB!");
      return;
    }

    setCompanyInfo({ ...companyInfo, logoPath: e.target.files[0] });
  };
  const handleCompanyPhoneNoChange = (e) => {
    const companyPhoneNumber = parseInt(e.target.value);

    // Handle more than 10 digit warning
    if (companyPhoneNumber.toString().length > 10) {
      return;
    }

    // Handle equal to 10 digit warning
    if (companyPhoneNumber.toString().length === 10) {
      setCompanyInfo({ ...companyInfo, companyPhoneNo: companyPhoneNumber });
      setCompanyError({ ...companyError, companyPhoneNoError: "" });
      return;
    }

    // Check for empty field
    if (!companyPhoneNumber) {
      setCompanyInfo({ ...companyInfo, companyPhoneNo: null });
      setCompanyError({
        ...companyError,
        companyPhoneNoError: "Phone number should be 10 digits",
      });
      return;
    }

    // Handle less than 10 digit warning
    if (companyPhoneNumber.toString().length < 10) {
      setCompanyInfo({ ...companyInfo, companyPhoneNo: companyPhoneNumber });
      setCompanyError({
        ...companyError,
        companyPhoneNoError: "Phone number should be 10 digits",
      });
      return;
    }
  };

  //check email id error handling in company section
  const handleCompanyEmailChange = (e) => {
    const companyEmail = e.target.value;
    if (isEmail(companyEmail)) {
      setCompanyInfo({ ...companyInfo, companyEmail: companyEmail });
      setCompanyError({ ...companyError, companyEmailError: "" });
      return;
    }
    setCompanyInfo({ ...companyInfo, companyEmail: "" });
    setCompanyError({ ...companyError, companyEmailError: "Invalid Email ID" });
  };

  //cin number error handling
  const handleCinNumberChange = (e) => {
    const cinNumber = e.target.value;

    // Handle more than 21 digit warning
    if (cinNumber.length > 21) {
      return;
    }

    // Handle equal to 21 digit warning
    if (cinNumber.length === 21) {
      setCompanyInfo({ ...companyInfo, cin: cinNumber });
      setCompanyError({ ...companyError, cinError: "" });
      return;
    }

    // Check for empty field
    if (!cinNumber) {
      setCompanyInfo({ ...companyInfo, cin: null });
      setCompanyError({
        ...companyError,
        cinError: "CIN  number should be of 21 digits",
      });
      return;
    }

    // Handle less than 21 digit warning
    if (cinNumber.length < 21) {
      setCompanyInfo({ ...companyInfo, cin: cinNumber });
      setCompanyError({
        ...companyError,
        cinError: "CIN  number should be of 21 digits",
      });
      return;
    }
  };

  const handleGstNumberChange = (e) => {
    const gstNumber = e.target.value;

    // Handle more than 15 digit warning
    if (gstNumber.length > 15) {
      return;
    }

    // Handle equal to 15 digit warning
    if (gstNumber.length === 15) {
      setCompanyInfo({ ...companyInfo, gstNo: gstNumber });
      setCompanyError({ ...companyError, gstError: "" });
      return;
    }

    // Check for empty field
    if (!gstNumber) {
      setCompanyInfo({ ...companyInfo, gstNo: null });
      setCompanyError({
        ...companyError,
        gstError: "GST  number should be of 15 digits",
      });
      return;
    }

    // Handle less than 15 digit warning
    if (gstNumber.length < 15) {
      setCompanyInfo({ ...companyInfo, gstNo: gstNumber });
      setCompanyError({
        ...companyError,
        gstError: "GST  number should be of 15 digits",
      });
      return;
    }
  };

  const handleStateChange = (options) => {
    // console.log(options.label);
    setCompanyInfo({ ...companyInfo, state: options.value });
  };

  const handleCountryChange = (option) => {
    setCompanyInfo({ ...companyInfo, country: option.value });
  };

  const handleCompanySaveBtn = () => {
    // console.log(companyInfo);
    groflexService.request(config.resourceUrls.accountSettings, {
      auth: true,
      method: "POST",
      data: {
        businessCategory: null,
        businessTurnover: null,
        businessType: null,
        companyAddress: {
          cinNumber: companyInfo.cin,
          city: "",
          countryIso: companyInfo.country,
          firstName: "hello",
          lastName: "world",
          gstNumber: companyInfo.gstNo,
          companyName: companyInfo.companyName,
          // country: companyInfo.country,
          street: "rgupta lane no 0",
          zipCode: "",

          // gstType: companyInfo.gstType,
        },
        indiaStateId: companyInfo.state,
        mobile: companyInfo.companyPhoneNo,
      },
    });
    // console.log(tenantData?.logoPath);
  };

  //change number modal mobile number verification

  const handleMobileChangeNumber = (e) => {
    const phoneNumber = parseInt(e.target.value);

    // Handle more than 10 digit warning
    if (phoneNumber.toString().length > 10) {
      return;
    }

    // Handle equal to 10 digit warning
    if (phoneNumber.toString().length === 10) {
      setProfileInfo({ ...profileInfo, phoneNo: phoneNumber });
      setProfileError({ ...profileError, phoneNoError: "" });
      return;
    }

    // Check for empty field
    if (!phoneNumber) {
      setProfileInfo({ ...profileInfo, phoneNo: null });
      setProfileError({
        ...profileError,
        phoneNoError: "This should not be empty",
      });
      return;
    }

    // Handle less than 10 digit warning
    if (phoneNumber.toString().length < 10) {
      setProfileInfo({ ...profileInfo, phoneNo: phoneNumber });
      setProfileError({
        ...profileError,
        phoneNoError: "Phone number should be 10 digits",
      });
      return;
    }
  };

  // console.log(companyInfo, profileInfo);
  // console.log(companyInfo.state);
  return (
    <PageContent
      loading={!stateOptions.length}
      title={"Account Details"}
      breadCrumbData={["Home", "Account Settings", "Account details"]}
    >
      <ChangeEmailModal
        setProfileInfo={setProfileInfo}
        profileInfo={profileInfo}
        isActive={changeEmailModalActive}
        setIsActive={setChangeEmailModalActive}
      />
      <ChangePhoneNoModal
        isActive={changePhoneNoModalActive}
        setIsActive={setChangePhoneNoModalActive}
        value={profileInfo.phoneNo}
        onChange={handleMobileChangeNumber}
        errorMessage={profileError.phoneNoError}
      />
      <div className="page-content-inner">
        <div className="tabs-wrapper">
          <div className="tabs-inner">
            <div className="tabs">
              <ul>
                <li data-tab="account-details-tab" className="is-active">
                  <Link to="/account-settings">Account Details</Link>
                </li>
                <li data-tab="projects-tab">
                  <Link to="/preferences">Preferences</Link>
                </li>
              </ul>
            </div>
          </div>

          <div id="account-details-tab" className="tab-content is-active">
            <div className="columns is-multiline">
              <div className="column is-7">
                {/* PROFILE INFO */}
                <AdvancedCard
                  type={"s-card"}
                  footer
                  footerContentRight={
                    <Button onClick={profileSaveBtn} isSuccess>
                      Save
                    </Button>
                  }
                >
                  <h2 className="title is-5 is-bold">Profile Info</h2>

                  <>
                    <div className="columns is-multiline m-b-5">
                      <div className="column is-6">
                        <div className="field">
                          <label>Registered E-mail Address</label>
                          <InputAddons
                            value={profileInfo.registerEmail}
                            type="email"
                            disabled
                            placeholder={"Enter Details"}
                            right={<FeatherIcon primaryColor name="Edit" />}
                            onRightAdornmentClick={() => {
                              setChangeEmailModalActive(true);
                            }}
                          />
                        </div>
                      </div>

                      <div className="column is-6">
                        <div className="field ">
                          <label>Phone Number</label>
                          <InputAddons
                            left={"+91"}
                            right={<FeatherIcon primaryColor name="Edit" />}
                            type="number"
                            disabled
                            value={profileInfo.phoneNo}
                            placeholder={"Enter Details"}
                            // value={
                            //   profileInfo.phoneNo ? profileInfo.phoneNo : ""
                            // }
                            // onChange={handleProfilePhoneChange}
                            onRightAdornmentClick={() => {
                              setChangePhoneNoModalActive(true);
                            }}
                            hasError={profileError.phoneNoError}
                            helpText={profileError.phoneNoError}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="columns is-multiline">
                      <div className="column is-6">
                        <div className="field">
                          <label>First Name</label>
                          <Input
                            placeholder={"Enter Detials"}
                            value={
                              profileInfo.firstName ? profileInfo.firstName : ""
                            }
                            onChange={handleProfileFirstnameChange}
                            helpText={profileError.firstNameError}
                            hasError={profileError.firstNameError}
                          />
                        </div>
                      </div>

                      <div className="column is-6">
                        <div className="field">
                          <label>Last Name</label>
                          <Input
                            placeholder={"Enter Detials"}
                            value={
                              profileInfo.lastName ? profileInfo.lastName : ""
                            }
                            onChange={handleProfileLastnameChange}
                            hasError={profileError.lastNameError}
                            helpText={profileError.lastNameError}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                </AdvancedCard>

                <div className="m-t-20" />

                {/* COMPANY INFO */}
                <AdvancedCard
                  type={"s-card"}
                  footer
                  footerContentRight={
                    <Button onClick={handleCompanySaveBtn} isSuccess>
                      Save
                    </Button>
                  }
                >
                  <h2 className="title is-5  is-bold">Company Info</h2>
                  <p className="subtitle is-6">
                    This details will appear in your invoices and expenses
                  </p>

                  <>
                    <div className="columns is-multiline m-b-5">
                      <div className="column is-6">
                        <div className="field">
                          <label>Company Name *</label>
                          <Input
                            placeholder="Enter Details"
                            onChange={handleCompanyNameChange}
                            value={
                              companyInfo.companyName
                                ? companyInfo.companyName
                                : ""
                            }
                            hasError={companyError.companyNameError}
                            helpText={companyError.companyNameError}
                          />
                        </div>
                      </div>

                      <div className="column is-6">
                        <div className="field">
                          <label>Phone Number</label>
                          <InputAddons
                            left={"+91"}
                            type="number"
                            onChange={handleCompanyPhoneNoChange}
                            value={
                              companyInfo.companyPhoneNo
                                ? companyInfo.companyPhoneNo
                                : ""
                            }
                            placeholder={"Enter Details"}
                            hasError={companyError.companyPhoneNoError}
                            helpText={companyError.companyPhoneNoError}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="columns is-multiline m-b-5">
                      <div className="column is-6">
                        <div className="field">
                          <label>Company Logo</label>
                          {companyInfo.logoPath ? (
                            <div>
                              <img
                                alt="Not found"
                                style={{
                                  width: "290px",
                                  height: "82px",
                                  objectFit: "contain",
                                }}
                                src={URL.createObjectURL(companyInfo.logoPath)}
                              />
                              <br />
                              <a
                                className="button h-button"
                                onClick={() =>
                                  setCompanyInfo({
                                    ...companyInfo,
                                    logoPath: null,
                                  })
                                }
                              >
                                Change Logo
                              </a>
                            </div>
                          ) : (
                            <FileInput
                              errorMessage={logoUploadErrorMsg}
                              onChange={handleCompanyLogoChange}
                              label={"Upload logo"}
                              description={
                                "(Upload jpeg/png image upto 2 MB size)"
                              }
                            />
                          )}
                        </div>
                      </div>

                      <div className="column is-6">
                        <div className="field">
                          <label>Address</label>
                          <TextArea
                            rows={3}
                            placeholder="Enter Details"
                            onChange={(e) =>
                              setCompanyInfo({
                                ...companyInfo,
                                companyAddress: e.target.value,
                              })
                            }
                            value={
                              companyInfo.companyAddress
                                ? companyInfo.companyAddress
                                : ""
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="columns is-multiline m-b-5">
                      <div className="column is-6">
                        <div className="field">
                          <label>Country *</label>
                          <SelectInput
                            defaultValue={companyInfo.country}
                            options={countriesOptions}
                            onChange={handleCountryChange}
                            value={companyInfo.country}
                          />
                        </div>
                      </div>

                      {companyInfo.country === "IN" ? (
                        <div className="column is-6">
                          <div className="field">
                            <label>State *</label>
                            <SelectInput
                              defaultValue={companyInfo.state}
                              options={stateOptions}
                              onChange={handleStateChange}
                              value={companyInfo.state}
                            />
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="columns is-multiline m-b-5">
                      <div className="column is-6">
                        <div className="field">
                          <label>E-mail Address</label>
                          <Input
                            placeholder={"Enter Detials"}
                            type="email"
                            onChange={handleCompanyEmailChange}
                            hasError={companyError.companyEmailError}
                            helpText={companyError.companyEmailError}
                          />
                        </div>
                      </div>
                      <div className="column is-6">
                        <div className="field">
                          <label>CIN</label>
                          <Input
                            type="text"
                            placeholder={"E.g.,U 31909 WB 2020 PTC 247113"}
                            onChange={handleCinNumberChange}
                            value={companyInfo.cin ? companyInfo.cin : ""}
                            hasError={companyError.cinError}
                            helpText={companyError.cinError}
                          />
                        </div>
                      </div>

                      <div className="column is-6">
                        <div className="field">
                          <label>GST Type *</label>
                          <SelectInput
                            options={[
                              { label: "Registered", value: "registered" },
                              { label: "Unregistered", value: "unregistered" },
                              {
                                label: "SEZ - Special Economic Zone",
                                value: "sez",
                              },
                              {
                                label: "Deemed Export",
                                value: "deemedExport",
                              },
                              {
                                label: "Overseas",
                                value: "overseas",
                              },
                            ]}
                            onChange={(option) =>
                              setCompanyInfo({
                                ...companyInfo,
                                gstType: option.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="column is-6">
                        <div className="field">
                          <label>GST</label>
                          <Input
                            placeholder={"E.g.,07AAAA0000AZ6"}
                            type="text"
                            onChange={handleGstNumberChange}
                            value={companyInfo.gstNo ? companyInfo.gstNo : ""}
                            hasError={companyError.gstError}
                            helpText={companyError.gstError}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                </AdvancedCard>
              </div>

              <div className="column is-5">
                {/* KYC FORM */}
                <AdvancedCard
                  type={"s-card"}
                  footer
                  footerContentRight={<Button isSuccess>View Form</Button>}
                >
                  <div className="columns is-multiline">
                    <div className="column is-8">
                      <h2 className="title is-5 is-bold">KYC Form</h2>

                      <p>
                        Complete your KYC documentation and start accepting
                        payments
                      </p>
                    </div>

                    <div className="column is-4">
                      <ApexChart />
                    </div>
                  </div>
                </AdvancedCard>

                <div className="m-t-15" />

                {/* YOUR PLAN */}
                {/* <AdvancedCard
                  type={"s-card"}
                  footer
                  footerContentRight={
                    <Button isDisabled isLight>
                      Upgrade Plans
                    </Button>
                  }
                >
                  <div>
                    <h2 className="title is-5 is-bold">Your Plan</h2>

                    <p>
                      Current Plan -{" "}
                      <span className="is-weight-900">Basic Free Plan</span>{" "}
                      (renews automatically)
                    </p>

                    <div className="m-t-5 m-b-5">
                      <progress
                        className="progress is-info"
                        value="50"
                        max="100"
                      >
                        50%
                      </progress>
                    </div>

                    <div className="widget-toolbar">
                      <p className="left">Starts on 10.01.2023</p>
                      <p className="right">Ends on 10.01.2023</p>
                    </div>
                  </div>
                </AdvancedCard> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContent>
  );
};

export default AccountSettings;
