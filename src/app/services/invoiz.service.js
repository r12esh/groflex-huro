import { assign, isString } from "lodash";
import EventEmitter from "eventemitter3";
import Events from "ampersand-events";
import config from "oldConfig";
import User from "../models/user.model";
import { request } from "helpers/request";
// import history from "../helpers/history";
import PendoService from "./pendo.service";
// import NotificationService from "../services/notification.service";

class InvoizService {
  constructor() {
    // Fixme: User can't be accesed before intilization :(
    // this.user = User;
    this.releaseStage = config.releaseStage;
    this.request = request;
    // this.offerListNaviagtion = false;

    this.page = {
      showToast: (messageOrObject) => {
        this.showNotification(messageOrObject);
      },
    };

    this.router = {
      navigate: (route, forceRefresh, asyncForceRefresh) => {
        this.historyPush(route, forceRefresh, asyncForceRefresh);
      },
      redirectTo: (route, forceRefresh, asyncForceRefresh) => {
        this.historyPush(route, forceRefresh, asyncForceRefresh);
      },
      reload: (route) => {
        const pathname = window.location.pathname;

        if (route) {
          this.historyPush("/reload");
          history.replace(route);
        } else {
          this.historyPush(pathname, true, true);
        }
      },
    };
    // Fixme: Same thing here
    // const { pendoData } = this.user;
    // PendoService.init(pendoData);

    //Fixme
    // if (this.user.loggedIn) {
    if (false) {
      // if (this.user.registrationStep === 'legal_form') {
      // 	this.router.redirectTo('/account/register/legalform');
      // } else
      if (this.user.registrationStep === "businesstype") {
        this.router.redirectTo("/account/register/businesstype");
        return;
      } else if (this.user.registrationStep === "businessturnover") {
        this.router.redirectTo("/account/register/businessturnover");
        return;
      } else if (this.user.registrationStep === "businesscategory") {
        this.router.redirectTo("/account/register/businesscategory");
        return;
      } else if (this.user.registrationStep === "mobile") {
        this.router.redirectTo("/account/register/mobile");
        return;
      } else if (this.user.registrationStep === "code") {
        this.router.redirectTo("/account/register/doi");
        return;
      } else if (this.user.registrationStep === "mobileotp") {
        this.router.redirectTo("/account/register/mobile");
        return;
      }
    }
  }

  historyPush(route, forceRefresh, asyncForceRefresh) {
    if (route.substr(0, 1) !== "/") {
      route = `/${route}`;
    }

    if (forceRefresh) {
      if (asyncForceRefresh) {
        setTimeout(() => {
          location.assign("/reload");
          // history.replace(route);
        });
      } else {
        location.assign("/reload");
        // history.replace(route);
      }
    } else {
      location.assign(route);
    }
  }

  showNotification(messageOrObject) {
    // if (isString(messageOrObject)) {
    //   NotificationService.show({
    //     type: "success",
    //     message: messageOrObject,
    //   });
    // } else {
    //   NotificationService.show({
    //     type: messageOrObject.type === "error" ? "error" : "success",
    //     message: messageOrObject.message || "",
    //     wrapperClass: messageOrObject.wrapperClass,
    //   });
    // }
  }
}

// assign(InvoizService.prototype, {
//   off: Events.off,
//   on: Events.on,
//   trigger: Events.trigger,
// });

const eventEmitter = new EventEmitter();

assign(InvoizService.prototype, {
  off: eventEmitter.off.bind(eventEmitter),
  on: eventEmitter.on.bind(eventEmitter),
  trigger: eventEmitter.emit.bind(eventEmitter),
});

export default new InvoizService();
