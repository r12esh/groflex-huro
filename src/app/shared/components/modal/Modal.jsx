import { FeatherIcon } from "../../featherIcon/FeatherIcon";
import { Button } from "../button/Button";

const Modal = ({
  isActive,
  setIsAcive,
  closeModalFunction,
  title,
  leftActions,
  centeredActions,
  rightActions,
  cancelBtnName = "Cancel",
  submitBtnName = "Confirm",
  onSubmit,
  roundedActionButtons,
  isSmall,
  isMedium,
  isLarge,
  isBig,
  children,
  ModalHeaderButton,
  otherHeaderChildren,
  otherActionButtons,
  submitDisabled,
  className,
  submitBtnLoading,
}) => {
  function getActionPositionClass() {
    if (leftActions) {
      return "is-start";
    } else if (centeredActions) {
      return "is-centered";
    } else if (rightActions) {
      return "is-end";
    }
    return "is-end";
  }

  function getModalSizeClass() {
    if (isSmall) {
      return "is-small";
    } else if (isMedium) {
      return "is-medium";
    } else if (isLarge) {
      return "is-large";
    } else if (isBig) {
      return "is-big";
    }
    return "";
  }

  const closeModal = () => {
    setIsAcive && setIsAcive(false);
    closeModalFunction && closeModalFunction();
  };

  return (
    <div
      className={`modal h-modal ${
        isActive ? "is-active" : ""
      } ${getModalSizeClass()}`}
    >
      <div className="modal-background  h-modal-close" onClick={closeModal} />
      <div className="modal-content">
        <div className={`modal-card ${className ? className : ""}`}>
          <header className="modal-card-head">
            <div className="title is-5 no-margin-bottom">{title}</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {otherHeaderChildren}
              {ModalHeaderButton ? (
                ModalHeaderButton
              ) : (
                <button
                  onClick={closeModal}
                  className="h-modal-close ml-auto"
                  aria-label="close"
                >
                  <FeatherIcon name="X" />
                </button>
              )}
            </div>
          </header>
          <div className="modal-card-body">
            <div className="inner-content">
              {/* inner Content of the modal */}
              {children}
            </div>
          </div>
          <div className={`modal-card-foot ${getActionPositionClass()}`}>
            <a
              onClick={closeModal}
              className={`button h-button h-modal-close ${
                roundedActionButtons ? "is-rounded" : ""
              }`}
            >
              {cancelBtnName}
            </a>
            {otherActionButtons}
            <Button
              isLoading={submitBtnLoading}
              isDisabled={submitDisabled}
              isPrimary
              onClick={onSubmit}
              className={`${roundedActionButtons ? "is-rounded" : ""}`}
              // className={`button h-button is-primary is-raised ${
              //   roundedActionButtons ? "is-rounded" : ""
              // }`}
            >
              {submitBtnName}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
