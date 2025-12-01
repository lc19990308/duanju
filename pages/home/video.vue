<template>
	<view class="page_content">
		<view class="main_content" :style="[{ paddingTop: barHeight + 'px' }]">
			<swiper class="swiper" circular :vertical="true" :duration="300" :current="current" @change="swiperChange">
				<swiper-item class="swiper_item" v-for="(item, index) in videoData" :key="index">
					
					<view class="videos" v-if="videoIndex == index" @click="videoClick">
	
						<video class="video" :id="'video' + item.dramaId" :ref="'video' + item.id" :loop="false"
							:controls="false" :autoplay="videoIndex == index"
							:object-fit="isLandscape ? 'contain' : 'cover'" :enable-progress-gesture="true"
							:muted="monis" :show-center-play-btn="false" :src="item.videoUrl" :poster="item.dramaPoster"
							@play="isPlaying = true, isPlayError = false" @pause="isPlaying = false"
							@timeupdate="videoTimeUpdate" @ended="videoEnded" @error="videoError"
							@loadedmetadata="VideoLoadedmetadata">
						</video>
						<view class="verror" v-if="isPlayError">
							<image class="image" :src="item.dramaPoster" mode="aspectFill"></image>
							<view class="content">
								<u-icon name="info-circle-fill" color="#fff" size="50"></u-icon>
								<text class="text">非常抱歉，视频播放出错啦！</text>
							</view>
						</view>
					</view>
					<view class="vcover" v-else>
						<image class="image" :src="item.image" mode="aspectFill"></image>
					</view>
					<view class="buttons" v-if="!isDrag && !isPlayError && videoIndex == index">
						<u-icon v-if="!isPlaying" name="play-right-fill" color="rgba(255, 255, 255, 0.8)" :size="60"
							@click="videoPlay"></u-icon>
					</view>
					<view class="sidebar" v-if="!isDrag && !isPlayError && videoIndex == index">
						<view class="item" @click="handleLikes(item.dramaId, index)">
						</view>
					</view>
					<view class="infobox" v-if="!isDrag && videoIndex == index">
						<view class="title">{{ item.dramaName }}</view>
						<view class="textarea">
							<view class="text" :class="{ active: isUnfold }">
								<text class="btn" v-if="$utils.countCharacters(item.dramaDescribe) > 74"
									@click="isUnfold = !isUnfold">{{ isUnfold ? $t('video_popup.pack_up') : $t('video_popup.unfold')  }}</text>
								{{ item.dramaDescribe }}
							</view>
						</view>
						<view class="content" @click="skipplay(item)">
							<view class="content-left">
								<image class="moinuns"
									src="https://baixoss.oss-cn-shenzhen.aliyuncs.com/bx_video/panpan/jxico/file-copy-fill.svg"
									mode=""></image>
								<text class="text1">{{$t('proposal.compilations')}}{{item.totalEpisodes}}{{$t('proposal.vidoe_unit')}} · {{$t('proposal.watch_all')}}</text>
							</view>
							<uni-icons class="arrow" type="right" size="24" color="#fff"></uni-icons>
						</view>
					</view>
					<!-- 进度条 -->
					<view class="progress" v-if="duration > 0 && videoIndex == index">
						<view class="bartext" v-if="isDrag">
							<text class="text1">{{ dragStarTime }}</text>
							<text class="text0">/</text>
							<text class="text2">{{ dragEndTime }}</text>
						</view>
						<view class="barview" :class="{ active: isDrag }">
							<slider :value="currentTime" :min="0" :max="duration" :blockSize="6" backgroundColor="#333"
								activeColor="#fff" @change="sliderChange" @changing="sliderChanging">
							</slider>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import apiMoen from '../../utils/config.js';
	import {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} from "vuex"
	export default {
		data() {
			return {
				isIos: uni.getSystemInfoSync().osName == 'ios' ? true : false,
				barHeight: uni.getSystemInfoSync().statusBarHeight,
				memberId:uni.getStorageSync('memberId'),
				current: 0,
				currentTime: 0, // 当前视频播放进度

				duration: 0, // 当前视频总时长
				isDrag: false, // 拖动进度条状态
				dragStarTime: "00:00", // 拖拽开始时长
				dragEndTime: "00:00", // 拖拽结束时长

				isPlaying: false, // 播放状态
				isPlayError: false, // 播放错误

				clickNum: 0, // 点击次数
				clickTimer: null, // 点击定时器

				isUnfold: false, // 展示文字

				originData: [], // 源数据
				originIndex: 0, // 源数据索引
				oldIndex: 0, // 源数据上一次索引

				videoData: [], // 视频渲染数据
				videoIndex: 0, // 渲染数据索引

				isLandscape: false, // 是否横屏

				isonuns: true,
				pageNo: 1,
				monis: true,
			}
		},
		computed: {
			...mapGetters("user", ["token", "userInfo"]),
			...mapGetters("app", ["videoAutoplay"]),
		},
		onLoad() {
			const memberId = uni.getStorageSync('id')
			this.getHandpickList()
		},
		onShow() {
			this.setTab();
			this.monis = true
			const timer1 = setTimeout(() => {
				console.log(4)
				this.monis = false
				clearTimeout(timer1)
			}, 500)
			// uni.setTabBarStyle({
			// 	color: '#999',
			// 	selectedColor: '#fff',
			// 	backgroundColor: '#000',
			// 	borderStyle: 'black'
			// })
			if (this.originData.length) {
				this.videoPlay()
			}
		},
		methods: {
			setTab(){
				uni.setTabBarItem({
					index: 0,
					text: this.$t('tabBar.home')
				})
				uni.setTabBarItem({
					index: 1,
					text: this.$t('tabBar.recommend')
				})
				uni.setTabBarItem({
					index: 2,
					text: this.$t('tabBar.reward')
				})
				uni.setTabBarItem({
					index: 3,
					text: this.$t('tabBar.profile')
				})
			},
			skipplay(item) {
				var omim = JSON.stringify(item)
				uni.navigateTo({
					url: '/pages/video/videoDetails?item=' + encodeURIComponent(omim)
				})
			},
			mofenshar() {
				console.log(111)
				const obj = {
					secondType: 4, //操作分类 1播放、2点赞、3收藏、4转发
					// calculateType: index, //计算分类 1加、2减
					memberId: uni.getStorageSync('id'), //会员ID
					dramaId: this.videoData[this.videoIndex].dramaId, //剧目ID
					dramaSeries: 1, //剧集集数
					tenantId: apiMoen.tenantId, //租户ID
					sysOrgCode: apiMoen.sysOrgCode, //部门编码
				}
				this.$request('video.likes', obj).then(res => {
					this.videoData[this.videoIndex].transMitCount++
				})
			},
			// 获取精选视频列表
			getHandpickList() {
				this.isonuns = false
				var data = {
					pageNo: this.pageNo,
					pageSize: 10,
					sysOrgCode: apiMoen.sysOrgCode,
					memberId:this.memberId || '',
				}
				this.$request('video.handpickListApp', data).then(res => {
					if (res.code === 200) {
						if (res.result.records && res.result.records.length) {
							this.originData = this.originData.concat(res.result.records)
							this.initSwiperData(this.originIndex, 1)
							if (res.result.records.length == 10) {
								this.isonuns = true
							}
							if (res.result.records.length < 10) {
								this.isonuns = false
							}
						}
					}
				})
			},
			// 初始化swiper数据
			initSwiperData(originIndex = this.originIndex, init = 0) {
				this.monis = true
				const originDataLength = this.originData.length;
				const videoList = [];
				videoList[this.videoIndex] = this.originData[originIndex];
				videoList[this.videoIndex - 1 == -1 ? 2 : this.videoIndex - 1] = this.originData[originIndex - 1 == -1 ?
					originDataLength - 1 : originIndex - 1];
				videoList[this.videoIndex + 1 == 3 ? 0 : this.videoIndex + 1] = this.originData[originIndex + 1 ==
					originDataLength ? 0 : originIndex + 1];
				this.videoData = videoList
				if (this.oldIndex >= this.originData.length) {
					this.oldIndex = 0
				}
				if (this.oldIndex < 0) {
					this.oldIndex = this.originData.length - 1
				}

				// 重置进度条状态
				this.duration = 0
				this.currentTime = 0
				this.isDrag = false
				this.isPlayError = false
				// H5自动播放
				const timer1 = setTimeout(() => {
					this.monis = false
					clearTimeout(timer1)
				}, 500)
				if (this.$utils.platforms() === 'wxOfficialAccount' && uni.getSystemInfoSync().platform == 'ios') {
					WeixinJSBridge.invoke('getNetworkType', {}, (e) => {
						this.videoPlay()
					})
				} else {
					if (this.videoAutoplay == 1) {
						const timer = setTimeout(() => {
							this.videoPlay()
							clearTimeout(timer)
						}, 500)
					} else {
						if (init != 1) {
							const timer = setTimeout(() => {
								this.videoPlay()
								clearTimeout(timer)
							}, 500)
						}
					}
				}
			},
			// swiper切换
			swiperChange(event) {
				const {
					current
				} = event.detail;
				const originDataLength = this.originData.length;
				if (this.videoIndex - current == 2 || this.videoIndex - current == -1) {
					this.originIndex = this.originIndex + 1 == originDataLength ? 0 : this.originIndex + 1;
					this.videoIndex = this.videoIndex + 1 == 3 ? 0 : this.videoIndex + 1;
					this.oldIndex = this.originIndex - 1
					this.initSwiperData(this.originIndex);
					if (this.originIndex == this.originData.length - 1) {
						if (this.isonuns) {
							this.pageNo++
							this.getHandpickList()
						}

					}
				} else if (this.videoIndex - current == -2 || this.videoIndex - current == 1) {
					this.originIndex = this.originIndex - 1 == -1 ? originDataLength - 1 : this.originIndex - 1;
					this.videoIndex = this.videoIndex - 1 == -1 ? 2 : this.videoIndex - 1;
					this.oldIndex = this.originIndex + 1
					this.initSwiperData(this.originIndex);
				}
			},
			// 播放
			videoPlay() {
				const video = this.getVideoCtx()
				if (!video) return
				video.play()
				this.isPlaying = true
			},
			// 暂停
			videoPause() {
				const video = this.getVideoCtx()
				if (!video) return
				video.pause()
				this.isPlaying = false
			},
			// 播放结束
			videoEnded(e) {
				if (this.$utils.platforms() === 'wxOfficialAccount' && uni.getSystemInfoSync().platform == 'ios') {
					if (this.videoIndex < 2) {
						this.current = this.videoIndex + 1
					} else {
						this.current = 0
					}
				} else {
					if (this.videoAutoplay == 1) {
						if (this.videoIndex < 2) {
							this.current = this.videoIndex + 1
						} else {
							this.current = 0
						}
					}
				}


				// // #ifndef H5
				// if (this.videoIndex < 2) {
				// 	this.current = this.videoIndex + 1
				// } else {
				// 	this.current = 0
				// }
				// // #endif
			},
			// 视频播放出错
			videoError() {
				this.isPlayError = true
			},
			// 点击
			videoClick() {
				this.clickTimer && clearTimeout(this.clickTimer)
				this.clickNum++
				this.clickTimer = setTimeout(() => {
					if (this.clickNum >= 2) {
					} else {
						if (this.isPlaying) {
							this.videoPause()
						} else {
							this.videoPlay()
						}
					}
					this.clickNum = 0
				}, 250)
			},
			// 元数据加载完毕
			VideoLoadedmetadata(e) {
				const {
					width,
					height
				} = e.detail
				this.isLandscape = width >= height ? true : false
			},
			// 拖拽结束
			sliderChange(e) {
				const video = this.getVideoCtx()
				if (!video) return
				// 停止拖拽
				this.isDrag = false
				// 判断一下是否大于基础时间
				if (this.duration > 0.1) {
					// 跳到指定时间点
					video.seek(e.detail.value)
					// 并调用播放
					video.play()
				}
			},
			// 正在拖拽
			sliderChanging(e) {
				// 开始拖拽
				this.isDrag = true
				// 刷新时间
				this.dragStarTime = this.$utils.formatTime(e.detail.value)
				// 总时间
				this.dragEndTime = this.$utils.formatTime(this.duration)
			},
			// 更新进度
			videoTimeUpdate(e) {
				if (this.isDrag) return
				const {
					currentTime,
					duration
				} = e.detail
				this.currentTime = Math.trunc(currentTime)
				this.duration = Math.trunc(duration)
				// 刷新时间
				this.dragStarTime = this.$utils.formatTime(this.currentTime)
				// 总时间
				this.dragEndTime = this.$utils.formatTime(this.duration)
			},
			// 获取video标签上下文
			getVideoCtx() {
				return uni.createVideoContext('video' + this.originData[this.originIndex].dramaId, this)
			},
			// 点赞
			handleLikes(dramaId, index) {
				const obj = {
					secondType: 2, //操作分类 1播放、2点赞、3收藏、4转发
					calculateType: index, //计算分类 1加、2减
					memberId: uni.getStorageSync('id'), //会员ID
					dramaId: dramaId, //剧目ID
					dramaSeries: 1, //剧集集数
					tenantId: apiMoen.tenantId, //租户ID
					sysOrgCode: apiMoen.sysOrgCode, //部门编码
				}
				this.$request('video.likes', obj).then(res => {
					if (res.code === 1) {
						if (this.videoData[index].is_like == 0) {
							this.videoData[index].is_like = 1
							this.videoData[index].likes++
						} else {
							this.videoData[index].is_like = 0
							this.videoData[index].likes--
						}
					}
				})
			},
			// 收藏
			handleCollect(id, index) {

				if (this.videoData[index].video.is_favorite == 0) {
					const obj = {
						vid: id,
						type: 'favorite'
					}
					this.$request('video.addRecord', obj, false).then(res => {
						if (res.code === 1) {
							this.videoData[index].video.is_favorite = 1
							this.videoData[index].video.favorites++
						}
					})
				} else {
					const obj = {
						ids: id,
						type: 'favorite'
					}
					this.$request('video.deleteRecord', obj, false).then(res => {
						if (res.code === 1) {
							this.videoData[index].video.is_favorite = 0
							this.videoData[index].video.favorites--
						}
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		.main_content {
			position: relative;
			background: #000;
			.selectionsView {
				position: absolute;
				background: #202020;
				border-radius: 24px 24px 0px 0px;
				color: #D1D1D1;
				z-index: 99999;
				width: 100%;
				height: 50%;
				bottom: 0;
				display: flex;
				flex-direction: column;
				left: 0;
				.selectionsView_title {
					font-family: Inter, Inter;
					font-weight: bold;
					font-size: 40rpx;
					padding: 40rpx;
					border-bottom: 2rpx solid #2A2A2A;
				}
				.selectionsView_list {
					flex: 1;
					width: 100%;
					height: 100%;
					padding-bottom: 25rpx;
					overflow-y: auto;
					view {
						position: relative;
						float: left;
						margin-left: 1.5%;
						margin-right: 1.5%;
						width: 17%;
						text-align: center;
						margin-top: 25rpx;
						height: 88rpx;
						line-height: 88rpx;
						background: #2A2A2A;
						border-radius: 8rpx;
						font-family: Inter, Inter;
						font-weight: normal;
						font-size: 30rpx;
						color: #D1D1D1;
						a {
							position: absolute;
							z-index: 999;
							right: 0;
							top: 0;
							width: 100%;
							display: flex;
							align-content: center;
							justify-content: center;
							height: 100%;
							background: #1A1A1A;
							border-radius: 8rpx;
							image {width: 48rpx;height: 48rpx;margin-top: 20rpx;}
						}
						span {
							position: absolute;
							z-index: 9;
							right: 0;
							top: 0;
							width: 47rpx;
							text-align: center;
							line-height: 36rpx;
							height: 36rpx;
							background: #FFF7F0;
							border-radius: 0rpx 8rpx 0rpx 8rpx;
							image {width: 100%;height: 100%;}
						}
					}
				}
			}
			.rechargeView {
				position: absolute;
				background: #202020;
				border-radius: 24px 24px 0px 0px;
				color: #D1D1D1;
				z-index: 99999;
				width: 100%;
				height: 50%;
				bottom: 0;
				display: flex;
				flex-direction: column;
				left: 0;
				.rechargeView_title {
					font-family: Inter, Inter;
					font-weight: bold;
					font-size: 40rpx;
					padding: 40rpx;
					border-bottom: 2rpx solid #2A2A2A;
					span {
						font-family: Inter, Inter;
						font-weight: 400;
						font-size: 28rpx;
						color: #FFCD03;
					}
				}
				.rechargeView_list {
					flex: 1;
					width: 100%;
					height: 100%;
					padding-bottom: 25rpx;
					overflow-y: auto;
					.rechargeView_lists {
						position: relative;
						float: left;
						margin-left: 3%;
						margin-right: 3%;
						text-align: center;
						margin-top: 25rpx;
						width: 44%;
						height: 160rpx;
						line-height: 53rpx;
						background: #242328;
						border-radius: 16rpx !important;
						border: 2rpx solid;
						border-image: linear-gradient(180deg, rgba(63, 62, 64, 1), rgba(163, 161, 166, 1)) 2 2;
						.rechargeView_percentage {
							position: absolute;
							z-index: 99;
							right: 0;
							top: 0;
							text-align: center;
							line-height: 40rpx;
							width: 82rpx;
							height: 40rpx;
							background: linear-gradient( 180deg, #EDC267 0%, #60D2FF 100%);
							border-radius: 0rpx 16rpx 0rpx 16rpx;
							font-family: Inter, Inter;
							font-weight: 400;
							font-size: 22rpx;
							color: #000000;
						}
						image {
							width: 96rpx;
							height: 79rpx;
							position: absolute;
							z-index: 99;
							right: 10rpx;
							bottom: 10rpx;
						}
						.rechargeView_top {
							font-family: Inter, Inter;
							font-weight: normal;
							font-size: 32rpx;
							color: #D1D1D1;
							span {
								font-size: 26rpx;
							}
						}
						.rechargeView_cen {
							font-family: Inter, Inter;
							font-weight: 400;
							font-size: 26rpx;
							color: #FFCD03;
						}
						.rechargeView_bottom {
							background: #3F3E40;
							font-family: Inter, Inter;
							font-weight: normal;
							font-size: 30rpx;
							color: #D1D1D1;
						}
					}
					.rechargeView_lists.top1 {
						text-align: left;
						padding-left: 20rpx;
						padding-top: 20rpx;
						background: linear-gradient( 186deg, rgba(255,224,157,0.4) 0%, rgba(237,194,103,0) 100%);
						border-radius: 16rpx;
						border: 2rpx solid #EDC267;
						.rechargeView_bottom {
							background: transparent;
							font-family: Inter, Inter;
							font-weight: bold;
							font-size: 36rpx;
							color: #EDC267;
						}
					}
					.rechargeView_lists.top2 {
						text-align: left;
						padding-left: 20rpx;
						padding-top: 20rpx;
						background: linear-gradient( 186deg, rgba(255,148,122,0.4) 0%, rgba(255,148,122,0) 100%);
						border-radius: 16rpx;
						border: 2rpx solid #FF947A;
						.rechargeView_top {
							color: #FF947A;
						}
						.rechargeView_bottom {
							background: transparent;
							font-family: Inter, Inter;
							font-weight: bold;
							font-size: 36rpx;
							color: #FF947A;
						}
					}
					.rechargeView_lists.top3 {
						.rechargeView_bottom {
							background: #EDC267;
							color: #000;
						}
					}
				}
			}
			.fs_mask {
				width: 100%;
				height: 100%;
				border: 2rpx solid red;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 1;
				background: rgba(#fff, 0.5);

				&.touch {
					pointer-events: none;
				}
			}

			.swiper {
				width: 100%;
				height: 100%;
				background: #000;
				border-radius: 16rpx;
				overflow: hidden;

				.swiper_item {
					position: relative;
					color: #fff;
					
					.videos {
						width: 100%;
						height: 100%;
						position: relative;

						.video {
							width: 100%;
							height: 100%;
							border-radius: 16rpx;
							overflow: hidden;
						}

						.verror {
							width: 100%;
							height: 100%;
							background: #000;
							position: absolute;
							top: 0;
							left: 0;
							z-index: 1;

							.image {
								width: 100%;
								height: 100%;
								opacity: 0.3;
							}

							.content {
								width: 100%;
								position: absolute;
								top: 50%;
								left: 0;
								transform: translateY(-50%);
								display: flex;
								flex-direction: column;
								align-items: center;

								.text {
									font-size: 32rpx;
									color: #fff;
									margin-top: 40rpx;
								}
							}
						}
					}

					.vcover {
						width: 100%;
						height: 100%;

						.image {
							width: 100%;
							height: 100%;
							opacity: 0.3;
						}
					}

					.buttons {
						position: absolute;
						top: 50%;
						left: 50%;
						z-index: 0;
						transform: translate(-50%, -50%);
						pointer-events: auto;
					}

					.sidebar {
						position: absolute;
						right: 32rpx;
						bottom: 120rpx;
						z-index: 2;

						.item {
							margin-bottom: 40rpx;
							text-align: center;

							&:last-child {
								margin-bottom: 0;
							}

							.image {
								width: 70rpx;
								margin: 0 auto;
								opacity: 0.9;
							}

							.text {
								font-size: 28rpx;

								&.active {
									color: #EE7F33;
								}
							}

							.btn {
								display: block;
								background: transparent;
								color: #fff;
								box-sizing: border-box;
								font-size: 28rpx;
								line-height: 40rpx;

								&::after {
									display: none;
								}
							}
						}
					}

					.infobox {
						width: 100%;
						position: absolute;
						bottom: 0;
						align-items: center;
						z-index: 1;
						font-size: 32rpx;
						z-index: 99999;

						.title {
							font-weight: 700;
							font-size: 32rpx;
							color: #fff;
							padding: 0 32rpx;
						}

						.content {
							padding: 20rpx 32rpx;
							background-color: rgba(0, 0, 0, 0.1);
							display: flex;
							align-items: center;
							width: 100%;
							justify-content: space-between;

							/* 盒子两端对齐 */
							.content-left {
								display: flex;
								align-items: center;

								.moinuns {
									width: 46rpx;
									height: 46rpx;
								}

								.text1 {
									margin-left: 16rpx;
								}
							}
						}

						.textarea {
							display: flex;
							flex-direction: row;
							overflow: hidden;
							font-size: 28rpx;
							min-height: 80rpx;
							width: 80%;
							padding: 20rpx 32rpx;

							.text {
								width: 100%;
								display: -webkit-box;
								-webkit-box-orient: vertical;
								text-overflow: ellipsis;
								-webkit-line-clamp: 2;
								overflow: hidden;

								text-align: justify;
								word-break: break-all;
								position: relative;
								line-height: 40rpx;

								&.active {
									-webkit-line-clamp: 999;
								}

								&::before {
									content: "";
									float: right;
									width: 0;
									height: 100%;
									background: #000;
									overflow: hidden;
									margin-bottom: -40rpx;
								}

								// &::after {
								// 	content: "";
								// 	position: absolute;
								// 	width: 100%;
								// 	height: 100px;
								// 	background: #fff;
								// 	background: transparent;
								// }

								.btn {
									float: right;
									clear: both;
									background: transparent;
									border: none;
									color: #fff;
									line-height: 40rpx;
								}
							}
						}


					}

					.progress {
						width: 100%;
						position: absolute;
						bottom: -15rpx;
						left: 0;
						z-index: 1;

						uni-slider {
							margin: 0 36rpx;
						}

						slider {
							margin: 0 36rpx;
						}

						.bartext {
							display: flex;
							flex-direction: row;
							justify-content: center;
							font-size: 40rpx;
							margin-bottom: 60rpx;
							font-weight: 700;

							.text1 {}

							.text0 {
								padding: 0 8rpx;
							}

							.text2 {
								color: rgba(#fff, 0.5);
							}
						}

						.barview {
							@mixin whlt($w, $h, $l, $t) {
								width: $w !important;
								height: $h !important;
								margin-left: $l !important;
								margin-top: $t !important;
							}

							::v-deep .uni-slider-handle-wrapper .uni-slider-handle,
							::v-deep .wx-slider-handle-wrapper .wx-slider-handle {
								@include whlt(64rpx, 64rpx, -32rpx, -32rpx);
							}

							::v-deep .uni-slider-handle-wrapper,
							::v-deep .wx-slider-handle-wrapper {
								height: 4rpx;
								transition: all 0.3s;
							}

							::v-deep .uni-slider-handle-wrapper .uni-slider-thumb,
							::v-deep .wx-slider-handle-wrapper .wx-slider-thumb {
								@include whlt(12rpx, 12rpx, -6rpx, -6rpx);
							}

							&.active {

								::v-deep .uni-slider-handle-wrapper,
								::v-deep .wx-slider-handle-wrapper {
									height: 24rpx;
									transition: all 0.3s;
								}

								::v-deep .uni-slider-handle-wrapper .uni-slider-thumb,
								::v-deep .wx-slider-handle-wrapper .wx-slider-thumb {
									@include whlt(32rpx, 32rpx, -16rpx, -16rpx);
								}
							}
						}
					}
				}
			}
		}
	}
</style>