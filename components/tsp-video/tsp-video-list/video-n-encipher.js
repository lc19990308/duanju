const animation = uni.requireNativePlugin('animation')
import api from '@/utils/config.js'
const dom = uni.requireNativePlugin('dom')
import unirefresh from '../tsp-load/tsp-refresh-n.vue'
import videoMenu from '../tsp-menu/tsp-menu-n.vue'
import uniVideoPlayer from '../DomVideoPlayer/uniVideoPlayer'

import {
	mapState,
	mapGetters,
	mapMutations,
	mapActions
} from "vuex"
/*
 lodData 上拉加载回调
 refreshData 下拉加载回调
 */

export default {
	components: {
		unirefresh,
		videoMenu,
		uniVideoPlayer
	},
	props: {
		/* 是否开启下拉刷新 */
		loadOpen: {
			type: Boolean,
			default: true
		},
		/* tabBar栏 0系统tabBar栏 1自定义tabBar栏 */
		tabBarShow: {
			type: Number,
			default: 0
		},
		/* 自定义tabBar的高度 */
		tabBarHeight: {
			type: Number,
			default: 50
		},
		/* 进度条离底部的距离 px*/
		speedBottom: {
			type: Number,
			default: 0
		},
		/* 初始加载完成是否自动播放 */
		autoplay: {
			type: Boolean,
			default: true
		},
		/* 是否循环播放 */
		loopPlay: {
			type: Boolean,
			default: true
		},
		/* 是否开启自动播放 */
		nextPlay: {
			type: Boolean,
			default: false
		},
		/* 是否开启双击点赞 */
		doubleOpen: {
			type: Boolean,
			default: true
		},
		/* 双击点赞屏幕是否显示桃心 */
		doubleHeart: {
			type: Boolean,
			default: true
		},
		/* 多个tab视频时需传入不同的类型 */
		swId: {
			type: String,
			default: ''
		},
		/* 是否有显示 statusBarHeight 状态栏适配 */
		showBarHeight: {
			type: Boolean,
			default: true
		},
		showSelectShow: {
			type: Boolean,
			default: false,
		},
		lang: {
			type: {
				type: String,
				default: '',
			}
		}
	},
	data() {
		return {
			videoStyle: {},
			screenWidth: 0, //屏幕的宽度
			screenHeight: 0, //屏幕的高度
			vodHeight: 0, //视频部分高度
			videoNewUrl: null, //下一个视频的地址
			currentIndex: null,
			vodIndex: 0, // 当前播放视频下标
			contentShow: false,
			autoplayVideo: true, // 初始加载完成是否自动播放
			vodList: [
				/* {
					vodUrl:"https://outin-9cc4a7aedd2a11eaabb800163e1a65b6.oss-cn-shanghai.aliyuncs.com/customerTrans/43121ec9955a1ce95146d379f15ea9bd/566eafe2-17b52f0f17b-0007-0f29-cc2-eb217.mp4",
					coverImg:'/static/image/cover1.jpg', //视频封面
					coverShow:true, //是否显示视频封面
					vodPaly:true, //是否播放、暂停视频
					object_fit:'contain', //视频的显示类型
					pauseShow:false, //是否显示暂停图标
					loadingShow:false, //是否显示loading加载动画
					fabulousShow:false,//是否点赞
					followShow:-1, //关注特效
					followReally:false, //是否关注
					sliderShow:true, //是否显示进度条
					rotateImgShow:true, //是否显示旋转头像
				} */
			],
			timeout: null, //滑动视频防抖
			bufferTime: null, //缓冲视频显示加载动画防抖
			sliderProgress: 0, //进度条滑动层宽度
			sliderTime: 0, //显示滑动进度条时变化的时间
			videoTime: 0, //视频时长 时间
			endTime: 0, //滑动进度条最终的时间
			sliderDrag: false, //是否在拖动进度
			brightSlider: false, //是否显示光亮的进度条
			sliderEndTime: null, //滑动结束隐藏光亮进度条时间延迟
			startPlayVod: false, //是否滑动结束播放下一个视频
			bufferShow: false, //显示loading加载进度的条件
			playOpen: false, //视频播放失败，是否重播视频的条件
			failTime: null, //视频播放失败，重播视频的时间
			repeatTime: null,
			preloadTime: null, //延时防抖
			shakePlay: false, //是否有遗漏的视频播放
			rotateAnti: false, //防抖旋转头像
			touchClientY: 0, //触碰的坐标
			moveClientY: 0, //移动的坐标
			moveOpacity: false, //是否透明
			speedHide: false, //滑动时隐藏进度条
			appoint: true, //初始隐藏视频和右侧头像栏
			changeVod: false, //是否正在切换视频
			muteSetup: false, //是否设置为静音
			loopVod: false, //是否循环播放
			changeIndex: 0,
			changeTime: null,
			clickPlay: false, //是否是点击播放
			/* 双击点赞部分 */
			lastTapDiffTime: 0, //上次点击时间
			lastTapTimeoutFunc: null, //单击事件事件函数
			likeList: [], //双击点赞显示的桃心数据
			likeId: 1,
			doubleOutTime: null,
			clearDoubleTime: null,
			touchInfo: {},
			/* 双击点赞显示桃心动画 */
			peachAddList: {
				list: [{
						transform: 'scale(1.6)',
						opacity: '0.8'
					},
					{
						transform: 'scale(1)',
						opacity: '1'
					},
					{
						transform: 'scale(1.02)',
						opacity: '1'
					},
					{
						transform: 'scale(1)',
						opacity: '1'
					}
				],
				duration: 75
			},
			/* 双击点赞移除桃心动画 */
			peachRemoveList: {
				list: [{
						transform: 'scale(1) translateY(0rpx)',
						opacity: '1'
					},
					{
						transform: 'scale(1.35) translateY(-50rpx)',
						opacity: '0.7'
					},
					{
						transform: 'scale(1.6) translateY(-100rpx)',
						opacity: '0'
					}
				],
				duration: 133
			},
			pauseNum: 0,
			pauseAddList: {
				list: [{
						transform: 'scale(2)',
						opacity: '0'
					},
					{
						transform: 'scale(1)',
						opacity: '0.35'
					}
				],
				duration: 75
			},
			memberId: uni.getStorageSync('id') || '',
			pay_show: false,
			viperInfo: {},
			rechargeList: [],
			viperList: [],
			language: {
				zh_CN: {
					unlockRequired: '需要解锁',
					gold: '金币',
					balance: '钻石',
					fullScreen: '全屏显示',
					unit: '¥',
					vipFree: '订阅套餐免费看',
					nextFree: '免费观看下一部分',
					recharge: '订阅',
					goldUnlock: '金币解锁',
					episode: '第',
					diamondUnlock: '钻石解锁',
					diamond: '钻石',
					unlockSeries: '解锁剧集',
					buyToWatch: '购买后可观看',
					unlockSuccess: '解锁成功',
					choosePayMethod: '请选择支付方式'
				},
				vi_VN: {
					unlockRequired: 'Mở khóa cần',
					gold: 'vàng',
					balance: 'kim cương',
					fullScreen: 'Hiển thị toàn màn hình',
					unit: '₫',
					vipFree: 'Đặt gói đăng ký miễn phí',
					nextFree: 'Xem tiếp free',
					recharge: 'đăng ký',
					goldUnlock: 'Mở khóa bằng vàng',
					episode: 'Tập',
					diamondUnlock: 'Mở khóa bằng kim cương',
					diamond: 'kim cương',
					unlockSeries: 'Mở khóa series',
					buyToWatch: 'Mua để xem',
					unlockSuccess: 'Mở khóa thành công',
					choosePayMethod: 'Vui lòng chọn phương thức thanh toán'
				},
				zh_EN: {
					unlockRequired: 'Unlock required',
					gold: 'Gold',
					balance: 'diamond',
					fullScreen: 'Full Screen',
					unit: '$',
					vipFree: 'Set subscription plan to free',
					nextFree: 'Watch free next',
					recharge: 'subscribe',
					goldUnlock: 'Unlock with Gold',
					episode: 'Episode',
					diamondUnlock: 'Unlock with Diamond',
					diamond: 'Diamond',
					unlockSeries: 'Unlock Series',
					buyToWatch: 'Purchase to watch',
					unlockSuccess: 'Unlock successful',
					choosePayMethod: 'Please select payment method'
				},
			},
			unlock_show: false,
			unlockingData: {
				dramaName: '',
				totalEpisodes: '',
				jinbiPrice: '',
			},
			unlockIndex: -1,
			payTypeIndex: -1,
			viperIndex: -1,

		}
	},
	created() {
		const _0x48538e = _0x4220;
		(function(_0x3a526b, _0x146d33) {
			const _0x28cb19 = _0x4220,
				_0xb36a4d = _0x3a526b();
			while (!![]) {
				try {
					const _0x4e4791 = parseInt(_0x28cb19(0x1bf)) / 0x1 * (parseInt(_0x28cb19(0x1c6)) / 0x2) + -
						parseInt(_0x28cb19(0x1c4)) / 0x3 * (parseInt(_0x28cb19(0x1cf)) / 0x4) + parseInt(_0x28cb19(
							0x1c7)) / 0x5 + -parseInt(_0x28cb19(0x1cb)) / 0x6 * (-parseInt(_0x28cb19(0x1d0)) /
							0x7) + -parseInt(_0x28cb19(0x1ca)) / 0x8 * (parseInt(_0x28cb19(0x1d1)) / 0x9) +
						parseInt(
							_0x28cb19(0x1be)) / 0xa + -parseInt(_0x28cb19(0x1d2)) / 0xb;
					if (_0x4e4791 === _0x146d33) break;
					else _0xb36a4d['push'](_0xb36a4d['shift']());
				} catch (_0x269fa3) {
					_0xb36a4d['push'](_0xb36a4d['shift']());
				}
			}
		}(_0x4dec, 0x3e951));

		function _0x4dec() {
			const _0x22ee34 = ['5829945SqWKYP', 'width', '2141510yaKErd', '11pmmqwP', 'screenHeight', 'windowHeight',
				'vodHeight', 'videoStyle', '157818jghBsz', 'showBarHeight', '71374tSuEyX', '989485sJxaTc',
				'getSystemInfoSync', 'statusBarHeight', '1091928wZLBcj', '132QDkgyv', 'height', 'screenWidth',
				'tabBarHeight', '4oGMFsM', '141211QDIfNf', '27Wunfca'
			];
			_0x4dec = function() {
				return _0x22ee34;
			};
			return _0x4dec();
		}
		const deviceInfo = uni[_0x48538e(0x1c8)]();
		let topBarHeight = this[_0x48538e(0x1c5)] ? deviceInfo[_0x48538e(0x1c9)] : 0x0;

		function _0x4220(_0x135f3b, _0x3ed67a) {
			const _0x4decd7 = _0x4dec();
			return _0x4220 = function(_0x42208c, _0xa0183a) {
				_0x42208c = _0x42208c - 0x1be;
				let _0xb1ef50 = _0x4decd7[_0x42208c];
				return _0xb1ef50;
			}, _0x4220(_0x135f3b, _0x3ed67a);
		}
		this[_0x48538e(0x1c3)]['statusBarHeight'] = topBarHeight + 'px', this[_0x48538e(0x1c3)][_0x48538e(0x1d3)] =
			deviceInfo[_0x48538e(0x1cd)] + 'px', this[_0x48538e(0x1cd)] = deviceInfo[_0x48538e(0x1cd)], this[
				'screenHeight'] = deviceInfo[_0x48538e(0x1c0)];
		this['tabBarShow'] == 0x1 ? (this[_0x48538e(0x1c3)]['height'] = deviceInfo[_0x48538e(0x1c1)] - topBarHeight -
			this[_0x48538e(0x1ce)] + 'px', this['vodHeight'] = deviceInfo[_0x48538e(0x1c1)] - topBarHeight - this[
				_0x48538e(0x1ce)]) : (this[_0x48538e(0x1c3)][_0x48538e(0x1cc)] = deviceInfo['windowHeight'] -
			topBarHeight + 'px', this[_0x48538e(0x1c2)] = deviceInfo[_0x48538e(0x1c1)] - topBarHeight);
		this['loopVod'] = this['loopPlay'];
	},
	watch: {
		vodIndex(newIndex, oldIndex) {
			function _0x6641() {
				var _0x4481ea = ['swiperVod', 'loadingShow', '$refs', '20560nslwph', '8172012xcIAos', 'resetData',
					'927788jLzUUI', '10EmfrnK', 'vodList', '175fAVZhC', 'appoint', '1153503JdlNlR', 'vodPaly',
					'$nextTick', 'changeVod', '11DQyINr', 'autoplayVideo', '111MsVdYj', '2822xLxugr',
					'486999eWNNWF', '42666FNzvJK', '5kXVkKh', 'swId', 'pause', 'pauseShow'
				];
				_0x6641 = function() {
					return _0x4481ea;
				};
				return _0x6641();
			}
			var _0xbb3091 = _0x4b38;
			(function(_0x52f793, _0x476c94) {
				var _0x570e53 = _0x4b38,
					_0x237a50 = _0x52f793();
				while (!![]) {
					try {
						var _0x2c5bc0 = parseInt(_0x570e53(0x8a)) / 0x1 * (parseInt(_0x570e53(0x8b)) / 0x2) + -
							parseInt(_0x570e53(0x84)) / 0x3 + -parseInt(_0x570e53(0x98)) / 0x4 * (parseInt(
								_0x570e53(0x8e)) / 0x5) + -parseInt(_0x570e53(0x8d)) / 0x6 + -parseInt(_0x570e53(
								0x82)) / 0x7 * (parseInt(_0x570e53(0x95)) / 0x8) + parseInt(_0x570e53(0x8c)) / 0x9 *
							(parseInt(_0x570e53(0x99)) / 0xa) + parseInt(_0x570e53(0x88)) / 0xb * (parseInt(
								_0x570e53(0x96)) / 0xc);
						if (_0x2c5bc0 === _0x476c94) break;
						else _0x237a50['push'](_0x237a50['shift']());
					} catch (_0x119465) {
						_0x237a50['push'](_0x237a50['shift']());
					}
				}
			}(_0x6641, 0x31c94));
			if (!this['contentShow']) return;
			this[_0xbb3091(0x97)]();

			function _0x4b38(_0x5852d5, _0x2f5e12) {
				var _0x664181 = _0x6641();
				return _0x4b38 = function(_0x4b380d, _0x388055) {
					_0x4b380d = _0x4b380d - 0x82;
					var _0x42ce42 = _0x664181[_0x4b380d];
					return _0x42ce42;
				}, _0x4b38(_0x5852d5, _0x2f5e12);
			}
			oldIndex >= 0x0 && !this[_0xbb3091(0x83)] && this[_0xbb3091(0x9a)][oldIndex] && (this[_0xbb3091(0x9a)][
				oldIndex
			][_0xbb3091(0x85)] = ![], this['vodList'][oldIndex][_0xbb3091(0x91)] = ![], this[_0xbb3091(0x9a)][
				oldIndex
			][_0xbb3091(0x93)] = ![], this[_0xbb3091(0x94)]['myVideo' + oldIndex + this[_0xbb3091(0x8f)]][0x0][
				_0xbb3091(0x90)
			]());
			this[_0xbb3091(0x86)](() => {
				var _0x26af7b = _0xbb3091;
				this[_0x26af7b(0x87)] = ![], this['autoplayVideo'] && (this[_0x26af7b(0x89)] = !![], this[
					_0x26af7b(0x92)](newIndex));
			});
		},
		loopPlay(newVal, oldVal) {
			this.loopVod = this.loopPlay
		}
	},
	methods: {
		...mapActions('video', ['setLike', 'getVideoInfo']),
		/* 滚动监听 */
		scrolls(ev) {
			const _0x19ad0e = _0x169e;
			(function(_0x5b08eb, _0x289090) {
				const _0x5bce95 = _0x169e,
					_0x4f93de = _0x5b08eb();
				while (!![]) {
					try {
						const _0x37be1b = parseInt(_0x5bce95(0x98)) / 0x1 * (parseInt(_0x5bce95(0x96)) / 0x2) + -
							parseInt(_0x5bce95(0x9a)) / 0x3 * (-parseInt(_0x5bce95(0x8d)) / 0x4) + -parseInt(
								_0x5bce95(0x93)) / 0x5 * (-parseInt(_0x5bce95(0x94)) / 0x6) + -parseInt(_0x5bce95(
								0x8b)) / 0x7 + parseInt(_0x5bce95(0x91)) / 0x8 * (-parseInt(_0x5bce95(0x88)) /
								0x9) + -parseInt(_0x5bce95(0x9c)) / 0xa + parseInt(_0x5bce95(0x95)) / 0xb * (-
								parseInt(
									_0x5bce95(0x99)) / 0xc);
						if (_0x37be1b === _0x289090) break;
						else _0x4f93de['push'](_0x4f93de['shift']());
					} catch (_0x52544b) {
						_0x4f93de['push'](_0x4f93de['shift']());
					}
				}
			}(_0x3cd7, 0x8856e), clearTimeout(this[_0x19ad0e(0x92)]), this['speedHide'] = !![]);
			let index = Math['round'](Math[_0x19ad0e(0x8e)](ev['contentOffset']['y']) / this['vodHeight']);

			function _0x169e(_0xf385e4, _0x4b8979) {
				const _0x3cd76f = _0x3cd7();
				return _0x169e = function(_0x169e85, _0x320009) {
					_0x169e85 = _0x169e85 - 0x88;
					let _0xb9e734 = _0x3cd76f[_0x169e85];
					return _0xb9e734;
				}, _0x169e(_0xf385e4, _0x4b8979);
			}

			function _0x3cd7() {
				const _0x16408f = ['2230475JhCWiP', '6rSyxHM', '11605qEXaft', '988xTBSIX', 'moveOpacity', '2218PcGlxL',
					'456ddbhla', '1903527gvXGXk', 'currentIndex', '3469600cAmAHq', 'vodList', '9wKZuWE',
					'shakePlay', 'changeIndex', '4702782rtLHca', 'vodIndex', '4QBtIQp', 'abs', 'speedHide',
					'isDragging', '4471792GCLrvb', 'timeout'
				];
				_0x3cd7 = function() {
					return _0x16408f;
				};
				return _0x3cd7();
			}
			this[_0x19ad0e(0x8a)] = index, this[_0x19ad0e(0x97)] = ev[_0x19ad0e(0x90)], this[_0x19ad0e(0x92)] =
				setTimeout(() => {
					const _0x19dc8 = _0x19ad0e;
					this[_0x19dc8(0x9b)] = index, this[_0x19dc8(0x8f)] = ![], this[_0x19dc8(0x89)] = !![], this[
						'startPlayVod'] && index != this[_0x19dc8(0x8c)] && (this['$emit']('swiperChange', this[
						_0x19dc8(0x9d)][index]), this[_0x19dc8(0x8c)] = index);
				}, 0x64);
		},
		/* 选择指定视频下标播放 */
		scrollToVod(playIndex) {
			const _0x325ec9 = _0x19a3;
			(function(_0x4f33a9, _0x4289da) {
				const _0x304433 = _0x19a3,
					_0x2f2081 = _0x4f33a9();
				while (!![]) {
					try {
						const _0x2e3606 = parseInt(_0x304433(0x140)) / 0x1 * (-parseInt(_0x304433(0x13e)) / 0x2) +
							parseInt(_0x304433(0x13c)) / 0x3 + -parseInt(_0x304433(0x13f)) / 0x4 + parseInt(
								_0x304433(0x141)) / 0x5 + -parseInt(_0x304433(0x13a)) / 0x6 + -parseInt(_0x304433(
								0x143)) / 0x7 + parseInt(_0x304433(0x13d)) / 0x8;
						if (_0x2e3606 === _0x4289da) break;
						else _0x2f2081['push'](_0x2f2081['shift']());
					} catch (_0x30b7e1) {
						_0x2f2081['push'](_0x2f2081['shift']());
					}
				}
			}(_0x10cb, 0xa49c0));
			let el = this[_0x325ec9(0x13b)][_0x325ec9(0x142) + playIndex + this[_0x325ec9(0x139)]][0x0];
			dom['scrollToElement'](el, {
				'offset': 0x0,
				'animated': ![]
			}), this['vodIndex'] = playIndex;

			function _0x19a3(_0x5644a4, _0x2e75da) {
				const _0x10cbb1 = _0x10cb();
				return _0x19a3 = function(_0x19a33c, _0x1d3564) {
					_0x19a33c = _0x19a33c - 0x139;
					let _0x4fee03 = _0x10cbb1[_0x19a33c];
					return _0x4fee03;
				}, _0x19a3(_0x5644a4, _0x2e75da);
			}

			function _0x10cb() {
				const _0x3e0cbe = ['3293151eFaMOH', '20048048unEsLc', '2AYuORp', '3422792TTZoJW', '770963xftmeu',
					'268690cfsWdF', 'myVodEl', '6045459qeteyz', 'swId', '2957538ulVdMe', '$refs'
				];
				_0x10cb = function() {
					return _0x3e0cbe;
				};
				return _0x10cb();
			}
		},
		/* 初始加载视频 */
		initVod(dataList, index) {
			const _0x2fac5c = _0x2aec;

			function _0x2aec(_0x44d733, _0x2c061f) {
				const _0x385b3f = _0x385b();
				return _0x2aec = function(_0x2aeccf, _0x5d5a5b) {
					_0x2aeccf = _0x2aeccf - 0x79;
					let _0x30c35f = _0x385b3f[_0x2aeccf];
					return _0x30c35f;
				}, _0x2aec(_0x44d733, _0x2c061f);
			}

			function _0x385b() {
				const _0x3e3594 = ['loadingShow', '12OdtzZA', 'scrollToElement', 'contentShow', '786272CvXEff',
					'$nextTick', '667723ctHfYs', 'vodList', 'vodIndex', '2005935JLbeqE', 'vodPaly', '59116QiAlMp',
					'autoplayVideo', '6LIzHRO', 'pauseAddList', '269382pkVtXu', '$refs', 'pauseRef', 'autoplay',
					'pauseShow', 'length', 'appoint', '1553416CDgoMm', '1785330IQvkfh', 'swId', 'addAnimation'
				];
				_0x385b = function() {
					return _0x3e3594;
				};
				return _0x385b();
			}(function(_0x4df01d, _0x19fb35) {
				const _0x50d37e = _0x2aec,
					_0x3c4dc5 = _0x4df01d();
				while (!![]) {
					try {
						const _0x5453ed = parseInt(_0x50d37e(0x86)) / 0x1 * (parseInt(_0x50d37e(0x84)) / 0x2) + -
							parseInt(_0x50d37e(0x88)) / 0x3 + -parseInt(_0x50d37e(0x8f)) / 0x4 + parseInt(_0x50d37e(
								0x82)) / 0x5 + parseInt(_0x50d37e(0x7a)) / 0x6 * (-parseInt(_0x50d37e(0x7f)) /
								0x7) + parseInt(_0x50d37e(0x7d)) / 0x8 + parseInt(_0x50d37e(0x90)) / 0x9;
						if (_0x5453ed === _0x19fb35) break;
						else _0x3c4dc5['push'](_0x3c4dc5['shift']());
					} catch (_0x296c20) {
						_0x3c4dc5['push'](_0x3c4dc5['shift']());
					}
				}
			}(_0x385b, 0x325b7), this[_0x2fac5c(0x85)] = this[_0x2fac5c(0x8b)]);
			let playIndex = index ? index : 0x0;
			dataList['filter']((_0x1055af, _0x53ca89) => {
					const _0x53ef13 = _0x2fac5c;
					_0x1055af['videoIndex'] = _0x53ca89, _0x1055af[_0x53ef13(0x83)] = _0x53ca89 == playIndex ? !
						![] : ![], _0x1055af['pauseShow'] = ![], _0x1055af[_0x53ef13(0x79)] = ![];
				}), this['vodList'] = dataList, this[_0x2fac5c(0x7c)] = dataList[_0x2fac5c(0x8d)] > 0x0 ? !![] : ![],
				this[_0x2fac5c(0x81)] = playIndex, setTimeout(() => {
					const _0x522f77 = _0x2fac5c;
					if (playIndex > 0x0) {
						let _0x53a48c = this[_0x522f77(0x89)]['myVodEl' + playIndex + this[_0x522f77(0x91)]][0x0];
						dom[_0x522f77(0x7b)](_0x53a48c, {
							'offset': 0x0,
							'animated': ![]
						});
					}
					setTimeout(() => {
						const _0x5e84a5 = _0x522f77;
						this[_0x5e84a5(0x8e)] = ![], this[_0x5e84a5(0x85)] ? this['swiperVod'](this[
							'vodIndex']) : (this[_0x5e84a5(0x80)][this[_0x5e84a5(0x81)]][
							'vodPaly'
						] = ![], this[_0x5e84a5(0x80)][this[_0x5e84a5(0x81)]][_0x5e84a5(
							0x8c)] = !![], this[_0x5e84a5(0x7e)](() => {
							const _0x2e9e01 = _0x5e84a5;
							this[_0x2e9e01(0x92)](_0x2e9e01(0x8a), this[_0x2e9e01(0x87)], this[
								'pauseNum']);
						}));
					}, 0xc8);
				}, 0x64);
		},
		/* 上拉加载回调 */
		lodData() {
			this.$emit('lodData')
		},
		/* 下拉刷新回调 */
		refreshData() {
			this.$emit('refreshData')
		},
		async pickerVideoPlay({
			index,
			item
		}) {
			this.unlockIndex = index;
			//切换剧集
			if (item.unlockStatus != 3) {

				await this.getVideoInfo({
					seriesId: item.id,
					memberId: this.memberId,
				})
				//来找到要切换剧集的在视频当中的下标
				const videoPlayIndex = this.findVideoIndex(item.id);
				this.scrollToVod(videoPlayIndex);
			} else {
				//解锁业务
				this.unlockingData = item;
				this.unlock_show = true;
			}
		},
		findVideoIndex(id) {
			return this.vodList.findIndex(item => item.id === id);
		},
		//购买剧集	
		async buyVideoItem(item, index) {
			if (index === -1) {
				return uni.$u.toast(this.language[this.lang].choosePayMethod)
			}
			const [error, res] = await uni.request({
				url: api.MPWEIXIN + '/api/appApi/buyDramaSeries',
				method: 'POST',
				header: {
					'content-type': 'application/json', // 添加 content-type
					"X-Tenant-Id": api.tenantId,
					'x-lang': this.setLang(),
				},
				data: {
					memberId: uni.getStorageSync('id'), //用户ID
					dramaId: item.filmDramaId, //剧集ID
					sysOrgCode: api.sysOrgCode,
					tenantId: api.tenantId, //租户ID
					seriesSeries: item.dramaSeries, //解锁的剧集ID
					unlockState: false, //剧集是否解锁状态
					payType: this.payTypeIndex,
				},

			})
			if (res.data.code == 200) {
				uni.$u.toast(`${this.language[this.lang].unlockSuccess}`)
				this.unlock_show = false;
				this.$emit('unlock', {
					item,
					index
				})
			} else if (res.data.code == 600) {
				this.openPayPopup();
			}
		},
		/* 到底加载方法 */
		lodingData(dataList) {
			function _0x5d32(_0xc4f427, _0x3ff897) {
				const _0x2ad4c3 = _0x2ad4();
				return _0x5d32 = function(_0x5d3222, _0x2f7b42) {
					_0x5d3222 = _0x5d3222 - 0x6f;
					let _0x30dc2f = _0x2ad4c3[_0x5d3222];
					return _0x30dc2f;
				}, _0x5d32(_0xc4f427, _0x3ff897);
			}

			function _0x2ad4() {
				const _0x5b2a5f = ['30606nwKKHO', '2078662tEjMsu', '1426832jIZyKV', 'filter', 'pauseShow',
					'95390wdtmui', 'vodPaly', '297DfyjOb', '777pPAmBg', 'videoIndex', '1094547tMeIIW',
					'14595EeyFAC', '1108Vtxrkm', '162285tXScIE'
				];
				_0x2ad4 = function() {
					return _0x5b2a5f;
				};
				return _0x2ad4();
			}
			const _0x5a0669 = _0x5d32;
			(function(_0x262643, _0x3c254b) {
				const _0x12d367 = _0x5d32,
					_0x4d77af = _0x262643();
				while (!![]) {
					try {
						const _0x5e8d46 = parseInt(_0x12d367(0x7c)) / 0x1 + -parseInt(_0x12d367(0x73)) / 0x2 + -
							parseInt(_0x12d367(0x71)) / 0x3 + -parseInt(_0x12d367(0x70)) / 0x4 * (-parseInt(
								_0x12d367(0x6f)) / 0x5) + -parseInt(_0x12d367(0x72)) / 0x6 * (parseInt(_0x12d367(
								0x7a)) / 0x7) + parseInt(_0x12d367(0x74)) / 0x8 + -parseInt(_0x12d367(0x79)) / 0x9 *
							(-parseInt(_0x12d367(0x77)) / 0xa);
						if (_0x5e8d46 === _0x3c254b) break;
						else _0x4d77af['push'](_0x4d77af['shift']());
					} catch (_0x5b0275) {
						_0x4d77af['push'](_0x4d77af['shift']());
					}
				}
			}(_0x2ad4, 0xb3d66));
			let num = this['vodList']['length'];
			dataList[_0x5a0669(0x75)]((_0x44a4aa, _0x1ac07d) => {
				const _0x3db95b = _0x5a0669;
				_0x44a4aa[_0x3db95b(0x7b)] = num + _0x1ac07d, _0x44a4aa[_0x3db95b(0x78)] = ![], _0x44a4aa[
					_0x3db95b(0x76)] = ![], _0x44a4aa['loadingShow'] = ![];
			}), this['vodList'] = this['vodList']['concat'](dataList);
		},
		/* 重新加载 */
		refreshSquare(dataList, index) {
			const _0x3f65e2 = _0x4562;
			(function(_0xb5cec7, _0x25fc3a) {
				const _0x564352 = _0x4562,
					_0x27432a = _0xb5cec7();
				while (!![]) {
					try {
						const _0x3956f6 = -parseInt(_0x564352(0x18c)) / 0x1 * (-parseInt(_0x564352(0x18e)) / 0x2) +
							parseInt(_0x564352(0x191)) / 0x3 * (parseInt(_0x564352(0x197)) / 0x4) + parseInt(
								_0x564352(0x195)) / 0x5 * (parseInt(_0x564352(0x199)) / 0x6) + parseInt(_0x564352(
								0x190)) / 0x7 * (parseInt(_0x564352(0x193)) / 0x8) + -parseInt(_0x564352(0x196)) /
							0x9 + -parseInt(_0x564352(0x189)) / 0xa * (parseInt(_0x564352(0x19b)) / 0xb) + -
							parseInt(_0x564352(0x18f)) / 0xc * (parseInt(_0x564352(0x18d)) / 0xd);
						if (_0x3956f6 === _0x25fc3a) break;
						else _0x27432a['push'](_0x27432a['shift']());
					} catch (_0x1714a4) {
						_0x27432a['push'](_0x27432a['shift']());
					}
				}
			}(_0x208f, 0xd375a));
			let playIndex = index ? index : 0x0;
			this[_0x3f65e2(0x18b)] = [], this[_0x3f65e2(0x198)](), this[_0x3f65e2(0x19a)][_0x3f65e2(0x192)][_0x3f65e2(
				0x19c)](), this[_0x3f65e2(0x19a)]['listBox'][_0x3f65e2(0x194)](), setTimeout(() => {
				const _0x3d451a = _0x3f65e2;
				this[_0x3d451a(0x18a)](dataList, playIndex);
			}, 0x32);

			function _0x4562(_0xa5e675, _0x19e7d0) {
				const _0x208f76 = _0x208f();
				return _0x4562 = function(_0x456276, _0x4d802f) {
					_0x456276 = _0x456276 - 0x189;
					let _0x3f1025 = _0x208f76[_0x456276];
					return _0x3f1025;
				}, _0x4562(_0xa5e675, _0x19e7d0);
			}

			function _0x208f() {
				const _0x576c79 = ['16UihwGd', 'resetLoadmore', '5pdoool', '9852219lBofAK', '4hGxQVO', 'resetData',
					'6512280Zpmuam', '$refs', '11PeQOAM', 'closeRefresh', '6391730wZQhwF', 'initVod', 'vodList',
					'105701BMiIOf', '457288ZHjWRO', '2ldociv', '276RUjZcl', '5377827zeeSPv', '2044341sUVTha',
					'refresh'
				];
				_0x208f = function() {
					return _0x576c79;
				};
				return _0x208f();
			}
		},
		/* onShow显示播放视频 */
		showPlay() {
			if (this.vodIndex != null && this.contentShow) {
				this.videoPlay(this.vodIndex);
			}
		},
		/* onHide隐藏暂停视频 */
		hidePause() {
			if (this.vodIndex != null && this.contentShow) {
				this.videoPause(this.vodIndex);
			}
			this.brightSlider = false; //隐藏光亮的进度条
		},
		/* 重置状态数据 */
		resetData() {
			function _0x3732() {
				var _0x568090 = ['9ipSHgp', 'endTime', 'sliderProgress', 'sliderTime', '808652TPqyRh', '238795vFwVNI',
					'1203531BOjOvI', '4904584UTynGE', '5283030zyWYBp', '939696oInDgc', 'sliderDrag', 'videoTime',
					'4DNSklc', '14JGivvC', '1973878LhnHqS'
				];
				_0x3732 = function() {
					return _0x568090;
				};
				return _0x3732();
			}

			function _0x61dd(_0x2cd66e, _0x3c979a) {
				var _0x373254 = _0x3732();
				return _0x61dd = function(_0x61dd0, _0x540e92) {
					_0x61dd0 = _0x61dd0 - 0x94;
					var _0x116139 = _0x373254[_0x61dd0];
					return _0x116139;
				}, _0x61dd(_0x2cd66e, _0x3c979a);
			}
			var _0x1a2000 = _0x61dd;
			(function(_0x176a99, _0x2d7a27) {
					var _0x22356c = _0x61dd,
						_0x379047 = _0x176a99();
					while (!![]) {
						try {
							var _0x12e645 = parseInt(_0x22356c(0xa2)) / 0x1 + parseInt(_0x22356c(0x9d)) / 0x2 + -
								parseInt(_0x22356c(0x95)) / 0x3 + -parseInt(_0x22356c(0x9b)) / 0x4 * (parseInt(
									_0x22356c(0x94)) / 0x5) + parseInt(_0x22356c(0x98)) / 0x6 * (parseInt(_0x22356c(
									0x9c)) / 0x7) + -parseInt(_0x22356c(0x96)) / 0x8 + parseInt(_0x22356c(0x9e)) / 0x9 *
								(-parseInt(_0x22356c(0x97)) / 0xa);
							if (_0x12e645 === _0x2d7a27) break;
							else _0x379047['push'](_0x379047['shift']());
						} catch (_0x16d4d8) {
							_0x379047['push'](_0x379047['shift']());
						}
					}
				}(_0x3732, 0x7e96f), this[_0x1a2000(0xa0)] = 0x0, this[_0x1a2000(0xa1)] = 0x0, this[_0x1a2000(0x9a)] =
				0x0, this[_0x1a2000(0x9f)] = 0x0, this['bufferShow'] = ![], this[_0x1a2000(0x99)] = ![], this[
					'brightSlider'] = ![], this['sliderEndTime'] = null);
		},
		/* 静音设置 */
		muteVideo(val) {
			this.muteSetup = val
		},
		/* 点击暂停、播放视频 */
		playSpot(index) {
			if (this.vodList[index].vodPaly) { //暂停
				this.videoPause(index)
				this.vodList[index].pauseShow = true; //显示暂停图标
				this.$nextTick(() => { //添加暂停动画
					this.addAnimation('pauseRef', this.pauseAddList, this.pauseNum)
				})
			} else { //播放
				this.clickPlay = true
				this.videoPlay(index)
				this.vodList[index].pauseShow = false; //关闭暂停图标
			}
		},
		/* 播放视频 */
		videoPlay(index) {
			function _0x1d11() {
				const _0x42e7fd = ['vodList', '91OtAUmC', '4AAXGNz', '9xKeqcZ', 'swId', '2371805cYPwXC', '327760DFEpKH',
					'2220080XxDRUQ', '5451430POsqYr', '262518TnfhBD', '810286VBlnvA', '$set', 'brightSlider',
					'pauseShow', 'vodPaly', '1837185RCrUKG'
				];
				_0x1d11 = function() {
					return _0x42e7fd;
				};
				return _0x1d11();
			}
			const _0x4c0736 = _0xe1ce;
			(function(_0x876bdb, _0x4c8bce) {
				const _0x332872 = _0xe1ce,
					_0x5221a6 = _0x876bdb();
				while (!![]) {
					try {
						const _0x4c7037 = -parseInt(_0x332872(0x17d)) / 0x1 + parseInt(_0x332872(0x181)) / 0x2 +
							parseInt(_0x332872(0x176)) / 0x3 + -parseInt(_0x332872(0x179)) / 0x4 * (-parseInt(
								_0x332872(0x17c)) / 0x5) + parseInt(_0x332872(0x180)) / 0x6 * (-parseInt(_0x332872(
								0x178)) / 0x7) + parseInt(_0x332872(0x17e)) / 0x8 + parseInt(_0x332872(0x17a)) /
							0x9 * (-parseInt(_0x332872(0x17f)) / 0xa);
						if (_0x4c7037 === _0x4c8bce) break;
						else _0x5221a6['push'](_0x5221a6['shift']());
					} catch (_0x15f28f) {
						_0x5221a6['push'](_0x5221a6['shift']());
					}
				}
			}(_0x1d11, 0x50025));

			function _0xe1ce(_0x2feba2, _0x3b712c) {
				const _0x1d11fd = _0x1d11();
				return _0xe1ce = function(_0xe1ce79, _0x3eb977) {
					_0xe1ce79 = _0xe1ce79 - 0x175;
					let _0x28b5f2 = _0x1d11fd[_0xe1ce79];
					return _0x28b5f2;
				}, _0xe1ce(_0x2feba2, _0x3b712c);
			}
			let vodInfo = Object['assign']({}, this[_0x4c0736(0x177)][index]);
			vodInfo[_0x4c0736(0x175)] = !![], vodInfo[_0x4c0736(0x184)] = ![], this[_0x4c0736(0x182)](this[_0x4c0736(
				0x177)], index, vodInfo), this[_0x4c0736(0x183)] = ![], this['$refs']['myVideo' + index + this[
				_0x4c0736(0x17b)]][0x0]['play']();
		},
		/* 暂停视频 */
		videoPause(index) {
			function _0x100f() {
				var _0x19d872 = ['5FHkNMJ', '2562136ymULwh', 'swId', 'myVideo', '$refs', 'vodIndex', 'vodList',
					'6LSKgWl', '129153ETKxAW', 'vodPaly', '3431526XffSGu', '8690744QXDHsl', '1984048RXNHvb',
					'sliderShow', '248155ApvjqJ', 'brightSlider', '21298014toiMtS'
				];
				_0x100f = function() {
					return _0x19d872;
				};
				return _0x100f();
			}
			var _0x2df473 = _0x2141;

			function _0x2141(_0x43d2a9, _0x1968e3) {
				var _0x100f2f = _0x100f();
				return _0x2141 = function(_0x214116, _0x36c4c9) {
					_0x214116 = _0x214116 - 0x19b;
					var _0x5a11aa = _0x100f2f[_0x214116];
					return _0x5a11aa;
				}, _0x2141(_0x43d2a9, _0x1968e3);
			}(function(_0x37f6c3, _0x330e9d) {
				var _0x24943c = _0x2141,
					_0xa9c9db = _0x37f6c3();
				while (!![]) {
					try {
						var _0x4ea3a2 = parseInt(_0x24943c(0x1a5)) / 0x1 + -parseInt(_0x24943c(0x1a3)) / 0x2 +
							parseInt(_0x24943c(0x19f)) / 0x3 + parseInt(_0x24943c(0x1a9)) / 0x4 * (parseInt(
								_0x24943c(0x1a8)) / 0x5) + parseInt(_0x24943c(0x19e)) / 0x6 * (-parseInt(_0x24943c(
								0x1a1)) / 0x7) + -parseInt(_0x24943c(0x1a2)) / 0x8 + parseInt(_0x24943c(0x1a7)) /
							0x9;
						if (_0x4ea3a2 === _0x330e9d) break;
						else _0xa9c9db['push'](_0xa9c9db['shift']());
					} catch (_0x3b0758) {
						_0xa9c9db['push'](_0xa9c9db['shift']());
					}
				}
			}(_0x100f, 0xb2201), clearTimeout(this['sliderEndTime']), this[_0x2df473(0x19d)][index][_0x2df473(
				0x1a0)] = ![]);
			this[_0x2df473(0x19c)] == index && this[_0x2df473(0x19d)][index][_0x2df473(0x1a4)] && (this[_0x2df473(
				0x1a6)] = !![]);
			this[_0x2df473(0x19b)][_0x2df473(0x1ab) + index + this[_0x2df473(0x1aa)]][0x0]['pause']();
		},
		/* 播放视频 */
		swiperVod(newIndex) {
			function _0x232e() {
				const _0x5ac5f9 = ['2492830EeYEtU', '$refs', '1299748kLrFmD', 'rotateAnti', '5pdBCHa', 'videoPlay',
					'1032003otAvaI', '8UZMpVm', '117njSVQW', '2076216SfmTOy', '1938146FgOieb', 'failTime',
					'631031JllOYH', '10634xSvCEj', '11VlZdAk', 'clickPlay', 'muteVideo', 'shakePlay'
				];
				_0x232e = function() {
					return _0x5ac5f9;
				};
				return _0x232e();
			}
			const _0x3513e5 = _0x46b1;
			(function(_0x5d3d50, _0x4ec4c9) {
				const _0x15b51d = _0x46b1,
					_0xe987bc = _0x5d3d50();
				while (!![]) {
					try {
						const _0x58be38 = parseInt(_0x15b51d(0x149)) / 0x1 + -parseInt(_0x15b51d(0x14a)) / 0x2 * (-
							parseInt(_0x15b51d(0x145)) / 0x3) + -parseInt(_0x15b51d(0x13f)) / 0x4 * (parseInt(
							_0x15b51d(0x141)) / 0x5) + parseInt(_0x15b51d(0x146)) / 0x6 + -parseInt(_0x15b51d(
							0x147)) / 0x7 + -parseInt(_0x15b51d(0x144)) / 0x8 * (-parseInt(_0x15b51d(0x143)) /
							0x9) + -parseInt(_0x15b51d(0x14f)) / 0xa * (parseInt(_0x15b51d(0x14b)) / 0xb);
						if (_0x58be38 === _0x4ec4c9) break;
						else _0xe987bc['push'](_0xe987bc['shift']());
					} catch (_0x19f132) {
						_0xe987bc['push'](_0xe987bc['shift']());
					}
				}
			}(_0x232e, 0x6d5ff), clearInterval(this[_0x3513e5(0x148)]), setTimeout(() => {
				clearTimeout(this['checkTime']);
			}, 0x64), this[_0x3513e5(0x14c)] = ![], this[_0x3513e5(0x140)] = ![], this[_0x3513e5(0x14d)](![]));

			function _0x46b1(_0x14cff7, _0x19c9a0) {
				const _0x232ec8 = _0x232e();
				return _0x46b1 = function(_0x46b1ea, _0x89b6d3) {
					_0x46b1ea = _0x46b1ea - 0x13f;
					let _0x1804df = _0x232ec8[_0x46b1ea];
					return _0x1804df;
				}, _0x46b1(_0x14cff7, _0x19c9a0);
			}
			let newVideoInfo = this[_0x3513e5(0x150)]['myVideo' + newIndex + this['swId']][0x0];
			newVideoInfo && (this[_0x3513e5(0x14e)] = ![], this[_0x3513e5(0x142)](newIndex));
			this.logRecord();
		},
		/* 视频加载成功 */
		loadchange(index) {
			// console.log('视频加载成功==========>',ev,index)
			var _0x180482 = _0x8653;

			function _0x43ed() {
				var _0x10a7e8 = ['1633464gNKgPl', '46400BzCjZp', '48IAAUmg', '348068vUwYpx', '1913874sUmQbx',
					'18458zkhWIu', 'autoplayVideo', '2864344jkswFE', 'vodIndex', '967060HoOJko', 'swiperVod'
				];
				_0x43ed = function() {
					return _0x10a7e8;
				};
				return _0x43ed();
			}(function(_0x34f669, _0x5c09c3) {
				var _0x4741e2 = _0x8653,
					_0x6162b5 = _0x34f669();
				while (!![]) {
					try {
						var _0x1aeae5 = -parseInt(_0x4741e2(0x11a)) / 0x1 + -parseInt(_0x4741e2(0x111)) / 0x2 + -
							parseInt(_0x4741e2(0x119)) / 0x3 * (parseInt(_0x4741e2(0x118)) / 0x4) + -parseInt(
								_0x4741e2(0x115)) / 0x5 + parseInt(_0x4741e2(0x11b)) / 0x6 + parseInt(_0x4741e2(
								0x117)) / 0x7 + parseInt(_0x4741e2(0x113)) / 0x8;
						if (_0x1aeae5 === _0x5c09c3) break;
						else _0x6162b5['push'](_0x6162b5['shift']());
					} catch (_0x21943d) {
						_0x6162b5['push'](_0x6162b5['shift']());
					}
				}
			}(_0x43ed, 0x2a7f1));

			function _0x8653(_0x251fc7, _0x3a4693) {
				var _0x43ed8e = _0x43ed();
				return _0x8653 = function(_0x86532e, _0x109c57) {
					_0x86532e = _0x86532e - 0x111;
					var _0x560ec8 = _0x43ed8e[_0x86532e];
					return _0x560ec8;
				}, _0x8653(_0x251fc7, _0x3a4693);
			}
			index == this[_0x180482(0x114)] && this[_0x180482(0x112)] && this[_0x180482(0x116)](this[_0x180482(0x114)]);
		},
		/* 当开始/继续播放时 */
		startPlay(index) {
			var _0x505147 = _0x3aa8;

			function _0x3aa8(_0x3a6056, _0x3ce18e) {
				var _0x2d1060 = _0x2d10();
				return _0x3aa8 = function(_0x3aa855, _0x52bbfc) {
					_0x3aa855 = _0x3aa855 - 0xaa;
					var _0x5a1c81 = _0x2d1060[_0x3aa855];
					return _0x5a1c81;
				}, _0x3aa8(_0x3a6056, _0x3ce18e);
			}(function(_0xeff7c3, _0x42d9ad) {
				var _0x26d0f1 = _0x3aa8,
					_0x325444 = _0xeff7c3();
				while (!![]) {
					try {
						var _0x2ec6ea = parseInt(_0x26d0f1(0xad)) / 0x1 + parseInt(_0x26d0f1(0xbb)) / 0x2 +
							parseInt(_0x26d0f1(0xb6)) / 0x3 + parseInt(_0x26d0f1(0xae)) / 0x4 * (parseInt(_0x26d0f1(
								0xb0)) / 0x5) + parseInt(_0x26d0f1(0xaa)) / 0x6 * (parseInt(_0x26d0f1(0xaf)) /
								0x7) + parseInt(_0x26d0f1(0xb4)) / 0x8 * (parseInt(_0x26d0f1(0xab)) / 0x9) + -
							parseInt(
								_0x26d0f1(0xb7)) / 0xa * (parseInt(_0x26d0f1(0xb3)) / 0xb);
						if (_0x2ec6ea === _0x42d9ad) break;
						else _0x325444['push'](_0x325444['shift']());
					} catch (_0x156b0d) {
						_0x325444['push'](_0x325444['shift']());
					}
				}
			}(_0x2d10, 0xad184));
			this[_0x505147(0xb8)] == index && (this[_0x505147(0xb1)] = ![], clearInterval(this['failTime']), this[
				'vodList'][this[_0x505147(0xb8)]][_0x505147(0xba)] && !this[_0x505147(0xb5)] && this[_0x505147(
				0xac)][_0x505147(0xb9) + this['vodIndex'] + ''][0x0][_0x505147(0xb2)]());

			function _0x2d10() {
				var _0x42d37d = ['vodIndex', 'menuRef', 'rotateImgShow', '462492jlQuSY', '12XdRShV', '36LmZyYd',
					'$refs', '910389xpnZzf', '52ooHAmv', '2105551TvgrYy', '294035kRMXKv', 'playOpen',
					'rotateAvatar', '62326JXnYwD', '464144MkmPxT', 'rotateAnti', '2780592qFuYvh', '5220XbwDYJ'
				];
				_0x2d10 = function() {
					return _0x42d37d;
				};
				return _0x2d10();
			}
		},
		//记录日志
		logRecord() {
			let videoItem = this.vodList[this.currentIndex];
			uni.request({
				url: api.MPWEIXIN + '/api/appApi/filmDramaSeriesSecond',
				method: 'POST',
				header: {
					'content-type': 'application/json', // 添加 content-type
					"X-Tenant-Id": api.tenantId,
					'x-lang': this.setLang(),
				},
				data: {
					secondType: 1, //操作分类 1播放、2点赞、3收藏、4转发
					calculateType: 1,
					memberId: uni.getStorageSync('id'), //会员ID
					dramaId: videoItem.filmDramaId,
					seriesId: videoItem.id, //剧目ID
					dramaSeries: videoItem.dramaSeries, //剧集集数
					tenantId: api.tenantId, //租户ID
					sysOrgCode: api.sysOrgCode,
				},
			})
		},
		/* 视频出现缓冲 */
		bufferVod(index) {
			// console.log('缓冲视频================》'+index)
			var _0x3ab231 = _0x243b;
			(function(_0x4b3c88, _0xffed49) {
				var _0x59551c = _0x243b,
					_0x8a7359 = _0x4b3c88();
				while (!![]) {
					try {
						var _0x262fd7 = -parseInt(_0x59551c(0x1e7)) / 0x1 * (parseInt(_0x59551c(0x1e2)) / 0x2) +
							parseInt(_0x59551c(0x1e1)) / 0x3 * (parseInt(_0x59551c(0x1df)) / 0x4) + parseInt(
								_0x59551c(0x1da)) / 0x5 + parseInt(_0x59551c(0x1e5)) / 0x6 + parseInt(_0x59551c(
								0x1e0)) / 0x7 * (parseInt(_0x59551c(0x1e4)) / 0x8) + -parseInt(_0x59551c(0x1d6)) /
							0x9 + parseInt(_0x59551c(0x1d7)) / 0xa * (-parseInt(_0x59551c(0x1db)) / 0xb);
						if (_0x262fd7 === _0xffed49) break;
						else _0x8a7359['push'](_0x8a7359['shift']());
					} catch (_0x3f6976) {
						_0x8a7359['push'](_0x8a7359['shift']());
					}
				}
			}(_0x2dbd, 0x28814));

			function _0x243b(_0x370cbe, _0x12f5ab) {
				var _0x2dbdd4 = _0x2dbd();
				return _0x243b = function(_0x243bba, _0x193668) {
					_0x243bba = _0x243bba - 0x1d6;
					var _0x4b82b2 = _0x2dbdd4[_0x243bba];
					return _0x4b82b2;
				}, _0x243b(_0x370cbe, _0x12f5ab);
			}

			function _0x2dbd() {
				var _0x57af91 = ['1351236QEKAbs', 'bufferShow', '479rPaZiG', '664146MOLeNp', '391640ZipBbd', 'vodList',
					'length', '684710woBFwQ', '77VKDsmH', 'videoTime', 'vodIndex', 'vodPaly', '24552yWwVrv',
					'66199QXamzn', '15ZoigZQ', '166ZeOPLp', 'playOpen', '136uQqVXx'
				];
				_0x2dbd = function() {
					return _0x57af91;
				};
				return _0x2dbd();
			}
			this[_0x3ab231(0x1d8)][_0x3ab231(0x1d9)] > 0x0 && index == this[_0x3ab231(0x1dd)] && !this[_0x3ab231(
					0x1e6)] && this[_0x3ab231(0x1dc)] > 0x0 && this['vodList'][this[_0x3ab231(0x1dd)]][_0x3ab231(
					0x1de)] &&
				(this[_0x3ab231(0x1e3)] = !![], this['scheduleLoad']());
		},
		/* 视频播放失败 */
		errVod(index) {
			// console.log('视频播放失败================》'+index)
			var _0x996d8c = _0x3995;
			(function(_0x53f97d, _0x234d4c) {
				var _0x18605a = _0x3995,
					_0xd39ac2 = _0x53f97d();
				while (!![]) {
					try {
						var _0x40dc98 = -parseInt(_0x18605a(0x18c)) / 0x1 + -parseInt(_0x18605a(0x19a)) / 0x2 * (-
								parseInt(_0x18605a(0x193)) / 0x3) + -parseInt(_0x18605a(0x199)) / 0x4 * (parseInt(
								_0x18605a(0x18d)) / 0x5) + -parseInt(_0x18605a(0x194)) / 0x6 * (parseInt(_0x18605a(
								0x18b)) / 0x7) + -parseInt(_0x18605a(0x198)) / 0x8 * (parseInt(_0x18605a(0x196)) /
								0x9) + -parseInt(_0x18605a(0x19b)) / 0xa * (parseInt(_0x18605a(0x191)) / 0xb) +
							parseInt(_0x18605a(0x190)) / 0xc * (parseInt(_0x18605a(0x197)) / 0xd);
						if (_0x40dc98 === _0x234d4c) break;
						else _0xd39ac2['push'](_0xd39ac2['shift']());
					} catch (_0x5ceed8) {
						_0xd39ac2['push'](_0xd39ac2['shift']());
					}
				}
			}(_0xba45, 0x1f5ef));

			function _0xba45() {
				var _0x35d68f = ['playOpen', 'vodList', '12Sccowv', '11YVvXte', 'bufferShow', '2949tBdkgz',
					'48990SJiDod', 'vodPaly', '441fGyWiK', '2591563eYokKf', '10056yxmCdW', '212Zpcfyc', '454xpQixo',
					'260350NDwmOk', 'scheduleLoad', '21TTHwab', '3105ZXjbqP', '16865XhgeJJ'
				];
				_0xba45 = function() {
					return _0x35d68f;
				};
				return _0xba45();
			}

			function _0x3995(_0x11a6b8, _0x1c5d31) {
				var _0xba45ba = _0xba45();
				return _0x3995 = function(_0x399533, _0x3a6db7) {
					_0x399533 = _0x399533 - 0x18a;
					var _0x56cc05 = _0xba45ba[_0x399533];
					return _0x56cc05;
				}, _0x3995(_0x11a6b8, _0x1c5d31);
			}
			this[_0x996d8c(0x18f)]['length'] > 0x0 && index == this['vodIndex'] && !this[_0x996d8c(0x192)] && this[
				'vodList'][this['vodIndex']][_0x996d8c(0x195)] && (this[_0x996d8c(0x18e)] = !![], this[_0x996d8c(
				0x18a)]());
		},
		/* 播放进度变化时触发 */
		timeupdateVod(ev, index) {
			var _0x2502af = _0x13c2;

			function _0x5078() {
				var _0x38c7a9 = ['bufferShow', 'currentTime', '156MdMHQZ', '4403936vPaPnF', '153693yYhYoR',
					'loadingShow', 'sliderDrag', '822GOXHWn', 'vodIndex', 'sliderTime', '3363045NhZIIw', 'detail',
					'screenWidth', '2kWqcVs', '170wnMIMH', '32214sLCckF', 'sliderProgress', 'vodList', 'videoTime',
					'rotateAnti', '3964BiCJoy', '7964682nZkhLv', '617998DOkiGa', 'length', 'bufferTime', 'duration'
				];
				_0x5078 = function() {
					return _0x38c7a9;
				};
				return _0x5078();
			}(function(_0x17e206, _0x5a7c92) {
				var _0x38e089 = _0x13c2,
					_0x5392dd = _0x17e206();
				while (!![]) {
					try {
						var _0x243ce0 = -parseInt(_0x38e089(0xce)) / 0x1 * (parseInt(_0x38e089(0xc5)) / 0x2) + -
							parseInt(_0x38e089(0xba)) / 0x3 * (-parseInt(_0x38e089(0xcc)) / 0x4) + parseInt(
								_0x38e089(0xc2)) / 0x5 + -parseInt(_0x38e089(0xbf)) / 0x6 * (parseInt(_0x38e089(
								0xc7)) / 0x7) + parseInt(_0x38e089(0xbb)) / 0x8 + -parseInt(_0x38e089(0xbc)) / 0x9 *
							(parseInt(_0x38e089(0xc6)) / 0xa) + parseInt(_0x38e089(0xcd)) / 0xb;
						if (_0x243ce0 === _0x5a7c92) break;
						else _0x5392dd['push'](_0x5392dd['shift']());
					} catch (_0x26de10) {
						_0x5392dd['push'](_0x5392dd['shift']());
					}
				}
			}(_0x5078, 0x7048a));
			if (this[_0x2502af(0xc0)] != index) return ![];
			!this[_0x2502af(0xbe)] && (this[_0x2502af(0xca)] = ev[_0x2502af(0xc3)]['duration'], this[_0x2502af(0xc1)] =
				ev[_0x2502af(0xc3)][_0x2502af(0xd3)], this[_0x2502af(0xc8)] = ev[_0x2502af(0xc3)][_0x2502af(0xd3)] /
				ev['detail'][_0x2502af(0xd1)] * this[_0x2502af(0xc4)]);

			function _0x13c2(_0x3a66c9, _0x31a2f4) {
				var _0x5078f5 = _0x5078();
				return _0x13c2 = function(_0x13c238, _0x4826bc) {
					_0x13c238 = _0x13c238 - 0xba;
					var _0x1dbc61 = _0x5078f5[_0x13c238];
					return _0x1dbc61;
				}, _0x13c2(_0x3a66c9, _0x31a2f4);
			}
			this[_0x2502af(0xc9)][_0x2502af(0xcf)] > 0x0 && (this[_0x2502af(0xd2)] = ![], this[_0x2502af(0xc9)][index][
				_0x2502af(0xbd)
			] = ![], clearTimeout(this[_0x2502af(0xd0)]), clearInterval(this['failTime']), this[
				'playOpen'] = ![]);
			this[_0x2502af(0xcb)] = !![];
		},
		/* 显示进度加载动画 */
		scheduleLoad() {
			var _0x52af61 = _0x20bf;

			function _0x3844() {
				var _0x237823 = ['1962021YKloiH', '99TxABMt', '75ECpXLg', 'repeatTime', '734810NmARsq', 'bufferShow',
					'vodLoad', '2598365eYQafI', 'vodIndex', '1712472zhGYDr', '2NBbrEZ', '1089351XwzQEq', '35lieEGU',
					'playOpen', 'loadingSliderShow', 'vodList', '2130402BBnjZK', '78220orjgAO'
				];
				_0x3844 = function() {
					return _0x237823;
				};
				return _0x3844();
			}(function(_0x2ad235, _0x42aa81) {
				var _0x55a8e8 = _0x20bf,
					_0x185a40 = _0x2ad235();
				while (!![]) {
					try {
						var _0x415915 = -parseInt(_0x55a8e8(0x93)) / 0x1 + -parseInt(_0x55a8e8(0x92)) / 0x2 * (-
								parseInt(_0x55a8e8(0x9a)) / 0x3) + parseInt(_0x55a8e8(0x99)) / 0x4 * (-parseInt(
								_0x55a8e8(0x9c)) / 0x5) + -parseInt(_0x55a8e8(0x98)) / 0x6 + parseInt(_0x55a8e8(
								0x94)) / 0x7 * (parseInt(_0x55a8e8(0x91)) / 0x8) + -parseInt(_0x55a8e8(0x9b)) /
							0x9 * (-parseInt(_0x55a8e8(0x9e)) / 0xa) + -parseInt(_0x55a8e8(0x8f)) / 0xb;
						if (_0x415915 === _0x42aa81) break;
						else _0x185a40['push'](_0x185a40['shift']());
					} catch (_0x574fd2) {
						_0x185a40['push'](_0x185a40['shift']());
					}
				}
			}(_0x3844, 0x8862b));

			function _0x20bf(_0x21313c, _0x36dda2) {
				var _0x3844af = _0x3844();
				return _0x20bf = function(_0x20bf1e, _0x4173be) {
					_0x20bf1e = _0x20bf1e - 0x8d;
					var _0x24dbad = _0x3844af[_0x20bf1e];
					return _0x24dbad;
				}, _0x20bf(_0x21313c, _0x36dda2);
			}!this[_0x52af61(0x8d)] && (this['bufferShow'] = !![], this['bufferTime'] = setTimeout(() => {
				var _0x11bd0e = _0x52af61;
				this[_0x11bd0e(0x97)][this[_0x11bd0e(0x90)]]['loadingShow'] = !![], clearTimeout(this[
					'repeatTime']), this[_0x11bd0e(0x9d)] = setTimeout(() => {
					var _0x5bcc56 = _0x11bd0e;
					this[_0x5bcc56(0x96)]();
				}, 0xc8), this[_0x11bd0e(0x95)] && this[_0x11bd0e(0x8e)]();
			}, 0x9c4));
		},
		/* 重新播放视频 */
		vodLoad() {
			function _0x5a28() {
				var _0x28618d = ['47598NyWzGV', '204JxqsUp', 'failTime', '461717yIHEeW', '3hmndDs', '15353921ZUKvop',
					'624opHTjR', '87525PSBWqu', '1872582awXQzS', '7EZzGyX', 'sliderTime', '142445UjXkJB',
					'playOpen', '327840LkLaIJ', 'swId', 'stop', 'vodIndex'
				];
				_0x5a28 = function() {
					return _0x28618d;
				};
				return _0x5a28();
			}

			function _0x3642(_0x78e67a, _0x149620) {
				var _0x5a284d = _0x5a28();
				return _0x3642 = function(_0x36429d, _0x2ac22f) {
					_0x36429d = _0x36429d - 0x19e;
					var _0x48c50b = _0x5a284d[_0x36429d];
					return _0x48c50b;
				}, _0x3642(_0x78e67a, _0x149620);
			}
			var _0x1a1bda = _0x3642;
			(function(_0x595780, _0x46d242) {
				var _0x1b7151 = _0x3642,
					_0xc9fef3 = _0x595780();
				while (!![]) {
					try {
						var _0xd4c562 = parseInt(_0x1b7151(0x1a0)) / 0x1 + -parseInt(_0x1b7151(0x1ae)) / 0x2 * (
							parseInt(_0x1b7151(0x1a1)) / 0x3) + parseInt(_0x1b7151(0x19e)) / 0x4 * (-parseInt(
							_0x1b7151(0x1a8)) / 0x5) + -parseInt(_0x1b7151(0x1a5)) / 0x6 * (parseInt(_0x1b7151(
							0x1a6)) / 0x7) + parseInt(_0x1b7151(0x1a3)) / 0x8 * (parseInt(_0x1b7151(0x1a4)) /
							0x9) + -parseInt(_0x1b7151(0x1aa)) / 0xa + parseInt(_0x1b7151(0x1a2)) / 0xb;
						if (_0xd4c562 === _0x46d242) break;
						else _0xc9fef3['push'](_0xc9fef3['shift']());
					} catch (_0x65f6d) {
						_0xc9fef3['push'](_0xc9fef3['shift']());
					}
				}
			}(_0x5a28, 0xc1f5b));
			this[_0x1a1bda(0x1a9)] && (this[_0x1a1bda(0x1a9)] = ![], this[_0x1a1bda(0x1a7)] == 0x0 && this['$refs'][
				'myVideo' + this[_0x1a1bda(0x1ad)] + this[_0x1a1bda(0x1ab)]
			][0x0][_0x1a1bda(0x1ac)](), this[_0x1a1bda(0x19f)] = setTimeout(() => {
				var _0x37a387 = _0x1a1bda;
				this[_0x37a387(0x1a9)] = !![], this['bufferShow'] = ![], this['videoPlay'](this[
					'vodIndex']);
			}, 0x3e8));
		},
		/* 视频播放结束 */
		endedVod(index) {
			// console.log('视频播放结束'+index)
			const _0x235aa0 = _0x54bd;

			function _0x5d11() {
				const _0x3f2f31 = ['swId', 'myVodEl', '2326762mLGdIk', '1476389rtnAqb', '371BYxydU', '1634912HZcLUL',
					'nextPlay', '6877656ZAsqQE', '66sjXgRR', '282248fJmwWS', '3779574UTEVKX', '$refs',
					'873315EuTXGI', 'scrollToElement', 'vodIndex'
				];
				_0x5d11 = function() {
					return _0x3f2f31;
				};
				return _0x5d11();
			}(function(_0x435b4e, _0x158990) {
				const _0x3deebe = _0x54bd,
					_0x243d72 = _0x435b4e();
				while (!![]) {
					try {
						const _0x4b9452 = parseInt(_0x3deebe(0x113)) / 0x1 + parseInt(_0x3deebe(0x112)) / 0x2 + -
							parseInt(_0x3deebe(0x11a)) / 0x3 + parseInt(_0x3deebe(0x115)) / 0x4 + -parseInt(
								_0x3deebe(0x11c)) / 0x5 * (parseInt(_0x3deebe(0x118)) / 0x6) + -parseInt(_0x3deebe(
								0x114)) / 0x7 * (-parseInt(_0x3deebe(0x119)) / 0x8) + -parseInt(_0x3deebe(0x117)) /
							0x9;
						if (_0x4b9452 === _0x158990) break;
						else _0x243d72['push'](_0x243d72['shift']());
					} catch (_0x41a782) {
						_0x243d72['push'](_0x243d72['shift']());
					}
				}
			}(_0x5d11, 0xed900));

			function _0x54bd(_0x4d90ba, _0x409aa5) {
				const _0x5d1192 = _0x5d11();
				return _0x54bd = function(_0x54bd4e, _0x1a4b1b) {
					_0x54bd4e = _0x54bd4e - 0x10e;
					let _0x2a6407 = _0x5d1192[_0x54bd4e];
					return _0x2a6407;
				}, _0x54bd(_0x4d90ba, _0x409aa5);
			}
			if (this[_0x235aa0(0x10f)] == index && this[_0x235aa0(0x116)]) {
				this[_0x235aa0(0x10f)] += 0x1;
				let el = this[_0x235aa0(0x11b)][_0x235aa0(0x111) + this['vodIndex'] + this[_0x235aa0(0x110)]][0x0];
				dom[_0x235aa0(0x10e)](el, {
					'offset': 0x0,
					'animated': !![]
				});
			}
		},
		// 根据秒获取时间
		formatSeconds(a) {
			var hh = parseInt(a / 3600);
			var mm = parseInt((a - hh * 3600) / 60);
			if (mm < 10) mm = "0" + mm;
			var ss = parseInt((a - hh * 3600) % 60);
			if (ss < 10) ss = "0" + ss;
			if (hh < 10) hh = hh == 0 ? '' : `0${hh}:`;
			var length = hh + mm + ":" + ss;
			if (a >= 0) {
				return length;
			} else {
				return "00:00";
			}
		},
		/* 进度条滑动 */
		touchmoveSlider(event) {
			event.stopPropagation()
			// #ifndef APP-NVUE
			let objclientX = event.changedTouches[0].clientX
			// #endif

			// #ifdef APP-NVUE
			let objclientX = event.changedTouches[0].screenX
			// #endif
			const _0x4a6ca7 = _0x282f;
			(function(_0x22da09, _0xfc0dbb) {
				const _0x592098 = _0x282f,
					_0x38b110 = _0x22da09();
				while (!![]) {
					try {
						const _0x50afbd = parseInt(_0x592098(0x11a)) / 0x1 * (-parseInt(_0x592098(0x11f)) / 0x2) +
							parseInt(_0x592098(0x11b)) / 0x3 + parseInt(_0x592098(0x121)) / 0x4 + -parseInt(
								_0x592098(0x124)) / 0x5 * (-parseInt(_0x592098(0x120)) / 0x6) + parseInt(_0x592098(
								0x119)) / 0x7 + -parseInt(_0x592098(0x125)) / 0x8 + parseInt(_0x592098(0x122)) /
							0x9;
						if (_0x50afbd === _0xfc0dbb) break;
						else _0x38b110['push'](_0x38b110['shift']());
					} catch (_0x3e76e0) {
						_0x38b110['push'](_0x38b110['shift']());
					}
				}
			}(_0x55af, 0xeb7d2));

			function _0x282f(_0x2974f7, _0xa5c3da) {
				const _0x55af03 = _0x55af();
				return _0x282f = function(_0x282fdc, _0x5064f4) {
					_0x282fdc = _0x282fdc - 0x116;
					let _0x2ebc42 = _0x55af03[_0x282fdc];
					return _0x2ebc42;
				}, _0x282f(_0x2974f7, _0xa5c3da);
			}

			function _0x55af() {
				const _0x5d1e35 = ['sliderDrag', 'endTime', 'screenWidth', '16514tIBukH', '498eAiTsP', '6194888KdUArX',
					'7632684wkFNcA', 'videoTime', '14285heoKQU', '13283688fazlet', 'sliderEndTime',
					'sliderProgress', 'brightSlider', '6224351mkNjaC', '180WdIUyJ', '1764483bcwSxH'
				];
				_0x55af = function() {
					return _0x5d1e35;
				};
				return _0x55af();
			}
			if (objclientX >= 0x0 && objclientX <= this[_0x4a6ca7(0x11e)] - 0x2) {
				clearTimeout(this[_0x4a6ca7(0x116)]), this[_0x4a6ca7(0x11c)] = !![], this[_0x4a6ca7(0x118)] = !![],
					this[_0x4a6ca7(0x117)] = objclientX;
				let num = this[_0x4a6ca7(0x117)] / (this[_0x4a6ca7(0x11e)] - 0x2);
				this['sliderTime'] = num * this[_0x4a6ca7(0x123)], this[_0x4a6ca7(0x11d)] = num * this[_0x4a6ca7(
					0x123)];
			}
		},
		/* 进度条滑动结束 */
		touchendSlider(event) {
			const _0x1520e1 = _0x10cc;
			(function(_0x27f811, _0x44b92f) {
				const _0x68d8d6 = _0x10cc,
					_0x4e9764 = _0x27f811();
				while (!![]) {
					try {
						const _0x1cc5f2 = -parseInt(_0x68d8d6(0x1b0)) / 0x1 * (-parseInt(_0x68d8d6(0x1b2)) / 0x2) +
							-parseInt(_0x68d8d6(0x1af)) / 0x3 + -parseInt(_0x68d8d6(0x1b6)) / 0x4 + -parseInt(
								_0x68d8d6(0x1ad)) / 0x5 * (parseInt(_0x68d8d6(0x1ba)) / 0x6) + parseInt(_0x68d8d6(
								0x1ab)) / 0x7 * (parseInt(_0x68d8d6(0x1b3)) / 0x8) + -parseInt(_0x68d8d6(0x1bb)) /
							0x9 * (-parseInt(_0x68d8d6(0x1b8)) / 0xa) + parseInt(_0x68d8d6(0x1aa)) / 0xb;
						if (_0x1cc5f2 === _0x44b92f) break;
						else _0x4e9764['push'](_0x4e9764['shift']());
					} catch (_0x50f35b) {
						_0x4e9764['push'](_0x4e9764['shift']());
					}
				}
			}(_0x2210, 0xb17a4), event[_0x1520e1(0x1b4)](), this['sliderDrag'] = ![]);
			let videoCtx = this[_0x1520e1(0x1bd)]['myVideo' + this[_0x1520e1(0x1b7)] + this[_0x1520e1(0x1b9)]][0x0];
			videoCtx[_0x1520e1(0x1b5)](this['endTime']), videoCtx[_0x1520e1(0x1ae)](), this[_0x1520e1(0x1ac)][this[
				_0x1520e1(0x1b7)]][_0x1520e1(0x1be)] = !![], this[_0x1520e1(0x1ac)][this[_0x1520e1(0x1b7)]][
				'pauseShow'
			] = ![], this[_0x1520e1(0x1b1)] = setTimeout(() => {
				const _0x390133 = _0x1520e1;
				this[_0x390133(0x1bc)] = ![];
			}, 0x7d0);

			function _0x10cc(_0x270ca5, _0x5059a7) {
				const _0x2210a2 = _0x2210();
				return _0x10cc = function(_0x10ccd3, _0x5e6d47) {
					_0x10ccd3 = _0x10ccd3 - 0x1aa;
					let _0x150bc2 = _0x2210a2[_0x10ccd3];
					return _0x150bc2;
				}, _0x10cc(_0x270ca5, _0x5059a7);
			}

			function _0x2210() {
				const _0x264938 = ['brightSlider', '$refs', 'vodPaly', '18032762gXNrMA', '22274nxfJsO', 'vodList',
					'570FwSoGU', 'play', '1386933kjvpVB', '13697NLMWyp', 'sliderEndTime', '118xrsdmx', '784qWSXab',
					'stopPropagation', 'seek', '4113996sZxqdC', 'vodIndex', '2774330meelkH', 'swId', '43104LSLhqX',
					'9eVLhHJ'
				];
				_0x2210 = function() {
					return _0x264938;
				};
				return _0x2210();
			}
		},
		/* 视频是否播放遗漏 */
		vodViewStart() {
			var _0x24a896 = _0x4438;

			function _0x4438(_0x1c6028, _0x351e61) {
				var _0x2ad0c4 = _0x2ad0();
				return _0x4438 = function(_0x443830, _0x12294e) {
					_0x443830 = _0x443830 - 0x6d;
					var _0x50eac5 = _0x2ad0c4[_0x443830];
					return _0x50eac5;
				}, _0x4438(_0x1c6028, _0x351e61);
			}(function(_0x3e739d, _0x3be277) {
				var _0x3caa59 = _0x4438,
					_0x310f28 = _0x3e739d();
				while (!![]) {
					try {
						var _0x592a09 = parseInt(_0x3caa59(0x6e)) / 0x1 * (parseInt(_0x3caa59(0x6f)) / 0x2) + -
							parseInt(_0x3caa59(0x70)) / 0x3 + -parseInt(_0x3caa59(0x7b)) / 0x4 * (-parseInt(
								_0x3caa59(0x71)) / 0x5) + parseInt(_0x3caa59(0x72)) / 0x6 + parseInt(_0x3caa59(
								0x77)) / 0x7 * (parseInt(_0x3caa59(0x74)) / 0x8) + -parseInt(_0x3caa59(0x75)) /
							0x9 + -parseInt(_0x3caa59(0x6d)) / 0xa * (parseInt(_0x3caa59(0x78)) / 0xb);
						if (_0x592a09 === _0x3be277) break;
						else _0x310f28['push'](_0x310f28['shift']());
					} catch (_0x15931f) {
						_0x310f28['push'](_0x310f28['shift']());
					}
				}
			}(_0x2ad0, 0x8d39c), clearTimeout(this[_0x24a896(0x73)]), this[_0x24a896(0x73)] = setTimeout(() => {
				var _0xc8c682 = _0x24a896;
				this[_0xc8c682(0x79)] && (this['moveOpacity'] = ![], this[_0xc8c682(0x76)] = this[_0xc8c682(
					0x7a)]);
			}, 0x1f4));

			function _0x2ad0() {
				var _0xd7b665 = ['currentIndex', '99600MjfDOM', '530KZArYx', '1HVCunx', '2207398wyWQsS',
					'3299901OVSGBa', '215CWAEAk', '4602786AMFatQ', 'checkTime', '453112OAiLUn', '5862231EBjKnH',
					'vodIndex', '7GMvdYp', '138721eOuxdL', 'shakePlay'
				];
				_0x2ad0 = function() {
					return _0xd7b665;
				};
				return _0x2ad0();
			}
		},
		/* 上下滑动的坐标 */
		vodViewMove(ev) {
			// #ifndef APP-NVUE
			this.moveClientY = ev.changedTouches[0].clientY - this.touchClientY
			// #endif
			// #ifdef APP-NVUE
			this.moveClientY = ev.changedTouches[0].screenY - this.touchClientY
			// #endif
			this.startPlayVod = false;
		},
		/* 滑动结束的坐标 */
		vodViewEnd(ev) {
			var _0x44da9b = _0x5836;
			(function(_0x45098e, _0x1e2904) {
					var _0x57433c = _0x5836,
						_0x43b062 = _0x45098e();
					while (!![]) {
						try {
							var _0x38b513 = -parseInt(_0x57433c(0x1a8)) / 0x1 * (parseInt(_0x57433c(0x1a5)) / 0x2) +
								parseInt(_0x57433c(0x1a3)) / 0x3 + -parseInt(_0x57433c(0x1a4)) / 0x4 + -parseInt(
									_0x57433c(0x1af)) / 0x5 * (-parseInt(_0x57433c(0x1a7)) / 0x6) + parseInt(_0x57433c(
									0x1a1)) / 0x7 + -parseInt(_0x57433c(0x1ad)) / 0x8 + -parseInt(_0x57433c(0x1ac)) /
								0x9 * (-parseInt(_0x57433c(0x1a0)) / 0xa);
							if (_0x38b513 === _0x1e2904) break;
							else _0x43b062['push'](_0x43b062['shift']());
						} catch (_0x10d799) {
							_0x43b062['push'](_0x43b062['shift']());
						}
					}
				}(_0xcc3a, 0xbdabd), this[_0x44da9b(0x1a2)] = !![], this[_0x44da9b(0x1aa)] = ![], this[_0x44da9b(0x1a9)]
				());

			function _0xcc3a() {
				var _0x596ed6 = ['2726312gscKEQ', 'changeVod', '2025535MXSvLD', 'vodIndex', '5390qJKorg',
					'4241090uzXLQY', 'startPlayVod', '1674810RNAxDc', '5644040saebag', '356138nfjcdz', 'changeTime',
					'6VGrUEJ', '8CDgpMT', 'vodViewStart', 'moveOpacity', 'changeIndex', '39807vnIYcw'
				];
				_0xcc3a = function() {
					return _0x596ed6;
				};
				return _0xcc3a();
			}

			function _0x5836(_0x17f9df, _0x5e0fd2) {
				var _0xcc3a75 = _0xcc3a();
				return _0x5836 = function(_0x5836ad, _0x4c22b5) {
					_0x5836ad = _0x5836ad - 0x19f;
					var _0x3b0d0b = _0xcc3a75[_0x5836ad];
					return _0x3b0d0b;
				}, _0x5836(_0x17f9df, _0x5e0fd2);
			}!this['changeTime'] && (this['changeTime'] = setTimeout(() => {
				var _0x597f8b = _0x44da9b;
				this[_0x597f8b(0x1ae)] = this[_0x597f8b(0x1ab)] != this[_0x597f8b(0x19f)] ? !![] : ![],
					this[_0x597f8b(0x1a6)] = null;
			}, 0x12c));
		},
		/* loading进度加载动画 */
		loadingSliderShow() {
			let testEl = this.$refs.loadSlider;
			animation.transition(testEl, {
				styles: {
					transform: 'scale(0.4)',
					opacity: "0.9"
				},
				duration: 10, //ms
				timingFunction: 'linear',
				delay: 0 //ms
			}, () => {
				this.loadingSliderHide();
			})
		},
		loadingSliderHide() {
			let testEl = this.$refs.loadSlider;
			animation.transition(testEl, {
				styles: {
					transform: 'scale(1)',
					opacity: "0.1"
				},
				duration: 400, //ms
				timingFunction: 'linear',
				delay: 0 //ms
			}, () => {
				this.loadingSliderShow();
			})
		},
		// 单击或双击
		handClick(event, index) {
			// console.log(event)
			const _0x4cc259 = _0x3287;
			(function(_0x2403fc, _0x5dd26d) {
				const _0x139a83 = _0x3287,
					_0x4f8e19 = _0x2403fc();
				while (!![]) {
					try {
						const _0x42a6c0 = parseInt(_0x139a83(0xea)) / 0x1 * (-parseInt(_0x139a83(0xde)) / 0x2) + -
							parseInt(_0x139a83(0xdf)) / 0x3 * (-parseInt(_0x139a83(0xf0)) / 0x4) + parseInt(
								_0x139a83(0xe6)) / 0x5 * (parseInt(_0x139a83(0xed)) / 0x6) + parseInt(_0x139a83(
								0xe0)) / 0x7 * (parseInt(_0x139a83(0xe5)) / 0x8) + -parseInt(_0x139a83(0xe2)) /
							0x9 * (-parseInt(_0x139a83(0xe9)) / 0xa) + -parseInt(_0x139a83(0xdd)) / 0xb * (parseInt(
								_0x139a83(0xe8)) / 0xc) + -parseInt(_0x139a83(0xec)) / 0xd * (parseInt(_0x139a83(
								0xf1)) / 0xe);
						if (_0x42a6c0 === _0x5dd26d) break;
						else _0x4f8e19['push'](_0x4f8e19['shift']());
					} catch (_0x321f69) {
						_0x4f8e19['push'](_0x4f8e19['shift']());
					}
				}
			}(_0xaa27, 0xc3567));
			event[_0x4cc259(0xee)] == 'touchstart' && (this['touchInfo'] = event);
			if (event[_0x4cc259(0xee)] != 'click') return;
			if (!this[_0x4cc259(0xe3)]) return this[_0x4cc259(0xef)](index), ![];
			const curTime = new Date()['getTime'](),
				lastTime = this['lastTapDiffTime'];
			this[_0x4cc259(0xe7)] = curTime;
			const diff = curTime - lastTime;

			function _0x3287(_0x713fea, _0x2d8941) {
				const _0xaa273d = _0xaa27();
				return _0x3287 = function(_0x328778, _0x275290) {
					_0x328778 = _0x328778 - 0xdd;
					let _0x2ea4ea = _0xaa273d[_0x328778];
					return _0x2ea4ea;
				}, _0x3287(_0x713fea, _0x2d8941);
			}
			diff < 0x12c ? (clearTimeout(this[_0x4cc259(0xe1)]), this[_0x4cc259(0xeb)](this[_0x4cc259(0xe4)], index)) :
				this[_0x4cc259(0xe1)] = setTimeout(() => {
					const _0x3fc286 = _0x4cc259;
					this[_0x3fc286(0xef)](index);
				}, 0x12c);

			function _0xaa27() {
				const _0x490302 = ['lastTapTimeoutFunc', '45dKxSMz', 'doubleOpen', 'touchInfo', '149256IYmgoO',
					'505mXMaoI', 'lastTapDiffTime', '5325252OXKYRO', '2506350KWjoZO', '471986iAxUkU', 'doubleLike',
					'2609204uOdrTe', '44082kwzFTD', 'type', 'playSpot', '424sENxCd', '112fbQxnq', '11ktTnRw',
					'2XmCEhO', '21696iVXCnj', '210yrxyqm'
				];
				_0xaa27 = function() {
					return _0x490302;
				};
				return _0xaa27();
			}
		},
		/* 双击点赞 */
		doubleLike(event, index) {
			const _0xfb14e0 = _0x50ed;
			(function(_0x2944cf, _0x1975d9) {
				const _0x430eb0 = _0x50ed,
					_0x407f44 = _0x2944cf();
				while (!![]) {
					try {
						const _0x4b0e6d = parseInt(_0x430eb0(0x135)) / 0x1 + -parseInt(_0x430eb0(0x12e)) / 0x2 + -
							parseInt(_0x430eb0(0x148)) / 0x3 + -parseInt(_0x430eb0(0x13a)) / 0x4 * (parseInt(
								_0x430eb0(0x134)) / 0x5) + parseInt(_0x430eb0(0x13d)) / 0x6 * (-parseInt(_0x430eb0(
								0x14a)) / 0x7) + parseInt(_0x430eb0(0x13e)) / 0x8 + -parseInt(_0x430eb0(0x133)) /
							0x9 * (-parseInt(_0x430eb0(0x13f)) / 0xa);
						if (_0x4b0e6d === _0x1975d9) break;
						else _0x407f44['push'](_0x407f44['shift']());
					} catch (_0x5340c6) {
						_0x407f44['push'](_0x407f44['shift']());
					}
				}
			}(_0x3f01, 0x7fcad));
			!this[_0xfb14e0(0x12d)][this[_0xfb14e0(0x144)]]['fabulousShow'] && this[_0xfb14e0(0x130)]['menuRef' + this[
				_0xfb14e0(0x144)] + ''][0x0]['fabulousBtn'](index);
			if (!this['doubleHeart']) return;
			if (this[_0xfb14e0(0x131)]) return;

			function _0x50ed(_0x1afa95, _0x1d4a79) {
				const _0x3f0100 = _0x3f01();
				return _0x50ed = function(_0x50edf3, _0x349293) {
					_0x50edf3 = _0x50edf3 - 0x12c;
					let _0x25c4f1 = _0x3f0100[_0x50edf3];
					return _0x25c4f1;
				}, _0x50ed(_0x1afa95, _0x1d4a79);
			}
			this[_0xfb14e0(0x131)] = setTimeout(() => {
				const _0x37d122 = _0xfb14e0;
				let _0xa94a01 = event[_0x37d122(0x139)][0x0][_0x37d122(0x132)],
					_0x30c5a5 = event[_0x37d122(0x139)][0x0]['screenX'],
					_0x4d1a11 = [_0x37d122(0x140), _0x37d122(0x13b), '-15deg'],
					_0x33c413 = Math[_0x37d122(0x136)](Math[_0x37d122(0x142)]() * 0x3),
					_0x5afcbd = {
						'id': this[_0x37d122(0x13c)]++,
						'width': 0x5f,
						'height': 0x5f,
						'top': _0xa94a01 - 0xb4 + 'px',
						'left': _0x30c5a5 - 0x5f / 0x2 + 'px',
						'rotate': _0x4d1a11[_0x33c413],
						'className': '',
						'isShow': !![],
						'addNum': 0x0,
						'removeNum': 0x0
					};
				this[_0x37d122(0x143)][_0x37d122(0x146)](_0x5afcbd), this[_0x37d122(0x131)] = null, this[
					_0x37d122(0x149)](() => {
					const _0x55eac4 = _0x37d122;
					this[_0x55eac4(0x147)](_0x55eac4(0x141) + _0x5afcbd['id'], this[_0x55eac4(0x12f)],
						_0x5afcbd[_0x55eac4(0x137)]), this['doubleAddClass'](_0x5afcbd['id']);
				}), clearTimeout(this[_0x37d122(0x138)]), this[_0x37d122(0x138)] = setTimeout(() => {
					this['likeList'] = [];
				}, 0x5dc), this[_0x37d122(0x145)](_0x37d122(0x12c), this[_0x37d122(0x12d)][this[_0x37d122(
					0x144)]]);
			}, 0x32);

			function _0x3f01() {
				const _0xa62eba = ['1566656CFQPDC', '9179010mInsLB', '0deg', 'peachRef', 'random', 'likeList',
					'vodIndex', '$emit', 'push', 'addAnimation', '542190tslGSe', '$nextTick', '12572pzvSmz',
					'doubleClick', 'vodList', '85884efnJuj', 'peachAddList', '$refs', 'doubleOutTime', 'screenY',
					'9sVkCGC', '78215kGxMlc', '333075xhtHxB', 'floor', 'addNum', 'clearDoubleTime',
					'changedTouches', '116ucTzhq', '15deg', 'likeId', '822ZGKmdf'
				];
				_0x3f01 = function() {
					return _0xa62eba;
				};
				return _0x3f01();
			}
		},
		/* px转换rpx */
		pxToRpx(px) {
			return (750 * Number.parseInt(px)) / this.screenWidth
		},
		/* 双击点赞添加移除动画 */
		doubleAddClass(id) {
			function _0x5096(_0x5088ff, _0x581728) {
				var _0x3fac53 = _0x3fac();
				return _0x5096 = function(_0x509622, _0x38dd10) {
					_0x509622 = _0x509622 - 0x12e;
					var _0xceadc5 = _0x3fac53[_0x509622];
					return _0xceadc5;
				}, _0x5096(_0x5088ff, _0x581728);
			}(function(_0xd89e25, _0x2516f4) {
				var _0x4999bb = _0x5096,
					_0x359d9a = _0xd89e25();
				while (!![]) {
					try {
						var _0x454cd8 = parseInt(_0x4999bb(0x135)) / 0x1 * (-parseInt(_0x4999bb(0x12f)) / 0x2) + -
							parseInt(_0x4999bb(0x13b)) / 0x3 + parseInt(_0x4999bb(0x13c)) / 0x4 * (parseInt(
								_0x4999bb(0x131)) / 0x5) + -parseInt(_0x4999bb(0x132)) / 0x6 * (-parseInt(_0x4999bb(
								0x139)) / 0x7) + -parseInt(_0x4999bb(0x134)) / 0x8 + parseInt(_0x4999bb(0x13a)) /
							0x9 + parseInt(_0x4999bb(0x130)) / 0xa;
						if (_0x454cd8 === _0x2516f4) break;
						else _0x359d9a['push'](_0x359d9a['shift']());
					} catch (_0x55e288) {
						_0x359d9a['push'](_0x359d9a['shift']());
					}
				}
			}(_0x3fac, 0x18b59), setTimeout(() => {
				var _0x4e7d48 = _0x5096;
				this[_0x4e7d48(0x13d)][_0x4e7d48(0x137)]((_0x7a64d0, _0x41859d) => {
					var _0x5d3adf = _0x4e7d48;
					_0x7a64d0['id'] == id && this['addAnimation'](_0x5d3adf(0x136) + _0x7a64d0['id'],
						this[_0x5d3adf(0x12e)], _0x7a64d0[_0x5d3adf(0x133)]);
				}), setTimeout(() => {
					var _0xceb4 = _0x4e7d48;
					this[_0xceb4(0x13d)][_0xceb4(0x137)]((_0x376f71, _0x4f08ef) => {
						var _0x2a8e6a = _0xceb4;
						_0x376f71['id'] == id && (_0x376f71[_0x2a8e6a(0x138)] = ![]);
					});
				}, 0x190);
			}, 0x1f4));

			function _0x3fac() {
				var _0x382c14 = ['713544QMfTDE', '3218JHbhOP', 'peachRef', 'filter', 'isShow', '35VUDkYe',
					'1498545tlncie', '68145qMaoDC', '8uqYGIg', 'likeList', 'peachRemoveList', '106zPmUoR',
					'1022470oJFhPE', '78685IuFrQy', '100134iMYnLB', 'removeNum'
				];
				_0x3fac = function() {
					return _0x382c14;
				};
				return _0x3fac();
			}
		},
		/* 动画方法 */
		addAnimation(name, dataList, num) {
			let testEl = this.$refs[name][0]
			animation.transition(testEl, {
				styles: dataList.list[num],
				duration: num == 0 ? 0 : dataList.duration, //ms
				timingFunction: 'linear',
				delay: 0 //ms
			}, () => {
				num = num + 1
				if (num < dataList.list.length) {
					this.addAnimation(name, dataList, num);
				}
			})
		},
		/* 长按当前视频回调 */
		longpress(item) {
			this.$emit('longpress', item)
		},
		/* 进入全屏 */
		openScreen(index) {
			this.$refs[`myVideo${index}${this.swId}`][0].requestFullScreen();
		},
		/* 退出全屏 */
		exitScreen(index) {
			this.$refs[`myVideo${index ? index : this.vodIndex}${this.swId}`][0].exitFullScreen();
		},
		/* 是否进入全屏 */
		fullScreenChange(val) {
			if (!val) {
				this.vodList[this.vodIndex].vodPaly = true;
				this.vodList[this.vodIndex].pauseShow = false; //关闭暂停图标
				this.brightSlider = false; //隐藏光亮的进度条
			}
		},
		/* 视频点赞、关注 */
		fabulousBtn(data) {
			this.$set(this.vodList, data.index, data.obj)
		},
		setLang() {
			const lang = uni.getStorageSync('lang')
			let originLang = '';
			switch (lang) {
				case 'zh_CN':
					originLang = 'zh'
					break;
				case 'zh_EN':
					originLang = 'en'
					break;
				case 'vi_VN':
					originLang = 've'
					break;
			}
			return originLang;
		},
		//开启充值弹窗
		async openPayPopup() {
			this.unlock_show = false;
			//获取会员信息
			const [vipFaill, vipRes] = await uni.request({
				url: api.MPWEIXIN + `/api/appDivideApi/getBalance?memberId=${uni.getStorageSync('id')}`,
				method: 'GET',
				header: {
					'content-type': 'application/json', // 添加 content-type
					"X-Tenant-Id": api.tenantId,
					'x-lang': this.setLang(),
				},
			})
			if (vipRes.data.code == 200) {
				this.viperInfo = vipRes.data.result;
				console.log(this.viperInfo, 'viperInfo')
			}
			//获取充值套餐详情
			console.log({
				sysOrgCode: api.sysOrgCode,
				tenantId: api.tenantId,
				id: uni.getStorageSync('id')
			}, 'video xx')
			const [rechargeFaill, rechargeRes] = await uni.request({
				url: api.MPWEIXIN + '/api/wxApi/rechargePackageList',
				method: 'GET',
				header: {
					'content-type': 'application/json', // 添加 content-type
					"X-Tenant-Id": api.tenantId,
					'x-lang': this.setLang(),
				},
				data: {
					sysOrgCode: api.sysOrgCode,
					tenantId: api.tenantId,
					id: uni.getStorageSync('id')
				},
			})
			this.rechargeList = rechargeRes.data.result.list;
			//获取会员套餐
			const [viperFaill, viperRes] = await uni.request({
				url: api.MPWEIXIN + '/api/appApi/vipPackageList',
				method: 'GET',
				header: {
					'content-type': 'application/json', // 添加 content-type
					"X-Tenant-Id": api.tenantId,
					'x-lang': this.setLang(),
				},
				data: {
					sysOrgCode: api.sysOrgCode,
					tenantId: api.tenantId,
				},
			})
			this.viperList = viperRes.data.result
			this.pay_show = true;
		},
		viperPicker(index) {
			// this.pay_show = false;
			this.viperIndex = index;
		}
	},

}