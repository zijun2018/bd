/**
 *   @Project:   微信分享封装
 *   @Author:    Zi_Jun
 *   @Email:     zijun2030@gmail.com
 *   @Date:      2019/5/28 11:01
 *   @Note:
 */

import {getWxJsSDK} from '../../api/news';
let wx = require('weixin-js-sdk');

exports.install = function (Vue) {
  Vue.prototype.shareList = function (title, imgUrl, desc, link, success) {
    const url = location.href.split('#')[0];

    // 先获取localStorage中的微信配置，如果没有，再接口获取
    const WX_CONFIG = localStorage.wxConfig && JSON.parse(localStorage.wxConfig);
    console.log(WX_CONFIG);
    console.log(url);
    if (WX_CONFIG && WX_CONFIG.url === url) {
      handleWXShare(WX_CONFIG)
    } else {
      getWxJsSDK({
        url
      }).then((res) => {
        // 将微信配置保存到localstorage中
        localStorage.setItem('wxConfig', JSON.stringify(res.wx_config));
        handleWXShare(res.wx_config);
      });
    }

    /**
     * 处理微信分享配置
     * @param configOption {Object} 微信分享配置
     */
    function handleWXShare (configOption) {
      const WXConfig = configOption;
      wx.config({
        debug: false, // true:调试时候弹窗
        appId: WXConfig.appId, // 微信appid
        timestamp: WXConfig.timestamp, // 时间戳
        nonceStr: WXConfig.nonceStr, // 随机字符串
        signature: WXConfig.signature, // 签名
        jsApiList: [
          // 所有要调用的 API 都要加到这个列表中
          'onMenuShareTimeline', // 分享到朋友圈接口
          'onMenuShareAppMessage', //  分享到朋友接口
          'updateAppMessageShareData',
          'updateTimelineShareData',
          'showAllNonBaseMenuItem', // 展示基础菜单栏
          'hideAllNonBaseMenuItem', // 隐藏基础菜单栏
          'showMenuItems', // 显示功能按钮
          'hideMenuItems' // 隐藏功能按钮

        ]
      });

      wx.checkJsApi({
        jsApiList: [
          // 所有要调用的 API 都要加到这个列表中
          'onMenuShareTimeline', // 分享到朋友圈接口
          'onMenuShareAppMessage', //  分享到朋友接口
          'updateAppMessageShareData',
          'updateTimelineShareData',
          'showAllNonBaseMenuItem', // 展示基础菜单栏
          'hideAllNonBaseMenuItem', // 隐藏基础菜单栏
          'showMenuItems', // 显示功能按钮
          'hideMenuItems' // 隐藏功能按钮
        ]
      });

      wx.ready(function () {
        if (success) {
          // wx.showAllNonBaseMenuItem();
          // 显示分享到朋友和空间按钮
          wx.showMenuItems({
            menuList: [
              'menuItem:share:appMessage',
              'menuItem:share:timeline',
              'menuItem:favorite'
            ]
          });
          // 隐藏其他第三方分享平台
          wx.hideMenuItems({
            menuList: [
              'menuItem:share:qq',
              'menuItem:share:weiboApp',
              'menuItem:share:facebook',
              'menuItem:share:QZone'
            ]
          });
        } else {
          wx.hideAllNonBaseMenuItem();
        }

        // 微信分享的数据
        const shareData = {
          imgUrl: imgUrl || '', // 分享显示的缩略图地址
          link: link || '', // 分享地址
          desc: desc || '', // 分享描述
          title: title || '', // 分享标题
          success: function () {
            // 分享成功可以做相应的数据处理
            console.log('分享成功');
            if (success) {
              setTimeout(() => {
                success();
              }, 500)
            }
          },
          fail: function () {
            alert('调用失败')
          },
          complete: function () {
            console.log('调用结束')
          }
        };

        wx.onMenuShareTimeline(shareData);
        wx.onMenuShareAppMessage(shareData);
        // wx.updateAppMessageShareData(shareData);
        // wx.updateTimelineShareData(shareData);
      });

      wx.error(function () {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，
        // 具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，
        // 对于SPA可以在这里更新签名。
        console.log('分享失败');
      })
    }
  }
};
