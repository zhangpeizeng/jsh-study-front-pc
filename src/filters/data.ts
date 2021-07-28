import Vue from "vue";
function addZero(val: any) {
  if (val < 10) {
    return "0" + val;
  } else {
    return val;
  }
}
Vue.filter("data", function(value: any, type: string = "") {
  var dataTime = "";
  var data = new Date();
  data.setTime(value);
  var year = data.getFullYear();
  var month = addZero(data.getMonth() + 1);
  var day = addZero(data.getDate());
  var hour = addZero(data.getHours());
  var minute = addZero(data.getMinutes());
  var second = addZero(data.getSeconds());
  if (type == "YMD") {
    dataTime = year + "-" + month + "-" + day;
  } else if (type == "YYMMDD") {
    dataTime = year + "年" + month + "月" + day + "日";
  } else if (type == "YMDHMS") {
    dataTime =
      year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  } else if (type == "HMS") {
    dataTime = hour + ":" + minute + ":" + second;
  } else if (type == "YM") {
    dataTime = year + "-" + month;
  }
  return dataTime; //将格式化后的字符串输出到前端显示
});
