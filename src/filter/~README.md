# filter目录

*vue全局过滤器，集成常用数据处理过滤器*


+ index.js : 统一导入过滤器


+ html-filter.js : html相关的过滤器
  + removeAllHyperLink : 去除文档中超链接
  + replaceAllHyperLinkToText : 将所有的超链接转换为文本形式
  + replaceAllLineBreakWithBr : 替换文本中所有换行(\n)为<br/>
  + removeBr : 去除字符中的br标签
  
  
+ image-filter.js : 图片相关的过滤器
  + thumbnail : 自定义缩略图


+ number-filter.js : 数字相关的过滤器
  + getAvg : 求取一组数的平均数
  + computedGoodsPrice : 格式化商品价格，保留两位小数
  + getMathRound : 四舍五入
  + computedNumMoreThanTenThousand : 格式化数字超过10000以万为单位


+ string-filter.js : 字符串相关的过滤器
  + reverse : 反转字符串
  + clearSpace : 清除字符前后空格


+ time-filter.js : 时间相关的过滤器
  + secondUnitFormat : 将秒转换为时分秒格式,有单位
  + secondFormat : 将秒转换为时分秒格式，没有单位
  + dateFormat : 时间格式化,将给定时间转换为需要的时间格式
  + dateFormatFriendly : 友好式的时间格式化：几分钟前，几小时前，隔天显示 月 日 时 分，隔年显示 年 月 日
  + dateFormatYearMonthDate : 格式化时间，显示年月日，2019-05-05
  + dateFormatMonthDateTime : 格式化时间，显示月日时间，05-05 16:01
  + dateFormatYearMonthDateTime : 格式化时间，显示年月日时间 2019-05-05 16:01
