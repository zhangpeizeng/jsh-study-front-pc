/**
 * @auther:seebin
 *
 * 其他通用工具方法
 *
 */

import { DateObject } from "@/utils/utils.interface";

/**
 * 是否含有权限码
 * @param {string} permission 权限码
 * @returns {boolean} 结果
 */
const hasPermission = (permission: string): boolean => {
  const permissionListStr = localStorage.getItem("permissionList") as string;
  const permissionList = JSON.parse(permissionListStr);
  if (!permissionList) return false;
  return permissionList.includes(permission);
};

/**
 * 清除首末的空字符串
 * @param {string} string 要处理的字符串
 * @returns {string} 返回处理好的字符串
 */
const trim = (string: string): string => {
  return (string || "").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "");
};

/**
 * 格式化时间对象为指定格式
 * @param {Date} date 日期对象
 * @param {string} type 要格式化的日期类型
 * @returns {string}  返回格式化好的日期数据
 */
const formatDate = (date: Date, type: string): string => {
  if (/(y+)/.test(type)) {
    type = type.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  let o: DateObject = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds()
  };

  Object.keys(o).forEach((key: string) => {
    if (new RegExp(`(${key})`).test(type)) {
      let str = o[key] + "";
      type = type.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : ("00" + str).substr(str.length)
      );
    }
  });
  return type;
};

/**
 * 获取完整的地址 基于当前的主机协议以及主机地址
 * @param {string} url 要拼装成完整地址的url片段
 * @returns {string} 返回完整的Url地址
 */
const getFullAddress = (url: string): string => {
  return `${window.location.protocol}//${window.location.host}${url}`;
};

/**
 * 复制文本到粘帖版
 * @param {string} text 要复制的文本
 * @param {() => void} callback 复制成功的回调
 */
const copyText = (text: string, callback: () => void): void => {
  const inputs = document.createElement("input");
  inputs.value = text;
  document.body.appendChild(inputs);
  inputs.select(); // 选择实例内容
  document.execCommand("Copy");
  document.body.removeChild(inputs);
  callback();
};

/**
 * 下载本地公共资源文件
 * @param {string} url 路径
 * @param {string} fileName 下载的文件名称
 */
const downPublicFiles = (url: string, fileName: string): void => {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};

export {
  hasPermission,
  trim,
  formatDate,
  getFullAddress,
  copyText,
  downPublicFiles
};
