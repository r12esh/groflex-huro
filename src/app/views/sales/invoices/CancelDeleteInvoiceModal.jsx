import React from "react";
import Modal from "../../../shared/components/modal/Modal";
import groflexService from "../../../services/groflex.service";
import config from "../../../../../oldConfig";
import Tabs from "../../../shared/components/tabs/Tabs";

const CancelDeleteInvoiceModal = ({
  isActive,
  closeFunction,
  onSubmit,
  data,
}) => {
  // console.log(data);

  return (
    <Modal
      isActive={isActive}
      closeModalFunction={closeFunction}
      onSubmit={() => {}}
      title={"Cancel and delete Invoice"}
    >
      <Tabs></Tabs>
      <div>Do you want to delete this invoice</div>
    </Modal>
  );
};

export default CancelDeleteInvoiceModal;
