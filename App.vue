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
			if (!uni.getStorageSync('lang')) {
				const langSys = uni.getSystemInfoSync().language;
				console.log(langSys, 'langsys')
				switch (langSys) {
					case 'zh-CN':
					case 'zh-Hans-CN':
						uni.setStorageSync('lang', 'zh_CN');
						break
					case 'vi-VN':
					case 'vi-CN':
						uni.setStorageSync('lang', 'vi_VN');
						break
					case 'zh-EN':
					case 'en-CN':
						uni.setStorageSync('lang', 'zh_EN');
						break
				}
			}
			uni.getClipboardData({
				success: function(res) {
					uni.setClipboardData({
						data: '',
						success() {
							const dramaId = (res.data.match(/dramaId=(\d+)/) || [, null])[1];
							if (dramaId) {
								uni.navigateTo({
									url: `/pages/video/testVideoInfo?dramaId=${dramaId}`
								})
							}
						}
					});
				}
			});
		},
		onShow() {
			this.$utils.ensureGuestLogin();
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uview-ui/index.scss";
	@import "@/common/style/style.scss";
</style>