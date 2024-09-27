import React from "react";
import ReactSlickCarousel from "../../shared/components/carousel/ReactSlickCarousel";
import login_Bg from "../../../assets/groflex/bg/loginpage_bg.png";
import groflex_logo_transparent from "../../../assets/groflex/logos/groflex_name_logo_color_no_tag.png";
import carousel1 from "../../../assets/groflex/images/carousel1.png";
import carousel2 from "../../../assets/groflex/images/carousel2.png";
import carousel3 from "../../../assets/groflex/images/carousel3.png";
import carousel4 from "../../../assets/groflex/images/carousel4.png";

const FirstColumn = () => {
  return (
    <div className="column is-relative is-7 h-hidden-mobile h-hidden-tablet-p">
      <div
        style={{
          backgroundImage: `url(${login_Bg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          height: "100vh",
        }}
        className="hero is-fullheight is-image"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
          }}
        >
          <img
            style={{
              margin: "14px",
              width: "180px",
              objectFit: "cover",
            }}
            src={groflex_logo_transparent}
            alt="logo"
          />
          <div className="carousel-container" style={{ margin: "auto 0" }}>
            <ReactSlickCarousel settings={{ fade: true }}>
              <div
                style={{
                  height: "350px",
                }}
              >
                <img
                  style={{
                    margin: "0 auto",
                    height: "350px",
                    objectFit: "contain",
                  }}
                  src={carousel1}
                  alt="carousel1"
                />
                <div
                  style={{
                    margin: "0 auto",
                    height: "150px",
                    width: "340px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <h2 className="is-bold is-5 title">
                    Best and Easiest Billing Software!
                  </h2>
                  <div>Create GST compliant invoices</div>
                </div>
              </div>
              <div
                style={{
                  height: "350px",
                }}
              >
                <img
                  style={{
                    margin: "0 auto",
                    height: "350px",
                    objectFit: "contain",
                  }}
                  src={carousel2}
                  alt="carousel2"
                />
                <div
                  style={{
                    margin: "0 auto",
                    height: "150px",
                    width: "340px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <h2 className="is-bold is-5 title">
                    Best and Easiest Billing Software!
                  </h2>
                  <div>Create GST compliant invoices</div>
                </div>
              </div>
              <div
                style={{
                  height: "350px",
                }}
              >
                <img
                  style={{
                    margin: "0 auto",
                    height: "350px",
                    objectFit: "contain",
                  }}
                  src={carousel3}
                  alt="carousel3"
                />
                <div
                  style={{
                    margin: "0 auto",
                    height: "150px",
                    width: "340px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <h2 className="is-bold is-5 title">
                    Best and Easiest Billing Software!
                  </h2>
                  <div>Create GST compliant invoices</div>
                </div>
              </div>
              <div
                style={{
                  height: "350px",
                }}
              >
                <img
                  style={{
                    margin: "0 auto",
                    height: "350px",
                    objectFit: "contain",
                  }}
                  src={carousel4}
                  alt="carousel4"
                />
                <div
                  style={{
                    margin: "0 auto",
                    height: "150px",
                    width: "340px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <h2 className="is-bold is-5 title">
                    Best and Easiest Billing Software!
                  </h2>
                  <div>Create GST compliant invoices</div>
                </div>
              </div>
            </ReactSlickCarousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstColumn;
