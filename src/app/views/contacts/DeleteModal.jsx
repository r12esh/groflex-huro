import React from 'react'
import Modal from '../../shared/components/modal/Modal'

const DeleteModal = ({ isModalDelete = false, setIsModalDelete, onSubmit,
  deleteIndex,
  setDeleteIndex,
  contactName
}) => {
  const handleConfirmDelete = () => {
    onSubmit(deleteIndex);
    setIsModalDelete(false);
    setDeleteIndex(null);
  };

  const handleCancelDelete = () => {
    setIsModalDelete(false);
    setDeleteIndex(null);
  };

  return (
    <Modal
      title="Delete Contact"
      submitBtnName="Delete"
      isActive={isModalDelete}
      setIsActive={setIsModalDelete}
      onSubmit={handleConfirmDelete}
      onClose={handleCancelDelete}
      isSmall>
      Are you sure you want to delete  {contactName}?
    </Modal>
  )
}

export default DeleteModal