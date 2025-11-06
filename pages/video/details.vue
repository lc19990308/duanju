<template>
	<view class="Plot">
		<view class="Plot-details">
			<!-- 头部区域 -->
			<view class="top">
				<view class="top-cover">
					<image :src="filmDrama.dramaPoster" mode="aspectFill"></image>
				</view>
				<view class="right-name">
					<view class="name">
						<view class="drama-name">
							{{filmDrama.dramaName}}
						</view>
						<view class="classify-name">
							<!-- {{filmDrama.classifyName}} · 播放{{filmDrama.playSecond || 0 }} -->
							已完结
						</view>
					</view>
					<view class="btn">
						<!-- <view class="button"> -->
						<!-- @click.stop="handleCollect(lfilmDrama.vid, lfilmDrama.is_favorite, lIndex)" -->
						<!-- <u-icon :name="1 == 1 ? 'star-fill' : 'star'" color="#eee" size="18"></u-icon> -->
						<!-- <text class="text">{{ lfilmDrama.is_favorite == 1 ? '已追剧' : '前往追剧' }}</text> -->
						<!-- <text class="text">追剧</text> -->
						<!-- </view> -->
						<view class="button">
							<!-- @click.stop="handleCollect(lfilmDrama.vid, lfilmDrama.is_favorite, lIndex)" -->
							<u-icon :name="1 == 1 ? 'star-fill' : 'star'" color="#eee" size="18"></u-icon>
							<!-- <text class="text">{{ lfilmDrama.is_favorite == 1 ? '已追剧' : '前往追剧' }}</text> -->
							<text @click="monunbrn" class="text">播放</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 剧情简介 -->
			<view class="synopsis">
				<view class="synopsis-name">
					剧情简介
				</view>
				<view class="synopsis-dramaDescribe">
					{{filmDrama.dramaDescribe}}
				</view>
			</view>
			<!-- 演员列表 -->
			<!-- <view class="actor">
				<view class="actor-text">
					演员
				</view>
				<view class="actor-box" @click="open">
					<view class="actor-head">
						<image src="../../static/icons/wx.png" mode="aspectFill"></image>
					</view>
					<view class="actor-name">
						{{filmDrama.createBy}}
					</view>
				</view>
				<view class="actor-box" @click="showOpen">
					<view class="actor-head">
						<image src="../../static/icons/wx.png" mode="aspectFill"></image>
					</view>
					<view class="actor-name">
						剧集详情
					</view>
				</view>
			</view> -->
			<!-- 相关推荐 -->
			<view class="related">
				<view class="related-text">
					相关推荐
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
			</view>
		</view>
		<!-- 演员详情 -->
		<view class="opBox">
			<uv-popup round=20 ref="popup" mode="bottom" @change="change" custom-style="min-height: 400rpx;">
				<view>
					<view class="actor-box">
						<view class="actor-head">
							<image src="../../static/icons/wx.png" mode="aspectFill"></image>
						</view>
						<view class="actor-name">
							<text>赵云</text>
							<view class="info">
								艾克橘红颗粒计划了客家话了客家话了看，就会立刻计划老客户考虑建行卡了解好可怜计划
							</view>
						</view>

					</view>
				</view>
			</uv-popup>
		</view>
	</view>
</template>

<script>
	const PlayerManager = require("../../utils/playerManager.js");
	import apiMoen from '../../utils/config.js';
	export default {
		data() {
			return {
				dramaIds: '',
				onShowTab: 0,
				SeriesList: [],
				videoList: [],
				videoQuery: {
					tenantId: apiMoen.tenantId,
					sysOrgCode: apiMoen.sysOrgCode,
				},
				filmDrama: {},
				totalEpisodes: null, // Replace with your actual totalEpisodes value
				list: [{
						name: '1-30'
					},
					{
						name: '31-60'
					},
					{
						name: '61-90'
					},
					{
						name: '91-120'
					}
				],
				selectedList: [], // This will be dynamically set based on totalEpisodes
				sid: 0,
				styles: {
					backgroundColor: '#F2F5F7', // 默认背景颜色
					color: '#333',
				}
			}
		},
		onLoad(option) {
			this.dramaIds = option.dramaId
			this.getVideoList()
			this.filmDramaById()
		},
		mounted() {
			this.setSelectedList();
		},
		methods: {
			monunbrn() {
				uni.navigateBack({
					delta: 1
				})
			},
			change(e) {
				console.log('弹窗状态改变：', e);
			},
			// 剧集切换 
			episodeSwitching(item) {
				console.log("this.剧集切换", item)
				this.sid = item.dramaSeries
			},
			// 显示剧目详情
			showOpen() {
				this.$refs.popups.open();
				this.filmDramaSeriesList()
				this.filmDramaById()
				this.setSelectedList();
				console.log("this.totalEpisodes111", this.totalEpisodes)
			},


			// 剧集列表
			filmDramaSeriesList() {
				this.$request('video.filmDramaSeriesList', {
					id: '100723'
				}).then(res => {
					console.log("获取剧集列表", res)
					if (res.code != 200) {
						uni.showToast({
							title: '系统异常',
							icon: 'none',
							duration: 2000 // 提示框显示时长
						});
					} else {
						this.SeriesList = res.result
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

			// 剧目详情
			filmDramaById() {
				this.$request('video.filmDramaById', {
					dramaId: this.dramaIds
				}).then(res => {
					console.log("获取剧目详情", res)
					if (res.code != 200) {
						uni.showToast({
							title: '系统异常',
							icon: 'none',
							duration: 2000 // 提示框显示时长
						});
					} else {
						this.filmDrama = res.result
						this.totalEpisodes = parseFloat(res.result.totalEpisodes)
						console.log("this.totalEpisodes", this.totalEpisodes)
					}
				}).catch(err => {
					console.log(err)
				})
			},

			// tab切换
			setSelectedList() {
				this.selectedList = []
				// this.filmDramaById()
				// console.log("this.totalEpisodes111333", this.totalEpisodes)
				if (this.totalEpisodes > 0 && this.totalEpisodes <= 30) {
					this.selectedList.push(this.list[0]);
				}
				if (this.totalEpisodes > 30 && this.totalEpisodes <= 60) {
					this.selectedList.push(this.list[0]);
					this.selectedList.push(this.list[1]);
				}
				if (this.totalEpisodes > 60 && this.totalEpisodes <= 90) {
					this.selectedList.push(this.list[0]);
					this.selectedList.push(this.list[1]);
					this.selectedList.push(this.list[2]);
				}
				if (this.totalEpisodes > 90 && this.totalEpisodes <= 120) {
					this.selectedList.push(this.list[0]);
					this.selectedList.push(this.list[1]);
					this.selectedList.push(this.list[2]);
					this.selectedList.push(this.list[3]);
				}
				// You can add more conditions if needed for different ranges
			},
			click(name) {
				this.onShowTab = name.index
				// Handle click event if needed
				console.log('Clicked:', name);
			},

			getStyle(item, sid) {
				// 假设 sid 是已知的全局状态存储
				console.log('item.dramaStatus:', item.dramaStatus);
				// 返回样式对象：背景色设置为蓝色或绿色
				if (item.dramaSeries === sid && item.uploadStatus != 1) {
					return {
						...this.styles,
						backgroundColor: 'rgba(25, 185, 204, 0.1)',
						color: "#19B9CC",
					};
				} else if (item.dramaSeries === sid && item.uploadStatus == 1) {
					return {
						...this.styles,
						backgroundColor: '#90630F',
						color: '#fff',
					}
				} else if (item.uploadStatus == 1) {
					return {
						...this.styles,
						backgroundColor: 'rgba(223, 183, 157, 0.1)',
						color: '#90630F',
					};
				} else {
					return {
						...this.styles,
						backgroundColor: '#F2F5F7',
						color: '#333',
					};
				}
			},


			// 显示演员详情
			open() {
				this.$refs.popup.open();
			},
			// 跳转播放
			openVideoDetail(lItems) {
				var omim = JSON.stringify(lItems)
				uni.navigateTo({
					url: '/pages/video/videoDetails?item=' + encodeURIComponent(omim)
				})
				// PlayerManager.navigateToPlayer({
				// 	srcAppid: uni.getStorageSync('srcAppid'),
				// 	dramaId: lItems.dramaId,
				// 	// extParam: encodeURIComponent('a=b&c=d'), // 分享会携带的参数，可自定义
				// })
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
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	@import 'episode-listing.scss';

	.Plot-details {
		z-index: 9;
		padding: 20rpx;

		.top {
			width: 100%;
			display: flex;
			height: 256rpx;

			.top-cover {
				width: 182rpx;
				height: 256rpx;
				border-radius: 16rpx;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}

				margin-right: 20rpx;
			}

			.right-name {

				// width: 100%;
				.name {
					margin-top: 20rpx;
					line-height: 30rpx;

					.drama-name {
						color: $uni-text-color;
						font-weight: bold;
						font-size: 36rpx;
						margin-bottom: 28rpx;
					}

					.classify-name {
						color: $uni-text-color-inverse;
						font-size: 28rpx;
					}
				}

				.btn {
					margin-top: 20rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.button {
						margin-right: 16rpx;
						margin-top: 32rpx;
						padding-right: 10rpx;
						padding-left: 16rpx;
						height: 80rpx;
						width: 220rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 28rpx;
						background: #FF0066;
						border-radius: 80rpx;
						color: #fff;

						.collect {
							opacity: 0.6;
						}

						.active {
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

		.synopsis {
			margin-top: 80rpx;

			.synopsis-name {
				font-size: 32rpx;
				margin-bottom: 28rpx;
			}

			.synopsis-dramaDescribe {
				font-size: 28rpx;
			}
		}

		.actor {
			margin-top: 80rpx;

			.actor-text {
				font-size: 32rpx;
				margin-bottom: 12rpx;
			}

			.actor-box {
				text-align: center;
				justify-content: center;
				// background-color: #333;
				width: 140rpx;
				margin-right: 20rpx;

				.actor-name {
					font-size: 28rpx;
				}

				.actor-head {
					justify-content: center;
					/* 水平居中 */
					display: flex;
					margin-top: 20rpx;

					image {
						width: 88rpx;
						height: 88rpx;
						border: 50%;
					}
				}
			}
		}

		.related {
			margin-top: 80rpx;

			.related-text {
				font-size: 32rpx;
				margin-bottom: 28rpx;
			}

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
		}
	}

	.opBox {
		.actor-box {
			padding: 40rpx 20rpx;
			display: flex;
			text-align: left;
			justify-content: center;
			// background-color: #333;
			width: 100%;
			margin-right: 20rpx;

			.actor-name {
				margin-left: 20rpx;
				margin-top: 30rpx;
				font-size: 28rpx;
				width: 90%;

				text {
					font-size: 32rpx;
					font-weight: 600;
					margin-bottom: 20rpx;
				}

				.info {
					margin-top: 10rpx;
				}
			}

			.actor-head {
				justify-content: center;
				/* 水平居中 */
				display: flex;
				margin-top: 20rpx;

				image {
					width: 128rpx;
					height: 128rpx;
					border: 50%;
				}
			}
		}
	}
</style>