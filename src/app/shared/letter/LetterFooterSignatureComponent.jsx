import React, { useCallback, useEffect, useRef, useState } from "react";
import resources from "../resources/resources";
import EditableIndicatorDiv from "../editableIndicatorDiv/EditableIndicatorDiv";
import FontAwesomeIcon from "../fontAwesomeIcon/FontAwesomeIcon";
import OnClickOutside from "../components/onClickOutside/OnClickOutside";
import {
  letterElementsToFabricObjects,
  fabricObjectToImageLetterElement,
  fabricObjectToTextLetterElement,
  fabricObjectToShapeLetterElement,
} from "../../helpers/letterHeaderHelpers";
import { fabric } from "fabric";
import oldConfig from "../../../../oldConfig";
import { FeatherIcon } from "../featherIcon/FeatherIcon";
import { TextArea } from "../components/textArea/TextArea";
import { Input } from "../components/input/Input";
import groflexService from "../../services/groflex.service";
import webStorageKeyEnum from "../../enums/web-storage-key.enum";
import WebStorageService from "../../services/webstorage.service";

const LetterFooterSignatureComponent = ({ items, onFinish }) => {
  const [state, setState] = useState({
    items,
    signatureElement: items[1] ? items[1] : {},
    signatureIsEmpty: items[1] ? false : true,
    fabricObjects: [],
  });

  const [editActive, setEditActive] = useState(items.length < 2);

  const fileInputRef = useRef(null);

  const showEditComp = () => {
    setEditActive(true);
  };

  const showDisplayComp = () => {
    if (
      !state.signatureElement.metaData.html &&
      !state.signatureElement.metaData.imageUrl
    ) {
      setState({
        ...state,
        signatureIsEmpty: true,
      });
      return;
    }
    if (!state.signatureElement.type) return;
    setEditActive(false);
  };

  const handleSignatureTextChange = (e) => {
    const value = e.target.value?.trim();
    console.log(value, "signatureTextChange");
    let signatureElementCopy = { ...state.signatureElement };

    // signatureElementCopy.metaData.html = e.target.value;
    signatureElementCopy = {
      metaData: {
        bold: false,
        color: "#272d30",
        font: "Caveat",
        fontSize: 28,
        fontWeight: 400,
        html: value,
        italic: false,
        underline: false,
      },
      sortId: 4,
      type: "text",
      x: 0,
      y: 0,
      // x: 0.3662109375,
      // y: 58.875,
    };
    setState({
      ...state,
      signatureElement: signatureElementCopy,
    });
  };

  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  const base64ToBinary = (base64String) => {
    const binaryString = atob(base64String)
      .split("")
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
      .join("");

    return binaryString;
  };

  const handleImageInput = (e) => {
    let imageUrl;
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      imageUrl = e.target.result;
      getImageSize(imageUrl).then((size) => {
        const { width, height } = size;
        const sizeInMB = bytesToMB(file.size);
        const sizeInKB = sizeInMB * 1024;
        // console.log(size, sizeInMB, sizeInKB, file, imageUrl, "Image size");
        if (width < 100) {
          groflexService.toast.error(resources.logoUploadMinWidthError);
          return;
        }
        if (height < 100) {
          groflexService.toast.error(resources.logoUploadMinHeightError);
          return;
        }
        if (height > 600) {
          groflexService.toast.error(resources.logoUploadMaxHeightError);
          return;
        }
        if (height > 800) {
          groflexService.toast.error(resources.logoUploadMaxWidthError);
          return;
        }
        if (sizeInMB > 10) {
          groflexService.toast.error(resources.logoUploadMaxSizeError);
          return;
        }
        if (sizeInKB < 2.5) {
          groflexService.toast.error(resources.logoUploadMinSizeError);
          return;
        }
        // console.log(
        //   base64ToBinary(imageUrl.split(",")[1]),
        //   "base64ToBinary"
        // );

        const formData = new FormData();
        formData.append("section", "footer");
        formData.append("sortId", 4);
        formData.append("x", 0);
        formData.append("y", 10);
        formData.append("metaData[height]", width);
        formData.append("metaData[width]", height);
        formData.append("image", file);
        console.log("binary", base64ToBinary(imageUrl.split(",")[1]));

        fetch(oldConfig.letter.endpoints.saveLetterPaperImageUrl, {
          method: "POST",
          body: formData,
          headers: {
            // "Content-Type": "image/jpeg",
            authtoken: WebStorageService.getItem(
              webStorageKeyEnum.LOGIN_TOKEN_KEY
            ),
          },
        })
          .then((res) => {
            groflexService.toast.success("Successfully saved");
          })
          .catch((err) => {
            groflexService.toast.error("Error saving");
          });
      });

      // setState({
      //   ...state,
      //   signatureElement: {
      //     metaData: {
      //       height: 80,
      //       imageUrl,
      //       width: 80,
      //     },
      //     sortId: 4,
      //     type: "image",
      //     x: 0,
      //     y: 10,
      //   },
      // });
    };
  };

  function bytesToMB(bytes) {
    const mb = bytes / (1024 * 1024);
    return mb;
  }

  const getImageSize = (url) => {
    const img = document.createElement("img");

    const promise = new Promise((resolve, reject) => {
      img.onload = () => {
        // Natural size is the actual image size regardless of rendering.
        // The 'normal' `width`/`height` are for the **rendered** size.
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        // Resolve promise with the width and height
        resolve({ width, height });
      };

      // Reject promise on error
      img.onerror = reject;
    });

    // Setting the source makes it start downloading and eventually call `onload`
    img.src = url;

    return promise;
  };

  const createEditComponent = () => {
    return (
      <OnClickOutside
        onClickOutside={showDisplayComp}
        className="letter-footer-signature-edit p-10 border-on-hover"
      >
        <div
          onClick={handleImageUpload}
          className="upload-btn-container flex-column flex-align-center cursor-pointer"
        >
          <div className="image-upload-btn">
            <FeatherIcon
              name="PlusCircle"
              color="#00a353"
              size={17}
              className={"m-r-5"}
            />
            Upload
          </div>
          <div className="color-secondary is-weight-600">Or drop a file</div>
        </div>
        <input
          ref={fileInputRef}
          className="is-hidden"
          type="file"
          accept="image/jpg,image/jpeg,image/png"
          onChange={handleImageInput}
        />

        <div style={{ textAlign: "center" }} className="m-t-10 m-b-10">
          Or
        </div>

        <Input
          fieldClassName={"signature-input"}
          onChange={handleSignatureTextChange}
          value={state?.signatureElement?.metaData?.html}
        />
      </OnClickOutside>
    );
  };

  const createDisplayComponent = () => {
    return (
      <EditableIndicatorDiv
        // onClick={showEditComp}
        className="letter-footer-signature-display p-10"
        icon={
          <FontAwesomeIcon
            onClick={showEditComp}
            onHoverColor={"#D94339"}
            size={16}
            name={"circle-xmark"}
            className={"icon-class"}
            primaryColor
            style={{
              cursor: "pointer",
              marginTop: "-8px",
              marginRight: "-8px",
            }}
          />
        }
      >
        {state?.signatureElement?.type === "text" ? (
          <div className="signature-text">
            {state.signatureElement.metaData.html}
          </div>
        ) : (
          <img
            className="signature-image"
            alt="signature"
            src={`${oldConfig.imageResourceHost}${state?.signatureElement?.metaData?.imageUrl}`}
          />
        )}
      </EditableIndicatorDiv>
    );
  };

  const signatureComponent = editActive
    ? createEditComponent()
    : createDisplayComponent();

  console.log(state, ": State");
  return (
    <div className="letter-footer-signature-section column is-4 p-0">
      <div className="p-10 is-weight-700 color-secondary">Signature</div>
      {signatureComponent}
    </div>
  );
};

export default LetterFooterSignatureComponent;
