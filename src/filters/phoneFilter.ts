/**
 * @auther:seebin
 */
import Vue from "vue";

/**
 * 手机号过滤器
 *
 */

Vue.filter("phone", function(value: any) {
  if (value === null || value === undefined || value === "") return "";
  if (value.indexOf("*") > -1) {
    return value;
  }
  const formatValue = value.toString();
  return (
    formatValue.substring(0, 3) +
    "****" +
    formatValue.substring(formatValue.length - 4)
  );
});
