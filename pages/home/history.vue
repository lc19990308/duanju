<template>
	<view class="page_content">
		<statusBar />
		<u-navbar bgColor='transparent' :fixed='true' :title='$t(`my.history`)' :titleStyle='titleStyle' leftIconColor='#fff'
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
									<!-- 编辑图标预留 -->
								</view>
							</view>
							<view class="boxTitle" v-if="contentCurrent == 1">
								<view class="text">{{$t('history.total_views')}}{{item.total}}{{$t('history.total_views')}}</view>
							</view>

							<!-- 网格缩略图：当当前 tab 为 追剧（0）并且有数据时显示 -->
							<view class="list" v-if="contentCurrent == 0 && contentList[0].list && contentList[0].list.length > 0">
								<view class="item" v-for="(lItem, lIndex) in contentList[0].list" :key="lIndex"
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

							<!-- 列表视图：当当前 tab 为 历史（1）并且有数据时显示 -->
							<view class="lists" v-else-if="contentCurrent == 1 && contentList[1].list && contentList[1].list.length > 0">
								<view class="item" v-for="(lItem, lIndex) in contentList[1].list" :key="lIndex"
									@click="HistoriCalcatchUp(lItem)">
									<view class="img">
										<image class="image" :src="lItem.dramaPoster" mode="aspectFill"></image>
									</view>
									<view class="info">
										<view class="title u-line-1">{{ lItem.dramaName }}</view>
										<!-- 描述位可选 -->
										<view class="text2">{{$t('history.viewing_up')}}{{ lItem.dramaSeries }}{{$t('history.unit')}}</view>
									</view>
								</view>
							</view>

							<!-- 无数据状态 -->
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
	export default {
		data() {
			return {
				navbarTitle: '',
				tabsActiveStyle: {
					color: '#fff',
					fontWeight: 'bold',
				},
				tabsInactiveStyle: {
					color: '#999',
				},
				contentList: [
					{
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
				refreshStatus: false,
				isRefresh: false,
				// indexId 之前逻辑不可靠，改为仅在需要时使用 contentCurrent
				titleStyle: {
					// 去掉重复 color
					fontFamily: 'PingFang SC, PingFang SC',
					fontWeight: 800,
					color: '#FFFFFF',
				},
			}
		},
		onLoad() {
			const memberId = uni.getStorageSync('id')
			if (!memberId) {
				uni.redirectTo({
					url: '/pages/user/login/login'
				})
				return
			}
		},
		onShow() {
			// 切换到当前 tab 的数据加载（保证页面展示时数据为最新）
			if (this.contentCurrent === 0) {
				this.getFilmLikeCollectList()
			} else {
				this.getFilmViewHistoryList()
			}
		},
		methods: {
			// 追剧跳转
			openVideoDetail(item) {
				uni.navigateTo({
					url: `/pages/video/testVideoInfo?dramaId=${item.dramaId || item.id}`
				})
			},
			// 历史跳转（同上）
			HistoriCalcatchUp(item) {
				uni.navigateTo({
					url: `/pages/video/testVideoInfo?dramaId=${item.dramaId || item.id}`
				})
			},

			// 处理收藏按钮（示例：调用接口切换收藏状态并更新本地列表）
			handleCollect(item, index) {
				// 这里示例用 toggle，实际请替换为真实接口调用
				const newStatus = item.is_favorite == 1 ? 0 : 1
				// 伪接口：this.$request('video.toggleFavorite', { vid: item.vid, favorite: newStatus })
				// .then(res => { if (res.code === 200) { ... } })
				// 为了立即响应 UI，我们先更新本地：
				// 判断 item 属于哪个列表（目前只在历史列表展示此按钮）
				if (this.contentCurrent === 1) {
					this.$set(this.contentList[1].list[index], 'is_favorite', newStatus)
				}
			},

			// 获取追剧列表（分页：page=1 时替换，page>1 时追加）
			getFilmLikeCollectList() {
				const idx = 0
				const cur = this.contentList[idx]
				this.$request('video.filmLikeCollectList', {
					memberId: uni.getStorageSync('id'),
					pageNo: cur.page,
					pageSize: cur.pagesize,
				}).then(res => {
					if (res && res.code == 200 && res.result) {
						const records = res.result.records || []
						if (cur.page === 1) {
							this.contentList[idx].list = records
						} else {
							this.contentList[idx].list = this.contentList[idx].list.concat(records)
						}
						this.contentList[idx].total = res.result.total || 0
						// 更新 status（可选）
						if (records.length < cur.pagesize) {
							this.contentList[idx].status = 'noMore'
						} else {
							this.contentList[idx].status = 'loadmore'
						}
					}
				}).catch(()=> {
					// 错误处理（可扩展）
				})
			},

			// 获取观看历史列表（分页同上）
			getFilmViewHistoryList() {
				const idx = 1
				const cur = this.contentList[idx]
				this.$request('video.filmViewHistoryList', {
					memberId: uni.getStorageSync('id'),
					pageNo: cur.page,
					pageSize: cur.pagesize,
				}).then(res => {
					if (res && res.code == 200 && res.result) {
						const records = res.result.records || []
						if (cur.page === 1) {
							this.contentList[idx].list = records
						} else {
							this.contentList[idx].list = this.contentList[idx].list.concat(records)
						}
						this.contentList[idx].total = res.result.total || 0
						if (records.length < cur.pagesize) {
							this.contentList[idx].status = 'noMore'
						} else {
							this.contentList[idx].status = 'loadmore'
						}
					}
				}).catch(()=> {
					// 错误处理（可扩展）
				})
			},

			// 下拉刷新
			refreshHandle() {
				// 开始刷新
				this.refreshStatus = true
				if (!this.isRefresh) {
					this.isRefresh = true
					// 重置当前 tab 的分页与数据
					this.contentList[this.contentCurrent].page = 1
					this.contentList[this.contentCurrent].list = []
					if (this.contentCurrent == 0) {
						this.getFilmLikeCollectList();
					} else {
						this.getFilmViewHistoryList()
					}
					// 退出刷新状态（确保不会永远显示）
					setTimeout(() => {
						if (this.isRefresh) {
							this.refreshStatus = false;
							this.isRefresh = false
						}
					}, 1000);
				}
			},

			// 滚动监听（预留）
			scrollHandle(e) {
				// 可用于记录滚动位置或展示回到顶部按钮
			},

			// 触底滚动（分页加载）
			bottomHandle() {
				const cur = this.contentList[this.contentCurrent]
				// 如果已经没有更多就直接返回
				if (cur.status === 'noMore') return
				this.contentList[this.contentCurrent].page++
				if (this.contentCurrent == 0) {
					this.getFilmLikeCollectList();
				} else {
					this.getFilmViewHistoryList()
				}
			},

			// 切换分类（同时兼容 u-tabs 和 swiper 的事件）
			changeContent(e, source) {
				// source === 1 来自 u-tabs（事件对象：{ index }）
				// source === 2 来自 swiper（事件对象：{ detail: { current } }）
				let current = 0
				if (source === 1) {
					current = e.index
				} else {
					current = e.detail && typeof e.detail.current !== 'undefined' ? e.detail.current : 0
				}

				// 如果没有真正切换，就不重复请求（但保留 page 重置的逻辑在需要时）
				if (this.contentCurrent === current) {
					return;
				}

				this.contentCurrent = current
				// 切换后如果当前页列表为空则加载
				if (this.contentList[current].list.length === 0) {
					this.contentList[current].page = 1
					if (current == 0) {
						this.getFilmLikeCollectList();
					} else {
						this.getFilmViewHistoryList()
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		color: #fff;
		background-image: url('/static/images/navbar-bg.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		min-height: 100vh;
		.head_content {
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
