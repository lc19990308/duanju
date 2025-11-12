<template>
	<view class="page_content">
		<view class="reward_t">
			Tiền vàng của tôi<br><span>100</span>
		</view>
		<view class="reward_list">
			<image src="/static/images/gold.png" class="goldImg" mode=""></image>
			<view class="reward_list_t">Đăng ký đến ngày <span>2</span></view>
			<view class="reward_lists">
				<view class="reward_list_info end">
					<view><image src="/static/images/gold.png" mode=""></image><span>+50</span></view>
					<span class="reward_list_info_t">Ngày 1</span>
				</view>
				<view class="reward_list_info end">
					<view><image src="/static/images/gold.png" mode=""></image><span>+50</span></view>
					<span class="reward_list_info_t">Ngày 2</span>
				</view>
				<view class="reward_list_info on">
					<view><image src="/static/images/gold.png" mode=""></image><span>+50</span></view>
					<span class="reward_list_info_t">Hôm nay</span>
				</view>
				<view class="reward_list_info">
					<view><image src="/static/images/gold.png" mode=""></image><span>+50</span></view>
					<span class="reward_list_info_t">Ngày 4</span>
				</view>
				<view class="reward_list_info">
					<view><image src="/static/images/gold.png" mode=""></image><span>+50</span></view>
					<span class="reward_list_info_t">Ngày 5</span>
				</view>
				<view class="reward_list_info">
					<view><image src="/static/images/gold.png" mode=""></image><span>+50</span></view>
					<span class="reward_list_info_t">Ngày 6</span>
				</view>
				<view class="reward_list_info">
					<view><image src="/static/images/gold.png" mode=""></image><span>+50</span></view>
					<span class="reward_list_info_t">Ngày 7</span>
				</view>
			</view>
			<u-button class="reward-btn">Đăng ký ngay</u-button>
		</view>
		<view class="invite">
			<view class="invite_t">Mời bạn bè</view>
			<view class="invite_info">
				<view class="invite_infos">
					<image src="/static/images/Frame-31.png" class="invite_info_img" mode=""></image>
					<view class="invite_info_left">
						<view>Mời bạn bè</view>
						<br><image src="/static/images/gold.png" mode=""></image><span>+100</span><i>Vàng</i>
					</view>
				</view>
				<u-button class="invite-btn">GO</u-button>
			</view>
		</view>
		<view class="rewardCover" v-if="rewardCover">
			<view class="rewardCover_t">Mời bạn bè</view>
			<view class="rewardCover_info">
				<image src="/static/images/gift.png" class="rewardCover_info_img" mode=""></image>
				
			</view>
			<view class="rewardCover_bottom">
				<image src="/static/images/Frame-44.png" mode=""></image>
				<span>Tạo liên kết</span>
			</view>
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				rewardCover:true,
			}
		},
		onLoad() {
			
			
		},
		onShow() {
			
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		background: #000;
		padding: 0 40rpx;
		.reward_t {
			font-family: Inter, Inter;
			font-weight: bold;
			font-size: 36rpx;
			color: #D1D1D1;
			margin-top: 20rpx;
			line-height: 70rpx;
			span {
				font-family: Inter, Inter;
				font-weight: bold;
				font-size: 40rpx;
				color: #FFCD03;
			}
		}
		.reward_list {
			padding: 0 20rpx;
			margin-top: 30rpx;
			position: relative;
			width: 100%;
			height: 680rpx;
			background-image: url('/static/images/Frame1000001530.png');
			background-repeat: no-repeat;
			background-size: 100% 100%;
			.goldImg {
				position: absolute;
				z-index: 9;
				right: 0;
				top: -180rpx;
				width: 265rpx;
				height: 254rpx;
			}
			.reward_list_t {
				padding: 0 30rpx;
				line-height: 90rpx;
				font-family: Inter, Inter;
				font-weight: 400;
				font-size: 26rpx;
				color: #D1D1D1;
				span {
					font-size: 32rpx;
					color: #FFCD03;
					margin-left: 20rpx;
				}
			}
			.reward_lists {
				width: 100%;
				float: left;
				margin-bottom: 20rpx;
				.reward_list_info {
					float: left;
					width: 21%;
					margin: 0 2%;
					margin-bottom: 20rpx;
					view {
						float: left;
						width: 100%;
						height: 143rpx;
						border: 2rpx solid #383838;
						background: #383838;
						border-radius: 16rpx;
						text-align: center;
						image {
							width: 62rpx;
							height: 59rpx;
							margin-top: 30rpx;
							margin-left: 50%;
							margin-left: 40rpx;
						}
						span {
							font-family: Inter, Inter;
							font-weight: 400;
							font-size: 28rpx;
							color: #FFCD03;
						}
					}
					.reward_list_info_t {
						margin-top: 20rpx;
						width: 100%;
						float: left;
						text-align: center;
						font-family: Inter, Inter;
						font-weight: 400;
						font-size: 26rpx;
						color: #D1D1D1;
					}
				}
				.reward_list_info.end {
					view {
						background: rgba(255,205,3,0.2);
						border-radius: 16rpx;
						border: 2rpx solid #FFCD03;
						span {
							color: #D1D1D1;
						}
					}
				}
				.reward_list_info.on {
					.reward_list_info_t {
						color: #FFCD03;
					}
				}
			}
			.reward-btn {
				height: 88rpx;
				background: linear-gradient( 90deg, #3EF2FF 0%, #FFE23E 100%);
				border-radius: 94rpx;
				font-family: Inter, Inter;
				font-weight: 400;
				font-size: 27rpx;
				color: #000000;
			}
		}
		.invite {
			width: 100%;
			float: left;
			.invite_t {
				width: 100%;
				float: left;
				line-height: 60rpx;
				font-family: Inter, Inter;
				font-weight: 400;
				font-size: 28rpx;
				margin-top: 30rpx;
				color: #FFFFFF;
			}
			.invite_info {
				width: 100%;
				height: 141rpx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				background: linear-gradient( 185deg, #262626 0%, #252525 100%);
				border-radius: 20rpx;
				border: 2rpx solid;
				border-image: linear-gradient(135deg, rgba(233, 233, 233, 0.2), rgba(233, 233, 233, 1), rgba(233, 233, 233, 0.2)) 1 1;
				.invite_infos {
					width: 70%;
					.invite_info_img {
						float: left;
						margin-left: 32rpx;
						margin-top: 27rpx;
						width: 88rpx;
						height: 88rpx;
					}
					.invite_info_left {
						margin-left: 130rpx;
						line-height: 26rpx;
						margin-top: 30rpx;
						font-family: Inter, Inter;
						font-weight: 400;
						font-size: 28rpx;
						color: #FFFFFF;
						
						image {
							width: 36rpx;
							height: 34rpx;
							float: left;
						}
						span {
							font-family: Inter, Inter;
							font-weight: 400;
							font-size: 26rpx;
							margin: 0 10rpx;
							color: #FFCD03;
						}
						i {
							font-style: normal;
							font-family: Inter, Inter;
							font-weight: 400;
							font-size: 26rpx;
							color: #999999;
						  }
					}
				}
				.invite-btn {
					width: 106rpx;
					height: 65rpx;
					text-align: center;
					font-family: Inter, Inter;
					font-weight: bold;
					font-size: 27rpx;
					color: #000000;
					margin-top: 38rpx;
					margin-right: 36rpx;
					line-height: 65rpx;
					background: linear-gradient( 90deg, #3EF2FF 0%, #FFE23E 100%);
					border-radius: 94rpx;
				}
			}
		}
		.rewardCover {
			width: 100%;
			height: 100%;
			position: fixed;
			z-index: 99999;
			left: 0;
			top: 0;
			bottom: 0;
			background-color: #000;
			background-image: url(/static/images/yqpy.png);
			background-repeat: no-repeat;
			background-size: cover;
			background-position: center center;
			.rewardCover_t {
				width: 100%;
				float: left;
				text-align: center;
				margin-top: 80rpx;
				margin-bottom: 70rpx;
				font-family: Inter, Inter;
				font-weight: bold;
				font-size: 40rpx;
				color: #FFCD03;
			}
			.rewardCover_info {
				position: relative;
				width: 100%;
				float: left;
				height: 842rpx;
				background-image: url(/static/images/Frame1000001593.png);
				background-repeat: no-repeat;
				background-size: auto 100%;
				background-position: center bottom;
				.rewardCover_info_img {
					width: 300rpx;
					height: 300rpx;
					position: absolute;
					z-index: 9;
					right: 1%;
					top: -100rpx;
				}
			}
			.rewardCover_bottom {
				margin-top: 50rpx;
				width: 100%;
				float: left;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-family: Inter, Inter;
				font-weight: 400;
				font-size: 24rpx;
				color: #D1D1D1;
				image {
					width: 88rpx;
					height: 88rpx;
					margin-bottom: 32rpx;
				}
			}
		}
	}
</style>
