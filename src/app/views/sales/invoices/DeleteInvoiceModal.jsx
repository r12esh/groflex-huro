import React from "react";
import Modal from "../../../shared/components/modal/Modal";
import groflexService from "../../../services/groflex.service";
import config from "../../../../../oldConfig";

const DeleteInvoiceModal = ({ isActive, closeFunction, onSubmit, data }) => {
  const handleDelete = () => {
    groflexService
      .request(`${config.resourceUrls.invoice}${data.row.id}`, {
        auth: true,
        method: "DELETE",
      })
      .then(() => {
        groflexService.toast.success(resources.invoiceDeleteSuccessMessage);
        data.params.api.applyTransaction({ remove: [data.row] });
        closeFunction();
        // onSubmit();
        // console.log(res, "Deleted Succesfullyyy");
      })
      .catch(() => {
        groflexService.toast.error("Deleting Invoice failed");
        // console.log(res, "Delete Failed");
      });
  };

  return (
    <Modal
      isActive={isActive}
      closeModalFunction={closeFunction}
      onSubmit={handleDelete}
      title={`Delete Invoice`}
    >
      <div>Delete modal dude</div>
    </Modal>
  );
};

export default DeleteInvoiceModal;
