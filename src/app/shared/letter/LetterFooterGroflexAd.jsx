import React from "react";
import groflexLetterFooterIcon from "../../../assets/groflex/logos/groflex_name_logo_color_no_tag.png";

const LetterFooterGroflexAd = () => {
  return (
    <div className="last-footer-msg-container columns is-multiline">
      <div className="groflex-ad column is-12">
        <img className="footer-logo" src={groflexLetterFooterIcon} alt="logo" />
        <div>Try Free Invoicing and Accounting software here </div>
        <div>
          <a className="app-link" target="_blank" href="https://app.groflex.in">
            &nbsp;app.groflex.in
          </a>
        </div>
      </div>
    </div>
  );
};

export default LetterFooterGroflexAd;
