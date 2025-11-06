// global.js
const PlayerManager = require("./playerManager.js");
// const playletPlugin = requirePlugin("playlet-plugin");
let playletPlugin;

// 检查当前是否在小程序环境中
if (typeof wx !== 'undefined' && wx.getSystemInfo) {
    try {
        // 在小程序中执行 requirePlugin
        playletPlugin = requirePlugin("playlet-plugin");
    } catch (error) {
        console.error('Failed to requirePlugin in WeChat Mini Program:', error);
    }
} else {
    // 在其他环境中的处理
    console.log('This code is executed only in WeChat Mini Program environment.');
}
import apiMoen from './config.js';
export default {
  install(Vue, options) {
    // 添加全局方法或属性
    Vue.prototype.$myGlobalMethod = function(dramaIds) {
		// console.log('This is a global method!',typeof dramaIds);
		var srcAppid = apiMoen.srcAppid
		var dramaId = dramaIds
		if (!srcAppid || !dramaId) {
			wx.showToast({
				icon: 'none',
				title: '请输入参数'
			})
			return
		}
		PlayerManager.navigateToPlayer({
			srcAppid,
			dramaId,
			// extParam: encodeURIComponent('a=b&c=d'), // 分享会携带的参数，可自定义
		})
    };
  }
}