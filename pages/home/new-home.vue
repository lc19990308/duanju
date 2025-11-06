<!--首页-->
<template>
	<view class="app-container">
		<view class="navbar">
			<view class="navbar-head">
				<view class="logo">
					<image class="icon" src="/static/images/Frame.png" mode=""></image>
					<image class="logo-text" src="/static/images/logo-text.png" mode=""></image>
				</view>
				<image class="right-icon" src="/static/images/gift1.png" mode=""></image>
			</view>
			<view class="search-box">
				<input type="text" placeholder="Tìm kiếm" />
				<u-icon name="search" color="#999" size="28"></u-icon>
			</view>
		</view>
		<view class="swiperItem">
			<HR_swiper s_type="swiper2" s_style="height:600rpx" :s_list="swiper2List" @bindChange="change2"
				@bindItem="bindItem2">
			</HR_swiper>
		</view>
		<view class="tabs">
			<view class="tabs-item tabs-item_active">
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
	import HR_swiper from "@/uni_modules/hongren-swiper/components/hongren-swiper/hongren-swiper.vue";

	export default {
		components: {
			HR_swiper
		},
		data() {
			return {
				swiper2List: [{
						id: 7,
						path: "",
						image: "https://img.pic88.com/preview/2020/09/03/***21176.jpg!t640?imageView2/1/sharpen/1"
					},
					{
						id: 1,
						path: "/pages/index/index",
						image: "https://img.pic88.com/preview/2020/08/05/***460246.jpg!s640?imageView2/1/sharpen/1"
					},
					{
						id: 2,
						path: "",
						image: "https://img.pic88.com/16056878326348.jpg?imageMogr2/quality/90!/thumbnail/640/sharpen/1/"
					},
					{
						id: 3,
						path: "",
						image: "https://img.pic88.com/preview/2020/09/02/***26270.jpg!t640?imageView2/1/sharpen/1"
					},
					{
						id: 4,
						path: "",
						image: "https://img.pic88.com/16056541538809.jpg?imageMogr2/quality/90!/thumbnail/640/sharpen/1/"
					},
					{
						id: 5,
						path: "",
						image: "https://img.pic88.com/preview/2020/09/03/***22672.jpg!t640?imageView2/1/sharpen/1"
					},
					{
						id: 6,
						path: "",
						image: "https://img.pic88.com/preview/2020/09/02/***25720.jpg!t640?imageView2/1/sharpen/1"
					}
				],
			}
		},
		methods: {
			change2(e) {
				let {
					current
				} = e.detail
				console.log('change2: ', current);
			},
			bindItem2(evt) {
				let {
					item
				} = evt.currentTarget.dataset
				console.log('bindItem2: ', item);
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-image: url('/static/images/navbar-bg.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-color: #000;
	}

	.navbar {
		padding: 22rpx 24rpx 16rpx 24rpx;

		.navbar-head {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.logo {
				display: flex;
				align-items: center;

				.icon {
					width: 69rpx;
					height: 63rpx;
					border-radius: 50%;

				}

				.logo-text {
					width: 293rpx;
					height: 36rpx;
					margin-left: 11rpx;
				}
			}

			.right-icon {
				width: 78rpx;
				height: 78rpx;
			}
		}

		.search-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 25rpx auto 0 auto;
			padding: 18rpx 15rpx 18rpx 42rpx;
			width: 500rpx;
			height: 64rpx;
			background: rgba(255, 255, 255, 0.3);
			border-radius: 37rpx;
		}
	}

	.swiperItem {
		position: relative;
		width: 100%;
		min-height: 300rpx;
		margin-bottom: 30rpx;
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
		.tabs-item_active{
			background: linear-gradient( 90deg, #3EF2FF 0%, #FFE23E 100%);
			color: #000000;
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

	.swiperItem{
		margin-top: 32rpx;
	}

	::v-deep .swiper2_item {
		border-radius: 20rpx;
		width: 100%;
		height: 100%;
	}

	::v-deep .uni-swiper-slides {
		width: 342rpx;
		height: 456rpx;
	}

	// ::v-deep .swiper-item-card{
	// 	width: 342rpx !important;
	// }
</style>