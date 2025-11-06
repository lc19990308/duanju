<!--首页-->
<template>
	<view class="app-container">
		<view class="navbar">
			<view class="navbar-head">
				<view class="logo">
					<view class="icon"></view>
					<view class="logo-text">Truyện ngắn Monkey</view>
				</view>
				<view class="right-icon"></view>
			</view>
			<view class="search-box">
				<input type="text" placeholder="Tìm kiếm" />
				<u-icon name="search" color="#999" size="28"></u-icon>
			</view>
		</view>
		<u-swiper :list="list2" keyName="image" radius="5" bgColor="#ffffff" previousMargin="30" nextMargin="30"
			indicator indicatorMode="line" :autoplay="false" circular></u-swiper>
		<view class="tabs">
			<view class="tabs-item">
				tất cả
			</view>
			<view class="tabs-item">
				Võ hiệp
			</view>
			<view class="tabs-item">
				Hiện đại
			</view>
			<view class="tabs-item">
				hồi hộp
			</view>
		</view>
		<view class="card">
			<view class="card-item" v-for="(item,index) in 9 " :key="index">
				<view class="cover"></view>
				<view class="title">bộ phim cổ ...</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list2: [{
						image: "https://uviewui.com/swiper/swiper2.png",
						title: "昨夜星辰昨夜风，画楼西畔桂堂东",
					},
					{
						image: "https://uviewui.com/swiper/swiper1.png",
						title: "身无彩凤双飞翼，心有灵犀一点通",
					},
					{
						image: "https://uviewui.com/swiper/swiper3.png",
						title: "谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳",
					},
				],
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #000;
	}
	.navbar{
		padding: 22rpx 24rpx 16rpx 24rpx;
		.navbar-head{
			display: flex;
			align-items: center;
			justify-content: space-between;
			.logo{
				display: flex;
				align-items: center;
				.icon{
					width: 69rpx;
					height: 63rpx;
					background-color: red;
					border-radius: 50%;
				}
				.logo-text{
					margin-left: 11rpx;
					font-family: Kenia, Kenia;
					font-weight: 400;
					font-size: 36rpx;
					color: #FFFFFF;
				}
			}
			.right-icon{
				width: 78rpx;
				height: 78rpx;
				background-color: red;
				border-radius: 50%;
			}
		}
		.search-box{
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 25rpx auto 0 auto;
			padding: 18rpx 15rpx 18rpx 42rpx;
			width: 500rpx;
			height: 64rpx;
			background: rgba(255,255,255,0.3);
			border-radius: 37rpx;
		}
	}
	.tabs {
		display: flex;
		margin: 0 34rpx;

		.tabs-item {
			width: 160rpx;
			height: 65rpx;
			margin-right: 24rpx;
			line-height: 65rpx;
			text-align: center;
			background: #202020;
			border-radius: 94rpx;
			font-family: Inter, Inter;
			font-weight: 400;
			font-size: 27rpx;
			color: #D1D1D1;
		}
	}

	.card {
		margin: 34rpx 36rpx 0 36rpx;
	}

	.card-item {
		display: inline-block;
		width: calc((100% - 48rpx) / 3);
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 69%, rgba(0, 0, 0, 0.9) 100%);
		border-radius: 20rpx 20rpx 0px 0px;
		margin-bottom: 26rpx;

		.cover {
			width: 100%;
			height: 268rpx;
			background-color: red;
			border-radius: 20rpx 20rpx 0px 0px;
		}

		.title {
			padding: 18rpx 22rpx;
			background: #282828;
			border-radius: 0px 0px 20px 20px;
			font-family: Inter, Inter;
			font-weight: 400;
			font-size: 26rpx;
			color: #FFFFFF;
		}
	}

	.card-item:nth-child(3n-1) {
		margin: 0 24rpx;
	}
</style>