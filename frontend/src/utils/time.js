export default function getTime(timestamp) {
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();
  var diffValue = now - timestamp;
  if (diffValue < 0) {
    return;
  }
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  if (monthC >= 1) {
    return "" + parseInt(monthC) + "月前";
  } else if (weekC >= 1) {
    return "" + parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    return "" + parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    return "" + parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    return "" + parseInt(minC) + "分钟前";
  } else {
    return "刚刚";
  }
}
