import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import VueCookie from "vue-cookie";
import qs from "qs";
import jsonp from "jsonp";
import { MarkeTing } from "@/request/interface";

export interface JsonpOptions {
  param: string; //用于指定回调的查询字符串参数的名称（默认为callback）
  timeout?: number; //发出超时错误后的时间。0禁用（默认为60000）
  prefix?: string; //处理jsonp响应的全局回调函数的前缀（默认为__jp）
  name?: string; // 处理jsonp响应的全局回调函数的名称（默认为prefix+递增计数器）
}

export class HttpService {
  constructor(private readonly instance: AxiosInstance = Axios) {}

  exptime = 5 * 60; // 处理接口请求token时间
  private jwtto = require("jwt-decode");

  public request<T = any>(
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.request<T>(config);
  }

  // 普通get请求
  public get<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    let param = "";
    if (Object.prototype.toString.call(data) === "[object Object]") {
      param = "";
      Object.keys(data).forEach(key => {
        param += `${key}=${data[key]}&`;
      });
      if (param.length > 0) param = `?${param.substring(0, param.length - 1)}`;
    } else if (Object.prototype.toString.call(data) === "[object String]") {
      param = data;
      if (param.length > 0 && param.substring(0, 1) !== "?")
        param = `?${param}`;
    } else if (data === undefined || data === null) {
      //
    } else {
      throw new Error(`参数错误，接收一个对象或者一个字符串`);
    }
    const finalConfig = this.setTokenToHeader(config);
    return this.instance.get<T>(
      url + `${param}${param ? "&" : "?"}_t=${new Date().getTime()}`,
      finalConfig
    );
  }

  // 普通post请求
  public post<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const finalConfig = this.setTokenToHeader(config);
    return this.instance.post(url, data, finalConfig);
  }

  // post 请求发送FormData数据
  public postFormData<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    if (config) {
      config.headers["content-type"] =
        "application/x-www-form-urlencoded; charset=UTF-8";
    } else {
      config = {
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      };
    }
    const finalConfig = this.setTokenToHeader(config);
    return this.instance.post(
      url,
      data ? qs.stringify(data) : null,
      finalConfig
    );
  }

  // post 请求上传文件
  public postMultipartData<T = any>(
    url: string,
    formData: object
  ): Promise<AxiosResponse<T>> {
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    const finalConfig = this.setTokenToHeader(config);
    return this.instance.post(url, formData, finalConfig);
  }

  // jsonp 请求
  public jsonp(
    url: string,
    opts: JsonpOptions | null,
    fn: (err: Error, data: any) => void
  ) {
    jsonp(url, opts, fn);
  }

  // login get请求 其他页面请勿用次请求
  public getto<T = any>(
    url: string,
    data?: any,
    token?: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    let param = "";
    if (Object.prototype.toString.call(data) === "[object Object]") {
      param = "";
      Object.keys(data).forEach(key => {
        param += `${key}=${data[key]}&`;
      });
      if (param.length > 0) param = `?${param.substring(0, param.length - 1)}`;
    } else if (Object.prototype.toString.call(data) === "[object String]") {
      param = data;
      if (param.length > 0 && param.substring(0, 1) !== "?")
        param = `?${param}`;
    } else if (data === undefined || data === null) {
      //
    } else {
      throw new Error(`参数错误，接收一个对象或者一个字符串`);
    }
    const authorization = `bearer ${token ? token : ""}`;
    const returnConfig = config || {};
    console.log("++++", token);
    if (token) {
      if (returnConfig.headers) {
        returnConfig.headers["Authorization"] = authorization;
      } else {
        returnConfig.headers = {
          Authorization: authorization
        };
      }
    }
    return this.instance.get<T>(
      url + `${param}${param ? "&" : "?"}_t=${new Date().getTime()}`,
      returnConfig
    );
  }

  // login post请求 其他页面请勿用次请求
  public postto<T = any>(
    url: string,
    data?: object,
    token?: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const authorization = `bearer ${token ? token : ""}`;
    const returnConfig = config || {};
    console.log("++++", token);
    if (token) {
      if (returnConfig.headers) {
        returnConfig.headers["Authorization"] = authorization;
      } else {
        returnConfig.headers = {
          Authorization: authorization
        };
      }
    }
    return this.instance.post(url, data, returnConfig);
  }

  private setTokenToHeader(config?: AxiosRequestConfig) {
    let owner = this;
    //在header里添加Authorization
    const returnConfig = config || {};
    let accessToken = localStorage.getItem("accessToken");
    let accessexp = localStorage.getItem("accessexp")
      ? Number(localStorage.getItem("accessexp"))
      : 0;
    let nowdate = Date.parse(new Date().toString()) / 1000;
    //没有时效时间 处理
    if (!accessexp) {
      let oldtoken: any = localStorage.getItem("oldtoken");
      if (oldtoken) {
        this.getto(
          MarkeTing.checkauthtoken,
          {
            deviceName: "jsh-study-front-pc"
          },
          oldtoken
        )
          .then(res => {
            if (res.data.success) {
              // 清空本地存储
              localStorage.removeItem("accessToken");
              localStorage.removeItem("accessexp");
              let data = res.data.data["access_token"]
                ? res.data.data["access_token"]
                : null;
              //刷新本地缓存
              if (data && data != "") {
                localStorage.setItem("accessToken", data);
                // let userString = decodeURIComponent(
                //   escape(window.atob(data.split(".")[1]))
                // );
                let userString = owner.jwtto(data);
                let time = userString.exp ? userString.exp : null;
                if (time && time != "") {
                  localStorage.setItem("accessexp", time);
                  console.log(time);
                }
                //添加token
                const authorization = `bearer ${data ? data : ""}`;
                if (returnConfig.headers) {
                  returnConfig.headers["Authorization"] = authorization;
                } else {
                  returnConfig.headers = {
                    Authorization: authorization
                  };
                }
              } else {
                window.location.href = `${location.protocol}//${window.location.host}/nouser`;
              }
            } else {
              window.location.href = `${location.protocol}//${window.location.host}/nouser`;
            }
          })
          .catch(cat => {
            // window.location.href = `${location.protocol}//${window.location.host}/404`;
          });
      }
    } else {
      //正常有效期处理
      if (accessexp - nowdate > this.exptime) {
        if (accessToken) {
          const authorization = `bearer ${accessToken ? accessToken : ""}`;
          if (returnConfig.headers) {
            returnConfig.headers["Authorization"] = authorization;
          } else {
            returnConfig.headers = {
              Authorization: authorization
            };
          }
        } else {
          const token = VueCookie.get("token");
          const authorization = `bearer ${token ? token : ""}`;
          if (returnConfig.headers) {
            returnConfig.headers["Authorization"] = authorization;
          } else {
            returnConfig.headers = {
              Authorization: authorization
            };
          }
        }
      }
      //超过有效期处理
      else {
        window.location.href = `${location.protocol}//${window.location.host}/nologin`;
        // // 清空本地存储
        // let refreshToken = localStorage.getItem("refreshToken")
        //   ? localStorage.getItem("refreshToken")
        //   : "";
        // this.postto(MarkeTing.refreshtoken, {
        //   refreshToken: refreshToken
        // })
        //   .then(res => {
        //     if (res.data.success) {
        //       localStorage.removeItem("accessToken");
        //       localStorage.removeItem("accessexp");
        //       let data = res.data.data["access_token"]
        //         ? res.data.data["access_token"]
        //         : null;
        //       //刷新本地缓存
        //       if (data && data != "") {
        //         localStorage.setItem("accessToken", data);
        //         let userString = decodeURIComponent(
        //           escape(window.atob(data.split(".")[1]))
        //         );
        //         let time = JSON.parse(userString).exp
        //           ? JSON.parse(userString).exp
        //           : null;
        //         if (time && time != "") {
        //           localStorage.setItem("accessexp", time);
        //           console.log(time);
        //         }
        //         //添加token
        //         const authorization = `bearer ${data ? data : ""}`;
        //         if (returnConfig.headers) {
        //           returnConfig.headers["Authorization"] = authorization;
        //         } else {
        //           returnConfig.headers = {
        //             Authorization: authorization
        //           };
        //         }
        //       } else {
        //         window.location.href = `${location.protocol}//${window.location.host}/nologin`;
        //       }
        //     } else {
        //       window.location.href = `${location.protocol}//${window.location.host}/nologin`;
        //     }
        //   })
        //   .catch(cat => {
        //     window.location.href = `${location.protocol}//${window.location.host}/404`;
        //   });
      }
    }

    return returnConfig;
  }
}
