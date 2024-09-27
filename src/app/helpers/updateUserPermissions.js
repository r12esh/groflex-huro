import invoiz from "../services/invoiz.service";
import config from "../../../config";
import { handleNotificationErrorMessage } from "../helpers/errorMessageNotification";

export const updateUserPermissions = (callback) => {
  invoiz
    .request(config.account.endpoints.getUserPermissions, { auth: true })
    .then(({ body: { data } }) => {
      console.log(data);
      if (invoiz.user) {
        invoiz.user.rights = data.features;
        callback && callback();
      }
    })
    .catch((error) => {
      const meta = error.body && error.body.meta;
      handleNotificationErrorMessage(meta);

      callback && callback();
    });
};
