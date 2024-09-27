import React, { useState } from "react";
import config from "../../../../config";
import { InputAddons } from "../../shared/components/inputAddons/InputAddons";
import Modal from "../../shared/components/modal/Modal";
import { FeatherIcon } from "../../shared/featherIcon/FeatherIcon";
import ErrorText from "../../shared/components/errorText/ErrorText";
import groflexService from "../../services/groflex.service";

import { Input } from "../../shared/components/input/Input";

const ChangePhoneNoModal = ({
  isActive = false,
  setIsActive,
  onChange,
  value,
  errorMessage,
}) => {
  // const [newEmail, setNewEmail] = useState("");
  // const [currentPassword, setCurrentPassword] = useState("");
  const [otp, setOtp] = useState();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    // console.log(event.target.value);
    event.preventDefault();
    setSubmitted(!submitted);
    // TODO: handle form submission
    console.log("HI handleSUbmit here");
    // const { mobile: mobileNo } = this.state;

    // resendDisabled = true;
    groflexService
      .request(config.resourceUrls.resendMobileOtp, {
        method: "PUT",
        auth: true,
        data: {
          mobileNo: value,
        },
      })
      .then((res) => {
        console.log(res);
        // this.setState({ otpInitiated: true });
        // Invoiz.page.showToast({
        //   message: `You have received a new OTP`,
        //   wrapperClass: "absolute-top",
        // });

        // setTimeout(() => {
        //   this.resendDisabled = false;
        // }, 5000);
      });
  };

  return (
    <div>
      {submitted ? (
        <Modal
          title="Change Phone Number"
          submitBtnName="Verify OTP"
          isActive={isActive}
          setIsAcive={setIsActive}
          onSubmit={handleSubmit}
          isSmall
        >
          <form onSubmit={handleSubmit}>
            <div className="columns">
              <div className="field column is-9">
                <label>Enter the OTP sent to {value} </label>
                {/* <InputAddons
                  left={"+91"}
                  type="number"
                  value={value ? value : ""}
                  onChange={onChange}
                />
                <ErrorText visible={errorMessage} text={errorMessage} /> */}
                <Input type="number" />
              </div>
            </div>
          </form>
          <div style={{ margin: "10px 0 0 0", display: "flex" }}>
            <span>
              <FeatherIcon
                style={{ margin: "5px 10px 0 0" }}
                name="Info"
                size={14}
              />
            </span>
            <span>
              <p>Resend OTP in “30 Seconds”</p>
            </span>
          </div>
        </Modal>
      ) : (
        <Modal
          title="Change Phone Number"
          submitBtnName="Send OTP"
          isActive={isActive}
          setIsAcive={setIsActive}
          onSubmit={handleSubmit}
          isSmall
        >
          <form onSubmit={handleSubmit}>
            <div className="columns">
              <div className="field column is-9">
                <label>New Phone Number</label>
                <InputAddons
                  left={"+91"}
                  type="number"
                  value={value ? value : ""}
                  onChange={onChange}
                  hasError={errorMessage}
                  helpText={errorMessage}
                />
                {/* <ErrorText visible={errorMessage} text={errorMessage} /> */}
              </div>
            </div>
          </form>
          <div style={{ margin: "10px 0 0 0", display: "flex" }}>
            <span>
              <FeatherIcon
                style={{ margin: "5px 10px 0 0" }}
                name="Info"
                size={14}
              />
            </span>
            <span>
              <p>
                We will send a 6 digit OTP to your new phone number for
                verification.
              </p>
            </span>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ChangePhoneNoModal;
