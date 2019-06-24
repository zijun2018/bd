# api目录

*主要提供接口api*

+ agent.js : 代理人相关接口
  + getAgentUserInfo : 代理人信息
  + getAgentUserNotices : 我的消息-列表
  + getAgentUserNotice : 我的消息-详情
  + postAuthLogin : 用户登录
  + postAuthSendMsg : 发送短信，获取验证码
  + postAgentUpdateInfo : 更新代理人信息
  + postAgentUploadPic : 上传图片
  + postAgentOpinionFeedback : 意见反馈
  + postComplaintImg : 投诉上传证据截图
  
+ ai-watch.js: 智能看盘相关接口
  + getWatchMorningMarketDetail : 盘前观测
  + getWatchCompoundDetail : 盘后总结
  
  
+ news.js : 资讯&广告相关接口
  + getBanners : 广告列表
  + getNewsList : 资讯文章列表
  + getNews : 资讯文章详情
  + getRiding : 首页跑马灯
  + getTrackVisitorsList : 用户追踪的访客列表
  + getTrackShareList : 用户追踪的分享列表
  + getTrackForwardList : 用户追踪的转发列表
  + getTrackUserStatistics : 用户追踪的统计数据
  + getTrackUserStatisticsList : 用户追踪的统计数据列表
  + getWxJsSDK : 获取微信分享SDK配置
  + postNewsShare : 资讯文章生成转发
  + postAddNewsTime : 用户追踪用户查看资讯文章的阅读时长统计
  + postNewsShareStats : 转发回调，统计分享数
  

+ product.js : 产品相关接口
  + getProducts : 产品列表
  + getProduct : 产品详情
  
  
+ helper.js : 文章编辑助手
  + getHelperGetWeChatArticle : 获取微信文章内容(公众号文章)
  + getHelperGetNewsDetail : 根据文章key值获取文章内容
  + postHelperAddWeChatArticle : 公众号文章添加入库
  + postHelperAddEditedNews : 添加编辑后资讯文章
