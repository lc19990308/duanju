<!--积分明细-->
<template>
	<view class="app-container">
		<u-navbar title="Chi tiết" :autoBack="true" :placeholder='true' />
		<view class="tabs">
			<view class="tabs-item tabs-item_active">
				điểm tích lũy
			</view>
			<view class="tabs-item">
				Hồ sơ rút tiền
			</view>
		</view>
		<view class="list">
			<view class="list-item">
				<view class="item-row">
					<view class="label">Đổi 2000 điểm</view>
					<view class="value">+50 vàng</view>
				</view>
				<view class="item-row">
					<view class="time">2024.05.20 11:20:11</view>
					<view class="red value">+50 vàng</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		},
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #000;
	}

	.tabs {
		display: flex;
		position: sticky;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 999;
		padding: 0 36rpx;
		margin-top: 16rpx;
	}

	.tabs-item {
		flex: 1;
		text-align: center;
		width: 205px;
		height: 88rpx;
		line-height: 88rpx;
		font-family: Inter, Inter;
		font-weight: 400;
		font-size: 32rpx;
		color: #999999;
	}

	.tabs-item_active {
		color: #fff;
	}

	.list-item {
		width: 678rpx;
		margin: 16rpx auto 0 auto;
		background: #2F2D34;
		box-sizing: border-box;
		padding: 26rpx 24rpx;
		border-radius: 30rpx;

		.item-row {
			margin-top: 17rpx;
			display: flex;
			justify-content: space-between;
			font-family: Inter, Inter;
			font-weight: 400;
			font-size: 30rpx;
			color: #D1D1D1;
			.time {
				
				font-family: Inter, Inter;
				font-weight: 400;
				font-size: 24rpx;
				color: #D1D1D1;
			}
		}

		.red {
			color: red;
		}
	}
</style>