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
			<navigator class="search-box" hover-class="none" url="/pages/home/search">
				<input type="text" :disabled="true" v-model='query.searchValue' placeholder="Tìm kiếm" />
				<u-icon name="search" color="#999" size="28"></u-icon>
			</navigator>
		</view>
		<view class="swiperItem">
			<HR_swiper s_type="swiper2" s_style="height:600rpx" :s_list="swiperList" @bindChange="change2"
				@bindItem="bindItem2">
			</HR_swiper>
		</view>
		<scroll-view class="scroll-view_H" scroll-x="true">
			<view class="tabs">
				<view class="tabs-item" :class="query.dramaClassify === item.id ? 'tabs-item_active':''"
					@tap="tabsChange(item)" v-for="(item,index) in cateList" :key="index">
					{{item.classifyName}}
				</view>
			</view>
		</scroll-view>
		<view class="card">
			<view class="card-item" v-for="(item,index) in list " :key="index">
				<image class="cover" :lazy-load="true" :src="item.dramaPoster" mode=""></image>
				<view class="title">{{item.dramaDescribe}}</view>
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
				swiperList: [
					// {
					// 	image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1200&fit=crop'
					// },
					// {
					// 	image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1200&fit=crop'
					// },
					// {
					// 	image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1200&fit=crop'
					// }
				],
				query: {
					pageNo: 1,
					pageSize: 9,
					sysOrgCode: '',
					searchValue: '',
					dramaClassify: '', //分类id
				},
				total: 0,
				list: [],
				cateList: [],
			}
		},
		methods: {
			tabsChange(info) {
				console.log(info.id, 'info.id')
				this.query.dramaClassify = info.id;
				this.getVideoList();
			},
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
			//获取轮播图
			getBanner() {
				this.$request('video.carouselList').then(res => {
					this.swiperList = res.result.map(item => {
						return {
							id: item.id,
							path: '',
							image: item.dramaPoster,
						}
					})
				})
			},
			//获取分类列表
			getCateList() {
				this.$request('video.filmDlassifyList').then(res => {
					this.cateList = res.result;
				})
			},
			//获取列表
			getVideoList() {
				this.$request('video.filmDramaList', this.query).then(res => {
					this.list = res.result.records;
					this.total = res.result.total;
				})
			},
		},
		onLoad() {
			this.getBanner();
			this.getCateList();
			this.getVideoList();
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
			height: 65rpx;
			padding: 0 32rpx;
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

		.tabs-item_active {
			background: linear-gradient(90deg, #3EF2FF 0%, #FFE23E 100%);
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
			white-space: nowrap;
			/* 不换行 */
			overflow: hidden;
			/* 超出隐藏 */
			text-overflow: ellipsis;
			/* 显示省略号 */
		}
	}

	.card-item:nth-child(3n-1) {
		margin: 0 24rpx;
	}

	.swiperItem {
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

	::v-deep .uni-input-input {
		color: #fff;
	}

	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
	}
</style>