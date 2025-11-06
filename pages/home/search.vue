<template>
	<view class="app-container">
		<u-navbar title="" :autoBack="true" :placeholder='true'>
			<template slot='center'>
				<view class="input-box">
					<input type="text" placeholder="Tìm kiếm" />
					<u-icon name="search" color="#8a9d9f" size="28"></u-icon>
				</view>
			</template>
		</u-navbar>
		<view class="remove-block">
			<view class="action-row">
				<view class="action-text">Lịch sử tìm kiếm</view>
				<view class="remove">
					<u-icon name="trash" color="#FFFFFF" size="28"></u-icon>
				</view>
			</view>
			<view class="remove-content">
				<view class="remove-item">Rơi vào tình yêu</view>
				<view class="remove-item">Bất chấp tất cả</view>
				<view class="remove-item">Làm ơn đừng chiều chuộng tôi</view>
				<view class="remove-item">hồi hộp</view>
			</view>
		</view>
		<!--热搜词-->
		<view class="hot-keyword">
			<view class="hot-keyword-action">
				<view class="action-text">
					Tìm kiếm nóng
				</view>
				<view class="action-icon">
					<u-icon name="trash" color="#FFFFFF" size="28"></u-icon>
				</view>
			</view>
			<view class="hot-content">
				<view class="hot-item">
					<view class="hot-text">Rơi vào tình yêu</view>
					<view class="icon"></view>
				</view>
				<view class="hot-item">
					<view class="hot-text">Bất chấp tất cả</view>
					<view class="icon"></view>
				</view>
				<view class="hot-item">
					<view class="hot-text">Làm ơn đừng chiều chuộng tôi</view>
					<view class="icon"></view>
				</view>
				<view class="hot-item">
					<view class="hot-text">hồi hộp</view>
					<view class="icon"></view>
				</view>
			</view>
		</view>
		<!--搜索排行榜单-->
		<view class="book-list">
			<view class="title">
				<view class="text">Phổ biến gần đây</view>
				<view class="icon"></view>
			</view>
			<view class="book-list-item" v-for="(item,index) in 3" :key="index">
				<view class="cover">
					
				</view>
				<view class="content">
					<view class="book-title">bộ phim cổ ...</view>
					<view class="tag">
						<view class="tag-item">Ngọt ngào</view>
						<view class="tag-item">dễ thương</view>
					</view>
					<view class="desc">
						Tại bất ngờ xuyên qua đến chính mình tiểu thuyết thế giới...
					</view>
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
		min-height: 100vh;
		background-color: #000000;
	}

	.input-box {
		width: 640rpx;
		display: flex;
		align-items: center;
		padding: 10rpx 20rpx;
		height: 64rpx;
		margin-left: 50rpx;
		background: #f7f7f7;
		border-radius: 37rpx;
	}

	.uni-input-input {
		width: 100%;
	}

	uni-input {
		width: 100%;
	}
	.remove-block{
		padding: 18rpx 36rpx;
		.action-row{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.action-text{
				font-family: Inter, Inter;
				font-weight: bold;
				font-size: 32rpx;
				color: #D1D1D1;
			}
		}
		.remove-content{
			margin-top: 18rpx;
			.remove-item{
				display: inline-block;
				padding: 16rpx 32rpx;
				margin-bottom: 24rpx;
				margin-right: 24rpx;
				background: #2F2D34;
				border-radius: 24rpx;
				font-family: Inter, Inter;
				font-weight: 400;
				font-size: 27rpx;
				color: #D1D1D1;
			}
		}
	}
	.hot-keyword{
		padding: 18rpx 36rpx;
		.hot-keyword-action{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.action-text{
				font-family: Inter, Inter;
				font-weight: bold;
				font-size: 32rpx;
				color: #D1D1D1;
			}
		}
		.hot-content{
			.hot-item{
				display: inline-block;
				margin-right: 24rpx;
				height: 66rpx;
				border-radius: 24rpx;
				.hot-text{
					font-family: Inter, Inter;
					font-weight: 400;
					font-size: 27rpx;
					color: #999999;
				}
			}
		}
	}
	.book-list{
		.title{
			padding: 18rpx 36rpx;
			.text{
				font-family: Inter, Inter;
				font-weight: bold;
				font-size: 32rpx;
				color: #FFCD03;
			}
		}
		.book-list-item{
			display: flex;
			margin: 0 auto 20rpx auto;
			padding: 24rpx;
			box-sizing: border-box;
			width: 678rpx;
			height: 316rpx;
			background: linear-gradient( 90deg, rgba(255,205,3,0.2) 0%, rgba(255,205,3,0) 100%);
			border-radius: 24rpx;
			.cover{
				width: 210rpx;
				height: 268rpx;
				background: linear-gradient( 180deg, rgba(0,0,0,0.2) 69%, rgba(0,0,0,0.9) 100%);
				border-radius: 12rpx;
			}
			.content{
				flex: 1;
				margin-left: 25rpx;
				.book-title{
					font-family: Inter, Inter;
					font-weight: 400;
					font-size: 32rpx;
					color: #FFFFFF;
				}
				.desc{
					margin-top: 24rpx;
					font-family: Inter, Inter;
					font-weight: 400;
					font-size: 22rpx;
					color: #666666;
				}
				.tag{
					margin-top: 24rpx;
					.tag-item{
						display: inline-block;
						width: 158rpx;
						height: 48rpx;
						margin-right: 24rpx;
						line-height: 48rpx;
						text-align: center;
						background: #2F2D34;
						border-radius: 29rpx;
						font-family: Inter, Inter;
						font-weight: 400;
						font-size: 22rpx;
						color: #D1D1D1;
					}
				}
			}
		}
	}
</style>