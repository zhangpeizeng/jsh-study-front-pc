import Axios, { AxiosResponse } from "axios";
import Router from "../router";
import { Message } from "element-ui";

// 添加请求拦截器
Axios.interceptors.request.use(
  config => {
    // 在发送请求之前操作
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
Axios.interceptors.response.use(
  (response): AxiosResponse => {
    const headers = response.headers;
    if (
      headers["content-type"].toLocaleLowerCase() ===
      "application/octet-stream;charset=utf-8"
    ) {
      return response;
    }
    if (response && response.data && response.data.responseText) {
      const emp = response.data.responseText.includes("<!DOCTYPE html>");
      if (emp) {
        if (process.env.NODE_ENV === "development") {
          Router.replace({ path: "/local-login" });
        } else {
          // window.location.href = `${location.protocol}//${window.location.host}/404`;
        }
      }
    }
    return response;
  },
  error => {
    const { response } = error;
    if (response) {
      // 对响应错误做点什么
      switch (response.data.code || response.data.status) {
        case 401:
          Router.replace({ path: "/login-page" }).catch(error => error);
          break;
        case 500:
          // 服务器错误
          Message.error("服务器错误");
          break;
        case 404:
          // 找不到接口
          break;
        case 502: {
          // 各种错误处理
          break;
        }
        case 503: {
          // 网络异常
          break;
        }
        default:
          break;
      }
    }
    return error;
  }
);

Axios.defaults.baseURL = location.origin;
