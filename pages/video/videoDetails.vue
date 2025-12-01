<template>
	<view class="page_content">
		<view class="main_content" :style="[{ paddingTop: barHeight + 'px' }]">
			<swiper class="swiper" :disable-touch="DisableTouch" circular :vertical="true" :duration="300"
				:current="current" @change="swiperChange">
				<swiper-item class="swiper_item" v-for="(item, index) in videoData" :key="index">
					<view class="videos" v-if="videoIndex == index" @click="videoClick">
						<!-- #ifdef H5 -->
						<video class="video" :id="'video' + item.dramaSeries" :ref="'video' + item.dramaSeries"
							:loop="false" :controls="false" :autoplay="videoIndex == index"
							:object-fit="isLandscape ? 'contain' : 'cover'" :enable-progress-gesture="true"
							:muted="monis" :show-center-play-btn="false" :src="item.videoUrl" :poster="item.cover"
							@play="isPlaying = true, isPlayError = false" @pause="isPlaying = false"
							@timeupdate="videoTimeUpdate" @ended="videoEnded" @error="videoError"
							@loadedmetadata="VideoLoadedmetadata">
						</video>

						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<video class="video" :id="'video' + item.dramaId" :ref="'video' + item.id" :loop="false"
							:controls="false" :autoplay="videoIndex == index"
							:object-fit="isLandscape ? 'contain' : 'cover'" :enable-progress-gesture="true"
							:show-center-play-btn="false" :src="item.playLink"
							@play="isPlaying = true, isPlayError = false" @timeupdate="videoTimeUpdate"
							@ended="videoEnded" @error="videoError" @loadedmetadata="VideoLoadedmetadata">
						</video>
						<!-- #endif -->
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
						<view v-if="isPay">
							<u-icon v-if="!isPlaying" name="play-right-fill" color="rgba(255, 255, 255, 0.8)" :size="60"
								@click="videoPlay(item)"></u-icon>
						</view>
						<view class="" v-if="!unlock">
							<!-- <u-icon name="play-right-fill" color="rgba(255, 255, 255, 0.8)" :size="60"
								@click="videoPlay(item)"></u-icon> -->
							<uv-icon size="60" name="lock-fill" @click="handleClick(item)"></uv-icon>
							<view class="">
								点击解锁
							</view>
						</view>
					</view>
					<view class="mojinunus" @click="minbckon">
						<uni-icons class="arrow" type="left" size="24" color="#fff"></uni-icons>
						<view class="">
							{{$t(`proposal.vidoe_unit`)}}{{item.dramaSeries}}
						</view>
					</view>
					<view class="sidebar" v-if="!isDrag && !isPlayError && videoIndex == index">
						<!-- 点赞 -->
						<view class="item" @click="bingeWatch(item, 2)">
							<image class="image"
								:src="`https://baixoss.oss-cn-shenzhen.aliyuncs.com/bx_video/panpan/jxico/${numLikes.likeStatus == true ?   'heart-fill-d' : 'heart-fill' }.svg`"
								mode="widthFix"></image>
							<text class="text" v-if="numLikes.likeTotal != 0"
								:class="{ active: numLikes.likeStatus }">{{ numLikes.likeTotal }}</text>
							<text class="text" v-else>{{$t('proposal.like')}}</text>
						</view>
						<!-- 追剧 -->
						<view class="item" @click="bingeWatch(item,3)">
							<image class="image" v-if="numLikes.collectStatus" src="/static/images/Frame-16.png"
								mode="widthFix"></image>
							<image class="image" v-else="numLikes.collectStatus" src="/static/images/Frame-15.png"
								mode="widthFix"></image>
							<text class="text" v-if="numLikes.collectTotal != 0"
								:class="{ active: numLikes.collectStatus }">{{ numLikes.collectTotal }}</text>
							<text class="text" v-else>收藏</text>
						</view>
						<!-- <view class="item" @click="handleCollect(item.vid, index)">
							<image class="image" :src="`/static/icons/collect_${item.video.is_favorite ? 1 : 0 }.png`" mode="widthFix"></image>
							<text class="text" :class="{ active: item.video.is_favorite }">{{ item.video.favorites }}</text>
						</view> -->
						<view class="item" style="position: relative;">
							<button class="btn" open-type="share" @click="shareBtn">
								<!-- 转发 -->
								<image class="image"
									src="https://baixoss.oss-cn-shenzhen.aliyuncs.com/bx_video/panpan/jxico/share-forward-fill.svg"
									mode="widthFix"></image>
								<text class="text">{{ item.transMitCount || $t(`proposal.share`) }} </text>
							</button>
							<view v-if="shareShow" class="shareView">
								<view @click="shareToTwitter">Twitter</view>
								<view @click="shareToFacebook">Facebook</view>
							</view>
						</view>
						<!-- #ifdef MP-WEIXIN -->

						<!-- #endif -->
					</view>
					<view class="infobox" v-if="!isDrag && videoIndex == index">
						<view class="title">{{ masitem.dramaName }}</view>
						<!-- <view class="textarea" v-if="!isIos">
							<view class="text" :class="{ active: isUnfold }">
								<text class="btn" v-if="$utils.countCharacters(item.dramaDescribe) > 74" @click="isUnfold = !isUnfold">{{ isUnfold ? '收起' : '展开' }}</text>
								{{ item.dramaDescribe }}
							</view>
						</view> -->
						<view class="textarea">
							<view class="text" :class="{ active: isUnfold }">
								<text class="btn" v-if="$utils.countCharacters(minonunmain.dramaDescribe) > 74"
									@click="isUnfold = !isUnfold">{{ isUnfold ? $t('video_popup.pack_up') : $t('video_popup.unfold')  }}</text>
								{{ minonunmain.dramaDescribe }}
							</view>
						</view>
						<!-- <view class="title">
							总裁与保镖
						</view>
						<view class="textarea">
							张三丰，五年前被灭满门，惨遭追杀，侥幸逃生，成为攻无张三丰，五年前被灭满门，惨遭追杀
						</view> -->
						<view class="content" @click="skipplay(item)">
							<!-- <u-icon name="play-right-fill" color="#fff" size="18"></u-icon> -->
							<view class="content-left">
								<image class="moinuns"
									src="https://baixoss.oss-cn-shenzhen.aliyuncs.com/bx_video/panpan/jxico/file-copy-fill.svg"
									mode=""></image>
								<text class="text1">{{$t(`proposal.compilations`)}}{{originData.length}}{{$t('proposal.vidoe_unit')}} · {{$t('proposal.completed')}}</text>
							</view>
							<uni-icons class="arrow" type="top" size="24" color="#fff"></uni-icons>
							<!-- <image  src="/static/icons/arrow.png" mode=""></image> -->
							<!-- <text class="text2" @click="openVideoDetail(item.video.id, item.video.title, item.video.image, item.video.description)">查看更多剧集</text> -->
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
		<my-component :dramaId="parentDramaId" ref="childComponent" @changeValue="changeParentValue"></my-component>
		<Popups ref="popups" @monchang="monchangValue"></Popups>
	</view>
</template>

<script>
	import apiMoen from '../../utils/config.js';
	import MyComponent from '@/pages/video/episode.vue';
	import Popups from '../../components/popups/charge-dialog.vue'
	import {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} from "vuex"
	export default {
		data() {
			return {
				shareShow: false,
				DisableTouch: false,
				parentDramaId: '',
				isIos: uni.getSystemInfoSync().osName == 'ios' ? true : false,
				barHeight: uni.getSystemInfoSync().statusBarHeight,
				bingeWatchType: '1',
				current: 0,
				currentTime: 0, // 当前视频播放进度
				numLikes: {},
				like: 0,
				unlock: true, //锁
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
				panduan: true,
				masitem: {},
				seriesId: 0,
				collectStatus: false, //是否已追剧
				likeStatus: false, //是否点赞
				isPay: true, //是否显示播放
				minonunmain: {},
			}
		},
		computed: {
			...mapGetters("user", ["token", "userInfo"]),
			...mapGetters("app", ["videoAutoplay"]),
		},
		mounted() {
			this.$refs.childComponent.filmDramaSeriesList();
		},
		watch: {

		},
		components: {
			// 注册组件
			MyComponent,
			Popups
		},
		onLoad(option) {
			// this.$refs.popups.open(this.originData[this.originIndex])
			// this.getRecommendList()
			this.masitem = JSON.parse(decodeURIComponent(option.item));
			this.filmDramaById(this.masitem)
			this.getHandpickList(this.masitem.dramaSeries)

			console.log(this.masitem, 'item5555555555555555')

		},
		onShow() {
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
			// #ifdef H5
			// if (this.originData.length) {
			// 	this.videoPlay()
			// }
			// #endif
		},
		onHide() {
			// uni.setTabBarStyle({
			// 	color: "#999",
			// 	selectedColor: "#EE7F33",
			// 	backgroundColor: "#fff",
			// 	borderStyle: "black",
			// })
		},
		// onShareAppMessage(res) {
		// 	this.mofenshar()
		// 	// #ifdef MP-WEIXIN
		// 	return {
		// 		title: this.videoData[this.videoIndex].dramaName,
		// 		path: `/pages/home/video`,
		// 		imageUrl: this.videoData[this.videoIndex].dramaPoster
		// 	}
		// 	// #endif
		// },
		// 分享到朋友圈
		// onShareTimeline(res) {
		//   return {
		//      title: this.videoData[this.videoIndex].dramaName,
		//      path: `/pages/home/video`,
		//      imageUrl: this.videoData[this.videoIndex].dramaPoster
		//     };
		// },
		methods: {
			shareBtn() {
				this.shareShow = !this.shareShow
			},
			// 获取当前页面URL
			getCurrentUrl() {
				return window.location.href;
			},
			// 分享到 X (Twitter)
			shareToTwitter() {
				const url = encodeURIComponent(this.getCurrentUrl());
				const text = "test"

				// 检测是否为移动设备
				const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

				if (isMobile) {
					// 移动端：优先尝试打开Twitter app，如果未安装则打开网页版
					const twitterAppUrl = `twitter://post?message=${text} ${url}`;
					const twitterWebUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;

					// 尝试打开app，如果失败则打开网页
					const iframe = document.createElement('iframe');
					iframe.style.display = 'none';
					iframe.src = twitterAppUrl;
					document.body.appendChild(iframe);

					setTimeout(() => {
						document.body.removeChild(iframe);
						// 如果app未打开，则打开网页版
						window.open(twitterWebUrl, '_blank');
					}, 500);
				} else {
					// 桌面端：直接打开Twitter网页版
					const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
					window.open(twitterUrl, '_blank', 'width=550,height=420');
				}
			},

			// 分享到 Facebook
			shareToFacebook() {
				const url = encodeURIComponent(this.getCurrentUrl());

				// 检测是否为移动设备
				const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

				if (isMobile) {
					// 移动端：优先尝试打开Facebook app
					const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
					const isAndroid = /Android/i.test(navigator.userAgent);

					let facebookAppUrl;
					if (isIOS) {
						facebookAppUrl = `fb://share?href=${url}`;
					} else if (isAndroid) {
						facebookAppUrl = `fb://facewebmodal/f?href=${url}`;
					}

					const facebookWebUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;

					if (facebookAppUrl) {
						// 尝试打开app
						const iframe = document.createElement('iframe');
						iframe.style.display = 'none';
						iframe.src = facebookAppUrl;
						document.body.appendChild(iframe);

						setTimeout(() => {
							document.body.removeChild(iframe);
							// 如果app未打开，则打开网页版
							window.open(facebookWebUrl, '_blank');
						}, 500);
					} else {
						// 直接打开网页版
						window.open(facebookWebUrl, '_blank');
					}
				} else {
					// 桌面端：直接打开Facebook网页版
					const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
					window.open(facebookUrl, '_blank', 'width=550,height=420');
				}
			},

			// 使用 Web Share API（如果支持）
			shareWithWebAPI() {
				if (navigator.share) {
					navigator.share({
						title: "test1",
						text: "test2",
						url: this.getCurrentUrl()
					}).catch(err => {
						console.log('分享取消或失败:', err);
					});
				}
			},





			// 剧目详情
			filmDramaById(jimudalis) {
				this.$request('video.filmDramaById', {
					id: jimudalis.dramaId
				}).then(res => {
					console.log("获取剧目详情", res)
					if (res.code != 200) {
						uni.showToast({
							title: this.$t('toast.sys_error'),
							icon: 'none',
							duration: 2000 // 提示框显示时长
						});
					} else {
						this.minonunmain = res.result
					}
				}).catch(err => {
					console.log(err)
				})
			},
			// 查询剧集免费状态
			// getselectByIdAndMemberId() {
			// 	this.isonuns = false
			// 	var data = {
			// 		memberId:uni.getStorageSync('id'),
			// 		seriesId:
			// 	}
			// 	this.$request('video.selectByIdAndMemberId',data).then(res => {
			// 		console.log("res:",res)
			// 		// this.originData = res.result
			// 		// this.initSwiperData(this.originIndex, 1)
			// 	})
			// 	return
			// },
			// 追剧
			bingeWatch(item, secondType) {
				console.log("数据item", item)
				if (secondType == 2) {
					var calculateType = this.likeStatus == false ? '1' : '2'
				} else {
					var calculateType = this.collectStatus == false ? '1' : '2'
				}
				var datas = {
					secondType: secondType, //操作分类 1播放、2点赞、3收藏、4转发
					calculateType: calculateType, //计算分类 1加追剧、2减取消追剧
					memberId: uni.getStorageSync('id'), //会员ID
					dramaId: this.masitem.dramaId, //剧目ID
					dramaSeries: item.dramaSeries, //剧集集数
					tenantId: apiMoen.tenantId, //租户ID
					sysOrgCode: apiMoen.sysOrgCode, //部门编码
				}
				// console.log("数据calculateType", datas)
				// return
				this.$request('video.likes', datas).then(res => {
					this.boxunchauxn()
				})
			},

			minbckon() {
				uni.navigateBack({
					delta: 1
				})
			},
			skipplay(item) {
				console.log("item获取视频列表信息", item);
				// this.videoPause()
				var index = item.dramaSeries
				this.$refs.childComponent.showOpen(index, this.masitem.dramaId);
			},
			monchangValue(index) {
				console.log(index, 'kaish')
				// this.initSwiperData(this.originIndex, 1)
				this.buyDramaSeries()
			},
			changeParentValue(newValue) {
				console.log(newValue)
				this.originIndex = newValue
				if (this.originData[this.originIndex].unlockStatus == 3) {
					this.initSwiperData(this.originIndex, 1)
					this.buyDramaSeries()
				} else {
					this.initSwiperData(this.originIndex, 1)
				}
			},

			// mofenshar(){
			// 	console.log(111)
			// 	const obj = {
			// 		secondType: 4, //操作分类 1播放、2点赞、3收藏、4转发
			// 		// calculateType: index, //计算分类 1加、2减
			// 		memberId: uni.getStorageSync('id'), //会员ID
			// 		dramaId: this.videoData[this.videoIndex].dramaId, //剧目ID
			// 		dramaSeries: 1, //剧集集数
			// 		tenantId: uni.getStorageSync('tenantId'), //租户ID
			// 		sysOrgCode: uni.getStorageSync('sysOrgCode'), //部门编码
			// 	}
			// 	this.$request('video.likes', obj).then(res => {
			// 		this.videoData[this.videoIndex].transMitCount++
			// 	})
			// },
			// 获取推荐视频
			// getRecommendList() {
			// 	var data = {
			// 		mediaId:'100002',
			// 		miniId:'1791309043386597376'
			// 	}
			// 	this.$request('video.recommend',data).then(res => {
			// 		console.log("res获取推荐视频:",res)
			// 		if(res.code === 200) {
			// 			if(res.result && res.result.length) {
			// 				this.originData = this.originData.concat(res.result)
			// 				console.log(this.originData,'this.originData')
			// 				this.initSwiperData(this.originIndex, 1)
			// 			}
			// 			this.originData = this.originData.concat(res.result)
			// 			console.log(this.originData,'this.originData')
			// 			this.initSwiperData(this.originIndex, 1)
			// 		}
			// 	})
			// },
			// 获取剧集列表
			getHandpickList(dramaSeries) {

				this.isonuns = false
				// var data = {
				// 	id:'100909'
				// }
				// this.$request('video.filmDramaSeriesList',data).then(res => {
				// 	console.log("res:",res)
				// 	this.originData = res.result
				// 	this.initSwiperData(this.originIndex, 1)
				// })
				// return
				if (dramaSeries) {
					this.originIndex = dramaSeries - 1
				}
				this.parentDramaId = this.masitem.dramaId
				var data = {
					dramaId: this.masitem.dramaId,
					memberId: uni.getStorageSync('id'),
					pageNo:1,
					pageSize:10,
				}
				this.$request('video.filmDramaSeriesList', data).then(res => {
					if (res.code === 200) {
						this.isonuns = false
						if (res.result.records && res.result.records.length) {
							this.originData = this.originData.concat(res.result.records)
							this.initSwiperData(this.originIndex, 1)
						}
						// this.originData = this.originData.concat(res.result.records)
						// this.initSwiperData(this.originIndex, 1)
					}
				})
			},
			// 购买剧集
			buyDramaSeries() {
				const that = this
				// that.DisableTouch = true
				// console.log('购买剧集',this.originIndex)
				console.log('剧集状态++item.unlockStatus', this.videoData[this.videoIndex].unlockStatus)
				if (this.videoData[this.videoIndex].unlockStatus == 2) {

				} else if (this.videoData[this.videoIndex].unlockStatus == 3) {
					// 调用购买剧集接口
					uni.request({
						// url: MYurl + '/api/wxApi/buyDramaSeries',
						url: apiMoen.MPWEIXIN + '/api/appApi/buyDramaSeries',
						method: 'POST',
						header: {
							'content-type': 'application/json', // 添加 content-type
							"X-Tenant-Id": apiMoen.tenantId
						},
						data: {
							memberId: uni.getStorageSync('id'), //用户ID
							dramaId: this.videoData[this.videoIndex].filmDramaId, //剧集ID
							sysOrgCode: apiMoen.sysOrgCode, //部门ID
							tenantId:apiMoen.tenantId, //租户ID
							seriesSeries: this.videoData[this.videoIndex].dramaSeries, //解锁的剧集ID
							unlockState: false //剧集是否解锁状态
						},
						success: (res) => {
							console.log('++encryptedData', res.encryptedData)
							// 如果余额充足,则提示购买成功
							console.log(res.data.message);
							if (res.data.code != 600) {
								that.DisableTouch = false
								this.originData[this.originIndex].unlockStatus = 1
								this.videoData[this.videoIndex].unlockStatus = 1
								console.log('++购买成功返回的数据sss', res)
								if (res.data.message != '') {
									uni.showToast({
										title: res.data.message,
										icon: 'none',
										duration: 1200,
									})
									this.initSwiperData(this.originIndex);
									console.log('剧集状态和剧集ID购买后', this.videoData[this.videoIndex].unlockStatus,
										this.videoData[this.videoIndex].dramaSeries)
									// H5自动播放
									const timer1 = setTimeout(() => {
										// console.log(4)
										this.monis = false
										clearTimeout(timer1)
									}, 500)
									// this.videoPlay()
									if (this.$utils.platforms() === 'wxOfficialAccount' && uni
										.getSystemInfoSync().platform == 'ios') {
										WeixinJSBridge.invoke('getNetworkType', {}, (e) => {
											console.log(2)
											this.videoPlay()
										})
									} else {
										if (this.videoAutoplay == 1) {
											const timer = setTimeout(() => {
												console.log(3)
												this.videoPlay()
												clearTimeout(timer)
											}, 500)
										} else {
											if (init != 1) {
												const timer = setTimeout(() => {
													console.log(4)
													this.videoPlay()
													clearTimeout(timer)
												}, 500)
											}
										}
									}
								}
								// 重新获取剧集状态
							} else {
								console.log('++购买失败返回的数据1', res.data.code)
								if (this.originData[this.originIndex - 1].unlockStatus == 1) {
									this.$refs.popups.open(this.originData[this.originIndex])
								} else {
									uni.showToast({
										title: this.$t('toast.please_unlock'),
										icon: 'none',
										duration: 2000,
									})
								}

								// 获取video标签上下文 设置暂停播放
								const video = this.getVideoCtx()
								if (!video) return
								video.pause()
								that.isPlaying = false
								that.isPay = false
								that.unlock = false
								if (res.data.message != '') {
									this.videoPause(this.originIndex)
									// uni.showToast({
									// 	title: res.data.message,
									// 	icon: 'success',
									// 	duration: 2000,
									// });
								}
								// pm.showChargeDialog()
							}
						}
					})
				}
			},
			//记录播放
			loncalis() {
				// return
				console.log(this.masitem,'this.masitem.dramaId')
				uni.request({
					url: apiMoen.MPWEIXIN + '/api/appApi/filmDramaSeriesSecond',
					method: 'POST',
					header: {
						'content-type': 'application/json', // 添加 content-type
						"X-Tenant-Id": apiMoen.tenantId
					},
					data: {
						secondType: 1, //操作分类 1播放、2点赞、3收藏、4转发
						calculateType:1,
						memberId: uni.getStorageSync('id'), //会员ID
						dramaId:this.masitem.dramaId, 
						seriesId: this.masitem.seriesId, //剧目ID
						dramaSeries: this.videoData[this.videoIndex].dramaSeries, //剧集集数
						tenantId: apiMoen.tenantId, //租户ID
						sysOrgCode: apiMoen.sysOrgCode, //部门编码
					},
				})
			},
			// 初始化swiper数据
			initSwiperData(originIndex = this.originIndex, init = 0) {
				console.log('我触发了')
				const item = this.originData[this.originIndex]
				console.log('4444444444', item.unlockStatus);
				this.monis = true
				const originDataLength = this.originData.length;
				const videoList = [];
				videoList[this.videoIndex] = this.originData[originIndex];
				videoList[this.videoIndex - 1 == -1 ? 2 : this.videoIndex - 1] = this.originData[originIndex - 1 == -
					1 ?
					originDataLength - 1 : originIndex - 1];
				videoList[this.videoIndex + 1 == 3 ? 0 : this.videoIndex + 1] = this.originData[originIndex + 1 ==
					originDataLength ? 0 : originIndex + 1];
				this.videoData = videoList
				console.log(this.videoData, 'this.videoData')
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
				this.boxunchauxn(this.oldIndex)
				console.log('剧集状态和剧集ID初始化后', this.videoData[this.videoIndex].unlockStatus, this.videoData[this.videoIndex]
					.dramaSeries)
				// if (this.videoData[this.videoIndex].unlockStatus == 1) {
				// 	const timer = setTimeout(() => {
				// 		const video = this.getVideoCtx()
				// 		console.log(video)
				// 		if (!video) return
				// 		video.play()
				// 		console.log(5555)
				// 		this.isPlaying = true
				// 		that.unlock = true
				// 		that.isPay = true
				// 		clearTimeout(timer)
				// 	}, 500)
				// }


				// H5自动播放
				// #ifdef H5
				this.unlock = true
				const timer1 = setTimeout(() => {
					// console.log(4)
					this.monis = false
					clearTimeout(timer1)
				}, 500)
				// this.videoPlay()
				if (this.$utils.platforms() === 'wxOfficialAccount' && uni.getSystemInfoSync().platform == 'ios') {
					WeixinJSBridge.invoke('getNetworkType', {}, (e) => {
						console.log(2)
						this.videoPlay()
					})
				} else {
					if (this.videoAutoplay == 1) {
						const timer = setTimeout(() => {
							console.log(3)
							this.videoPlay()
							clearTimeout(timer)
						}, 500)
					} else {
						if (init != 1) {
							const timer = setTimeout(() => {
								console.log(4)
								this.videoPlay()
								clearTimeout(timer)
							}, 500)
						}
					}
				}
				// #endif
				// this.monis = true
				// const originDataLength = this.originData.length;
				// const videoList = [];
				// videoList[this.videoIndex] = this.originData[originIndex];
				// videoList[this.videoIndex - 1 == -1 ? 2 : this.videoIndex - 1] = this.originData[originIndex - 1 == -
				// 	1 ?
				// 	originDataLength - 1 : originIndex - 1];
				// videoList[this.videoIndex + 1 == 3 ? 0 : this.videoIndex + 1] = this.originData[originIndex + 1 ==
				// 	originDataLength ? 0 : originIndex + 1];
				// this.videoData = videoList
				// console.log(this.videoData, 'this.videoData')
				// if (this.oldIndex >= this.originData.length) {
				// 	this.oldIndex = 0
				// }
				// if (this.oldIndex < 0) {
				// 	this.oldIndex = this.originData.length - 1
				// }

				// // 重置进度条状态
				// this.duration = 0
				// this.currentTime = 0
				// this.isDrag = false
				// this.isPlayError = false
				// this.boxunchauxn(this.oldIndex)
				// // H5自动播放
				// // #ifdef H5
				// console.log(1)

				// const timer1 = setTimeout(() => {
				// 	// console.log(4)
				// 	this.monis = false
				// 	clearTimeout(timer1)
				// }, 500)
				// // this.videoPlay()
				// if (this.$utils.platforms() === 'wxOfficialAccount' && uni.getSystemInfoSync().platform == 'ios') {
				// 	WeixinJSBridge.invoke('getNetworkType', {}, (e) => {
				// 		console.log(2)
				// 		this.videoPlay()
				// 	})
				// } else {
				// 	if (this.videoAutoplay == 1) {
				// 		const timer = setTimeout(() => {
				// 			console.log(3)
				// 			this.videoPlay()
				// 			clearTimeout(timer)
				// 		}, 500)
				// 	} else {
				// 		if (init != 1) {
				// 			const timer = setTimeout(() => {
				// 				console.log(4)
				// 				this.videoPlay()
				// 				clearTimeout(timer)
				// 			}, 500)
				// 		}
				// 	}
				// }
				// // #endif
				this.loncalis()

			},
			handleClick(item) {
				if (this.originData[this.originIndex - 1].unlockStatus == 1) {
					this.$refs.popups.open(item)
				} else {
					uni.showToast({
						title: this.$t('toast.please_unlock'),
						icon: 'success',
						duration: 2000,
					})
				}
			},
			// swiper切换
			swiperChange(event) {
				// console.log('this.videoData[this.videoIndex].id',this.videoData[this.videoIndex].id)
				// console.log('this.videoIndex',this.videoIndex)
				// console.log('this.videoData',this.videoData)
				// console.log('this.videoData[this.videoIndex + 1].dramaSeries',this.videoData[this.videoIndex + 1].dramaSeries)
				console.log('剧集状态和剧集ID购买前', this.videoData[this.videoIndex].unlockStatus, this.videoData[this.videoIndex]
					.dramaSeries)
				// this.current = event.detail.current
				const {
					current
				} = event.detail;
				console.log('current', current)
				console.log('currentthis.videoIndex', this.videoIndex)
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
				if (this.videoData[this.videoIndex].unlockStatus == 3) {
					console.log('剧集状态和剧集ID切换前', this.videoData[this.videoIndex].unlockStatus, this.videoData[this
						.videoIndex].dramaSeries)
					this.initSwiperData(this.originIndex);
					this.buyDramaSeries()
				}
			},
			boxunchauxn() {
				console.log("查询剧集ID:", this.videoData[this.videoIndex].dramaSeries)
				console.log("查询点赞:", this.videoData[this.videoIndex].id)
				// return
				var data = {
					seriesId: this.videoData[this.videoIndex].id,
					memberId: uni.getStorageSync('id')
				}
				this.$request('video.selectByIdAndMemberId', data).then(res => {
					// console.log("查询点赞:", res)
					this.collectStatus = res.result.collectStatus
					this.likeStatus = res.result.likeStatus
					this.numLikes = res.result
				})
			},
			// 播放
			videoPlay(item) {
				console.log(item, '6666666666666666666666');
				// if(!item){
				// 	const video = this.getVideoCtx()
				// 	console.log(video, '播放')
				// 	if (!video) return
				// 	video.play()
				// 	// console.log(5555)
				// 	this.isPlaying = true
				// }
				if (this.videoData[this.videoIndex].unlockStatus == 1) {
					const video = this.getVideoCtx()
					console.log(video, '播放')
					if (!video) return
					video.play()
					// console.log(5555)
					this.isPlaying = true
				}
				// 播放
				// var datas = {
				// 	secondType: 1, //操作分类 1播放、2点赞、3收藏、4转发
				// 	memberId: uni.getStorageSync('id'), //会员ID
				// 	dramaId: this.masitem.dramaId, //剧目ID
				// 	dramaSeries: item.dramaSeries, //剧集集数
				// 	tenantId: apiMoen.tenantId, //租户ID
				// 	sysOrgCode: apiMoen.sysOrgCode, //部门编码
				// }
				// // console.log("数据calculateType", datas)
				// // return
				// this.$request('video.likes', datas).then(res => {
				// 	// this.boxunchauxn()
				// 	console.log("播放数据res", res)
				// })
			},
			// 暂停
			videoPause(originIndex) {
				const item = this.originData[this.originIndex]
				var a;
				if (originIndex > 0) {
					a = originIndex - 1
				} else {
					a = 0
				}
				console.log(a, this.originData[a]);
				if (this.originData[a].unlockStatus == 1 && item.unlockStatus == 1) {
					const video = this.getVideoCtx()
					if (!video) return
					video.pause()
					this.isPlaying = false
					this.unlock = true
				} else if (this.originData[a].unlockStatus != 1 && item.unlockStatus != 1) {
					const video = this.getVideoCtx()
					if (!video) return
					video.pause()
					this.unlock = false
					this.isPlaying = true
					// uni.showToast({
					// 	title: `请按顺序解锁`,
					// 	icon: 'success',
					// 	duration: 2000,
					// })
					// this.$refs.popups.open(item)
				}
				// if (item.unlockStatus == 1) {

				// } else {
				// 	const video = this.getVideoCtx()
				// 	if (!video) return
				// 	video.pause()
				// 	this.unlock = false
				// 	this.isPlaying = true
				// }
			},
			// 播放结束
			videoEnded(e) {
				// #ifdef H5
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
				// #endif

				// #ifndef H5
				if (this.videoIndex < 2) {
					this.current = this.videoIndex + 1
				} else {
					this.current = 0
				}
				// #endif
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
						// console.log('你双击了')
					} else {
						// console.log('你单击了')
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
				return uni.createVideoContext('video' + this.originData[this.originIndex].dramaSeries, this)
			},
			// APP点赞
			handleLikes(item, index) {
				const obj = {
					secondType: 2, //操作分类 1播放、2点赞、3收藏、4转发
					calculateType: index, //计算分类 1加、2减
					memberId: uni.getStorageSync('id'), //会员ID
					dramaId: item.filmDramaId, //剧目ID
					dramaSeries: item.dramaSeries, //剧集集数
					tenantId: apiMoen.tenantId, //租户ID
					sysOrgCode: apiMoen.sysOrgCode, //部门编码
				}
				this.$request('video.likes', obj).then(res => {
					// console.log("res点赞状态", res)
					if (res.code === 1) {
						if (this.videoData[index].is_like == 0) {
							this.videoData[index].is_like = 1
							this.videoData[index].likes++
						} else {
							this.videoData[index].is_like = 0
							this.videoData[index].likes--
						}
					}
					// console.log("res点赞状态1", res)
				})
			},
			// 追剧
			// handleCollect(id, index) {
			// 	if(this.videoData[index].video.is_favorite == 0) {
			// 		const obj = { vid: id, type: 'favorite' }
			// 		this.$request('video.addRecord', obj, false).then(res => {
			// 			if(res.code === 1) {
			// 				this.videoData[index].video.is_favorite = 1
			// 				this.videoData[index].video.favorites++
			// 			}
			// 		})
			// 	} else {
			// 		const obj = { ids: id, type: 'favorite' }
			// 		this.$request('video.deleteRecord', obj, false).then(res => {
			// 			if(res.code === 1) {
			// 				this.videoData[index].video.is_favorite = 0
			// 				this.videoData[index].video.favorites--
			// 			}
			// 		})
			// 	}
			// },
			// 点赞
			// handleLikes(dramaId, index) {
			// 	const obj = {
			// 		secondType: 2, //操作分类 1播放、2点赞、3收藏、4转发
			// 		calculateType: index, //计算分类 1加、2减
			// 		memberId: uni.getStorageSync('id'), //会员ID
			// 		dramaId: item.dramaId, //剧目ID
			// 		dramaSeries: 1, //剧集集数
			// 		tenantId: uni.getStorageSync('tenantId'), //租户ID
			// 		sysOrgCode: uni.getStorageSync('sysOrgCode'), //部门编码
			// 	}
			// 	this.$request('video.likes', obj).then(res => {
			// 		if(res.code === 1) {
			// 			if(this.videoData[index].is_like == 0) {
			// 				this.videoData[index].is_like = 1
			// 				this.videoData[index].likes++
			// 			} else {
			// 				this.videoData[index].is_like = 0
			// 				this.videoData[index].likes--
			// 			}
			// 		}
			// 	})
			// },
			// 收藏
			// handleCollect(id, index) {

			// 	if(this.videoData[index].video.is_favorite == 0) {
			// 		const obj = { vid: id, type: 'favorite' }
			// 		this.$request('video.addRecord', obj, false).then(res => {
			// 			if(res.code === 1) {
			// 				this.videoData[index].video.is_favorite = 1
			// 				this.videoData[index].video.favorites++
			// 			}
			// 		})
			// 	} else {
			// 		const obj = { ids: id, type: 'favorite' }
			// 		this.$request('video.deleteRecord', obj, false).then(res => {
			// 			if(res.code === 1) {
			// 				this.videoData[index].video.is_favorite = 0
			// 				this.videoData[index].video.favorites--
			// 			}
			// 		})
			// 	}
			// },
		}
	}
</script>

<style lang="scss" scoped>
	.mojinunus {
		position: fixed;
		top: 24rpx;
		left: 24rpx;
		display: flex;

		view {
			font-size: 32rpx;
		}
	}

	.page_content {
		.main_content {
			position: relative;
			background: #000;

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
				// border-radius: 16rpx;
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
							// border-radius: 16rpx;
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

							.shareView {
								position: absolute;
								width: 200rpx;
								height: 100rpx;
								line-height: 50rpx;
								text-align: center;
								top: 10rpx;
								left: -220rpx;
								z-index: 999;
								color: #fff;
								background-color: #000;
								border-radius: 20rpx;
							}

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