import React, { useEffect, useState } from "react";
import googleIcon from "../../../assets/groflex/logos/google.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import config from "../../../../config";
import groflexService from "../../services/groflex.service";
import * as actionTypes from "../../redux/actions/actions.types";
import store from "../../redux/store";
import webStorageKeyEnum from "../../enums/web-storage-key.enum";
import webstorageService from "../../services/webstorage.service";
import { AdvancedCard } from "../../shared/components/cards/AdvancedCard";
import { Input } from "../../shared/components/input/Input";
import { Button } from "../../shared/components/button/Button";
import { InputAddons } from "../../shared/components/inputAddons/InputAddons";
import FontAwesomeIcon from "../../shared/fontAwesomeIcon/FontAwesomeIcon";
import FirstColumn from "./FirstColumn";

const stepWisePage = {
  code: "/email-verification",
  mobile: "/mobile-verification",
  mobileOtp: "/mobile-verification",
};

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValidations, setPasswordValidations] = useState({
    passwordLengthValid: false,
    passwordHasAlphabets: false,
    passwordHasSpecialOrNumber: false,
    allValid: false,
  });
  const [formErrors, setFormErrors] = useState({
    emailError: "",
    passwordError: "",
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
      return;
    } else {
      setEmail(regEmail);
      // If registration email exists in webstorage
      if (user?.registrationStep) {
        // if registration email exists AND registration step is SET in websotrage
        navigate(stepWisePage[user.registrationStep]);
      }
    }
  }, []);

  const handleEmailChange = (event) => {
    setEmail(event.target.value.trim());
  };

  const handlePasswordChange = (event) => {
    const inputPassword = event.target.value.trim();
    const passwordLengthValid = inputPassword.length > 7;
    const passwordHasAlphabets = /(?=.*[a-z])(?=.*[A-Z])/.test(inputPassword);
    const passwordHasSpecialOrNumber = /[^a-zA-Z]/.test(inputPassword);
    const allValid =
      passwordLengthValid && passwordHasAlphabets && passwordHasSpecialOrNumber;

    setPasswordValidations({
      ...passwordValidations,
      passwordLengthValid,
      passwordHasAlphabets,
      passwordHasSpecialOrNumber,
      allValid,
    });

    setPassword(inputPassword);
  };

  //Signup
  const handleSignup = () => {
    if (!passwordValidations.allValid || !email) return;

    setFormErrors({ ...formErrors, emailError: "", passwordError: "" });
    // Email is empty or not
    if (!email) {
      setFormErrors({ ...formErrors, emailError: "Please type email address" });
      return;
    }

    // Email is valid or not
    if (!config.regex.emailCheck.test(email)) {
      setFormErrors({
        ...formErrors,
        emailError: "Please type a valid email address",
      });
      return;
    }

    // Once email regex is valid, Send Email OTP
    groflexService
      .getRegistartionToken(email)
      .then((res) => {
        if (res?.meta?.email[0]?.code === "EXISTS") {
          setFormErrors({ emailError: "Email already exists" });
          return;
        }
        webstorageService.setItem(webStorageKeyEnum.REGISTRATION_EMAIL, email);
        webstorageService.setItem(webStorageKeyEnum.REGISTRATION_PASS, password);
        webstorageService.setItem(
          webStorageKeyEnum.REGISTRATION_TOKEN,
          res.data.token
        );
        console.log(res.data, "Token 1st");
        return res;
      })
      .then(() => {
        groflexService.sendEmailOtp(email, password).then((res) => {
          webstorageService.setItem(
            webStorageKeyEnum.REGISTRATION_TOKEN,
            res.data.token
          );
          webstorageService.setItem(webStorageKeyEnum.USER, {
            registrationStep: "code",
          });
          console.log(res.data, "Token 2nd");
          navigate(stepWisePage["code"]);
        });
      });
  };

  // console.log(email, password);
  // console.log(passwordValidations, "Password validation");

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
                  Create Groflex account
                </h2>
                <div style={{ margin: "20px 0" }} className="field">
                  <form
                    id="signup-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSignup();
                    }}
                  >
                    <label>
                      <p style={{ fontWeight: "500" }}>Email</p>
                    </label>
                    <Input
                      helpText={formErrors.emailError}
                      hasError={formErrors.emailError}
                      hasValidation
                      name="email"
                      onChange={handleEmailChange}
                      placeholder={"Enter email"}
                      type={"email"}
                      value={email}
                    />

                    <label>
                      <p style={{ fontWeight: "500" }}>Create a password</p>
                    </label>
                    <InputAddons
                      hasError={formErrors.passwordError}
                      helpText={formErrors.passwordError}
                      hasShowPassword
                      name="password"
                      onChange={handlePasswordChange}
                      placeholder={"Enter password"}
                      type="password"
                      value={password}
                    />
                  </form>
                  <div className="validaiton-info-container mt-5">
                    <div className="mt-2">
                      <FontAwesomeIcon
                        size={13}
                        name={"check-circle"}
                        primaryColor={passwordValidations.passwordLengthValid}
                      />
                      <p className="is-inline-block">At least 8 characters</p>
                    </div>
                    <div className="mt-2">
                      <FontAwesomeIcon
                        size={13}
                        name={"check-circle"}
                        primaryColor={passwordValidations.passwordHasAlphabets}
                      />
                      <p className="is-inline-block">
                        At least 1 upper and lower case letter
                      </p>
                    </div>
                    <div className="mt-2">
                      <FontAwesomeIcon
                        size={13}
                        name={"check-circle"}
                        primaryColor={
                          passwordValidations.passwordHasSpecialOrNumber
                        }
                      />
                      <p className="is-inline-block">
                        At least 1 number or special character
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  style={{ margin: "20px 0" }}
                  isBold
                  isFullWidth
                  isLight={!passwordValidations.allValid || !email}
                  isSuccess={passwordValidations.allValid && email}
                  onClick={handleSignup}
                >
                  Create account
                </Button>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      backgroundColor: "#00A353",
                      height: "1px",
                      width: "100%",
                    }}
                  />
                  <div style={{ margin: "0 23px" }}>Or</div>
                  <div
                    style={{
                      backgroundColor: "#00A353",
                      height: "1px",
                      width: "100%",
                    }}
                  />
                </div>
                <Button
                  isBold
                  style={{
                    margin: "20px 0",
                    display: "flex",
                    alignItems: "center",
                  }}
                  icon={
                    <img
                      width={20}
                      height={20}
                      style={{ margin: "0 10px 0 0" }}
                      src={googleIcon}
                      alt="signupwithgoogle"
                    />
                  }
                  isFullWidth
                  isOutlined
                  isSuccess
                >
                  Continue with Google
                </Button>
                <div style={{ textAlign: "center" }}>
                  Already have an account?{" "}
                  <Link to={"/login"} className="text-primary title is-6">
                    Log in
                  </Link>
                </div>
              </AdvancedCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
