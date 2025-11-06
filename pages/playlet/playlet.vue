<template>
</template>

<script>
	var PlayerManager = require('../playerManager')
	// playlet-plugin必须和上面的app.json里面声明的插件名称一致
	// const playletPlugin = requirePlugin('playlet-plugin')
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
	export default {
		data() {
			return {
			
			}
		},
		onLaunch(options) {
			// 注册播放器页面的onLoad事件
			playletPlugin.onPageLoad(this._onPlayerLoad.bind(this))
		},
		_onPlayerLoad(info) {
			const playerManager = new PlayerManager()
			playerManager._onPlayerLoad(info)
		},
	}
</script>

<style>
</style>
