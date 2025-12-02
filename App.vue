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
			console.log("App Launch");
			// 获取配置信息
			// this.getConfigInfo()





		},
		methods: {
			// ...mapActions("app", ["getConfigInfo"]),
			// ...mapMutations("app", ["setShare"]),
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uview-ui/index.scss";
	@import "@/common/style/style.scss";
</style>