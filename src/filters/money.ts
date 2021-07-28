/**
 * @auther:seebin
 */
import Vue from "vue";

/**
 * 金额过滤器
 *
 * 默认保留2位小数，默认会拼接中文金额符号(不想要金额符号，则传入空字符串顶替默认).
 *
 * money 可以接收3个参数：
 * @param decimals number 最多保留小数的位数 默认最多保留2位
 * @param unit UnitType 展示的单位类型 默认￥ 可取值：￥\$\元
 * @param isTransformUnit boolean 是否自动按万分位自动转换格式 默认不转换 设置true可自动为万、亿单位
 *
 * 例子：
 * <div>{{12231231.1232 | money}}</div>                 ==> ￥12,231,231.12
 * <div>{{12231231.1232 | money(2)}}</div>              ==> ￥12,231,231.12
 * <div>{{12231231.1232 | money(2, '$')}}</div>         ==> $12,231,231.12
 * <div>{{12231231.1232 | money(3, '')}}</div>          ==> 12,231,231.123
 * <div>{{12231231.1232 | money(2, '￥', true)}}</div>  ==> ￥1,223.12万
 * <div>{{1230000.12322 | money(2, '元', true)}}</div>  ==> 123万元
 */

enum UnitType {
  first = "￥",
  second = "¥",
  third = "$",
  fourth = "元"
}

Vue.filter("money", function(
  value: any,
  decimals: number = 2,
  unit: UnitType = UnitType.second,
  isTransformUnit: boolean = false
) {
  if (value === null || value === undefined || value === "" || isNaN(value))
    return "";

  const formatValue = value.toString();

  let money = parseFloat(formatValue)
    .toFixed(decimals)
    .toString();

  // if (isTransformUnit && parseFloat(money) >= Math.pow(10, 6)) {
  //   money = (parseFloat(money) / Math.pow(10, 8)).toFixed(decimals);
  //   money = parseFloat(money).toString() + "亿";
  // }
  if (isTransformUnit && parseFloat(money) >= Math.pow(10, 4)) {
    money = (parseFloat(money) / Math.pow(10, 4)).toFixed(decimals);
    money = parseFloat(money).toString() + "万";
  } else {
    money = parseFloat(money).toString();
  }

  const newMonty = money
    .toString()
    .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");

  switch (unit) {
    case UnitType.first:
      return `${unit}${newMonty}`;
    case UnitType.second:
      return `${unit}${newMonty}`;
    case UnitType.third:
      return `${unit}${newMonty}`;
    case UnitType.fourth:
      return `${newMonty}${unit}`;
    default:
      return `${newMonty}`;
  }
});
