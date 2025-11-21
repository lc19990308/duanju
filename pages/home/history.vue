<template>
	<view class="page_content">
		<statusBar />
		<u-navbar bgColor='transparent' :fixed='false' :title='$t(`my.history`)' :titleStyle='titleStyle' leftIconColor='#fff'
			:autoBack="true" :placeholder='true'>
		</u-navbar>
		<view class="head_content">
			<view class="tabs_box">
				<u-tabs :scrollable="false" :lineWidth="0" :list="contentList" :current="contentCurrent"
					:activeStyle="tabsActiveStyle" :inactiveStyle="tabsInactiveStyle" lineColor="#000"
					@change="changeContent($event, 1)" />
			</view>
		</view>
		<view class="main_content" v-if="contentList && contentList.length">
			<swiper style="height: 100%" :skip-hidden-item-layout="true" :current="contentCurrent"
				@change="changeContent($event, 2)">
				<swiper-item style="height: 100%;" v-for="(item, index) in contentList" :key="item.id">
					<scroll-view style="height: 100%" :scroll-y="true" :refresher-enabled="true"
						:refresher-threshold="100" :refresher-triggered="refreshStatus" refresher-background='transparent'
						@refresherrefresh="refreshHandle" @scrolltolower="bottomHandle" @scroll="scrollHandle">
						<view class="content_box">
							<view class="boxTitle" v-if="contentCurrent == 0">
								<view class="text">{{$t('history.currently_in_pursuit')}}{{item.total}}{{$t('history.total_views')}}</view>
								<view class="icon">
									<!-- <u-icon name="edit-pen" color="#000000" size="26"></u-icon>编辑 -->
								</view>
							</view>
							<view class="boxTitle" v-if="contentCurrent == 1">
								<view class="text">{{$t('history.total_views')}}{{item.total}}{{$t('history.total_views')}}</view>
								<!-- <view class="icon">
									<u-icon name="edit-pen" color="#000000" size="26"></u-icon>编辑
								</view> -->
							</view>
							<view class="list" v-if="videoList.length > 0 && contentCurrent == 0">
								<view class="item" v-for="(lItem, lIndex) in item.list" :key="lIndex"
									@click="openVideoDetail(lItem)">
									<view class="img">
										<image class="image" :src="lItem.dramaPoster" mode="aspectFill"></image>
										<view class="count">
											<u-icon name="play-right-fill" color="#fff" size="14"></u-icon>
											{{lItem.totalPlay}}
										</view>
									</view>
									<view class="info">
										<view class="title u-line-1">{{ lItem.dramaName}}</view>
										<view class="text">{{$t('history.viewing_up')}}{{ lItem.dramaSeries }}{{$t('history.unit')}}</view>
									</view>
								</view>
							</view>
							<view class="lists" v-else-if="videoList.length > 0 && contentCurrent == 1">
								<view class="item" v-for="(lItem, lIndex) in item.list" :key="lIndex"
									@click="HistoriCalcatchUp(lItem)">
									<view class="img">
										<image class="image" :src="lItem.dramaPoster" mode="aspectFill"></image>
									</view>
									<view class="info">
										<view class="title u-line-1">{{ lItem.dramaName }}</view>
										<!-- <view class="text1 u-line-2">{{ lItem.video.description }}</view> -->
										<view class="text2">{{$t('history.viewing_up')}}{{ lItem.dramaSeries }}{{$t('history.unit')}}</view>
									</view>
									<view class="btns">
										<view class="button" v-if="indexId == 2"
											:class="{ collect: lItem.is_favorite == 1 }" hover-class="active"
											:hover-start-time="0" :hover-stay-time="200">
											<!-- @click.stop="handleCollect(lItem.vid, lItem.is_favorite, lIndex)" -->
											<u-icon :name="lItem.is_favorite == 1 ? 'star-fill' : 'star'" color="#eee"
												size="18"></u-icon>
											<text class="text">{{ lItem.is_favorite == 1 ? t('history.binge_watching') : $t('history.go_binge_watching') }}</text>
										</view>
									</view>
								</view>
							</view>
							<view class="nodata" v-else>
								<u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png" />
							</view>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	const PlayerManager = require("../../utils/playerManager.js");
	// const playletPlugin = requirePlugin("playlet-plugin");
	let playletPlugin;

	// 检查当前是否在小程序环境中
	if (typeof wx !== 'undefined' && wx.getSystemInfo) {
		try {
			// 在小程序中执行 requirePlugin
			// playletPlugin = requirePlugin("playlet-plugin");
		} catch (error) {
			// console.error('Failed to requirePlugin in WeChat Mini Program:', error);
		}
	} else {
		// 在其他环境中的处理
		console.log('This code is executed only in WeChat Mini Program environment.');
	}
	export default {
		data() {
			return {
				navbarTitle: '',
				tabsActiveStyle: {
					color: '#fff',
					// fontSize: '40rpx',
					fontWeight: 'bold',
				},
				tabsInactiveStyle: {
					color: '#999',
					// fontSize: '32rpx',
				},
				contentList: [{
						id: 1,
						name: this.$t('my.tabs_item1'),
						type: 'log',
						list: [],
						page: 1,
						pagesize: 10,
						status: 'loadmore',
						total: 0,
					},
					{
						id: 2,
						name: this.$t('my.tabs_item2'),
						type: 'favorite',
						list: [],
						page: 1,
						pagesize: 10,
						status: 'loadmore',
						total: 0,
					},
				],
				contentCurrent: 0,
				refreshStatus: true,
				isRefresh: false,
				videoList: [{
						id: 1,
						image: '../../static/01.jpg',
						name: '测试测试测试',
						es: '100集',
						description: '穿越',
						number: '1000',
						nu: '70集'
					},
					{
						id: 2,
						image: '../../static/01.jpg',
						name: '测试测试测试',
						es: '100集',
						description: '穿越',
						number: '1000',
						nu: '70集'
					},
					{
						id: 3,
						image: '../../static/01.jpg',
						name: '测试测试测试',
						es: '100集',
						description: '穿越',
						number: '1000',
						nu: '70集'
					},
				],
				indexId: 1,
				titleStyle: {
					color: '#fff',
					fontFamily: 'PingFang SC, PingFang SC',
					fontWeight: 800,
					color: '#FFFFFF',
				},
			}
		},
		onLoad() {
			var memberId = uni.getStorageSync('id')
			if (!memberId) {
				uni.redirectTo({
					url: '/pages/user/login/login'
				})
				return
			}
			// this.getPlayRecordList()

		},
		onShow() {
			this.getFilmLikeCollectList()
			this.getFilmViewHistoryList()
		},
		methods: {
			// 追剧跳转
			openVideoDetail(lItem) {
				var omim = JSON.stringify(lItem)
				uni.navigateTo({
					url: '/pages/video/videoDetails?item=' + encodeURIComponent(omim)
				})
			},
			// 历史跳转
			HistoriCalcatchUp(lItem) {
				var omim = JSON.stringify(lItem)
				uni.navigateTo({
					url: '/pages/video/videoDetails?item=' + encodeURIComponent(omim)
				})
			},
			// 获取追剧列表
			getFilmLikeCollectList() {
				// contentCurrent
				this.$request('video.filmLikeCollectList', {
					memberId: uni.getStorageSync('id'),
					pageNo:this.contentList[this.contentCurrent].page,
					pageSize:this.contentList[this.contentCurrent].pagesize,
					
				}).then(res => {
					console.log(res,
						"2追剧列表11111111111111111111111111111111111111111111111111111111111111111111111")
					if (res.code == 200) {
						this.contentList[0].list = res.result.records
						this.contentList[0].total = res.result.total
					}
				})
			},
			// 获取观看历史列表
			getFilmViewHistoryList() {
				this.$request('video.filmViewHistoryList', {
					memberId: uni.getStorageSync('id'),
					pageNo:this.contentList[this.contentCurrent].page,
					pageSize:this.contentList[this.contentCurrent].pagesize,
				}).then(res => {
					this.contentList[1].list = res.result.records
					this.contentList[1].total = res.result.total
				})
			},
			// 下拉刷新
			refreshHandle() {
				this.refreshStatus = true
				if (this.contentCurrent == 0) {
					if (!this.isRefresh) {
						this.isRefresh = true
						this.contentList[this.contentCurrent].page = 1
						this.contentList[this.contentCurrent].list = []
						this.getFilmLikeCollectList();
						setTimeout(() => {
							if (this.isRefresh) { // 仅在确保当前正在刷新状态下执行退出刷新状态的操作
								this.refreshStatus = false; // 退出刷新状态
								this.isRefresh = false
							}
						}, 1000); // 2秒后退出刷新状态
					}
				} else {
					if (!this.isRefresh) {
						this.isRefresh = true
						this.contentList[this.contentCurrent].page = 1
						this.contentList[this.contentCurrent].list = []
						this.getFilmViewHistoryList()
						setTimeout(() => {
							if (this.isRefresh) { // 仅在确保当前正在刷新状态下执行退出刷新状态的操作
								this.refreshStatus = false; // 退出刷新状态
								this.isRefresh = false
							}
						}, 1000); // 2秒后退出刷新状态
					}
				}
			},
			// 滚动监听
			scrollHandle(e) {

			},
			// 触底滚动
			bottomHandle() {
				this.contentList[this.contentCurrent].page++
				if (this.contentCurrent == 0) {
					this.getFilmLikeCollectList();
				} else {
					this.getFilmViewHistoryList()
				}
			},
			// 切换分类
			changeContent(e, i) {
				this.indexId = i
				this.contentList[0].page = 1;
				this.contentList[1].page = 1;
				const current = i === 1 ? e.index : e.detail.current
				if (this.contentCurrent === current) {
					return;
				}
				this.contentCurrent = current
				// if (current == this.contentCurrent) return
				if (this.contentCurrent == 0) {
					this.getFilmLikeCollectList();
				} else {
					this.getFilmViewHistoryList()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-image: url('/static/images/navbar-bg.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.page_content {
		color: #fff;

		.head_content {
			margin-top: 88rpx;

			.tabs_box {
				// padding: 0 100rpx;
			}
		}

		.main_content {
			overflow: hidden;

			.content_box {
				padding: 40rpx 40rpx 60rpx 40rpx;

				.boxTitle {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 48rpx;

					.text {
						font-size: 32rpx;
						color: #fff;
					}

					.icon {
						display: flex;
						color: #fff;
						align-items: center;
					}
				}

				.list {
					display: grid;
					grid-template-columns: 1fr 1fr 1fr;
					grid-gap: 12rpx;

					.item {
						width: 100%;

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
								font-size: 28rpx;
								color: #fff;
								font-weight: 700;
							}

							.text {
								font-size: 24rpx;
								color: #fff;
								margin-top: 4rpx;
							}
						}
					}
				}

				.lists {

					.item {
						margin-bottom: 40rpx;
						display: flex;
						align-items: center;

						.img {
							width: 216rpx;
							height: 282rpx;
							border-radius: 20rpx;
							overflow: hidden;

							.image {
								width: 100%;
								height: 100%;
							}
						}

						.info {
							flex: 1;
							margin-left: 40rpx;

							.title {
								font-size: 32rpx;
								color: #fff;
								font-weight: 700;
							}

							.text1 {
								height: 68rpx;
								font-size: 24rpx;
								color: #fff;
								margin-top: 4rpx;
								line-height: 34rpx;
								margin: 10rpx 0;
							}

							.text2 {
								font-size: 28rpx;
								color: #fff;
								margin-top: 4rpx;
							}


						}

						.btns {
							margin-top: 20rpx;
							display: flex;
							align-items: center;
							justify-content: space-between;

							.button {
								padding-right: 10rpx;
								padding-left: 16rpx;
								height: 60rpx;
								display: flex;
								align-items: center;
								justify-content: center;
								font-size: 28rpx;
								background: #FF0066;
								border-radius: 60rpx;
								color: #fff;

								&.collect {
									opacity: 0.6;
								}

								&.active {
									background: rgba(#000, 0.9);
								}

								.text {
									margin-left: 8rpx;
									padding-right: 16rpx;
								}
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

	::v-deep .u-tabs__wrapper__nav,
	.u-tabs {
		flex-direction: unset !important;
	}

	::v-deep .u-tabs__wrapper__nav__item {
		white-space: nowrap;
	}
</style>