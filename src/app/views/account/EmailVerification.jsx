import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import config from "../../../../config";
import groflexService from "../../services/groflex.service";
import * as actionTypes from "../../redux/actions/actions.types";
import store from "../../redux/store";
import webStorageKeyEnum from "../../enums/web-storage-key.enum";
import webstorageService from "../../services/webstorage.service";
import { AdvancedCard } from "../../shared/components/cards/AdvancedCard";
import { Button } from "../../shared/components/button/Button";
import FirstColumn from "./FirstColumn";
import OtpInputComponent from "../../shared/components/otpInput/OtpInputComponent";
import ErrorText from "../../shared/components/errorText/ErrorText";
import { useDispatch } from "react-redux";

const stepWisePage = {
  code: "/email-verification",
  mobile: "/mobile-verification",
  mobileOtp: "/mobile-verification",
};

const EmailVerification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [registerationEmail, setRegisterationEmail] = useState("");
  const [registerationPass, setRegisterationPass] = useState("");
  const [otp, setOtp] = useState("");
  const [formErrors, setFormErrors] = useState({
    otpError: "",
  });

  useEffect(() => {
    if (config.checkLoginTokenIsValid()) {
      navigate("/");
      return;
    }

    const regEmail = webstorageService.getItem(
      webStorageKeyEnum.REGISTRATION_EMAIL
    );
    const regPass = webstorageService.getItem(
      webStorageKeyEnum.REGISTRATION_PASS
    );

    const user = webstorageService.getItem(webStorageKeyEnum.USER);

    if (!regEmail) {
      navigate("/signup");
      return;
    } else {
      // If registration email exists in webstorage
      setRegisterationEmail(regEmail);
      setRegisterationPass(regPass);
      if (!user?.registrationStep) {
        // if registration email exists but registration step is not set in webstorage
        navigate("/signup");
        return;
      } else {
        if (user.registrationStep === "code") {
          return;
        }
        navigate(stepWisePage[user.registrationStep]);
        return;
      }
    }
  }, []);

  const handleChangeRegisterationEmail = () => {
    webstorageService.removeItem(webStorageKeyEnum.REGISTRATION_EMAIL);
    webstorageService.removeItem(webStorageKeyEnum.REGISTRATION_PASS);
    webstorageService.removeItem(webStorageKeyEnum.REGISTRATION_TOKEN);
    webstorageService.removeItem(webStorageKeyEnum.USER);
    navigate("/signup");
  };

  const handleOtpInputChange = (otp) => {
    setOtp(otp);
  };

  const handleResendOtp = () => {
    setFormErrors({ ...formErrors, otpError: "" });
    groflexService.resendEmailOtp();
  };

  const handleVerifyEmailOtp = () => {
    if (otp.length !== 4) return;
    setFormErrors({ ...formErrors, otpError: "" });

    groflexService.verifyEmailOtp(otp).then((res) => {
      console.log(res, "response of verify email otp in Component");
      if (res.emailOtpSuccess) {
        // webstorageService.setItem(webStorageKeyEnum.USER, {
        //   registrationStep: "mobile",
        // });
        // navigate(stepWisePage["mobile"]);
        //Directly Login :(
        handleLogin();
      } else {
        setFormErrors({ ...formErrors, otpError: "Entered OTP is wrong" });
      }
    });
  };

  const handleLogin = () => {
    setFormErrors({ ...formErrors, otpError: "" });

    groflexService.login(registerationEmail, registerationPass).then((res) => {
      if (res.meta.email) {
        navigate("/signup");
        return;
      } else if (res.meta.password) {
        setFormErrors({ ...formErrors, passwordError: "Password is wrong" });
        return;
      }
      console.log(res, "response after login");
      //Set Token, and login time in localstorage
      webstorageService.setItem(
        webStorageKeyEnum.LOGIN_TOKEN_KEY,
        res.data.token
      );
      webstorageService.setItem(
        webStorageKeyEnum.LOGIN_TOKEN_START_TIME,
        new Date().getTime()
      );
      //Remove the temporary Email and password from localstorage
      webstorageService.removeItem(webStorageKeyEnum.REGISTRATION_EMAIL);
      webstorageService.removeItem(webStorageKeyEnum.REGISTRATION_PASS);

      //Set Tenant stuff
      groflexService
        .request(config.resourceUrls.tenant, {
          auth: true,
        })
        .then((res) => {
          dispatch({
            type: actionTypes.SET_TENANT_DATA,
            payload: res.body.data,
          });
        })
        .then(() => {
          groflexService
            .request(config.resourceUrls.user, {
              auth: true,
            })
            .then((res) => {
              dispatch({
                type: actionTypes.SET_USER_DATA,
                payload: res.body.data,
              });
            });
        })
        .then(() => {
          groflexService
            .request(config.resourceUrls.accountSettings, {
              auth: true,
            })
            .then((res) => {
              console.log(res.body.data);
              dispatch({
                type: actionTypes.SET_ACCOUNTINFO_DATA,
                payload: res.body.data,
              });
              navigate("/");
            });
        });
    });
  };

  // console.log(otp, "otp");
  // console.log(formErrors, "formErrors");

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
                  <p>Enter the 4 digit code, we sent to</p>{" "}
                  <p style={{ fontWeight: "500" }}>“{registerationEmail}”</p>
                </div>
                <div style={{ margin: "0 6px" }} className="field">
                  <form
                    id="email-verification-otp-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleVerifyEmailOtp();
                    }}
                  >
                    <OtpInputComponent
                      hasError={!!formErrors.otpError}
                      otpLength={4}
                      type={"number"}
                      value={otp}
                      onChange={handleOtpInputChange}
                      containerStyle={{ marginTop: "10px" }}
                    />
                    <ErrorText
                      style={{ margin: "15px 0 0 0" }}
                      visible={formErrors.otpError}
                      text={formErrors.otpError}
                    />
                  </form>
                  <div style={{ textAlign: "center" }} className="mt-5">
                    <p
                      style={{ cursor: "pointer", lineHeight: 1.5 }}
                      onClick={handleResendOtp}
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
                  isLight={otp.length < 4}
                  isSuccess={otp.length === 4}
                  onClick={handleVerifyEmailOtp}
                >
                  Verify OTP
                </Button>

                <div style={{ textAlign: "center" }}>
                  Wrong email?{" "}
                  <p
                    style={{ cursor: "pointer", lineHeight: 1.5 }}
                    onClick={handleChangeRegisterationEmail}
                    className="text-primary title is-6 is-inline-block"
                  >
                    Change email
                  </p>
                </div>
              </AdvancedCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
