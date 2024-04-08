import React from "react";
import Modal from "../../../shared/components/modal/Modal";
import resources from "../../../shared/resources/resources";

const CancelInvoiceModal = ({ isActive, closeFunction, onSubmit, data }) => {
  const handleSubmit = () => {
    onSubmit();
  };
  console.log(data?.row, "camcel data");
  return (
    <Modal
      isActive={isActive}
      closeModalFunction={closeFunction}
      onSubmit={handleSubmit}
      title={`Cancel invoice ${data?.row.number}`}
    >
      <div>Cancel modal dude</div>
    </Modal>
  );
};

export default CancelInvoiceModal;
