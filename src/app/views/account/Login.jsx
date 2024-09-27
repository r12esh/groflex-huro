import React, { useEffect, useState } from "react";
import googleIcon from "../../../assets/groflex/logos/google.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import config from "../../../../config";
import groflexService from "../../services/groflex.service";
import * as actionTypes from "../../redux/actions/actions.types";
import webStorageKeyEnum from "../../enums/web-storage-key.enum";
import webstorageService from "../../services/webstorage.service";
import { AdvancedCard } from "../../shared/components/cards/AdvancedCard";
import { Input } from "../../shared/components/input/Input";
import { Button } from "../../shared/components/button/Button";
import { InputAddons } from "../../shared/components/inputAddons/InputAddons";
import { Checkbox } from "../../shared/components/checkbox/Checkbox";
import FirstColumn from "./FirstColumn";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [emailExistsFlag, setEmailExistsFlag] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [formErrors, setFormErrors] = useState({
    emailError: "",
    passwordError: "",
  });
  useEffect(() => {
    if (config.checkLoginTokenIsValid()) {
      navigate("/");
    }
  }, []);

  const handleEmailChange = (event) => {
    setEmail(event.target.value.trim());
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value.trim());
  };

  const handleLogin = () => {
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

    // Check email exists or not
    if (emailExistsFlag === null) {
      groflexService.checkEmailExist(email).then((res) => {
        if (
          res.meta.email !== undefined &&
          res.meta.email[0].code === "NOT_FOUND"
        ) {
          console.log(res, "Email not exists!");
          webstorageService.setItem(
            webStorageKeyEnum.REGISTRATION_EMAIL,
            email
          );
          setEmailExistsFlag(false);
          navigate("/signup");
          return;
        }
        // console.log("Email exists!");
        setEmailExistsFlag(true);
      });
      return;
    }

    // If Email exists then try login
    if (emailExistsFlag) {
      groflexService.login(email, password).then((res) => {
        if (res.meta.email) {
          // setFormErrors({ ...formErrors, emailError: "Email not found" });
          navigate("/signup");
          return;
        } else if (res.meta.password) {
          setFormErrors({ ...formErrors, passwordError: "Password is wrong" });
          return;
        }
        console.log(res, "response after login");
        // Set Token, and login time in localstorage
        webstorageService.setItem(
          webStorageKeyEnum.LOGIN_TOKEN_KEY,
          res.data.token
        );
        webstorageService.setItem(
          webStorageKeyEnum.LOGIN_TOKEN_START_TIME,
          new Date().getTime()
        );

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
    }
  };

  // console.log(email, password);
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
                footer={emailExistsFlag ? false : true}
                footerContentCenter={
                  emailExistsFlag ? null : (
                    <div style={{ margin: "10px 50px", textAlign: "center" }}>
                      <div>By signing up, you agree to our</div>
                      <Link to={"/login"} className="text-primary title is-6">
                        Terms & Privacy
                      </Link>
                    </div>
                  )
                }
              >
                <h2
                  style={{ textAlign: "center", margin: "20px 0" }}
                  className="title is-4 is-bold"
                >
                  {emailExistsFlag ? "Welcome back" : "Welcome to Groflex"}
                </h2>
                <div style={{ margin: "20px 0" }} className="field">
                  <form
                    id="login-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleLogin();
                    }}
                  >
                    <label>
                      <p style={{ fontWeight: "500" }}>Email</p>
                    </label>
                    <Input
                      helpText={formErrors.emailError}
                      hasError={formErrors.emailError}
                      hasValidation={true}
                      name="email"
                      onChange={handleEmailChange}
                      placeholder={"Enter email"}
                      type={"email"}
                      value={email}
                    />
                    {emailExistsFlag ? (
                      <>
                        <label>
                          <p style={{ fontWeight: "500" }}>Password</p>
                        </label>
                        <InputAddons
                          hasValidation
                          hasError={formErrors.passwordError}
                          helpText={formErrors.passwordError}
                          hasShowPassword
                          name="password"
                          onChange={handlePasswordChange}
                          placeholder={"Enter password"}
                          type="password"
                          value={password}
                        />
                      </>
                    ) : null}
                  </form>
                </div>
                {emailExistsFlag ? (
                  <div
                    style={{
                      margin: "20px 0",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    className="field"
                  >
                    <Checkbox
                      isOutlined
                      isSuccess
                      onChange={() => {
                        setRememberMe(!rememberMe);
                      }}
                      checked={rememberMe}
                      value={rememberMe}
                      label={"Remember me"}
                      labelStyle={{ padding: "0" }}
                    />

                    <h2
                      style={{ cursor: "pointer", color: "#00A353" }}
                      className="title is-6"
                    >
                      Forgot Password?
                    </h2>
                  </div>
                ) : null}

                <Button
                  isDisabled={!email}
                  isBold
                  className={"mt-20 mb-20"}
                  isFullWidth
                  isSuccess={email}
                  onClick={handleLogin}
                >
                  {emailExistsFlag ? "Login" : "Login / Register"}
                </Button>

                {emailExistsFlag ? null : (
                  <>
                    <div
                      className="divider_with_message"
                      style={{ display: "flex", alignItems: "center" }}
                    >
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
                          alt="loginwithgoogle"
                        />
                      }
                      isFullWidth
                      isOutlined
                      isSuccess
                    >
                      Continue with Google
                    </Button>
                  </>
                )}
                <div style={{ textAlign: "center" }}>
                  Don't have an account?{" "}
                  <Link to={"/signup"} className="text-primary title is-6">
                    Sign up
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

export default Login;
