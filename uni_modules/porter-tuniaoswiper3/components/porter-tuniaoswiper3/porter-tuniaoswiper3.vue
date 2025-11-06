<template>
	<view class="porter-tuniaoswiper3">
		<swiper class="card-swiper" :circular="circular" :autoplay="autoplay" :duration="duration" :interval="interval"
			previous-margin="185rpx" next-margin="185rpx" @change="cardSwiper" >
			<swiper-item v-for="(item,index) in swiperList" :key="index" :class="currentCardCur==index?'cur':''">
				<!-- <view class="swiper-item image-banner">
		       <image :src="item.url" mode="widthFix" v-if="item.type=='image'"></image>
		     </view> -->
				<!-- <view class="swiper-item image-banner" :style="'background-image:url('+ item.url + ');width: 230rpx;height: 100%;background-size:100% 100%;'">
		     </view> -->

				<view class="tnphone-black-min swiper-item  wow fadeInLeft2">
					<view class="skin wow box fadeInRight2">
						<view class="screen wow fadeInUp2">
							<!-- <view class="head">
		     			  <text>{{item.name}}</text>
		     		  </view> -->
			<!-- 				<view class="peak wow">
								<view class="sound"></view>
								<view class="lens"></view>
							</view> -->
							<!-- <view class="area-l">
		     			  <view class="">
		               <text class="tn-icon-all"></text>
		               <text class="tn-icon-wifi tn-padding-left-xs"></text>
		     			  </view>
		     		  </view>
		     		  <view class="area-r">
		     			  <view class="">
		               <text class="tn-icon-light"></text>
		               <text class="tn-icon-time tn-padding-left-xs"></text>
		             </view>
		     		  </view> -->
							<!-- <div class="talk"></div> -->

							<view class="image-banner">
								<image :src="item.url" mode="aspectFill" v-if="item.type=='image'"></image>
							</view>

						</view>
					</view>
				</view>
				<view class="swiper-item-text tn-text-center">
					<view class="tn-text-xl tn-text-bold tn-padding-top-xs" :style="{color:contentColor}">{{item.name}}</view>
				</view>
			</swiper-item>
		</swiper>

		<view v-if="regularShow" class="tn-text-center year-text">
			<view class="tn-text-xxl tn-text-bold">
				<text :style="{color:contentColor}">{{regularContent}}</text>

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'porter-tuniaoswiper3',
		props: {
			swiperList: {
				type: Array,
				default: () => [{
					id: 0,
					type: 'image',
					name: '新年快乐，恭喜发财',
					url: 'https://tnuiimage.tnkjapp.com/bless/bless-1.jpg',
					pngurl: 'https://tnuiimage.tnkjapp.com/swiper/c4d1.png'
				}, {
					id: 1,
					type: 'image',
					name: '年年有福，开门大红',
					url: 'https://tnuiimage.tnkjapp.com/bless/bless-2.jpg',
					pngurl: 'https://tnuiimage.tnkjapp.com/swiper/c4d2.png'
				}, {
					id: 2,
					type: 'image',
					name: '眼疾手快，票子多多',
					url: 'https://tnuiimage.tnkjapp.com/bless/bless-3.jpg',
					pngurl: 'https://tnuiimage.tnkjapp.com/swiper/c4d3.png'
				}, {
					id: 3,
					type: 'image',
					name: '如虎添亿，其乐融融',
					url: 'https://tnuiimage.tnkjapp.com/bless/bless-4.jpg',
					pngurl: 'https://tnuiimage.tnkjapp.com/swiper/c4d4.png'
				}]
			},
			cardCur: {
				type: Number,
				default: 0
			},
			duration: {
				type: Number,
				default: 500
			},
			interval: {
				type: Number,
				default: 5000
			},
			circular: {
				type: Boolean,
				default: true
			},
			autoplay: {
				type: Boolean,
				default: false
			},
			contentColor: {
				type: String,
				default: '#000'
			},
			regularShow: {
				type: Boolean,
				default: true
			},
			regularContent: {
				type: String,
				default: '早上好,图鸟小伙伴'
			}

		},
		data() {
			return {
				currentCardCur: this.cardCur
			}
		},
		methods: {
			// cardSwiper
			cardSwiper(e) {
				this.currentCardCur = e.detail.current;
				this.$emit('callBack', e.detail.current);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.porter-tuniaoswiper3 {
		overflow: hidden;
	}

	/* 祝福 start*/
	.year-text {
		position: fixed;
		bottom: 15vh;
		margin: 0 auto;
		right: 0rpx;
		left: 0rpx;
	}

	/* .tnphone-black-min 细边框*/
	.tnphone-black-min {
		width: 380rpx;
		height: 760rpx;
		border-radius: 40rpx;
		background: #C6D1D8;
		padding: 7rpx;
		display: table;
		color: #333;
		box-sizing: border-box;
		box-shadow: 0rpx 0rpx 0rpx 5rpx rgba(80, 80, 80, .8) inset;
		margin: 70rpx auto;
		cursor: default;
		position: relative
	}

	.tnphone-black-min .skin {
		width: 100%;
		height: 100%;
		border-radius: 40rpx;
		background: #222;
		padding: 10rpx;
		box-shadow: 0rpx 0rpx 0rpx 7rpx rgba(68, 68, 68, .3)
	}

	.tnphone-black-min .screen {
		width: 100%;
		height: 100%;
		border-radius: 30rpx;
		background: #fff;
		position: relative;
		overflow: hidden
	}

	.tnphone-black-min .head {
		width: 100%;
		height: 90rpx;
		text-align: center;
		position: absolute;
		padding: 45rpx 15rpx 10rpx 15rpx;
	}

	.tnphone-black-min .peak {
		left: 22%;
		width: 56%;
		height: 27rpx;
		margin: -2rpx auto 0rpx;
		border-radius: 0 0 20rpx 20rpx;
		background: #222;
		position: absolute
	}

	.tnphone-black-min .sound {
		width: 48rpx;
		height: 6rpx;
		border-radius: 15rpx;
		background: #555;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -24rpx;
		margin-top: -10rpx;
		box-shadow: 0rpx 4rpx 4rpx 0rpx #444 inset
	}

	.tnphone-black-min .lens {
		width: 6rpx;
		height: 6rpx;
		border-radius: 50%;
		background: #2c5487;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: 34rpx;
		margin-top: -10rpx
	}

	.tnphone-black-min .talk {
		width: 50%;
		height: 6rpx;
		border-radius: 15rpx;
		background: rgba(0, 0, 0, .3);
		position: absolute;
		bottom: 8rpx;
		left: 50%;
		margin-left: -25%
	}

	.tnphone-black-min .area-l,
	.tnphone-black-min .area-r {
		width: 70rpx;
		height: 16rpx;
		position: absolute;
		top: 6rpx
	}

	.tnphone-black-min .area-l {
		left: 0;
		text-align: center;
		font-size: 12rpx;
		line-height: 22rpx;
		text-indent: 10rpx;
		font-weight: 600;
		padding-left: 20rpx;
	}

	.tnphone-black-min .area-r {
		right: 0;
		text-align: center;
		font-size: 12rpx;
		line-height: 22rpx;
		text-indent: 10rpx;
		font-weight: 600;
		padding-right: 20rpx;
	}

	.tnphone-black-min .fa-feed {
		float: left;
		font-size: 12rpx !important;
		transform: rotate(-45deg);
		margin-top: 4rpx;
		margin-right: 8rpx
	}

	.tnphone-black-min .fa-battery-full {
		float: left;
		font-size: 12rpx !important;
		margin-top: 6rpx
	}

	.tnphone-black-min .fa-chevron-left {
		float: left;
		margin-top: 4rpx
	}

	.tnphone-black-min .fa-cog {
		float: right;
		margin-top: 4rpx
	}

	.tnphone-black-min .btn01 {
		width: 3rpx;
		height: 28rpx;
		border-radius: 3rpx 0 0 3rpx;
		background: #222;
		position: absolute;
		top: 105rpx;
		left: -3rpx
	}

	.tnphone-black-min .btn02 {
		width: 3rpx;
		height: 54rpx;
		border-radius: 3rpx 0 0 3rpx;
		background: #222;
		position: absolute;
		top: 160rpx;
		left: -3rpx
	}

	.tnphone-black-min .btn03 {
		width: 3rpx;
		height: 54rpx;
		border-radius: 3rpx 0 0 3rpx;
		background: #222;
		position: absolute;
		top: 230rpx;
		left: -3rpx
	}

	.tnphone-black-min .btn04 {
		width: 3rpx;
		height: 86rpx;
		border-radius: 0 3rpx 3rpx 0;
		background: #222;
		position: absolute;
		top: 180rpx;
		right: -3rpx
	}

	/* 轮播样机样式 start*/
	.card-swiper {
		height: 447rpx !important;
	}

	.card-swiper swiper-item {
		width: 380rpx !important;
		// left: 185rpx;
		box-sizing: border-box;
		padding: 0rpx 0rpx 90rpx 0rpx;
		overflow: initial;
	}

	.card-swiper swiper-item .swiper-item {
		display: block;
		transform: scale(0.7);
		transition: all 0.2s ease-in 0s;
		overflow: hidden;
	}

	.card-swiper swiper-item.cur .swiper-item {
		transform: none;
		transition: all 0.2s ease-in 0s;
	}

	.card-swiper swiper-item .swiper-item-text {
		margin-top: 8vh;
		width: 100%;
		display: block;
		transform: scale(0.7, 0.7);
		transition: all 0.4s ease 0s;
		overflow: hidden;
		opacity: 0;
	}

	.card-swiper swiper-item.cur .swiper-item-text {
		transform: scale(1);
		transition: all 0.4s ease 0s;
		opacity: 1;
	}

	.image-banner {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.image-banner image {
		width: 100%;
		height: 730rpx;
		// border: 1rpx solid red;
	}

	/* 轮播指示点 start*/
	.indication {
		z-index: 9999;
		width: 100%;
		height: 36rpx;
		position: absolute;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.spot {
		background-color: #000;
		opacity: 0;
		width: 10rpx;
		height: 10rpx;
		border-radius: 20rpx;
		margin: 0 8rpx !important;
		top: -80rpx;
		position: relative;
	}

	.spot.active {
		opacity: 0;
		width: 30rpx;
		background-color: #000;
	}

	.box {
		box-sizing: border-box;
	}

	.tn-text-center {
		text-align: center;
	}

	.tn-text-xs {
		font-size: 20rpx;
	}

	.tn-text-sm {
		font-size: 24rpx;
	}

	.tn-text-md {
		font-size: 28rpx;
	}

	.tn-text-lg {
		font-size: 32rpx;
	}

	.tn-text-xl {
		font-size: 36rpx;
	}

	.tn-text-xxl {
		font-size: 40rpx;
	}

	.tn-text-xl-xxl {
		font-size: 80rpx;
	}
</style>