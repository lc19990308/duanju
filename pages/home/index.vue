<template>
	<view class="page_content">
		<meta name="tencent-site-verification" content="3594747d6a3729f2995f41fbbce7b0c5"/>
		<!-- <view class="" @click="ceshi">点一下1</view> -->
	<!-- 	<view class="head_content">
			<view class="navbar">推荐</view>
		</view> -->
		<view class="main_content">
			<view class="content_box">
				<view class="tabs">
					<view class="itemList">
						<!-- 分类列表 -->
						<view class="items" :class="{ active: isSelected(tabItem) }"
							v-for="(tabItem, tabIndex) in tabsList" :key="tabIndex" @click="changeTabs(tabItem)">
							{{ tabItem.classifyName || '分类'}}
						</view>
					</view>
					<view class="icon" @click="opShow">
						<u-icon name="arrow-down" color="#000" size="14"></u-icon>
					</view>
					<view class="backls" v-if="show">
					</view>
				</view>
				<scroll-view style="height: 100%" :scroll-y="true" :refresher-enabled="true" :refresher-threshold="100"
					:refresher-triggered="refreshStatus" @refresherrefresh="refreshHandle" @scrolltolower="bottomHandle"
					@scroll="scrollHandle">
					<view class="list" v-if="videoList.length > 0">
						<block v-for="(lItems, lIndex) in videoList" :key="lItems.id">
							<view class="item item1" @click="openVideoDetail(lItems)">
								<view class="img">
									<image class="image" :src="lItems.dramaPoster" mode="aspectFill"></image>
									<view class="count">
										<u-icon name="play-right-fill" color="#fff" size="14"></u-icon>
										{{lItems.totalPlay || 0}}
									</view>
								</view>
								<view class="info">
									<view class="title u-line-1">{{ lItems.dramaName }}</view>
									<view class="text u-line-1">{{lItems.classifyName}} · {{ lItems.totalEpisodes}}集
									</view>
								</view>
							</view>
						</block>
					</view>
					<view class="nodata" v-else>
						<u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png" />
					</view>
				</scroll-view>
				<view class="btbox">

				</view>
			</view>
		</view>
		<view class="opBox" v-if="show">
			<view class="opTitle">
				<view class="text">筛选</view>
				<view class="close" @click="close">
					<u-icon name="close" color="#000" size="18"></u-icon>
				</view>
			</view>
			<view class="opContent">
				<view class="boxT">
					<view class="t-title">频道</view>
					<view class="t-content">
						<view class="t-item" :class="{ active: tabItem.id === selectedTabId}"
							v-for="(tabItem, tabIndex) in channel" :key="tabIndex"
							@click="choiceTabs(tabIndex,tabItem)">{{ tabItem.name }}</view>
					</view>
				</view>
				<view class="boxB">
					<view class="b-title">分类</view>
					<view class="b-content">
						<view class="b-item" :class="{ active: isSelected(tabItem) }"
							v-for="(tabItem, tabIndex) in tabsList" :key="tabIndex" @click="changeTabs(tabItem)">
							{{ tabItem.classifyName }}
						</view>
					</view>
				</view>
				<view class="btnBox">
					<view class="reset" @click="reset">重置</view>
					<view class="confirm" @click="confirm">确认</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import apiMoen from '../../utils/config.js';
	// const PlayerManager = require("../../utils/playerManager.js");
	// const playletPlugin = requirePlugin("playlet-plugin");
	// let playletPlugin;

	// 检查当前是否在小程序环境中
	// if (typeof wx !== 'undefined' && wx.getSystemInfo) {
	// 	try {
	// 		// 在小程序中执行 requirePlugin
	// 		playletPlugin = requirePlugin("playlet-plugin");
	// 	} catch (error) {
	// 		console.error('Failed to requirePlugin in WeChat Mini Program:', error);
	// 	}
	// } else {
	// 	// 在其他环境中的处理
	// 	console.log('This code is executed only in WeChat Mini Program environment.');
	// }
	import {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} from "vuex"
	export default {
		data() {
			return {
				refreshStatus: true,
				// 频道筛选状态
				selectedTabId: "",
				// 集数筛选状态
				episodeId: "",
				videoQuery: {
					tenantId: apiMoen.tenantId,
					sysOrgCode: apiMoen.sysOrgCode,
					dramaClassify: "", //短剧分类
					dramaChannel: "", //频道分类
				},
				show: false,
				navbarTitle: this.$store.state.app.title || '推荐',
				tabsActiveStyle: {
					color: '#EE7F33',
					fontSize: '32rpx',
					fontWeight: 'bold',
				},
				tabsInactiveStyle: {
					color: '#666666'
				},
				contentCurrent: 0,
				refreshStatus: true,
				isRefresh: false,
				tabsList: [{
						id: 1,
						name: '推荐',
						type: 'recommend'
					},
					{
						id: 2,
						name: '分类',
						type: 'new'
					},
					{
						id: 3,
						name: '热门',
						type: 'hot'
					}
				],
				channel: [{
						id: 1,
						name: '男频',
						type: false
					},
					{
						id: 2,
						name: '女频',
						type: false
					},
				],
				episodes: [{
						id: 1,
						totalEpisodesEnd: 1,
						totalEpisodesStart: 30,
						name: '1-30级',
						type: false
					},
					{
						id: 2,
						totalEpisodesEnd: 31,
						totalEpisodesStart: null,
						name: '30集以上',
						type: false
					},
					{
						id: 3,
						totalEpisodesEnd: 61,
						totalEpisodesStart: null,
						name: '60集以上',
						type: false
					},
				],
				classification: [{
						id: 1,
						name: '推荐',
						type: false
					},
					{
						id: 2,
						name: '最新',
						type: false
					},
				],
				tabsActive: {},
				isTabsFixed: false,
				videoList: []
			}
		},
		computed: {
			...mapGetters("user", ["token", "userInfo"]),
			...mapGetters("app", ["title"]),
		},
		watch: {
			title(newValue, oldValue) {
				this.navbarTitle = newValue
			}
		},
		onLoad() {
			const memberId = uni.getStorageSync('id')
			// this.ceshi()
			// if(!memberId){
			// 	uni.redirectTo({
			// 		url:'/pages/user/login/login'
			// 	})
			// }else{
			// 	this.getVideoClassify()
			// }
		},
		onShow() {
			this.getVideoList()
			this.getVideoClassify()
			// this.ceshi()
		},
		methods: {
			async getWeiXinJsCode(scope = "snsapi_base") {
				let res = await this.$refs.pay.getProviderAppId({
					provider: "wxpay",
					provider_pay_type: "jsapi"
				});
				if (res.appid) {
					let appid = res.appid;
					let redirect_uri = window.location.href.split("?")[0];
					let url =
						`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&state=STATE#wechat_redirect`;
					window.location.href = url;
				}
			},
			ceshi() {
				let mythis = this
				// var datas = {
				// 	code: uni.getStorageSync('code'),
				// 	sysOrgCode: uni.getStorageSync('sysOrgCode'), //盼盼短剧
				// }
				// mythis.$request('login.getOpenIdByCode',datas).then(res => {
				// 	console.log('获取openid111', res)
				// 	if (res.code == 200) {
				// 		uni.setStorageSync('openid', res.result.openid)
				// 	}
				// })
				// return
				let newUrl = encodeURIComponent('https://www.bxduanju.com/')
				let appid = 'wx8b0cbc42a0580434'
				let scope = 'snsapi_base'
				let code = this.getUrlCode().code; //是否存在code
				console.log(code, '1212222121212')
				if (code == null || code === "") {
					// return
					// let url_code = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxef1f84e3ab87ba11&redirect_uri="+ newUrl +"&response_type=code&scope=snsapi_base&state=STATE&wechat_redirect";
					let url_code =
						`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${newUrl}&response_type=code&scope=${scope}&state=STATE#wechat_redirect`;
					console.log("url_code", url_code);
					window.location.href = url_code; //打开这个链接，你的url后面就会跟上code的参数
					console.log("url_code", url_code);
				} else {
					mythis.$request('login.getOpenIdByCode', {
						code: code,
						sysOrgCode: uni.getStorageSync('sysOrgCode'), //盼盼短剧
					}).then(res => {
						console.log('获取openid', res)
						if (res.code == 200) {
							uni.setStorageSync('openid', res.result)
						}
					})
					// 081YtDll205TRd4ClZml2mSlQD0YtDlb
					// uni.showModal({
					// 	title:code+'555555'
					// })
				}
			},
			getUrlCode() {
				// 截取url中的code方法
				var url = location.search;
				var theRequest = new Object();
				if (url.indexOf("?") != -1) {
					var str = url.substr(1);
					var strs = str.split("&");
					for (var i = 0; i < strs.length; i++) {
						theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
					}
				}
				console.log(theRequest);
				return theRequest;
			},

			// 获取视频分类
			getVideoClassify() {
				var that = this
				if (this.videoQuery.sysOrgCode != '') {
					that.$request('video.classify', {
						sysOrgCode: this.videoQuery.sysOrgCode
					}).then(res => {
						if (res.code !== 200) {
							uni.showToast({
								title: '获取视频分类失败',
								icon: 'none',
								duration: 2000 // 提示框显示时长
							});
						}
						that.tabsList = res.result
						// console.log("this.tabsList", that.tabsList);
						console.log("res视频分类:", res);
					})
				}
			},
			// 获取视频列表
			getVideoList() {
				this.$request('video.filmDramaList', this.videoQuery).then(res => {
					// console.log("视频列表:", res);
					if (res.code != 200) {
						uni.showToast({
							title: '视频列表获取失败',
							icon: 'none',
							duration: 2000 // 提示框显示时长
						});
					}
					this.videoList = res.result
					console.log("this.videoList视频列表:", this.videoList);
					setTimeout(() => {
						// 延时结束，执行的操作
						this.refreshStatus = false
					}, 2000);
					this.isRefresh = false
				}).catch(err => {
					setTimeout(() => {
						// 延时结束，执行的操作
						this.refreshStatus = false
					}, 2000);
					this.isRefresh = false
				})
			},
			openVideoDetail(lItems) {
				console.log(lItems)
				var omim = JSON.stringify(lItems)
				uni.navigateTo({
					url: '/pages/video/videoDetails?item=' + encodeURIComponent(omim)
				})
				return
				this.$request('video.filmDramaSeriesList', {
					id: lItems.dramaId
				}).then(res => {
					console.log("获取剧集列表", res)
					if (res.code != 200) {
						uni.showToast({
							title: '系统异常',
							icon: 'none',
							duration: 2000 // 提示框显示时长
						});
					} else {
						uni.showToast({
							title: '获取剧集列表成功',
							icon: 'none',
							duration: 2000 // 提示框显示时长
						});
						// uni.switchTab({
						//   url: '/pages/home/index'
						// })
					}
				}).catch(err => {
					console.log(err)
				})
			},
			// openVideoDetail(lItems) {
			// 	PlayerManager.navigateToPlayer({
			// 		srcAppid: uni.getStorageSync('srcAppid'),
			// 		dramaId: lItems.dramaId,
			// 		// extParam: encodeURIComponent('a=b&c=d'), // 分享会携带的参数，可自定义
			// 	})
			// },
			opShow() {
				this.show = true
			},
			close() {
				this.show = false
			},
			// 	收藏
			handleCollect(id, collect, index) {
				if (collect == 0) {
					const obj = {
						vid: id,
						type: 'favorite'
					}
					this.$request('video.addRecord', obj, false).then(res => {
						if (res.code === 1) {}
					})
				} else {
					const obj = {
						ids: id,
						type: 'favorite'
					}
					this.$request('video.deleteRecord', obj, false).then(res => {
						if (res.code === 1) {}
					})
				}
			},
			// 下拉刷新
			refreshHandle() {
				this.refreshStatus = true
				if (!this.isRefresh) {
					this.isRefresh = true
					this.getVideoList()
				}
			},
			// 滚动监听
			scrollHandle(e) {
				if (this.contentCurrent == 0) {
					this.isTabsFixed = e.detail.scrollTop > 200 ? true : false
				}
			},
			// 触底滚动
			bottomHandle() {
				// this.contentList[this.contentCurrent].page++
				this.getVideoList()
			},
			isSelected(tabItem) {
				// return this.tabsActive.id === tabItem.id;
				return this.tabsActive[tabItem.id] !== undefined;
			},
			// 切换tabs
			changeTabs(tabItem) {
				const keys = Object.keys(this.tabsActive);
				console.log("keys:", keys);
				if (this.tabsActive[tabItem.id]) {
					// 如果该 tab 已经被选中，就取消选中
					delete this.tabsActive[tabItem.id];
				} else {
					// 如果该 tab 未被选中，就选中
					this.tabsActive[tabItem.id] = tabItem;

				}
				// 更新 this.videoQuery.dramaClassify
				this.videoQuery.dramaClassify = Object.keys(this.tabsActive).join(',');
				// 获取视频列表
				this.getVideoList();
			},
			// 频道筛选
			choiceTabs(item, tabItem) {
				if (this.selectedTabId === tabItem.id) {
					this.selectedTabId = null; // 取消选中
					this.videoQuery.dramaChannel = null
				} else {
					this.selectedTabId = tabItem.id; // 更新选中的选项 ID
					this.videoQuery.dramaChannel = tabItem.id;
				}
			},
			classTabs(item) {
				this.classification[item].type = true
			},
			// 重置筛选条件
			reset() {
				this.selectedTabId = ""
				this.episodeId = ""
				this.tabsActive = {};
				this.videoQuery.dramaClassify = '';
				// console.log("已取消所有选中状态");
				this.getVideoList(); // 获取视频列表
			},
			confirm() {
				this.show = false
				console.log(this.videoQuery, "this.videoQuery")
				this.getVideoList()
			},
		}
	}
</script>

<style lang="scss" scoped>
	.backls {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, .4);
	}

	.page_content {
		overflow: hidden;
		margin-top: 20rpx;

		.tabs {
			padding-bottom: 30rpx;
			display: flex;
			align-items: center;
			position: relative;

			.itemList {
				display: flex;
				align-items: center;
				width: 92%;
				overflow-y: auto;

				.items {
					color: #000;
					padding: 14rpx 26rpx;
					border-radius: 12rpx;
					font-size: 32rpx;
					// font-weight: 700;
					background-color: $uni-color-bgc;
					margin-right: 16rpx;
					white-space: nowrap;

					&.active {
						background-color: $uni-color-tab-act;
						color: $uni-color-error;
					}
				}
			}

			.icon {
				width: 8%;
				display: flex;
				justify-content: flex-end;
				align-items: center;
			}




			&.top {
				height: 0;
				padding: 0 40rpx;
				overflow: hidden;
				transition: all 0.2s linear;

				&.show {
					height: 94rpx;
					padding: 20rpx 40rpx;
				}
			}


		}

		.head_content {
			.navbar {
				margin-top: 88rpx;
				margin-bottom: 20rpx;
				padding: 16rpx 40rpx 16rpx 40rpx;
				font-size: 48rpx;
				font-weight: bold;
			}

			.tabs_box {
				padding: 0 20rpx 10rpx;
				position: relative;

				.search {
					position: absolute;
					top: 50%;
					right: 0;
					transform: translate(100%, -55%);
				}
			}
		}

		.main_content {
			overflow: hidden;

			.content_box {
				padding: 0 40rpx 96rpx 40rpx;
				height: 100%;


				.list {
					display: grid;
					grid-template-columns: 1fr 1fr 1fr;
					grid-gap: 8px;

					.item {
						width: 100%;

						&.item1 {

							&:nth-child(10n),
							&:nth-child(10n-3),
							&:nth-child(10n-6) {
								margin-right: 0;
							}
						}

						&.item2 {
							&:nth-child(3n) {
								margin-right: 0;
							}
						}

						.img {
							width: 100%;
							height: 282rpx;
							border-radius: 16rpx;
							overflow: hidden;
							position: relative;

							.image {
								width: 100%;
								height: 100%;
							}

							.count {
								position: absolute;
								left: 24rpx;
								bottom: 24rpx;
								color: #fff;
								display: flex;
								align-items: center;
								font-size: 28rpx;
							}
						}

						.info {
							margin-top: 16rpx;

							.title {
								font-size: 32rpx;
								color: #000;
							}

							.text {
								font-size: 28rpx;
								color: #858585;
								margin-top: 4rpx;
							}
						}
					}
				}

				.nodata {
					padding: 15vh 0;
				}
			}
		}
	}

	.opBox {
		position: relative;
		button: 0;
		left: 0;
		width: 100%;
		background-color: #fff;
		padding: 32rpx 32rpx 64rpx 32rpx;
		border-radius: 18rpx 18rpx 0 0;
		z-index: 9;

		.opTitle {
			position: relative;

			.text {
				text-align: center;
				font-weight: bold;
			}

			.close {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				right: 0;
			}
		}

		.opContent {
			.boxT {
				margin-bottom: 24rpx;

				.t-title {
					margin-bottom: 16rpx;
					color: #4f4f4f;
					font-weight: bold;
				}

				.t-content {
					display: grid;
					grid-template-columns: 1fr 1fr 1fr;
					grid-gap: 16px;

					.t-item {
						background-color: $uni-color-bgc;
						display: flex;
						justify-content: center;
						align-items: center;
						height: 100rpx;
						border-radius: 16rpx;
						font-weight: bold;
					}

					.active {
						background-color: $uni-color-tab-act;
						color: $uni-color-error;
					}
				}
			}

			.boxC {
				margin-bottom: 24rpx;

				.c-title {
					margin-bottom: 16rpx;
					color: #4f4f4f;
					font-weight: bold;
				}

				.c-content {
					display: grid;
					grid-template-columns: 1fr 1fr 1fr;
					grid-gap: 16px;

					.c-item {
						background-color: $uni-color-bgc;
						display: flex;
						justify-content: center;
						align-items: center;
						height: 100rpx;
						border-radius: 16rpx;
						font-weight: bold;
					}

					.active {
						background-color: $uni-color-tab-act;
						color: $uni-color-error;
					}
				}
			}

			.boxB {
				margin-bottom: 64rpx;

				.b-title {
					margin-bottom: 16rpx;
					color: #4f4f4f;
					font-weight: bold;
				}

				.b-content {
					display: grid;
					grid-template-columns: 1fr 1fr 1fr;
					grid-gap: 16px;

					.b-item {
						background-color: $uni-color-bgc;
						display: flex;
						justify-content: center;
						align-items: center;
						height: 100rpx;
						border-radius: 16rpx;
						font-weight: bold;
					}

					.active {
						background-color: $uni-color-tab-act;
						color: $uni-color-error;
					}
				}
			}

			.btnBox {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.reset {
					border-radius: 50rpx;
					border: 2rpx solid #000;
					height: 100rpx;
					width: 328rpx;
					text-align: center;
					line-height: 96rpx;
					font-size: 36rpx;
					font-weight: bold;
				}

				.confirm {
					border-radius: 50rpx;
					background-color: #19b9cc;
					color: #fff;
					height: 100rpx;
					width: 328rpx;
					text-align: center;
					line-height: 100rpx;
					font-size: 36rpx;
					font-weight: bold;
				}
			}
		}
	}
</style>