import React from "react";
import Modal from "../../shared/components/modal/Modal";
import { useNavigate } from "react-router-dom";
import accountingLivePopup from "../../../assets/groflex/images/accountingLivePopup.png";
import { useDispatch } from "react-redux";
import * as actionTypes from "../../redux/actions/actions.types";

const NewSubscriptionPlanModal = ({ isModalActive, setIsModalActive }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleBuy = () => {
    navigate("/billing-info");
    dispatch({
      type: actionTypes.SET_HAS_NEW_SUBSCRIPTION_MODAL_OPENED,
      payload: true,
    });
  };
  const handleCancel = () => {
    dispatch({
      type: actionTypes.SET_HAS_NEW_SUBSCRIPTION_MODAL_OPENED,
      payload: true,
    });
  };

  return (
    <div>
      <Modal
        isActive={isModalActive}
        setIsAcive={setIsModalActive}
        submitBtnName="Buy"
        onSubmit={handleBuy}
        isMedium
        closeModalFunction={handleCancel}
      >
        <img className="groflexPopupImage" src={accountingLivePopup} />
      </Modal>
    </div>
  );
};

export default NewSubscriptionPlanModal;
