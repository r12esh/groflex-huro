import React from "react";
import { Input } from "../../shared/components/input/Input";
import Modal from "../../shared/components/modal/Modal";

const EditModal = ({
  editContactDetails,
  setEditContactDetails,
  handleSaveContact,
  isModalEdit = false, setIsModalEdit,
}) => {
  return (
    <Modal
      title="Edit Contact"
      submitBtnName="Save"
      isActive={isModalEdit}
      setIsAcive={setIsModalEdit}
      onSubmit={handleSaveContact}>
      <form onSubmit={handleSaveContact}>
        <Input
          type="text"
          value={editContactDetails.firstName}
          onChange={(e) =>
            setEditContactDetails((prevDetails) => ({
              ...prevDetails,
              firstName: e.target.value,
            }))
          }
        />

        <Input
          type="email"
          value={editContactDetails.email}
          onChange={(e) =>
            setEditContactDetails((prevDetails) => ({
              ...prevDetails,
              email: e.target.value,
            }))
          }
        />
      </form>

    </Modal>
  );
};

export default EditModal;
