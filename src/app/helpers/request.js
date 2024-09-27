import _ from "lodash";
import config from "../../../config";
import webStorageKeyEnum from "../enums/web-storage-key.enum";
import groflexService from "../services/groflex.service";
import WebStorageService from "../services/webstorage.service";
import qs from "qs";

const environment = "local";
const localHost = "http://localhost:18000/serverconnect?url=";

const getEndpoint = (endpoint) => {
  return environment === "local" ? `${localHost}${endpoint}` : endpoint;
};

//Login
export const login = (email, password) => {
  if (environment === "local") {
    return new Promise((resolve, reject) => {
      fetch(getEndpoint(config.resourceUrls.login), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: JSON.stringify({ email, password }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
          url: config.resourceUrls.login,
        }),
      }).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else {
          reject(response);
        }
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      fetch(getEndpoint(config.resourceUrls.login), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else {
          reject(response);
        }
      });
    });
  }
};

export const logout = () => {
  WebStorageService.removeItem(webStorageKeyEnum.LOGIN_TOKEN_KEY);
  WebStorageService.removeItem(webStorageKeyEnum.LOGIN_TOKEN_START_TIME);
  location.assign("/login");
};

/* Registration APIs */
//Check email exist
export const checkEmailExist = (email, password = "lSlSlS@3") => {
  if (environment === "local") {
    return new Promise((resolve, reject) => {
      fetch(getEndpoint(config.resourceUrls.login), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: JSON.stringify({ email, password }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
          url: config.resourceUrls.login,
        }),
      }).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else {
          reject(response);
        }
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      fetch(getEndpoint(config.resourceUrls.login), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else {
          reject(response);
        }
      });
    });
  }
};

export const checkEmailExist2 = (email) => {
  if (environment === "local") {
    return new Promise((resolve, reject) => {
      fetch(
        getEndpoint(
          `${config.resourceUrls.checkEmailExist}?` +
            new URLSearchParams({
              email,
            })
        ),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            headers: { "Content-Type": "application/json" },
            method: "GET",
            url: config.resourceUrls.checkEmailExist,
          }),
        }
      ).then((response) => {
        if (response) {
          // response.json().then((data) => {
          //   resolve(data);
          // });
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      fetch(
        getEndpoint(
          `${config.resourceUrls.checkEmailExist}?` +
            new URLSearchParams({
              email,
            })
        ),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((response) => {
        if (response) {
          // response.json().then((data) => {
          //   resolve(data);
          // });
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
  }
};

//Get Registration Token
export const getRegistrationToken = (email) => {
  if (environment === "local") {
    return new Promise((resolve, reject) => {
      fetch(getEndpoint(config.resourceUrls.getRegistartionToken), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: JSON.stringify({ email }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          url: config.resourceUrls.getRegistartionToken,
        }),
      }).then((response) => {
        if (response) {
          response.json().then((data) => {
            resolve(data);
          });
          // resolve(response);
        } else {
          reject(response);
        }
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      fetch(getEndpoint(config.resourceUrls.getRegistartionToken), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }).then((response) => {
        if (response) {
          response.json().then((data) => {
            resolve(data);
          });
          // resolve(response);
        } else {
          reject(response);
        }
      });
    });
  }
};

//Verify email
export const sendEmailOtp = (email, password) => {
  const registrationToken = WebStorageService.getItem(
    webStorageKeyEnum.REGISTRATION_TOKEN
  );

  console.log("from REQUEST JS sendEmailOtp", registrationToken);
  if (environment === "local") {
    return new Promise((resolve, reject) => {
      fetch(getEndpoint(config.resourceUrls.sendEmailOtp), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: JSON.stringify({ email, password }),
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${registrationToken}`,
          },
          method: "POST",
          url: config.resourceUrls.sendEmailOtp,
        }),
      }).then((response) => {
        if (response) {
          response.json().then((data) => {
            resolve(data);
          });
          // resolve(response);
        } else {
          reject(response);
        }
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      fetch(getEndpoint(config.resourceUrls.sendEmailOtp), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${registrationToken}`,
        },
        body: JSON.stringify({ email, password }),
      }).then((response) => {
        if (response) {
          response.json().then((data) => {
            resolve(data);
          });
          // resolve(response);
        } else {
          reject(response);
        }
      });
    });
  }
};

export const resendEmailOtp = () => {
  const registrationToken = WebStorageService.getItem(
    webStorageKeyEnum.REGISTRATION_TOKEN
  );
  if (environment === "local") {
    return new Promise((resolve, reject) => {
      fetch(getEndpoint(config.resourceUrls.resendEmailOtp), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${registrationToken}`,
          },
          method: "POST",
          url: config.resourceUrls.resendEmailOtp,
        }),
      }).then((response) => {
        if (response) {
          response.json().then((data) => {
            resolve(data);
          });
          groflexService.toast.success("OTP resent succesfully");
          // resolve(response);
        } else {
          reject(response);
        }
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      fetch(getEndpoint(config.resourceUrls.resendEmailOtp), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${registrationToken}`,
        },
      }).then((response) => {
        if (response) {
          response.json().then((data) => {
            resolve(data);
          });
          groflexService.toast.success("OTP resent succesfully");
          // resolve(response);
        } else {
          reject(response);
        }
      });
    });
  }
};

export const verifyEmailOtp = (code) => {
  const registrationToken = WebStorageService.getItem(
    webStorageKeyEnum.REGISTRATION_TOKEN
  );
  if (environment === "local") {
    return new Promise((resolve, reject) => {
      fetch(getEndpoint(config.resourceUrls.verifyEmailOtp), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: JSON.stringify({ code }),
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${registrationToken}`,
          },
          method: "POST",
          url: config.resourceUrls.verifyEmailOtp,
        }),
      }).then((response) => {
        if (response) {
          response
            .json()
            .then((res) => {
              if (res) {
                console.log(res, "code was wrong");
                resolve(res);
              }
            })
            .catch((err) => {
              resolve({ emailOtpSuccess: true });
            });
        } else {
          reject(response);
        }
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      fetch(getEndpoint(config.resourceUrls.verifyEmailOtp), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${registrationToken}`,
        },
        body: JSON.stringify({ code }),
      }).then((response) => {
        if (response) {
          // response.json().then((data) => {
          //   resolve(data);
          // });
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
  }
};

//Verify mobile number
export const sendMobileOtp = (mobileNo) => {
  const registrationToken = WebStorageService.getItem(
    webStorageKeyEnum.REGISTRATION_TOKEN
  );
  if (environment === "local") {
    return new Promise((resolve, reject) => {
      fetch(getEndpoint(config.resourceUrls.sendMobileOtp), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: JSON.stringify({ mobileNo }),
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${registrationToken}`,
          },
          method: "PUT",
          url: config.resourceUrls.sendMobileOtp,
        }),
      }).then((response) => {
        if (response) {
          // response.json().then((data) => {
          //   resolve(data);
          // });
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      fetch(getEndpoint(config.resourceUrls.sendMobileOtp), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${registrationToken}`,
        },
        body: JSON.stringify({ mobileNo }),
      }).then((response) => {
        if (response) {
          // response.json().then((data) => {
          //   resolve(data);
          // });
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
  }
};

export const verifyMobileOtp = (mobileOtp) => {
  const registrationToken = WebStorageService.getItem(
    webStorageKeyEnum.REGISTRATION_TOKEN
  );
  if (environment === "local") {
    return new Promise((resolve, reject) => {
      fetch(getEndpoint(config.resourceUrls.verifyMobileOtp), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: JSON.stringify({ mobileOtp }),
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${registrationToken}`,
          },
          method: "PUT",
          url: config.resourceUrls.verifyMobileOtp,
        }),
      }).then((response) => {
        if (response) {
          response.json().then((data) => {
            resolve(data);
          });
          // resolve(response);
        } else {
          reject(response);
        }
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      fetch(getEndpoint(config.resourceUrls.verifyMobileOtp), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${registrationToken}`,
        },
        body: JSON.stringify({ mobileOtp }),
      }).then((response) => {
        if (response) {
          response.json().then((data) => {
            resolve(data);
          });
          // resolve(response);
        } else {
          reject(response);
        }
      });
    });
  }
};

//Requests after login
export const request2 = (
  endpoint,
  options = { data, auth, authCustomBearerToken, method, headers }
) => {
  const token = options.authCustomBearerToken
    ? options.authCustomBearerToken
    : WebStorageService.getItem(webStorageKeyEnum.LOGIN_TOKEN_KEY);
  // console.log(token, options.auth);

  if (!options?.auth || !token) {
    console.error("No token provided for request");
    return new Promise((resolve, reject) => {});
  }

  // This options object is to be sent to the fetch function
  const fetchOptions = {
    method: options.method || "GET",
    headers: options.headers || { "Content-Type": "application/json" },
    url: endpoint,
  };

  fetchOptions.headers.Authorization = `Bearer ${token}`;
  if (fetchOptions.method !== "GET" && !!options.data) {
    fetchOptions.body = JSON.stringify(options.data);
  }

  // Local only accepts POST requests but the options body can be any method
  if (environment === "local") {
    // console.log(endpoint, fetchOptions);
    const defaultLocalhostOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fetchOptions),
    };
    return new Promise((resolve, reject) => {
      fetch(`${localHost}${endpoint}`, defaultLocalhostOptions).then(
        (response) => {
          console.log(response, "RAW response from req.js");

          resolve(response);
          // if (response.ok) {
          //   response.json().then((data) => {
          //     resolve(data);
          //   });
          // } else {
          //   reject(response);
          // }
        }
      );
    });
  } else {
    // on non local environment
    return new Promise((resolve, reject) => {
      fetch(endpoint, fetchOptions).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else {
          reject(response);
        }
      });
    });
  }
};

//Request function from old groflex

const blobTypes = ["pdf", "csv"];
const textTypes = ["json", "text"];
const isMatching = (header, types) => {
  if (!header) return header;
  for (let type of types)
    if (header.includes(type))
      // need to modify in future
      return true;
};

export const request = (endpoint, options) => {
  options = options || {};

  const fetchOptions = {
    method: options.method || "GET",
    headers: options.headers || { "Content-Type": "application/json" },
    url: endpoint,
  };

  const token = WebStorageService.getItem(webStorageKeyEnum.LOGIN_TOKEN_KEY);

  if (options.auth === true && (options.authCustomBearerToken || token)) {
    if (options.authCustomBearerToken) {
      fetchOptions.headers.authtoken = options.authCustomBearerToken;
      fetchOptions.headers["api-version"] = "1";

      if (options.requestId) {
        fetchOptions.headers["logLevel"] = "Debug";
        fetchOptions.headers["requestId"] = options.requestId;
      }
    } else {
      fetchOptions.headers.authorization = `Bearer ${token}`;
    }
  }

  if (
    options.customHeaders &&
    options.customHeaders &&
    Object.keys(options.customHeaders).length > 0
  ) {
    Object.keys(options.customHeaders).forEach((key) => {
      fetchOptions.headers[key] = options.customHeaders[key];
    });
  }

  if (fetchOptions.method === "GET" && options.data) {
    const forXDataOptimizedParams = _.reduce(
      options.data,
      (result, value, key) => {
        result[key] = _.isString(value) ? `${value}` : value;
        return result;
      },
      {}
    );

    endpoint = `${fetchOptions.url}?${qs.stringify(forXDataOptimizedParams)}`;
  } else if (fetchOptions.method !== "GET" && options.data) {
    fetchOptions.body = JSON.stringify(options.data);
  }

  if (fetchOptions.method !== "GET" && options.responseType) {
    fetchOptions.responseType = options.responseType;
  }
  // console.log(endpoint, fetchOptions, )

  if (environment == "local") {
    var options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fetchOptions),
    };
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:18000/serverconnect?url=${endpoint}`, options)
        .then((res) => {
          if (!res.ok) {
            if (res.status === 401 && res.url !== config.resourceUrls.login) {
              groflexService.logout();
            } else {
              if (res.status === 404) {
                const error = {
                  body: res.statusText,
                };

                reject(error);
              } else if (res.status === 500) {
                const error = {
                  body: res.statusText,
                };

                reject(error);
              } else {
                res.json().then((err) => {
                  const error = {
                    body: err,
                  };

                  reject(error);
                });
              }
            }

            throw Error(res.statusText);
          }
          if (isMatching(fetchOptions.headers["Content-Type"], textTypes))
            return res.text();
          if (isMatching(fetchOptions.headers["Content-Type"], blobTypes))
            return res.blob();
          return res;
        })
        .then((data) => {
          try {
            if (isMatching(fetchOptions.headers["Content-Type"], textTypes))
              data = JSON.parse(data);
            resolve({ body: data });
          } catch (err) {
            resolve(true);
          }
        })
        .catch((reason) => {});
    });
  } else {
    return new Promise((resolve, reject) => {
      fetch(endpoint, fetchOptions)
        .then((res) => {
          if (!res.ok) {
            if (res.status === 401 && res.url !== config.resourceUrls.login) {
              groflexService.logout();
            } else {
              if (res.status === 404) {
                const error = {
                  body: res.statusText,
                };

                reject(error);
              } else if (res.status === 500) {
                const error = {
                  body: res.statusText,
                };

                reject(error);
              } else {
                res.json().then((err) => {
                  const error = {
                    body: err,
                  };

                  reject(error);
                });
              }
            }

            throw Error(res.statusText);
          }
          if (isMatching(fetchOptions.headers["Content-Type"], textTypes))
            return res.text();
          if (isMatching(fetchOptions.headers["Content-Type"], blobTypes))
            return res.blob();
          return res;
        })
        .then((data) => {
          try {
            if (isMatching(fetchOptions.headers["Content-Type"], textTypes))
              data = JSON.parse(data);
            resolve({ body: data });
          } catch (err) {
            resolve(true);
          }
        })
        .catch((reason) => {});
    });
  }
};
