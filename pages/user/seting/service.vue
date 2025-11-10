<!--联系客服-->
<template>
	<view class="app-container">
		<u-navbar title="Liên hệ h hỗ trợ khách hàng" bgColor='transparent' :titleStyle='titleStyle' leftIconColor='#fff' :autoBack="true" :placeholder='true' />

		<view class="chat-box">
			<view class="time">2025.01.24 16:22:34</view>

			<!-- 对方消息 -->
			<view class="chat-item left">
				<view class="avatar">
					<image src="/static/images/Frame.png" mode=""></image>
				</view>
				<view class="user-info">
					<view class="nickname">Truyện ngắn Monkey</view>
					<view class="msg-box">
						Xin vui lòng để lại tin nhắn của bạn trực tiếp...
					</view>
				</view>
			</view>

			<!-- 自己消息 -->
			<view class="chat-item right">
				<view class="avatar">
					<image src="/static/images/Frame.png" mode=""></image>
				</view>
				<view class="user-info">
					<view class="nickname">Bạn</view>
					<view class="msg-box">
						Tôi có một câu hỏi...
					</view>
				</view>
			</view>
		</view>
		<!--问题卡片-->
		<view class="issue-card">
			<view class="issue-action">
				<image class="question-circle" src="/static/images/Frame-43.png" mode=""></image>
				<view class="issue-text">Câu hỏi nhanh</view>
			</view>
			<view class="issue-content">
				<view class="issue-item boder-top-lr">
					<view class="label">Nạp tiền thất bại</view>
					<u-icon name="arrow-right" color="#999" size="16"></u-icon>
				</view>
				<view class="issue-item ">
					<view class="label">Muốn hoàn tiền</view>
					<u-icon name="arrow-right" color="#999" size="16"></u-icon>
				</view>
				<view class="issue-item ">
					<view class="label">Thời hạn sử dụng đồng xu vàng</view>
					<u-icon name="arrow-right" color="#999" size="16"></u-icon>
				</view>
				<view class="issue-item boder-bottom-lr">
					<view class="label">Phim ngắn không chơi được</view>
					<u-icon name="arrow-right" color="#999" size="16"></u-icon>
				</view>
			</view>
		</view>
		<view class="fill-box" />
		<view class="footer-action">
			<view class="input-boder">
				<view class="input-box">
					<input type="text" :placeholderStyle='placeholderStyle'
						placeholder="Vui lòng nhập câu hỏi của bạn..." />
				</view>
			</view>
			<view class="input-icon">
				<image class="icon" src="/static/images/Frame-42.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				placeholderStyle: 'color: #666;',
				titleStyle: {
					color: '#fff',
					fontFamily: 'PingFang SC, PingFang SC',
					fontWeight: 800,
					color: '#FFFFFF',
				},
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #000;

	}

	.app-container {
		min-height: 100vh;
		background-image: url('/static/images/navbar-bg.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-position: 100% 100%;
	}


	.footer-action {
		display: flex;
		align-items: center;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 156rpx;
		padding: 16rpx 36rpx;
		box-sizing: border-box;
		background-color: #202020;
	}

	.fill-box {
		height: 156rpx;
	}

	.input-boder {
		position: relative;
		border-radius: 50rpx;
		width: 566rpx;
		box-sizing: border-box;
		padding: 2rpx;
		/* 边框宽度 */
		background: linear-gradient(135deg, rgba(233, 233, 233, 0.2), rgba(233, 233, 233, 0.6), rgba(233, 233, 233, 0.2));
	}

	.input-box {
		background: #000;
		/* 内部背景色 */
		padding: 30rpx 24rpx;
		border-radius: 50rpx;
		font-family: Inter, Inter;
		font-weight: 400;
		font-size: 28rpx;
		color: #666666;
	}

	.input-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 108rpx;
		margin-left: 24rpx;
		height: 108rpx;
		background: linear-gradient(185deg, #262626 0%, #252525 100%);
		border-radius: 50%;
		border: 2rpx solid;
		image{
			width: 70rpx;
			height: 70rpx;
		}
	}

	.issue-card {
		.issue-action {
			display: flex;
			align-items: center;
			width: 340rpx;
			margin-left: 36rpx;
			border-radius: 46rpx;
			margin-bottom: 16rpx;
			border: 2rpx solid;
			padding: 15rpx 27rpx;
			box-sizing: border-box;
			background-image: url('/static/images/Framebg.png');
			background-size: 100% 100%;
			background-repeat: no-repeat;

			.question-circle {
				width: 34rpx;
				height: 34rpx;
			}

			.issue-text {
				font-family: Inter, Inter;
				font-weight: 400;
				font-size: 28rpx;
				color: #FFCD03;
				margin-left: 20rpx;
			}
		}

		.issue-content {
			width: 678rpx;
			margin: 0 auto;
			background-image: url('/static/images/frame-card.png');
			background-repeat: no-repeat;
			background-size: 100% 100%;
			padding: 15rpx;
			border-radius: 20rpx;

			.issue-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 30rpx 24rpx;

				.label {
					font-family: Inter, Inter;
					font-weight: 400;
					font-size: 28rpx;
					color: #999999;
				}
			}

			.boder-top-lr {
				// border-radius: 20rpx 20rpx 0 0;
			}

			.boder-bottom-lr {
				// border-radius: 0 0 20rpx 20rpx;
			}
		}
	}

	.chat-box {
		margin: 0 34rpx;

		.time {
			text-align: center;
			font-family: Inter, Inter;
			font-weight: 400;
			font-size: 24rpx;
			color: #D1D1D1;
			margin-top: 38rpx;
			margin-bottom: 36rpx;
		}

		.chat-item {
			display: flex;
			margin-bottom: 44rpx;

			&.left {
				flex-direction: row;

				.user-info {
					margin-left: 24rpx;
					margin-right: 0;
					align-items: flex-start;
				}
			}

			&.right {
				flex-direction: row-reverse;

				.user-info {
					margin-right: 24rpx;
					margin-left: 0;
					align-items: flex-end;

					.msg-box {
						background: #2C2C2C; // 可区分背景色
					}
				}
			}

			.avatar {
				width: 100rpx;
				height: 100rpx;
				border-radius: 81rpx;
				border: 2rpx solid #6D6864;
				flex-shrink: 0;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.user-info {
				flex: 1;
				display: flex;
				flex-direction: column;

				.nickname {
					font-family: Inter, Inter;
					font-weight: 400;
					font-size: 28rpx;
					color: #999999;
				}

				.msg-box {
					max-width: 462rpx;
					margin-top: 16rpx;
					padding: 16rpx 24rpx;
					background: #1F1F1F;
					border-radius: 16rpx;
					font-family: Inter, Inter;
					font-weight: 400;
					font-size: 24rpx;
					color: #D1D1D1;
					box-shadow: 2rpx 2rpx 2rpx #1F1F1F;
				}
			}
		}
	}
</style>