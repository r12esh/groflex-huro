import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import config from "../../../../config";
import { useDispatch, useSelector } from "react-redux";
import groflexService from "../../services/groflex.service";
import * as actionTypes from "../../redux/actions/actions.types";

const SharedLayout = () => {
  const navigate = useNavigate();
  const tenantData = useSelector((state) => state.accountData.tenantData);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!config.checkLoginTokenIsValid()) {
      navigate("/login");
    } else {
      if (!tenantData) {
        groflexService
          .request(config.resourceUrls.tenant, {
            auth: true,
          })
          .then((res) => {
            // console.log(res.data, "TENANT DATA from Shared layout");
            dispatch({
              type: actionTypes.SET_TENANT_DATA,
              payload: res.body.data,
            });
          })
          .then(() => {
            groflexService
              .request(config.resourceUrls.user, {
                auth: true,
              })
              .then((res) => {
                dispatch({
                  type: actionTypes.SET_USER_DATA,
                  payload: res.body.data,
                });
              });
          })
          .then(() => {
            groflexService
              .request(config.resourceUrls.accountSettings, {
                auth: true,
              })
              .then((res) => {
                dispatch({
                  type: actionTypes.SET_ACCOUNTINFO_DATA,
                  payload: res.body.data,
                });
              });
          });
      }
    }
  }, []);

  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};

export default SharedLayout;
