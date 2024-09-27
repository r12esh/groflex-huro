import invoiz from "../services/invoiz.service";
import config from "../../../config";
import { handleNotificationErrorMessage } from "../helpers/errorMessageNotification";

export const updatePlanPermissions = (callback) => {
  invoiz
    .request(config.account.endpoints.getPlanPermissions, { auth: true })
    .then(({ body: { data } }) => {
      if (invoiz.user) {
        invoiz.user.planRights = data.rights;
        callback && callback();
      }
    })
    .catch((error) => {
      const meta = error.body && error.body.meta;
      handleNotificationErrorMessage(meta);

      callback && callback();
    });
};
