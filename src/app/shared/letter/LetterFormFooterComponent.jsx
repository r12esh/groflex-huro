import React, { useEffect, useState } from "react";
import HtmlInputComponent from "../components/input/HtmlInputComponent";
import resources from "../resources/resources";
import EditableIndicatorDiv from "../editableIndicatorDiv/EditableIndicatorDiv";
import { FeatherIcon } from "../featherIcon/FeatherIcon";
import LetterFooterSignatureComponent from "./LetterFooterSignatureComponent";

const LetterFormFooterComponent = ({ columns, onSave, onChange, onReset }) => {
  const [state, setState] = useState({
    columns,
  });

  // useEffect(() => {
  //   window.addEventListener(
  //     "DOMNodeInserted",
  //     (event) => {
  //       event.stopImmediatePropagation();
  //     },
  //     true
  //   );
  //   return () => {
  //     window.removeEventListener("DOMNodeInserted", (event) => {
  //       event.stopImmediatePropagation();
  //     });
  //   };
  // }, []);

  const handleFooterTwoSectionTextChange = (value, columnIndex) => {
    const footerArr = state.columns;
    footerArr[columnIndex].metaData.html = value;
    setState({
      ...state,
      columns: footerArr,
    });
  };

  const handleAddParagraphToLetterFooter = (columnIndex) => {
    const footerArr = state.columns;
    footerArr[columnIndex].metaData.html +=
      "<p>................ : ...............</p>";
    setState({
      ...state,
      columns: footerArr,
    });
  };

  const handleLetterFooterSignatureEdited = (elements) => {
    console.log(elements, "Elements");
  };

  const createFirstTwoFooter = () => {
    // const elements = [];
    return state.columns.map((column, index) => {
      if (index < 2) {
        const {
          sortId,
          metaData: { html },
        } = column;
        // console.log(html, "HTML FROM BACKEND");
        // elements[sortId - 1] = (
        // elements.push(
        return (
          <div
            key={`letter-footer-column-${index}`}
            className="letter-footer-column column is-4 p-0"
          >
            {/* <div className="p-10 font-color-dark is-weight-600">
              {index === 1 ? "BANK DETAILS" : "COMPANY DETAILS"}
            </div> */}
            <EditableIndicatorDiv
              className="m-r-10"
              keyProp={`letter-footer-column-${index}`}
            >
              <HtmlInputComponent
                placeholder={`${resources.str_column} ${sortId}`}
                value={html}
                onChange={(value) => handleFooterTwoSectionTextChange(value, index)}
              />
              <div
                onClick={() => {
                  handleAddParagraphToLetterFooter(index);
                }}
                className="add-field-button cursor-pointer flex-row flex-align-center color-primary m-10 is-weight-500"
              >
                <FeatherIcon
                  name="PlusCircle"
                  color="#00a353"
                  size={17}
                  className={"m-r-5"}
                />
                Add Field
              </div>
            </EditableIndicatorDiv>
          </div>
        );
      }
    });
  };

  // console.log(state, "State: ");
  const firstTwoColumns = createFirstTwoFooter();
  const signatureArr = state.columns.slice(2);

  return (
    <div className="letter-form-footer columns is-multiline">
      {firstTwoColumns}
      <LetterFooterSignatureComponent
        items={signatureArr}
        onFinish={handleLetterFooterSignatureEdited}
      />
    </div>
  );
};

export default LetterFormFooterComponent;
