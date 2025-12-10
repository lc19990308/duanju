<template>
	<view class="app-container">
		<statusBar />
		<u-navbar :title="$t(`creation.pageTitle`)" :fixed='true' :autoBack="true" bgColor='transparent'
			:titleStyle='titleStyle' leftIconColor='#fff' :placeholder='true' />
		<view class="video-box">
			<navigator url="/pages/user/framer/add-framer" hover-class="none" class="video-box-item-style1">
				<view class="icon">
					<u-icon name="plus" color="#666666" size="14"></u-icon>
				</view>
				<view class="tips">{{$t('creation.uploadText')}}</view>
			</navigator>
			<view class="video-box-item-style2" v-for="(item,index) in list" :key="index">
				<view class="auth-status">{{ auditStatus[lang][item.auditStatus]}}</view>
				<image class="cover" :src="item.pictureUrl" :lazy-load="true" mode=""></image>
				<view class="tips">{{item.videoName}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '@/utils/config.js'
	export default {
		data() {
			return {
				titleStyle: {
					color: '#fff',
					fontFamily: 'PingFang SC, PingFang SC',
					fontWeight: 800,
					color: '#FFFFFF',
				},
				query: {
					memberId: uni.getStorageSync('id'),
					tenantId: api.tenantId,
					column: 'createTime',
					order: 'desc',
					pageNo: 1,
					pageSize: 20,
				},
				list: [],
				total: 0,
				lang: uni.getStorageSync('lang'),
				auditStatus: {
					zh_CN: {
						0: '待审核',
						1: '审核通过',
						2: '审核拒绝'
					},
					vi_VN: {
						0: 'Chờ duyệt',
						1: 'Đã duyệt',
						2: 'Từ chối'
					},
					zh_EN: {
						0: 'Pending Review',
						1: 'Approved',
						2: 'Rejected'
					}
				}
			}
		},
		methods: {
			resetQuery() {
				this.query.pageNo = 1;
				this.list = [];
			},
			getVideoList() {
				this.$request('video.memberVideoList', this.query).then(res => {
					this.total = res.result.total;
					this.list = this.list.concat(res.result.records);
					uni.stopPullDownRefresh();
					if (this.total === this.list.length) {
						this.status = 'nomore'
					} else {
						this.status = 'loadmore'
					}
				})
			},
		},
		onShow() {
			this.resetQuery();
			this.getVideoList();
		},
		onReachBottom() {
			if (this.total > this.list.length) {
				this.query.pageNo += 1;
				this.getVideoList();
			}
		},
		onPullDownRefresh() {
			this.resetQuery();
			this.getVideoList();
		},
	}
</script>

<style lang="scss" scoped>
	.app-container {
		min-height: 100vh;
		background-image: url('/static/images/navbar-bg.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-position: 100% 100%;
	}

	.video-box {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
		margin: 20rpx 18rpx 0 18rpx;
	}

	.video-box-item-style1 {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		width: 223rpx;
		height: 268rpx;
		background: linear-gradient(185deg, #262626 0%, #252525 100%);
		border-radius: 8rpx;

		.icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 50rpx;
			height: 50rpx;
			background: #252525;
			border: 6rpx solid #666;
			border-radius: 0px 0px 0px 0px;
		}

		.tips {
			width: 171px;
			height: 27px;
			margin-top: 20rpx;
			font-weight: 400;
			font-size: 22rpx;
			color: #666666;
			text-align: center;
		}
	}

	.video-box-item-style2 {
		position: relative;
		width: 223rpx;
		height: 268rpx;
		background: linear-gradient(185deg, #262626 0%, #252525 100%);
		border-radius: 16rpx;
		.auth-status{
			position: absolute;
			right: 0;
			top: 0;
			padding: 5rpx 8rpx;
			font-size: 20rpx;
			border-radius: 10rpx;
			background-color: #262626;
			opacity: .6;
			color: #fff;
			z-index: 999;
		}
		.cover {
			width: 100%;
			height: 100%;
		}

		.tips {
			width: 100%;
			position: absolute;
			bottom: 0;
			left: 0;
			font-weight: 400;
			font-size: 26rpx;
			color: #FFFFFF;
			height: 60rpx;
			line-height: 60rpx;
			padding: 0 12rpx;
			background: rgba(37, 37, 37, 0.6);
			border-radius: 0px 0px 0px 0px;
		}
	}
</style>