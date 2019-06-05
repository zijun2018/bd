# utils目录

*提供项目中常用的复用方法*

+ base-methods.js : 基础方法集合
  + isEmptyObj : 判断对象是否为空
  + isEmptyArray : 判数组是否为空
  + isBlank : 检测空格、回车、换行、空白
  + getBrowser : 获取设备内核
  + isWx : 是否在微信中
  + isIos : 是否在苹果设备中
  + isIphoneX, : 是否在iphoneX中
  + isSafari : 是否在Safari中
  + isWxMiniProgram : 是否在微信小程序中
  + removeHtmlTag : 字符串去除所有html标签
  + clearSpace : 清除字符前后空格
  + removeAllSpace : 移除所有空格
  + removeAllHyperLink : 移除所有超链接
  + replaceAllLineBreakWithBr : 替换文本中所有换行(\n)为<br/>
  + removeAllLineBreak : 清除内容中 \n | \\n
  + removeBr : 去除字符串中 <br/>
  + replaceAllHyperLinkToText : 将所有超链接转换为不被浏览器解析的文本
  + checkPhone : 验证手机号
  + isPhoneNum : 判断是否为手机号
  + checkUrl : 验证是否是URL地址
  + getStrLength : 获取字符串长度
  + parseQueryString : 解析url参数，转换为参数对象模式
  + arrContactObject : 两个数组合并一个对象
  + deepClone : 深拷贝，支持常见类型
  + getMathRound : 五舍五入取值
  + randomInt : 取两个数之间的随机数
  + formatPhoneNum : 格式化手机号为 3-4-4结构
  + returnFloat : 强制保留n位小数
  + handleAuth : 微信跳转登录权限地址，及验证回调
  + closeShare : 关闭微信中的分享
  + openShare : 打开微信中的分享
  + setWxConfig : 微信分享SDK配置
  + generateCanvasImage : 将html转化为图片


+ cookie-methods.js : Cookie相关方法
  + setCookie : 保存Cookie
  + removeCookie : 移除Cookie
  + getCookie : 获取Cookie
  
  
+ time-methods.js : 时间相关的方法
  + dateFormat : 时间格式化,将给定时间转换为需要的时间格式
  + dateFormatYearMonthDate : 格式化时间，显示年月日，2019-05-05
  + dateFormatMonthDateTime : 格式化时间，显示月日时间，05-05 16:01
  + dateFormatYearMonthDateTime : 格式化时间，显示年月日时间 2019-05-05 16:01
  + dateFormatMonthDate : 格式化时间，显示时间 05月05日
  + dateFormatTime : 格式化时间，显示时间 16:01
  + returnLeftTime : 倒计时计算年，天，时，分，秒
  + getFewMonthAgoOrAfterDate : 获取当前日期的N个月前后的日期
  
  
+ const.js : 常量定义集合
  + DEFAULT_SHARE_IMAGES : 默认分享的默认图片集合
    
