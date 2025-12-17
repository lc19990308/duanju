<script>
	import apiMoen from './utils/config.js';
	export default {
		usingComponents: {
			"open-area-left": "/components/open-area-left/open-area-left",
			"open-area-left-side": "/components/open-area-left-side/open-area-left-side",
			"open-area-right": "/components/open-area-right/open-area-right",
			"playlet-plugin": "/pages/playlet/playlet"
		},
		onLaunch: function(options) {
			console.log(uni.getStorageSync('lang'),'获取存入的语言')
			if (!uni.getStorageSync('lang')) {
				const langSys = uni.getSystemInfoSync().language;
				switch (langSys) {
					case 'zh-CN':
						uni.setStorageSync('lang', 'zh_CN');
						break
					case 'vi-VN':
						uni.setStorageSync('lang', 'vi_VN');
						break
					case 'zh-EN':
						uni.setStorageSync('lang', 'zh_EN');
						break
				}
			}
		},
		onShow() {
			this.$utils.ensureGuestLogin();
			// isVisitor();
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uview-ui/index.scss";
	@import "@/common/style/style.scss";
</style>