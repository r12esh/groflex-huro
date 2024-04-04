import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import config from "../../../../newConfig";
import { useDispatch, useSelector } from "react-redux";
import groflexService from "../../services/groflex.service";
import * as actionTypes from "../../redux/actions/actions.types";
import { multiFetchHandler } from "../../helpers/multiFetchHandler";
import oldConfig from "../../../../oldConfig";
const SharedLayout = () => {
  const navigate = useNavigate();
  const tenantData = useSelector((state) => state.accountData.tenantData);
  const dispatch = useDispatch();

  const setImportantReduxStates = () => {
    const calls = [
      groflexService.request(config.resourceUrls.tenant, {
        auth: true,
      }),
      groflexService.request(config.resourceUrls.user, {
        auth: true,
      }),
      groflexService.request(config.resourceUrls.accountSettings, {
        auth: true,
      }),
      groflexService.request(
        oldConfig.settings.endpoints.getSubscriptionDetails,
        {
          auth: true,
        }
      ),
    ];

    multiFetchHandler(calls).then((responses) => {
      const tenant = responses[0];
      const user = responses[1];
      const accountSettings = responses[2];
      const subscription = responses[3];
      dispatch({
        type: actionTypes.SET_TENANT_DATA,
        payload: tenant.body.data,
      });
      dispatch({
        type: actionTypes.SET_USER_DATA,
        payload: user.body.data,
      });
      dispatch({
        type: actionTypes.SET_ACCOUNTINFO_DATA,
        payload: accountSettings.body.data,
      });
      dispatch({
        type: actionTypes.SET_SUBSCRIPTION_DATA,
        payload: subscription.body.data,
      });
    });
  };

  useEffect(() => {
    if (!config.checkLoginTokenIsValid()) {
      navigate("/login");
    } else {
      if (!tenantData) {
        setImportantReduxStates();
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
