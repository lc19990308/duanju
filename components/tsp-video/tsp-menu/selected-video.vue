<template>
	<u-popup :show="show" :closeOnClickOverlay='true' @close="close" :round="10" @open="open">
		<view class="selected-video">
			<view class="selected-video-head">
				<image class="cover"
					src="https://monkey-short-video.oss-cn-beijing.aliyuncs.com/temp/p2926391728_1763025389915.jpg"
					mode=""></image>
				<view class="content">
					<view class="video-info">
						<text class="video-info-title">Phượng Nghịch Thiên Hạ</text>
						<uni-icons type="right" color="#fff" size="14"></uni-icons>
					</view>
					<text class="des-text">
						ột nữ CEO tài ba đột nhiên xuyên không thành công chúa bị ghẻ lạnh thời cổ đại. Ở đây, nàng dùng
						trí tuệ và kỹ năng quản lý tài chính thời hiện đại để lật đổ hoàng cung, thu phục các mỹ nam, và
						bước
					</text>
				</view>
			</view>
			<view class="video-box">
				<view class="video-box-item video-box-item_active" v-for="(item,index) in videoList" :key="index">
					<text class="video-box-item-text">{{item.dramaSeries}}</text>
					<view class="lock-box" v-if="item.unlockStatus === 3">
						<u-icon name="lock-opened-fill"  color="#fff" size="18"></u-icon>
					</view>
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
	import api from '@/utils/config.js'
	export default {
		props: {
			videoList:{
				type:Array,
				default:()=>{
					return []
				}
			}
		},
		data() {
			return {
				show: false,
				current: 0,
				memberId: uni.getStorageSync('memberId') || '',
				pageNo: 1,
				pageSize: 1000,
				vodeoList:[],
			}
		},
		methods: {
			close() {
				this.show = false;
			},
			open() {
				console.log('open')
				this.show = true;
				// this.getVideData();

			},
			//获取剧集列表
			async getVideData() {
				const [error, res] = await uni.request({
					url: `${api.MPWEIXIN}/api/appApi/filmDramaSeriesList`,
					method: 'GET',
					data: {
						dramaId: this.dramaId,
						memberId: this.memberId,
						pageNo: this.pageNo,
						pageSize: this.pageSize,
					},
				})
				if(res.data.code === 200){
					this.vodeoList = res.data.result.records;
				}
				const [errorVideoInfo, videoInfo] = await uni.request({
					url: `${api.MPWEIXIN}/api/appApi/filmDramaById`,
					method: 'GET',
					data: {
						id: this.dramaId,
					},
				})
				console.log(videoInfo,'videoInfo')
			},

		},
	}
</script>

<style lang="scss" scoped>
	.selected-video {
		padding: 30rpx;
		background-color: #000;
		height: 700rpx;
	}

	.selected-video-head {
		flex-direction: row;
	}

	.cover {
		width: 150rpx;
		height: 200rpx;
	}

	.content {
		margin-left: 30rpx;
		flex: 1;
	}

	.video-info {
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 30rpx;

		.video-info-title {
			font-size: 36rpx;
			font-weight: 500;
			color: #fff;
		}
	}

	.des-text {
		color: #fff;
		font-size: 30rpx;
		margin-top: 10rpx;
		lines: 2;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.video-box {
		position: relative;
		flex-direction: row;
		flex-wrap: wrap;
		margin-top: 20rpx;

		.video-box-item {
			flex-direction: row;
			justify-content: center;
			align-items: center;
			width: 90rpx;
			height: 90rpx;
			background: #2a2a2a;
			border-radius: 8rpx;
			margin-right: 15rpx;
			margin-bottom: 15rpx;

			.video-box-item-text {
				color: #fff;
				font-size: 24rpx;
			}
		}

		.video-box-item_active {
			background-color: rgb(25, 23, 23) !important;
		}

	}

	.lock-box {
		position: absolute;
		right: 0;
		top: 0;
		background-color: #90630F;
		border-radius: 0px 8rpx 0px 8rpx;
	}
</style>