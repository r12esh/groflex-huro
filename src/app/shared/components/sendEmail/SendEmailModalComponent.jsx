import React, { useEffect, useState } from "react";
import Modal from "../modal/Modal";
import SelectMultipleInput from "../select/SelectMultipleInput";
import { Input } from "../input/Input";
import HtmlInputComponent from "../input/HtmlInputComponent";
import groflexService from "../../../services/groflex.service";
import config from "../../../../../newConfig";

const SendEmailModalComponent = ({
  isActive,
  title,
  fileName,
  formData,
  closeFunction,
  onSubmit,
  submitBtnName,
  submitDisabled,
  className,
  allowPdfSend = true,
  allowCsvSend,
  allowAttachment,
}) => {
  const [formdataLocal, setFormDataLocal] = useState({
    attachmentName: formData?.attachmentName || "",
    attachments: formData?.attachments || [], //After the user uploads an Attachments the id should be entered Here
    recipients: formData?.recipients || [], //["abc@gmail.io"],
    sendCopy: formData?.sendCopy || false,
    subject: formData?.subject || "", //"Payment reminder on account No. 0028",
    text: formData?.text || "", //"<p>Dear Ladies and Gentlemen,</p><p><br></p><p>in the hustle and bustle of everyday life, one can easily overlook an invoice. That's why we write to you today. For the items listed in the attachment, we have not yet received any payment from you.</p><p><br></p><p>We therefore allow us to remind you accordingly and ask you to settle the invoice amount in a timely manner. Maybe the thing is already done? In that case, thank you very much!</p>",
    textAdditional: formData?.textAdditional || "", //"<p>Yours sincerely,</p>",
  });

  const handleRecipientsChange = (options) => {
    // console.log(options, "multiselect");
    // console.log(options.length > formdataLocal.recipients.length, "length check");
    const lastElement = options[options.length - 1];
    if (
      lastElement?.__isNew__ &&
      options.length > formdataLocal.recipients.length &&
      config.regex.emailCheck.test(lastElement.value)
    ) {
      setFormDataLocal({ ...formdataLocal, recipients: options });
      return;
    } else if (options.length < formdataLocal.recipients.length) {
      setFormDataLocal({ ...formdataLocal, recipients: options });
      return;
    }
  };

  const handleSubjectChange = (e) => {
    setFormDataLocal({ ...formdataLocal, subject: e.target.value });
  };

  const handleTextChange = (text) => {
    if (text === formdataLocal.text) {
      return;
    }
    setFormDataLocal({ ...formdataLocal, text });
  };

  const handleAdditionalTextChange = (text) => {
    if (text === formdataLocal.textAdditional) {
      return;
    }
    setFormDataLocal({ ...formdataLocal, textAdditional: text });
  };

  const handleSubmit = () => {
    const formCopy = {
      ...formdataLocal,
      recipients: formdataLocal.recipients.map((recipient) => recipient.value),
    };
    onSubmit(formCopy);
  };

  console.log(formdataLocal, "From modal send email compoentrender ");
  return (
    <Modal
      closeModalFunction={closeFunction}
      title={title}
      isActive={isActive}
      submitDisabled={submitDisabled}
      onSubmit={handleSubmit}
      submitBtnName={submitBtnName}
      className={className}
      isMedium
    >
      <div className="columns is-multiline">
        <div className="column is-12 field m-b-0">
          <SelectMultipleInput
            onChange={handleRecipientsChange}
            value={formdataLocal.recipients}
            isAnimated
            isCreatable
          />
        </div>
        <div className="column is-12 field m-b-0">
          <Input
            label="Subject"
            onChange={handleSubjectChange}
            value={formdataLocal.subject}
          />
        </div>
        <div className="column is-12 field m-b-0">
          <label>Preview your Email</label>
          <div
            style={{
              border: "1px solid hsl(0, 0%, 86%)",
              borderRadius: "4px",
              height: "auto",
              minHeight: "100px",
            }}
          >
            <HtmlInputComponent
              onChange={handleTextChange}
              value={formdataLocal.text}
            />
          </div>
        </div>
        <div className="column is-12 field m-b-0">
          <label>Footer</label>
          <div
            style={{
              border: "1px solid hsl(0, 0%, 86%)",
              // borderWidth:"",
              color: "black",
              borderRadius: "4px",
              height: "auto",
              minHeight: "70px",
            }}
          >
            <HtmlInputComponent
              onChange={handleAdditionalTextChange}
              value={formdataLocal.textAdditional}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SendEmailModalComponent;
