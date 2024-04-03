import React from "react";
import q from "q";
import invoiz from "services/invoiz.service";
import config from "oldConfig";
import ChargebeePlan from "enums/chargebee-plan.enum";
import SubscriptionStatus from "enums/subscription-status.enum";
import SubscriptionVendor from "enums/subscription-vendor.enum";
import { redirectToChargebee } from "helpers/redirectToChargebee";
// import { redirectToZohoApi } from 'helpers/redirectToZohoApi';
// import ModalService from "services/modal.service";
// import UpgradeSmallModalComponent from "shared/modals/upgrade-small-modal.component";
// import UpgradeModalComponent from "shared/modals/upgrade-modal.component";
import { getFullResources } from "./resource";
// import { format } from "util";
import ZohoPlan from "enums/zoho-plan.enum";

export const isAndroidClient = () => {
  return (
    invoiz.user.registrationClient &&
    invoiz.user.registrationClient.toLowerCase() === "android"
  );
};
export const updateSubscriptionDetails = (callback) => {
  const resources = getFullResources();
  const fetchSubscriptionData = () => {
    const requests = [
      invoiz.request(config.account.endpoints.getSubscription, { auth: true }),
      invoiz.request(config.settings.endpoints.getSubscriptionDetails, {
        auth: true,
      }),
      invoiz.request(config.account.endpoints.getPlanPermissions, {
        auth: true,
      }),
    ];

    return q.all(requests);
  };

  const setSubscriptionState = ([
    subscriptionStateResponse,
    subscriptionDetailResponse,
    planRightsResponse,
  ]) => {
    const {
      body: {
        data: { current: freemiumContingent },
      },
    } = subscriptionStateResponse;

    const {
      body: {
        data: {
          activeTill,
          contingentLimit,
          contingentLimitImpressOffers,
          nextBillingAt,
          planId,
          renewalDate,
          status,
          trialDays,
          trialEndAt,
          usedContingent,
          usedContingentImpressOffers,
          vendor,
          tenantId,
          currentUserCount,
          maxUserCount,
          currentPaidUsers,
          currentAddons,
          pendingSeatInvites,
        },
      },
    } = subscriptionDetailResponse;

    const {
      body: {
        data: { rights },
      },
    } = planRightsResponse;

    const subscriptionData = {
      activeTill,
      contingentLimit,
      contingentLimitImpressOffers,
      freemiumContingent,
      nextBillingAt,
      renewalDate,
      planId,
      status,
      trialDays,
      trialEndAt,
      usedContingent,
      usedContingentImpressOffers,
      vendor,
      tenantId,
      currentUserCount,
      maxUserCount,
      currentPaidUsers,
      currentAddons,
      pendingSeatInvites,
    };
    invoiz.user.subscriptionData = subscriptionData;
    invoiz.user.planId = subscriptionData.planId;
    invoiz.user.planRights = rights;
    invoiz.trigger("userModelSubscriptionDataSet", subscriptionData);

    if (subscriptionData.vendor === SubscriptionVendor.STORE) {
      if (
        subscriptionData.contingentLimit >= 0 &&
        subscriptionData.usedContingent > subscriptionData.contingentLimit
      ) {
        const isAndroidStore = isAndroidClient();

        // ModalService.open(
        // 	<UpgradeSmallModalComponent
        // 		title={resources.str_yourTurnoverStarts}
        // 		claim={resources.upgradeSmallModalCustomizeInvoiceQuotaClaim}
        // 		subClaim={format(resources.upgradeSmallModalStoreSubClaimText, isAndroidStore ? resources.str_play : resources.str_app)}
        // 		resources={resources}
        // 	/>,
        // 	{
        // 		width: 800,
        // 		padding: 40,
        // 		isCloseable: true
        // 	}
        // );
      }
    } else {
      if (
        subscriptionData.planId === ChargebeePlan.TRIAL ||
        subscriptionData.planId === ZohoPlan.TRIAL ||
        subscriptionData.planId === ChargebeePlan.TRIAL_21
      ) {
        if (subscriptionData.trialDays <= 0) {
          $(".menuBar_container").addClass("trial-locked");
          $(".menuHeader").addClass("trial-locked");
          $(".menuBar_content").addClass("trial-locked");
          $(".menuHeader_logo").addClass("trial-locked");
          $(".menuHeader_search").addClass("trial-locked");
          $(".menuHeader_newsfeed").addClass("trial-locked");

          invoiz.router.redirectTo("/settings/billing");

          // ModalService.open(
          // 	<UpgradeModalComponent title={resources.trialExpiredMessage} resources={resources} subscriptionDetail={subscriptionData} />,
          // 	{
          // 		width: 1196,
          // 		padding: 0,
          // 		isCloseable: true
          // 	}
          // );
        }
      } else if (subscriptionData.status === SubscriptionStatus.CANCELLED) {
        $(".menuBar_container").addClass("trial-locked");
        $(".menuHeader").addClass("trial-locked");
        $(".menuBar_content").addClass("trial-locked");
        $(".menuHeader_logo").addClass("trial-locked");
        $(".menuHeader_search").addClass("trial-locked");
        $(".menuHeader_newsfeed").addClass("trial-locked");

        invoiz.router.redirectTo("/settings/billing");

        // ModalService.open(
        // 	<UpgradeModalComponent title={resources.accountDownMessage} resources={resources} subscriptionDetail={subscriptionData} />,
        // 	{
        // 		width: 1196,
        // 		padding: 0,
        // 		isCloseable: true
        // 	}
        // );
      } else {
        if (
          subscriptionData.contingentLimit >= 0 &&
          subscriptionData.usedContingent > subscriptionData.contingentLimit
        ) {
          //   ModalService.open(
          //     <UpgradeSmallModalComponent
          //       title={resources.str_yourTurnoverStarts}
          //       claim={resources.upgradeSmallModalCustomizeInvoiceQuotaClaim}
          //       subClaim={
          //         subscriptionData.vendor === SubscriptionVendor.AMAZON
          //           ? resources.amazonAccountUpgradeText
          //           : ""
          //       }
          //       okButtonLabel={
          //         subscriptionData.vendor === SubscriptionVendor.AMAZON
          //           ? null
          //           : resources.str_upgradeNow
          //       }
          //       onConfirm={() => {
          //         redirectToChargebee(null);
          //       }}
          //       resources={resources}
          //     />,
          //     {
          //       width: 800,
          //       padding: 40,
          //       isCloseable: true,
          //     }
          //   );
        }
      }
    }

    callback && callback();

    if (window.location.search.indexOf("state=succeeded") !== -1) {
      invoiz.router.reload();
    }
  };

  const onFetchError = (error) => {
    invoiz.showNotification({
      message: resources.getSubscriptionStateErrorMessage,
      type: "error",
    });
    throw error;
  };

  const updateSubscriptionData = () => {
    const deferred = q.defer();
    const params = new URLSearchParams(window.location.search);
    if (window.location.search.indexOf("state=succeeded") !== -1) {
      const id = params.has("id") ? params.get("id") : "";
      const state = params.has("state") ? params.get("state") : "";

      if (id && state) {
        invoiz
          .request(config.settings.endpoints.updateSubscription, {
            auth: true,
            method: "POST",
            data: { id, state },
          })
          .then(() => {
            deferred.resolve();
          });
      } else {
        invoiz
          .request(config.settings.endpoints.updateSubscription, {
            auth: true,
            method: "POST",
          })
          .then(() => {
            deferred.resolve();
          });
      }
    } else {
      deferred.resolve();
    }

    return deferred.promise;
  };

  updateSubscriptionData()
    .then(fetchSubscriptionData)
    .then(setSubscriptionState)
    .catch(onFetchError);
};
