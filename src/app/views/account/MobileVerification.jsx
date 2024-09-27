import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import config from "../../../../config";
import groflexService from "../../services/groflex.service";
import * as actionTypes from "../../redux/actions/actions.types";
import webStorageKeyEnum from "../../enums/web-storage-key.enum";
import webstorageService from "../../services/webstorage.service";
import { AdvancedCard } from "../../shared/components/cards/AdvancedCard";
import { Button } from "../../shared/components/button/Button";
import FirstColumn from "./FirstColumn";
import { InputAddons } from "../../shared/components/inputAddons/InputAddons";
import OtpInputComponent from "../../shared/components/otpInput/OtpInputComponent";
import ErrorText from "../../shared/components/errorText/ErrorText";

const stepWisePage = {
  code: "/email-verification",
  mobile: "/mobile-verification",
  mobileOtp: "/mobile-verification",
};

const MobileVerification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [registrationStep, setRegistrationStep] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [formErrors, setFormErrors] = useState({
    mobileOtpError: "",
    mobileNumberError: "",
  });
  useEffect(() => {
    if (config.checkLoginTokenIsValid()) {
      navigate("/");
      return;
    }

    const regEmail = webstorageService.getItem(
      webStorageKeyEnum.REGISTRATION_EMAIL
    );

    const user = webstorageService.getItem(webStorageKeyEnum.USER);

    if (!regEmail) {
      navigate("/signup");
      return;
    } else {
      // If registration email exists in webstorage
      if (!user?.registrationStep) {
        // if registration email exists but registration step is not set in websotrage
        navigate("/signup");
        return;
      } else {
        if (user.registrationStep === "mobile") {
          setRegistrationStep(user.registrationStep);
        } else if (user.registrationStep === "mobileOtp") {
          setRegistrationStep(user.registrationStep);
          setMobileNumber(user.mobileNumber);
        } else {
          navigate(stepWisePage[user.registrationStep]);
          return;
        }
      }
    }
  }, []);

  //First Part
  const handleMobileNumberChange = (e) => {
    const inputNumber = e.target.value.trim();
    if (inputNumber.length <= 10) {
      setMobileNumber(inputNumber);
      return;
    }
  };

  const handleMobileOtpChange = (otp) => {
    setMobileOtp(otp);
  };

  const handleSendMobileOTP = () => {
    if (mobileNumber.length !== 10 || /^0/.test(mobileNumber)) return;
    console.log("mobile and mobileotp");
    setFormErrors({ ...formErrors, mobileOtpError: "", mobileNumberError: "" });

    if (mobileNumber.length !== 10) {
      return;
    }

    groflexService.sendMobileOtp(mobileNumber).then((res) => {
      console.log("response from send mobile otp", res.data);
      webstorageService.setItem(webStorageKeyEnum.USER, {
        mobileNumber,
        registrationStep: "mobileOtp",
      });
      setRegistrationStep("mobileOtp");
    });
  };

  const handleResendMobileOtp = () => {};

  const handleChangeRegistrationPhoneNumber = () => {
    setMobileOtp("");
    webstorageService.setItem(webStorageKeyEnum.USER, {
      registrationStep: "mobile",
    });
    setRegistrationStep("mobile");
  };

  //Second Part
  const handleVerifyMobileOtp = () => {
    if (mobileOtp.length !== 6) return;
    setFormErrors({ ...formErrors, mobileOtpError: "", mobileNumberError: "" });

    groflexService.verifyMobileOtp(mobileOtp).then((res) => {
      console.log("response from verify mobile otp", res);
      if (res.success) {
        webstorageService.removeItem(webStorageKeyEnum.REGISTRATION_EMAIL);
        webstorageService.removeItem(webStorageKeyEnum.USER);
        navigate("/login");
      }
    });
  };

  return (
    <div className="auth-wrapper is-dark">
      <div className="modern-login">
        <div className="underlay h-hidden-mobile h-hidden-tablet-p"></div>

        <div className="columns is-gapless is-vcentered">
          {/* First column */}
          <FirstColumn />

          {/* Second column */}
          <div className="column is-5 is-relative">
            <div className="is-form">
              {registrationStep === "mobile" ? (
                <AdvancedCard
                  type={"r-card"}
                  footer
                  footerContentCenter={
                    <div style={{ margin: "10px 50px", textAlign: "center" }}>
                      <div>By signing up, you agree to our</div>
                      <Link to={"/signup"} className="text-primary title is-6">
                        Terms & Privacy
                      </Link>
                    </div>
                  }
                >
                  <h2
                    style={{ textAlign: "center", margin: "20px 0" }}
                    className="title is-4 is-bold"
                  >
                    Verify mobile number
                  </h2>
                  <div style={{ padding: "10px 5px", textAlign: "center" }}>
                    <p>
                      We need your phone number for security purposes. We send
                      you an OTP code to your mobile number.
                    </p>
                  </div>
                  <div style={{ margin: "10px 0" }} className="field">
                    <form
                      id="mobile-verification-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMobileOTP();
                      }}
                    >
                      <div className="field ">
                        <label>Mobile Number</label>
                        <InputAddons
                          left={"+91"}
                          type="number"
                          value={mobileNumber}
                          placeholder={"9876543210"}
                          hasError={formErrors.mobileNumberError}
                          helpText={formErrors.mobileNumberError}
                          onChange={handleMobileNumberChange}
                        />
                      </div>
                    </form>
                  </div>
                  <Button
                    style={{ margin: "20px 0" }}
                    isBold
                    isFullWidth
                    isLight={
                      mobileNumber.length !== 10 || /^0/.test(mobileNumber)
                    }
                    isSuccess={
                      mobileNumber.length === 10 && !/^0/.test(mobileNumber)
                    }
                    onClick={handleSendMobileOTP}
                  >
                    Send OTP
                  </Button>
                </AdvancedCard>
              ) : (
                <AdvancedCard
                  type={"r-card"}
                  footer
                  footerContentCenter={
                    <div style={{ margin: "10px 50px", textAlign: "center" }}>
                      <div>By signing up, you agree to our</div>
                      <Link to={"/signup"} className="text-primary title is-6">
                        Terms & Privacy
                      </Link>
                    </div>
                  }
                >
                  <h2
                    style={{ textAlign: "center", margin: "20px 0" }}
                    className="title is-4 is-bold"
                  >
                    Verify email address
                  </h2>
                  <div style={{ padding: "10px 5px", textAlign: "center" }}>
                    <p>Enter the 6 digit code, we sent to</p>{" "}
                    <p style={{ fontWeight: "500" }}>“{mobileNumber}”</p>
                  </div>
                  <div style={{ margin: "0 6px" }} className="field">
                    <form
                      id="mobile-otp-verification-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleVerifyMobileOtp();
                      }}
                    >
                      <OtpInputComponent
                        hasError={!!formErrors.mobileOtpError}
                        otpLength={6}
                        type={"number"}
                        value={mobileOtp}
                        onChange={handleMobileOtpChange}
                        containerStyle={{ marginTop: "10px" }}
                      />
                      <ErrorText
                        style={{ margin: "15px 0 0 0" }}
                        visible={formErrors.mobileOtpError}
                        text={formErrors.mobileOtpError}
                      />
                    </form>
                    <div style={{ textAlign: "center" }} className="mt-5">
                      <p
                        style={{ cursor: "pointer", lineHeight: 1.5 }}
                        onClick={handleResendMobileOtp}
                        className="text-primary title is-6 is-inline-block"
                      >
                        Resend OTP
                      </p>
                    </div>
                  </div>
                  <Button
                    style={{ margin: "20px 0" }}
                    isBold
                    isFullWidth
                    isLight={mobileOtp.length < 6}
                    isSuccess={mobileOtp.length === 6}
                    onClick={handleVerifyMobileOtp}
                  >
                    Verify OTP
                  </Button>

                  <div style={{ textAlign: "center" }}>
                    Change phone number?{" "}
                    <p
                      style={{ cursor: "pointer", lineHeight: 1.5 }}
                      onClick={handleChangeRegistrationPhoneNumber}
                      className="text-primary title is-6 is-inline-block"
                    >
                      Go back
                    </p>
                  </div>
                </AdvancedCard>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileVerification;
