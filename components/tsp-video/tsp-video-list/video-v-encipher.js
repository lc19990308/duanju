/* 
 lodData 上拉加载回调
 refreshData 下拉加载回调
 */
export default {
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
		/* 自定义底部栏的高度 */
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
		/* 视频总数量，有值才能滑动加载到最后一个视频 */
		totalvod: {
			type: Number,
			default: 0
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
		/* 前后保留多少个视频数量节点 */
		keepVodNum: {
			type: Number,
			default: 1
		},
	},
	data() {
		return {
			videoStyle: {},
			screenWidth: 0, //屏幕的宽度
			screenHeight: 0, //屏幕的高度
			videoCtx: null,
			vodIndex: 0, // 当前视频下标
			currentIndex: 0, //定位播放的下标
			contentShow: false,
			loadShow: false,
			autoplayVideo: true, // 初始加载完成是否自动播放
			//当前播放的视频数组
			vodList: [
				/* {
					vodUrl:"https://outin-9cc4a7aedd2a11eaabb800163e1a65b6.oss-cn-shanghai.aliyuncs.com/customerTrans/43121ec9955a1ce95146d379f15ea9bd/566eafe2-17b52f0f17b-0007-0f29-cc2-eb217.mp4",
					coverImg:'/static/image/cover1.jpg', //视频封面
					vodPaly:true, //是否播放、暂停视频
					vodShow:true, //是否显示视频
					object_fit:'contain', //视频的显示类型
					pauseShow:false, //是否显示暂停图标
					loadingShow:false, //是否显示loading加载动画
					fabulousShow:false,//是否点赞
					followReally:false, //是否关注
					sliderShow:true, //是否显示进度条
					rotateImgShow:true, //是否显示旋转头像
				} */
			],
			totalPlayList: [],
			finalList: [],
			changeIndex: 0, //current 下标
			beforeVodInfo: {}, //当前播放视频对象
			vodCurIndex: 0, //当前播放视频对象下标
			circular: true,
			durationNum: 300,
			showShade: false, //显示遮罩swiper
			openSpot: false,
			shadeNum: 0,
			bufferTime: null, //缓冲视频显示加载动画防抖
			sliderProgress: 0, //进度条滑动层宽度
			sliderTime: 0, //显示滑动进度条时变化的时间
			videoTime: 0, //视频时长 时间
			endTime: 0, //滑动进度条最终的时间
			sliderDrag: false, //是否在拖动进度
			brightSlider: false, //是否显示光亮的进度条
			sliderEndTime: null, //滑动结束隐藏光亮进度条时间延迟
			bufferNum: null, //显示loading加载进度的时间条件
			bufferShow: false, //显示loading加载进度的条件
			playOpen: false, //视频播放失败，是否重播视频的条件
			failTime: null, //视频播放失败，重播视频的时间
			repeatTime: null,
			palyCartoon: false, //是否播放旋转头像
			shakePlay: false, //是否有防抖视频播放
			touchClientY: 0, //触碰的坐标
			moveClientY: 0, //移动的坐标
			moveOpacity: false, //是否透明
			refreshShow: false, //是否显示下拉刷新
			refreshOpacity: 0, //下拉刷新的透明度
			refreshclientY: 0, //下拉刷新的坐标
			refreshOpen: false, //下拉刷新的触发条件
			playErrTime: null,
			interceptIndex: [],
			loadTime: null,
			beginLoad: 0,
			loadStart: false,
			clickPlay: false, //是否是点击播放
			muteSetup: false, //是否设置为静音
			/* 双击点赞部分 */
			lastTapDiffTime: 0, //上次点击时间
			lastTapTimeoutFunc: null, //单击事件事件函数
			likeList: [], //双击点赞显示的桃心数据
			likeId: 1,
			doubleOutTime: null,
			clearDoubleTime: null,

			tailPlay: false,
			autoplayNum: 0,
			vodPageNum: 3, //页面视频节点数量
			starLoad: true,
			loopVod: false, //是否循环播放
			playCurIndex: 0,
			language: {
				zh_CN: {
					unlockRequired: '需要解锁',
					gold: '金币',
					balance: '余额',
					fullScreen: '全屏显示',
				},
				vi_VN: {
					unlockRequired: 'Mở khóa cần',
					gold: 'vàng',
					balance: 'Số dư',
					fullScreen: 'Hiển thị toàn màn hình',
				},
				zh_EN: {
					unlockRequired: 'Unlock required',
					gold: 'Gold',
					balance: 'Balance',
					fullScreen: 'Full Screen',
				},
			},
			lang: uni.getStorageSync('lang'),

		}
	},
	created() {
		const _0x11a1ef = _0x3120;
		(function(_0x182ce2, _0x148ab9) {
			const _0x4161c1 = _0x3120,
				_0x3b5eaf = _0x182ce2();
			while (!![]) {
				try {
					const _0x16a913 = -parseInt(_0x4161c1(0x17c)) / 0x1 * (-parseInt(_0x4161c1(0x186)) / 0x2) + -
						parseInt(_0x4161c1(0x18a)) / 0x3 * (-parseInt(_0x4161c1(0x177)) / 0x4) + parseInt(_0x4161c1(
							0x176)) / 0x5 * (parseInt(_0x4161c1(0x183)) / 0x6) + parseInt(_0x4161c1(0x17b)) / 0x7 +
						-parseInt(_0x4161c1(0x182)) / 0x8 * (-parseInt(_0x4161c1(0x181)) / 0x9) + parseInt(
							_0x4161c1(0x17a)) / 0xa + -parseInt(_0x4161c1(0x179)) / 0xb;
					if (_0x16a913 === _0x148ab9) break;
					else _0x3b5eaf['push'](_0x3b5eaf['shift']());
				} catch (_0x56c840) {
					_0x3b5eaf['push'](_0x3b5eaf['shift']());
				}
			}
		}(_0x4a3c, 0x5a14e));
		const deviceInfo = uni[_0x11a1ef(0x187)]();
		let topBarHeight = this[_0x11a1ef(0x188)] ? deviceInfo[_0x11a1ef(0x17d)] : 0x0;
		this[_0x11a1ef(0x17e)][_0x11a1ef(0x17d)] = topBarHeight + 'px', this['videoStyle'][_0x11a1ef(0x178)] =
			deviceInfo['screenWidth'] + 'px', this['screenWidth'] = deviceInfo['screenWidth'], this[_0x11a1ef(0x17f)] =
			deviceInfo[_0x11a1ef(0x17f)];

		function _0x3120(_0x252862, _0x11c405) {
			const _0x4a3c85 = _0x4a3c();
			return _0x3120 = function(_0x3120c2, _0x33d386) {
				_0x3120c2 = _0x3120c2 - 0x175;
				let _0x5ce107 = _0x4a3c85[_0x3120c2];
				return _0x5ce107;
			}, _0x3120(_0x252862, _0x11c405);
		}

		function _0x4a3c() {
			const _0x11a48e = ['screenHeight', 'loopPlay', '2295QrFfRW', '2360LVKNgL', '18mJPRFr', 'windowHeight',
				'tabBarHeight', '192pqQcjk', 'getSystemInfoSync', 'showBarHeight', 'tabBarShow', '3dldXtJ',
				'height', '3055oywhZL', '2579804HwjpTp', 'width', '12800964JOyvWH', '973780rEGWDp', '2459065Qqqqms',
				'3771aKFOTC', 'statusBarHeight', 'videoStyle'
			];
			_0x4a3c = function() {
				return _0x11a48e;
			};
			return _0x4a3c();
		}
		this[_0x11a1ef(0x189)] == 0x1 ? (this[_0x11a1ef(0x17e)][_0x11a1ef(0x175)] = deviceInfo['windowHeight'] -
			topBarHeight - this['tabBarHeight'] + 'px', this['vodHeight'] = deviceInfo[_0x11a1ef(0x184)] -
			topBarHeight - this[_0x11a1ef(0x185)]) : (this[_0x11a1ef(0x17e)][_0x11a1ef(0x175)] = deviceInfo[
				_0x11a1ef(0x184)] - topBarHeight + 'px', this['vodHeight'] = deviceInfo[_0x11a1ef(0x184)] -
			topBarHeight);
		this['loopVod'] = this[_0x11a1ef(0x180)];
	},
	watch: {
		vodCurIndex(newIndex, oldIndex) {
			/* 上一个视频处理 */
			const _0x5cc47a = _0x112b;

			function _0x112b(_0x4798fd, _0x1969fc) {
				const _0xa9837a = _0xa983();
				return _0x112b = function(_0x112b72, _0x2f6de2) {
					_0x112b72 = _0x112b72 - 0x1b9;
					let _0x33415a = _0xa9837a[_0x112b72];
					return _0x33415a;
				}, _0x112b(_0x4798fd, _0x1969fc);
			}(function(_0x3f4083, _0x202c1f) {
				const _0x42b033 = _0x112b,
					_0x53559e = _0x3f4083();
				while (!![]) {
					try {
						const _0x5214fd = parseInt(_0x42b033(0x1bc)) / 0x1 * (parseInt(_0x42b033(0x1bb)) / 0x2) + -
							parseInt(_0x42b033(0x1c8)) / 0x3 + parseInt(_0x42b033(0x1c2)) / 0x4 + -parseInt(
								_0x42b033(0x1c4)) / 0x5 * (parseInt(_0x42b033(0x1c6)) / 0x6) + -parseInt(_0x42b033(
								0x1c7)) / 0x7 + parseInt(_0x42b033(0x1c5)) / 0x8 + parseInt(_0x42b033(0x1bd)) / 0x9;
						if (_0x5214fd === _0x202c1f) break;
						else _0x53559e['push'](_0x53559e['shift']());
					} catch (_0x1068c8) {
						_0x53559e['push'](_0x53559e['shift']());
					}
				}
			}(_0xa983, 0x52a20));

			function _0xa983() {
				const _0x5b7b0 = ['vodPaly', 'pause', 'filter', 'vodList', '784472LmiOGC', 'pauseShow', '2665ZgFKQc',
					'3456320tdWyFd', '6408cBzsMR', '3354813GyrxrY', '1850889GBbKAo', 'swId', '$refs', '65868WXvTQt',
					'13aGnjlh', '8528670CiYZlO'
				];
				_0xa983 = function() {
					return _0x5b7b0;
				};
				return _0xa983();
			}
			if (oldIndex >= 0x0) {
				let oldObj = null;
				this[_0x5cc47a(0x1c1)][_0x5cc47a(0x1c0)]((_0x41f933, _0x42d0e5) => {
					const _0x2c4297 = _0x5cc47a;
					oldIndex == _0x41f933['videoIndex'] && (_0x41f933[_0x2c4297(0x1be)] = ![], _0x41f933[
						_0x2c4297(0x1c3)] = ![], _0x41f933['loadingShow'] = ![], this[_0x2c4297(0x1ba)][
						'myVideo' + _0x42d0e5 + this[_0x2c4297(0x1b9)]
					][0x0][_0x2c4297(0x1bf)]());
				});
			}
		},
		loopPlay(newVal, oldVal) {
			this.loopVod = this.loopPlay
		}
	},
	methods: {
		/* 初始加载视频 */
		initVod(dataList, index) {
			const _0x305e9c = _0x4488;
			(function(_0x1f414c, _0x9d7cb3) {
				const _0x1b30ad = _0x4488,
					_0x1a6512 = _0x1f414c();
				while (!![]) {
					try {
						const _0xd6057 = parseInt(_0x1b30ad(0x1be)) / 0x1 * (parseInt(_0x1b30ad(0x1c2)) / 0x2) +
							parseInt(_0x1b30ad(0x1bc)) / 0x3 * (-parseInt(_0x1b30ad(0x1c0)) / 0x4) + -parseInt(
								_0x1b30ad(0x1bd)) / 0x5 + -parseInt(_0x1b30ad(0x1ab)) / 0x6 + parseInt(_0x1b30ad(
								0x1b3)) / 0x7 + -parseInt(_0x1b30ad(0x1b1)) / 0x8 + parseInt(_0x1b30ad(0x1ae)) /
							0x9;
						if (_0xd6057 === _0x9d7cb3) break;
						else _0x1a6512['push'](_0x1a6512['shift']());
					} catch (_0x5656a0) {
						_0x1a6512['push'](_0x1a6512['shift']());
					}
				}
			}(_0x110f, 0x23996), this[_0x305e9c(0x1b5)] = this[_0x305e9c(0x1b6)]);
			index && (this[_0x305e9c(0x1bf)] = 0x0);

			function _0x4488(_0xaa72ad, _0x5eb1d5) {
				const _0x110f9b = _0x110f();
				return _0x4488 = function(_0x44881f, _0x29f57e) {
					_0x44881f = _0x44881f - 0x1ab;
					let _0x36f5ef = _0x110f9b[_0x44881f];
					return _0x36f5ef;
				}, _0x4488(_0xaa72ad, _0x5eb1d5);
			}
			let playIndex = index ? index : 0x0;
			dataList['filter']((_0x51198d, _0xdc82f5) => {
					const _0x30824e = _0x305e9c;
					_0x51198d[_0x30824e(0x1b8)] = _0xdc82f5, _0x51198d[_0x30824e(0x1af)] = _0xdc82f5 == playIndex ?
						!![] : ![], _0x51198d[_0x30824e(0x1b4)] = ![], _0x51198d[_0x30824e(0x1ba)] = ![];
				}), dataList['sort']((_0x5a989d, _0x4e8114) => {
					const _0x9204f = _0x305e9c;
					return _0x5a989d['videoIndex'] - _0x4e8114[_0x9204f(0x1b8)];
				}), this[_0x305e9c(0x1b0)] = dataList, this[_0x305e9c(0x1ac)] = dataList['length'] > 0x0 ? !![] : ![],
				this[_0x305e9c(0x1b9)] = dataList[_0x305e9c(0x1b7)] > 0x0 ? !![] : ![];
			if (this[_0x305e9c(0x1b0)][_0x305e9c(0x1b7)] >= this[_0x305e9c(0x1b2)])
				for (let i = 0x0; i < this[_0x305e9c(0x1b2)]; i++) {
					this[_0x305e9c(0x1bb)]['push']({});
				} else this['vodList'] = dataList;
			this[_0x305e9c(0x1c1)](playIndex, _0x305e9c(0x1ad));

			function _0x110f() {
				const _0x1e492f = ['vodPageNum', '426062tWvLxn', 'pauseShow', 'autoplayVideo', 'autoplay', 'length',
					'videoIndex', 'loadShow', 'loadingShow', 'vodList', '43170eBJvgL', '323365YVAiPa', '3469rwSklQ',
					'durationNum', '68Juwsku', 'getPlayVod', '22kleQmE', '960606jCtCeI', 'contentShow',
					'initialLoad', '6001506XUFiiq', 'vodPaly', 'totalPlayList', '1205128iDoOGp'
				];
				_0x110f = function() {
					return _0x1e492f;
				};
				return _0x110f();
			}
		},
		/* 选择指定视频下标播放 */
		scrollToVod(playIndex) {
			function _0xa3e4() {
				var _0x3da254 = ['466008AUKPdf', '6hrYRBq', '8pjOVbd', '1668951IOimNO', '1517394yxClTo', '899477eyHYdF',
					'3744600KaxpNN', '155032TPTGnc', 'durationNum', '115hLigVv', '2oAYLuk', '2945957JLrlBB',
					'572gTAgMU', 'getPlayVod'
				];
				_0xa3e4 = function() {
					return _0x3da254;
				};
				return _0xa3e4();
			}
			var _0xb92026 = _0x569b;

			function _0x569b(_0x5b0729, _0x1d1154) {
				var _0xa3e47c = _0xa3e4();
				return _0x569b = function(_0x569bc3, _0xb874c5) {
					_0x569bc3 = _0x569bc3 - 0xdc;
					var _0x4192b5 = _0xa3e47c[_0x569bc3];
					return _0x4192b5;
				}, _0x569b(_0x5b0729, _0x1d1154);
			}(function(_0x27707b, _0x35da6a) {
				var _0x4c081c = _0x569b,
					_0x4e8909 = _0x27707b();
				while (!![]) {
					try {
						var _0x3e731d = -parseInt(_0x4c081c(0xe0)) / 0x1 + parseInt(_0x4c081c(0xe5)) / 0x2 * (
							parseInt(_0x4c081c(0xdf)) / 0x3) + -parseInt(_0x4c081c(0xe2)) / 0x4 * (parseInt(
							_0x4c081c(0xe4)) / 0x5) + parseInt(_0x4c081c(0xdc)) / 0x6 * (-parseInt(_0x4c081c(
							0xe6)) / 0x7) + parseInt(_0x4c081c(0xdd)) / 0x8 * (-parseInt(_0x4c081c(0xde)) /
							0x9) + parseInt(_0x4c081c(0xe1)) / 0xa + parseInt(_0x4c081c(0xe7)) / 0xb * (
							parseInt(
								_0x4c081c(0xe9)) / 0xc);
						if (_0x3e731d === _0x35da6a) break;
						else _0x4e8909['push'](_0x4e8909['shift']());
					} catch (_0xa54c2e) {
						_0x4e8909['push'](_0x4e8909['shift']());
					}
				}
			}(_0xa3e4, 0x7aa99), this[_0xb92026(0xe3)] = 0x0, this[_0xb92026(0xe8)](playIndex, null));
		},
		/* 根据指定下标播放 */
		getPlayVod(playIndex, uType) {
			const _0x4ae4cf = _0x3a7b;
			(function(_0x1839da, _0x3ec4fc) {
				const _0x41cccc = _0x3a7b,
					_0x2ee001 = _0x1839da();
				while (!![]) {
					try {
						const _0x37be46 = -parseInt(_0x41cccc(0x18b)) / 0x1 + parseInt(_0x41cccc(0x173)) / 0x2 + -
							parseInt(_0x41cccc(0x175)) / 0x3 * (-parseInt(_0x41cccc(0x188)) / 0x4) + parseInt(
								_0x41cccc(0x17e)) / 0x5 + parseInt(_0x41cccc(0x16e)) / 0x6 + -parseInt(_0x41cccc(
								0x16a)) / 0x7 * (parseInt(_0x41cccc(0x17b)) / 0x8) + -parseInt(_0x41cccc(0x17f)) /
							0x9;
						if (_0x37be46 === _0x3ec4fc) break;
						else _0x2ee001['push'](_0x2ee001['shift']());
					} catch (_0x569b3e) {
						_0x2ee001['push'](_0x2ee001['shift']());
					}
				}
			}(_0x358c, 0xe6aa2));
			let currentNum = 0x0;
			this[_0x4ae4cf(0x180)] = playIndex, setTimeout(() => {
				const _0x5dffed = _0x4ae4cf;
				if (this[_0x5dffed(0x174)][_0x5dffed(0x184)] >= this[_0x5dffed(0x170)]) {
					let _0x3b0bb6 = this[_0x5dffed(0x174)]['length'],
						_0x33d206 = _0x3b0bb6 % this[_0x5dffed(0x170)],
						_0x4d3b1d = playIndex - this['keepVodNum'] < 0x0 ? 0x0 : playIndex - this[_0x5dffed(
							0x16b)],
						_0x3c723a = playIndex + this[_0x5dffed(0x16b)] + 0x1,
						_0x9b8b60 = _0x3b0bb6 - _0x33d206;
					if (playIndex == 0x0 || playIndex + 0x1 >= _0x9b8b60) {
						this['circular'] = ![];
						let _0x4e6bff = [];
						playIndex == 0x0 ? _0x4e6bff = JSON[_0x5dffed(0x186)](JSON[_0x5dffed(0x189)](this[
							_0x5dffed(0x174)][_0x5dffed(0x17a)](_0x4d3b1d, playIndex + this[
							_0x5dffed(0x170)]))) : _0x4e6bff = JSON[_0x5dffed(0x186)](JSON['stringify'](
							this[_0x5dffed(0x174)][_0x5dffed(0x17a)](_0x9b8b60 - this[_0x5dffed(0x170)],
								_0x9b8b60)));
						this[_0x5dffed(0x171)](_0x4e6bff);
						if (playIndex != 0x0) {
							let _0x9210e1 = JSON[_0x5dffed(0x186)](JSON[_0x5dffed(0x189)](this[_0x5dffed(0x174)]
								[_0x5dffed(0x17a)](_0x9b8b60, _0x3b0bb6)));
							_0x9210e1['filter'](_0x221951 => {
								const _0x13e063 = _0x5dffed;
								this[_0x13e063(0x169)][_0x13e063(0x16c)](_0x221951);
							}), this['totalPlayList'][_0x5dffed(0x184)] >= this['totalvod'] && (this[
								'loadShow'] = ![]);
						}
					} else {
						this[_0x5dffed(0x178)] = !![];
						let _0x4edc43 = JSON['parse'](JSON[_0x5dffed(0x189)](this[_0x5dffed(0x174)][_0x5dffed(
							0x17a)](_0x4d3b1d, _0x3c723a)));
						this[_0x5dffed(0x171)](_0x4edc43);
					}
				} else this[_0x5dffed(0x178)] = ![];
				this['getVodInfo'](), this[_0x5dffed(0x169)][_0x5dffed(0x17c)]((_0x4e1678, _0x585dd1) => {
						const _0x17cdf2 = _0x5dffed;
						this[_0x17cdf2(0x180)] == _0x4e1678[_0x17cdf2(0x18a)] && (currentNum = _0x585dd1);
					}), this[_0x5dffed(0x180)] + 0x1 >= this[_0x5dffed(0x174)][_0x5dffed(0x184)] - this[
						_0x5dffed(0x174)][_0x5dffed(0x184)] % this[_0x5dffed(0x170)] && this[_0x5dffed(0x174)][
						'length'
					] >= this[_0x5dffed(0x170)] && (this[_0x5dffed(0x179)] = !![], clearTimeout(this[_0x5dffed(
						0x168)]), this[_0x5dffed(0x168)] = setTimeout(() => {
						const _0x71a247 = _0x5dffed;
						this['beginLoad'] = this[_0x71a247(0x174)][_0x71a247(0x184)], this[_0x71a247(
							0x180)] + 0x1 == this[_0x71a247(0x185)] && (this[_0x71a247(0x169)][0x0][
							_0x71a247(0x18a)
						] = this[_0x71a247(0x185)], this[_0x71a247(0x187)] = !![]), console[
							_0x71a247(0x181)](_0x71a247(0x17d), this[_0x71a247(0x187)]), this[
							_0x71a247(0x16d)](_0x71a247(0x183));
					}, 0x12c)), playIndex > 0x0 && (this['currentIndex'] = currentNum), this[_0x5dffed(0x176)] =
					currentNum, this[_0x5dffed(0x182)] = currentNum;
			}, 0x64), setTimeout(() => {
				const _0x57377e = _0x4ae4cf;
				this['durationNum'] = 0x12c, uType == _0x57377e(0x177) ? this['autoplayVideo'] ? this[_0x57377e(
					0x172)](currentNum) : (this['beforeVodInfo']['vodPaly'] = ![], this[_0x57377e(0x167)][
					_0x57377e(0x16f)
				] = !![]) : this[_0x57377e(0x172)](currentNum);
			}, 0xc8);

			function _0x3a7b(_0x3124b7, _0x5a9f02) {
				const _0x358c31 = _0x358c();
				return _0x3a7b = function(_0x3a7b9a, _0x4ca12a) {
					_0x3a7b9a = _0x3a7b9a - 0x167;
					let _0x2a8a5c = _0x358c31[_0x3a7b9a];
					return _0x2a8a5c;
				}, _0x3a7b(_0x3124b7, _0x5a9f02);
			}

			function _0x358c() {
				const _0x341e61 = ['this.tailPlay====>', '2462540VcbHWY', '7195644ADNODA', 'vodCurIndex', 'log',
					'vodIndex', 'lodData', 'length', 'beginLoad', 'parse', 'tailPlay', '2715596bMnaaR', 'stringify',
					'videoIndex', '1625902SUUeJV', 'beforeVodInfo', 'loadTime', 'vodList', '1172255LgdDLN',
					'keepVodNum', 'push', '$emit', '8993898WHZzxA', 'pauseShow', 'vodPageNum', 'setSliceList',
					'swiperPlay', '3056232KboWVe', 'totalPlayList', '6BFvEhr', 'changeIndex', 'initialLoad',
					'circular', 'loadStart', 'slice', '72ekHxFE', 'filter'
				];
				_0x358c = function() {
					return _0x341e61;
				};
				return _0x358c();
			}
		},
		/* 赋值截取的数据 */
		setSliceList(resData) {
			const _0x34693f = _0x108d;

			function _0x5a14() {
				const _0x4afbe1 = ['150qLmqbS', '3330278wJIBEL', '6pGaihf', '3427336dhYPAl', '1218303UDcUAe', 'filter',
					'1688VgWaLy', 'videoIndex', 'vodPageNum', '959740qTtYBw', 'vodList', '41OjaeUg',
					'1089780IhuzRo', '290844qAlNqZ'
				];
				_0x5a14 = function() {
					return _0x4afbe1;
				};
				return _0x5a14();
			}

			function _0x108d(_0x2ff3bd, _0x440ff1) {
				const _0x5a14fe = _0x5a14();
				return _0x108d = function(_0x108da8, _0x3e1384) {
					_0x108da8 = _0x108da8 - 0x14a;
					let _0x353d7b = _0x5a14fe[_0x108da8];
					return _0x353d7b;
				}, _0x108d(_0x2ff3bd, _0x440ff1);
			}(function(_0xae6898, _0x3ea1b1) {
				const _0x3ca758 = _0x108d,
					_0x475014 = _0xae6898();
				while (!![]) {
					try {
						const _0x508123 = -parseInt(_0x3ca758(0x14c)) / 0x1 * (-parseInt(_0x3ca758(0x155)) / 0x2) +
							-parseInt(_0x3ca758(0x153)) / 0x3 + parseInt(_0x3ca758(0x14d)) / 0x4 + -parseInt(
								_0x3ca758(0x14a)) / 0x5 + parseInt(_0x3ca758(0x151)) / 0x6 * (parseInt(_0x3ca758(
								0x150)) / 0x7) + -parseInt(_0x3ca758(0x152)) / 0x8 + parseInt(_0x3ca758(0x14e)) /
							0x9 * (parseInt(_0x3ca758(0x14f)) / 0xa);
						if (_0x508123 === _0x3ea1b1) break;
						else _0x475014['push'](_0x475014['shift']());
					} catch (_0x373068) {
						_0x475014['push'](_0x475014['shift']());
					}
				}
			}(_0x5a14, 0x3adb5));
			for (let i = 0x0; i < this[_0x34693f(0x157)]; i++) {
				resData[_0x34693f(0x154)]((_0x97abc, _0x19c7ea) => {
					const _0x2e10f4 = _0x34693f;
					_0x97abc[_0x2e10f4(0x156)] % this['vodPageNum'] == i && (this[_0x2e10f4(0x14b)][i] =
						_0x97abc);
				});
			}
		},
		/* 到底加载方法 */
		lodingData(dataList) {
			const _0x4bb3a1 = _0x2bb4;

			function _0x54ca() {
				const _0x317bb0 = ['63966REJJnI', 'slice', 'getVodSliceList', '4534zUxzZm', '1954524XEinde', 'length',
					'circular', '10LViCNO', 'totalPlayList', 'vodCurIndex', '$nextTick', 'vodPageNum', 'push',
					'pauseShow', '12312207xjDCIK', 'filter', 'concat', 'totalvod', 'loadingShow', 'beginLoad',
					'vodList', 'videoIndex', 'tailPlay', '1598472AYJBYe', '205ZLEUBV', '5360SkLvRw', 'finalList',
					'1974ImllnE', 'vodPaly', '2124384UvoBgJ'
				];
				_0x54ca = function() {
					return _0x317bb0;
				};
				return _0x54ca();
			}

			function _0x2bb4(_0x209535, _0x49665d) {
				const _0x54caa9 = _0x54ca();
				return _0x2bb4 = function(_0x2bb4c9, _0x4f5b0f) {
					_0x2bb4c9 = _0x2bb4c9 - 0x8c;
					let _0x32db39 = _0x54caa9[_0x2bb4c9];
					return _0x32db39;
				}, _0x2bb4(_0x209535, _0x49665d);
			}(function(_0x21e65f, _0x45a2dc) {
				const _0x536944 = _0x2bb4,
					_0x1813c3 = _0x21e65f();
				while (!![]) {
					try {
						const _0x2f48c1 = -parseInt(_0x536944(0x9c)) / 0x1 * (-parseInt(_0x536944(0xa5)) / 0x2) +
							parseInt(_0x536944(0xa1)) / 0x3 + parseInt(_0x536944(0xa6)) / 0x4 + parseInt(_0x536944(
								0x9d)) / 0x5 * (parseInt(_0x536944(0x9f)) / 0x6) + parseInt(_0x536944(0xa2)) / 0x7 +
							-parseInt(_0x536944(0x9b)) / 0x8 + -parseInt(_0x536944(0x92)) / 0x9 * (parseInt(
								_0x536944(0xa9)) / 0xa);
						if (_0x2f48c1 === _0x45a2dc) break;
						else _0x1813c3['push'](_0x1813c3['shift']());
					} catch (_0x48aaf1) {
						_0x1813c3['push'](_0x1813c3['shift']());
					}
				}
			}(_0x54ca, 0x6f340));
			let num = this[_0x4bb3a1(0x8c)]['length'];
			if (dataList && dataList[_0x4bb3a1(0xa7)] == 0x0) return;
			dataList[_0x4bb3a1(0x93)]((_0x4df8a7, _0x353afd) => {
				const _0x41630b = _0x4bb3a1;
				_0x4df8a7[_0x41630b(0x99)] = num + _0x353afd, _0x4df8a7[_0x41630b(0xa0)] = ![], _0x4df8a7[
					_0x41630b(0x91)] = ![], _0x4df8a7[_0x41630b(0x96)] = ![];
			}), this['totalPlayList'] = this['totalPlayList'][_0x4bb3a1(0x94)](dataList), this[_0x4bb3a1(0x8e)](
				() => {
					const _0x18e5bc = _0x4bb3a1;
					this[_0x18e5bc(0xa4)](), setTimeout(() => {
						const _0x456f84 = _0x18e5bc;
						for (let _0x20078c = 0x0; _0x20078c < this[_0x456f84(0x8f)]; _0x20078c++) {
							this[_0x456f84(0x9e)][_0x456f84(0x93)]((_0x42cd58, _0x2c81d3) => {
								const _0x2d2806 = _0x456f84;
								_0x42cd58[_0x2d2806(0x99)] != this['vodCurIndex'] && (_0x42cd58[
										_0x2d2806(0x99)] % this[_0x2d2806(0x8f)] == _0x20078c &&
									(this['vodList'][_0x20078c] = _0x42cd58));
							});
						}
						let _0x2c79de = this[_0x456f84(0x95)] - this[_0x456f84(0x95)] % this[_0x456f84(
							0x8f)];
						if (this[_0x456f84(0x8d)] != 0x0 && this['vodList'][_0x456f84(0xa7)] == this[
								_0x456f84(0x8f)] && this[_0x456f84(0x8d)] + 0x1 >= _0x2c79de && this[
								_0x456f84(0x95)] > 0x0) {
							let _0x4386dd = this['totalPlayList'][_0x456f84(0xa3)](this[_0x456f84(0x8d)] +
								0x1, this[_0x456f84(0x8c)][_0x456f84(0xa7)]);
							_0x4386dd[_0x456f84(0x93)](_0x407f2d => {
								const _0x59632e = _0x456f84;
								this[_0x59632e(0x98)][_0x59632e(0x90)](_0x407f2d);
							});
						}
						this['$nextTick'](() => {
							const _0x2f23d3 = _0x456f84;
							this[_0x2f23d3(0xa8)] = !![];
						}), this[_0x456f84(0x8d)] + 0x1 == this[_0x456f84(0x97)] && (this[_0x456f84(
							0x98)][0x0][_0x456f84(0x99)] = this['beginLoad'], this[_0x456f84(
							0x9a)] = !![]);
					}, 0x64);
				});
		},
		/* 重新加载 */
		refreshSquare(dataList, index) {
			function _0x23ea(_0x52af72, _0x385eab) {
				const _0x560573 = _0x5605();
				return _0x23ea = function(_0x23ea06, _0x515d13) {
					_0x23ea06 = _0x23ea06 - 0x198;
					let _0x3c511b = _0x560573[_0x23ea06];
					return _0x3c511b;
				}, _0x23ea(_0x52af72, _0x385eab);
			}
			const _0x246c61 = _0x23ea;

			function _0x5605() {
				const _0x3b89f2 = ['1328XvUSsa', '140440YEaqsT', 'resetData', '6OgjjCL', '1511718BzeNnw', 'initVod',
					'387720WZJCLq', '742563DSojFz', '78572GhWsrQ', '966hQNPGe', '11962960IoSNco', 'totalPlayList',
					'refreshShow', '42IUUwuj', 'vodCurIndex'
				];
				_0x5605 = function() {
					return _0x3b89f2;
				};
				return _0x5605();
			}(function(_0x99d2d4, _0x2d41b5) {
				const _0x2ac355 = _0x23ea,
					_0x17f231 = _0x99d2d4();
				while (!![]) {
					try {
						const _0x3bc03e = parseInt(_0x2ac355(0x1a3)) / 0x1 * (-parseInt(_0x2ac355(0x1a1)) / 0x2) + -
							parseInt(_0x2ac355(0x19e)) / 0x3 * (parseInt(_0x2ac355(0x199)) / 0x4) + -parseInt(
								_0x2ac355(0x1a6)) / 0x5 + -parseInt(_0x2ac355(0x1a4)) / 0x6 + parseInt(_0x2ac355(
								0x19a)) / 0x7 * (parseInt(_0x2ac355(0x1a0)) / 0x8) + parseInt(_0x2ac355(0x198)) /
							0x9 + parseInt(_0x2ac355(0x19b)) / 0xa;
						if (_0x3bc03e === _0x2d41b5) break;
						else _0x17f231['push'](_0x17f231['shift']());
					} catch (_0xe7f0a2) {
						_0x17f231['push'](_0x17f231['shift']());
					}
				}
			}(_0x5605, 0x435b4));
			let playIndex = index ? index : 0x0;
			this[_0x246c61(0x1a2)](), this[_0x246c61(0x19d)] = ![], this['refreshOpen'] = ![], this[_0x246c61(0x19f)] =
				0x0, this['currentIndex'] = 0x0, this['vodList'] = [], this[_0x246c61(0x19c)] = [], setTimeout(() => {
					const _0x406d58 = _0x246c61;
					this[_0x406d58(0x1a5)](dataList, playIndex);
				}, 0x64);
		},
		/* 静音设置 */
		muteVideo(val) {
			this.muteSetup = val
		},
		/* onShow播放视频 */
		showPlay() {
			function _0x276e() {
				var _0x43a73c = ['14UQxVDd', '551854ldMEzd', '2077551esZCxa', '1023624esWtHx', '10620968rAvRya',
					'vodIndex', 'beforeVodInfo', '376038xtPPmw', '269964rUyBUd', '1376090jYHOzD', 'vodPaly',
					'contentShow'
				];
				_0x276e = function() {
					return _0x43a73c;
				};
				return _0x276e();
			}

			function _0x50a6(_0x26a25a, _0x3f1018) {
				var _0x276e42 = _0x276e();
				return _0x50a6 = function(_0x50a6d0, _0x98ecf9) {
					_0x50a6d0 = _0x50a6d0 - 0x91;
					var _0x1c1086 = _0x276e42[_0x50a6d0];
					return _0x1c1086;
				}, _0x50a6(_0x26a25a, _0x3f1018);
			}
			var _0x569f27 = _0x50a6;
			(function(_0x446fb8, _0x2ccc31) {
				var _0x16043f = _0x50a6,
					_0x310d21 = _0x446fb8();
				while (!![]) {
					try {
						var _0x9f8f4a = -parseInt(_0x16043f(0x98)) / 0x1 + parseInt(_0x16043f(0x9a)) / 0x2 + -
							parseInt(_0x16043f(0x99)) / 0x3 + -parseInt(_0x16043f(0x93)) / 0x4 + -parseInt(
								_0x16043f(0x94)) / 0x5 + parseInt(_0x16043f(0x92)) / 0x6 * (parseInt(_0x16043f(
								0x97)) / 0x7) + parseInt(_0x16043f(0x9b)) / 0x8;
						if (_0x9f8f4a === _0x2ccc31) break;
						else _0x310d21['push'](_0x310d21['shift']());
					} catch (_0x4d07c3) {
						_0x310d21['push'](_0x310d21['shift']());
					}
				}
			}(_0x276e, 0x5c363));
			this[_0x569f27(0x9c)] != null && this[_0x569f27(0x96)] && !this[_0x569f27(0x91)][_0x569f27(0x95)] && this[
				'videoPlay'](this[_0x569f27(0x9c)]);
		},
		/* onHide暂停视频 */
		hidePause() {
			var _0xbef13b = _0xe1e7;
			(function(_0x1ac6ec, _0x5ed1e9) {
				var _0x866749 = _0xe1e7,
					_0x5aa7ff = _0x1ac6ec();
				while (!![]) {
					try {
						var _0x1451a4 = parseInt(_0x866749(0x156)) / 0x1 + parseInt(_0x866749(0x150)) / 0x2 * (-
							parseInt(_0x866749(0x159)) / 0x3) + parseInt(_0x866749(0x152)) / 0x4 + parseInt(
							_0x866749(0x153)) / 0x5 + parseInt(_0x866749(0x151)) / 0x6 + parseInt(_0x866749(
							0x158)) / 0x7 + parseInt(_0x866749(0x157)) / 0x8 * (-parseInt(_0x866749(0x155)) /
							0x9);
						if (_0x1451a4 === _0x5ed1e9) break;
						else _0x5aa7ff['push'](_0x5aa7ff['shift']());
					} catch (_0x5eb667) {
						_0x5aa7ff['push'](_0x5aa7ff['shift']());
					}
				}
			}(_0x3cc4, 0xb35af));

			function _0x3cc4() {
				var _0x5585a3 = ['beforeVodInfo', '4ONSdzd', '6159348ohltsW', '3402396YTmtRu', '4515835IePutw',
					'vodIndex', '35401203kBVLpi', '919529jxwtyD', '8ebULYe', '6942383aCaJjy', '35274KHFzru',
					'contentShow', 'brightSlider', 'videoPause'
				];
				_0x3cc4 = function() {
					return _0x5585a3;
				};
				return _0x3cc4();
			}

			function _0xe1e7(_0x4aec8b, _0x1359ac) {
				var _0x3cc42f = _0x3cc4();
				return _0xe1e7 = function(_0xe1e7fc, _0x4ef771) {
					_0xe1e7fc = _0xe1e7fc - 0x150;
					var _0x4677c4 = _0x3cc42f[_0xe1e7fc];
					return _0x4677c4;
				}, _0xe1e7(_0x4aec8b, _0x1359ac);
			}
			this['vodIndex'] != null && this[_0xbef13b(0x15a)] && this[_0xbef13b(0x15d)]['vodPaly'] && this[_0xbef13b(
				0x15c)](this[_0xbef13b(0x154)]);
			this[_0xbef13b(0x15b)] = ![];
		},
		/* 点击暂停、播放视频 */
		playSpot(index) {
			if (this.beforeVodInfo.vodPaly) { //暂停
				this.videoPause(index)
				this.beforeVodInfo.pauseShow = true; //显示暂停图标
			} else { //播放
				this.clickPlay = true
				this.videoPlay(index)
				this.beforeVodInfo.pauseShow = false; //关闭暂停图标

				/* 解决手机浏览器h5前三个滑动不能自动播放的问题 */
				// #ifdef H5
				if (!this.autoplay && this.autoplayNum == 0) {
					this.autoplayNum = 1
					this.vodList.filter((item, idx) => {
						if (idx != index) {
							// uni.createVideoContext('myVideo' + idx + this.swId, this).pause();
							this.$refs[`myVideo${idx}${this.swId}`][0].pause();
						}
					})
				}
				// #endif
			}
		},
		/* 播放视频 */
		videoPlay(index) {
			function _0x5de2(_0x2c1c9e, _0x54080d) {
				var _0x37a4b0 = _0x37a4();
				return _0x5de2 = function(_0x5de254, _0x49038d) {
					_0x5de254 = _0x5de254 - 0x167;
					var _0x4c3f22 = _0x37a4b0[_0x5de254];
					return _0x4c3f22;
				}, _0x5de2(_0x2c1c9e, _0x54080d);
			}
			var _0x424314 = _0x5de2;

			function _0x37a4() {
				var _0x51d4c6 = ['openSpot', 'showShade', '$nextTick', 'swId', 'beforeVodInfo', 'play', '438416vHuKgO',
					'8UutnFy', '1073860Mjvqqi', 'moveOpacity', '123231mWWgKH', '3609438MeafyY', 'getVodInfo',
					'431520sicAch', '4KfVYTT', '66QEtlFC', '$refs', '1822923NjNrQX', 'loadStart', '5rhTxoi',
					'3814384SPLYll'
				];
				_0x37a4 = function() {
					return _0x51d4c6;
				};
				return _0x37a4();
			}(function(_0x5d7878, _0x4460f5) {
					var _0x65c239 = _0x5de2,
						_0x47672c = _0x5d7878();
					while (!![]) {
						try {
							var _0x302f06 = -parseInt(_0x65c239(0x17a)) / 0x1 + parseInt(_0x65c239(0x16c)) / 0x2 + -
								parseInt(_0x65c239(0x169)) / 0x3 * (-parseInt(_0x65c239(0x16d)) / 0x4) + -parseInt(
									_0x65c239(0x172)) / 0x5 * (-parseInt(_0x65c239(0x16a)) / 0x6) + -parseInt(_0x65c239(
									0x173)) / 0x7 + -parseInt(_0x65c239(0x17b)) / 0x8 * (parseInt(_0x65c239(0x170)) /
									0x9) + parseInt(_0x65c239(0x167)) / 0xa * (parseInt(_0x65c239(0x16e)) / 0xb);
							if (_0x302f06 === _0x4460f5) break;
							else _0x47672c['push'](_0x47672c['shift']());
						} catch (_0x71f830) {
							_0x47672c['push'](_0x47672c['shift']());
						}
					}
				}(_0x37a4, 0x4d5b3), this[_0x424314(0x174)] = !![], this[_0x424314(0x16b)](), this[_0x424314(
					0x175)] = ![], this['beforeVodInfo']['vodPaly'] = !![], this[_0x424314(0x178)]['pauseShow'] = ![],
				this[
					'brightSlider'] = ![], this[_0x424314(0x171)] = ![], this[_0x424314(0x176)](() => {
					var _0x35a67d = _0x424314;
					this[_0x35a67d(0x168)] = ![], this[_0x35a67d(0x16f)]['myVideo' + index + this[_0x35a67d(0x177)]]
						[0x0][_0x35a67d(0x179)]();
				}));
		},
		/* 暂停视频 */
		videoPause(index) {
			var _0x40b6a4 = _0x4f08;

			function _0x587b() {
				var _0x266e5c = ['pause', '10etrEoZ', '2573704IfckZf', '374763jXDOKT', '122vNkXyN', 'beforeVodInfo',
					'sliderEndTime', 'sliderShow', '2036jcyXQi', '374SzVsAP', '$nextTick', 'swId', '469lUzvPd',
					'brightSlider', '1604eTRFfa', '7566EZZupJ', 'vodIndex', '2577105pgZPtt', 'myVideo',
					'155556ELBCZn', '2480pyETVq'
				];
				_0x587b = function() {
					return _0x266e5c;
				};
				return _0x587b();
			}(function(_0x37189f, _0x38d714) {
				var _0x481dd5 = _0x4f08,
					_0x4ecae = _0x37189f();
				while (!![]) {
					try {
						var _0x5a17aa = -parseInt(_0x481dd5(0x181)) / 0x1 * (parseInt(_0x481dd5(0x185)) / 0x2) + -
							parseInt(_0x481dd5(0x180)) / 0x3 + parseInt(_0x481dd5(0x176)) / 0x4 * (parseInt(
								_0x481dd5(0x17c)) / 0x5) + parseInt(_0x481dd5(0x177)) / 0x6 * (parseInt(_0x481dd5(
								0x174)) / 0x7) + parseInt(_0x481dd5(0x17f)) / 0x8 + -parseInt(_0x481dd5(0x179)) /
							0x9 * (-parseInt(_0x481dd5(0x17e)) / 0xa) + parseInt(_0x481dd5(0x186)) / 0xb * (-
								parseInt(_0x481dd5(0x17b)) / 0xc);
						if (_0x5a17aa === _0x38d714) break;
						else _0x4ecae['push'](_0x4ecae['shift']());
					} catch (_0x192966) {
						_0x4ecae['push'](_0x4ecae['shift']());
					}
				}
			}(_0x587b, 0x3136e), this['getVodInfo'](), clearTimeout(this[_0x40b6a4(0x183)]), this[_0x40b6a4(0x182)][
				'vodPaly'
			] = ![]);

			function _0x4f08(_0x187659, _0x3078ad) {
				var _0x587bba = _0x587b();
				return _0x4f08 = function(_0x4f0855, _0x311efb) {
					_0x4f0855 = _0x4f0855 - 0x172;
					var _0x2a1187 = _0x587bba[_0x4f0855];
					return _0x2a1187;
				}, _0x4f08(_0x187659, _0x3078ad);
			}
			this[_0x40b6a4(0x178)] == index && this['beforeVodInfo'][_0x40b6a4(0x184)] && (this[_0x40b6a4(0x175)] = !
				![]);
			this[_0x40b6a4(0x172)](() => {
				var _0x96a870 = _0x40b6a4;
				this['$refs'][_0x96a870(0x17a) + index + this[_0x96a870(0x173)]][0x0][_0x96a870(0x17d)]();
			});
		},
		changeSwiper(ev) {
			function _0x322a(_0x2a64d7, _0x1f8ead) {
				const _0x16ce9a = _0x16ce();
				return _0x322a = function(_0x322a37, _0x21eb06) {
					_0x322a37 = _0x322a37 - 0xb2;
					let _0x42f162 = _0x16ce9a[_0x322a37];
					return _0x42f162;
				}, _0x322a(_0x2a64d7, _0x1f8ead);
			}
			const _0x3bd258 = _0x322a;
			(function(_0x52cf8c, _0x113564) {
				const _0x2be8cf = _0x322a,
					_0x44e328 = _0x52cf8c();
				while (!![]) {
					try {
						const _0x3c5f5e = parseInt(_0x2be8cf(0xb5)) / 0x1 + parseInt(_0x2be8cf(0xb6)) / 0x2 + -
							parseInt(_0x2be8cf(0xbf)) / 0x3 + parseInt(_0x2be8cf(0xb4)) / 0x4 * (parseInt(_0x2be8cf(
								0xbb)) / 0x5) + parseInt(_0x2be8cf(0xc9)) / 0x6 + -parseInt(_0x2be8cf(0xb7)) / 0x7 +
							parseInt(_0x2be8cf(0xbe)) / 0x8;
						if (_0x3c5f5e === _0x113564) break;
						else _0x44e328['push'](_0x44e328['shift']());
					} catch (_0x1317af) {
						_0x44e328['push'](_0x44e328['shift']());
					}
				}
			}(_0x16ce, 0x1df50));
			let curIndex = ev[_0x3bd258(0xbd)][_0x3bd258(0xba)],
				videoIndex = this[_0x3bd258(0xb3)][curIndex]['videoIndex'];
			this[_0x3bd258(0xc4)] = !![], this['shadeNum']++, this[_0x3bd258(0xc5)] = ![], this['autoplayVideo'] = !![],
				this[_0x3bd258(0xb9)] = ![], this[_0x3bd258(0xc0)] = this[_0x3bd258(0xc3)];
			let vodTotal = this[_0x3bd258(0xc8)][_0x3bd258(0xb8)] % this[_0x3bd258(0xc6)];
			(videoIndex == 0x0 || videoIndex + 0x1 == this['totalPlayList']['length'] - vodTotal) && this[_0x3bd258(
				0xc1)] > 0x1 && (this['showShade'] = !![]);
			this[_0x3bd258(0xc2)] = curIndex, this[_0x3bd258(0xbc)] = curIndex, this[_0x3bd258(0xc7)] = videoIndex,
				this['getVodSliceList'](), this[_0x3bd258(0xb2)]();

			function _0x16ce() {
				const _0x516daa = ['current', '20ltIzhC', 'currentIndex', 'detail', '70496obwQFl', '257670gkDiJm',
					'loopVod', 'shadeNum', 'changeIndex', 'loopPlay', 'moveOpacity', 'openSpot', 'vodPageNum',
					'vodCurIndex', 'totalPlayList', '202986yseNmE', 'getVodInfo', 'vodList', '25956TkBgjk',
					'153896coNeZx', '244808VuzaYc', '954135PdOfaw', 'length', 'clickPlay'
				];
				_0x16ce = function() {
					return _0x516daa;
				};
				return _0x16ce();
			}
		},
		/* 要播放视频的下标 */
		swiperVod(ev) {
			const _0x314f31 = _0x327d;
			(function(_0x11988c, _0x2b5a4f) {
				const _0x5956f4 = _0x327d,
					_0x47e96c = _0x11988c();
				while (!![]) {
					try {
						const _0x3f0b4e = -parseInt(_0x5956f4(0x19d)) / 0x1 + -parseInt(_0x5956f4(0x195)) / 0x2 +
							parseInt(_0x5956f4(0x181)) / 0x3 + -parseInt(_0x5956f4(0x18b)) / 0x4 + -parseInt(
								_0x5956f4(0x194)) / 0x5 * (-parseInt(_0x5956f4(0x179)) / 0x6) + parseInt(_0x5956f4(
								0x18f)) / 0x7 * (-parseInt(_0x5956f4(0x17b)) / 0x8) + parseInt(_0x5956f4(0x19e)) /
							0x9 * (parseInt(_0x5956f4(0x182)) / 0xa);
						if (_0x3f0b4e === _0x2b5a4f) break;
						else _0x47e96c['push'](_0x47e96c['shift']());
					} catch (_0x1b8289) {
						_0x47e96c['push'](_0x47e96c['shift']());
					}
				}
			}(_0xb6e7, 0x7b80e));
			if (this[_0x314f31(0x189)] == this['vodCurIndex']) return;
			this[_0x314f31(0x189)] = this[_0x314f31(0x196)];
			let curIndex = ev[_0x314f31(0x198)][_0x314f31(0x187)];
			if (this[_0x314f31(0x191)]) return;

			function _0x327d(_0x1fd471, _0x46da) {
				const _0xb6e76a = _0xb6e7();
				return _0x327d = function(_0x327d80, _0x326080) {
					_0x327d80 = _0x327d80 - 0x179;
					let _0x2afdd4 = _0xb6e76a[_0x327d80];
					return _0x2afdd4;
				}, _0x327d(_0x1fd471, _0x46da);
			}
			this[_0x314f31(0x183)](), this[_0x314f31(0x186)] = ![], this[_0x314f31(0x17a)] = ![], this[_0x314f31(0x19c)]
				(this[_0x314f31(0x18e)]);
			let endNum = this[_0x314f31(0x17f)]['length'] - this[_0x314f31(0x17f)][_0x314f31(0x17e)] % this[_0x314f31(
					0x19f)],
				endPlay = ![];
			if (this[_0x314f31(0x196)] == 0x0 || this[_0x314f31(0x196)] + 0x1 >= endNum) {
				this[_0x314f31(0x18a)] = ![];
				let appendNum = this[_0x314f31(0x17d)] - this[_0x314f31(0x17d)] % this[_0x314f31(0x19f)];
				if (this['vodCurIndex'] != 0x0 && this['vodList']['length'] == this[_0x314f31(0x19f)] && this[_0x314f31(
						0x196)] + 0x1 >= appendNum && this[_0x314f31(0x17d)] > 0x0) {
					let oldIndex = this['vodCurIndex'],
						arrList = this['totalPlayList'][_0x314f31(0x199)](this[_0x314f31(0x196)] + 0x1, this[_0x314f31(
							0x17f)][_0x314f31(0x17e)]);
					arrList['filter'](_0x3f2844 => {
						const _0x355458 = _0x314f31;
						this[_0x355458(0x19a)]['push'](_0x3f2844);
					});
				}
			} else {
				let loadNum = this[_0x314f31(0x193)] - this[_0x314f31(0x193)] % this[_0x314f31(0x19f)];
				this[_0x314f31(0x193)] > 0x0 && this[_0x314f31(0x196)] + 0x1 >= loadNum && this['vodCurIndex'] + 0x1 <=
					this['beginLoad'] ? this[_0x314f31(0x196)] + 0x1 == this[_0x314f31(0x193)] && (this[_0x314f31(
						0x19a)][0x0][_0x314f31(0x19b)] = this[_0x314f31(0x193)], this['tailPlay'] = !![]) : this[
						_0x314f31(0x19a)][_0x314f31(0x17e)] > this[_0x314f31(0x19f)] && (this[_0x314f31(0x19a)][
						_0x314f31(0x17e)
					] = this['vodPageNum']), this['$nextTick'](() => {
						const _0x1d34d7 = _0x314f31;
						this[_0x1d34d7(0x18a)] = !![];
					});
			}
			this[_0x314f31(0x17d)] > 0x0 && (this[_0x314f31(0x18d)] = this[_0x314f31(0x17f)][_0x314f31(0x17e)] >= this[
				'totalvod'] ? ![] : !![]);
			if (this[_0x314f31(0x196)] + 0x1 > this[_0x314f31(0x193)] && this[_0x314f31(0x193)] > 0x0 && this[_0x314f31(
					0x18c)] && !endPlay && this['beginLoad'] != this[_0x314f31(0x17f)][_0x314f31(0x17e)]) {
				this[_0x314f31(0x18c)] = ![], this[_0x314f31(0x188)] = 0x0;
				let currentNum = 0x0;
				this[_0x314f31(0x180)](() => {
					const _0x45d13e = _0x314f31;
					this[_0x45d13e(0x19a)][_0x45d13e(0x184)]((_0x4a98cd, _0x3e5602) => {
						const _0x57211a = _0x45d13e;
						_0x4a98cd[_0x57211a(0x19b)] == this[_0x57211a(0x193)] && (currentNum =
							_0x3e5602);
					}), this['currentIndex'] = currentNum, this[_0x45d13e(0x192)] = currentNum, setTimeout(
						() => {
							const _0x160f38 = _0x45d13e;
							this[_0x160f38(0x188)] = 0x12c, this[_0x160f38(0x193)] = 0x0;
						}, 0x64);
				});
			}!endPlay && (this[_0x314f31(0x17c)] = this[_0x314f31(0x192)], this['swiperPlay'](this['vodIndex']), this[
				'$emit'](_0x314f31(0x190), this[_0x314f31(0x19a)][this[_0x314f31(0x17c)]]));

			function _0xb6e7() {
				const _0x3c3675 = ['vodPageNum', '3241782JxIOKz', 'showShade', '92048ohHxyC', 'vodIndex', 'totalvod',
					'length', 'totalPlayList', '$nextTick', '1220937NhPQdL', '20pxXhId', 'resetData', 'filter',
					'lodData', 'moveOpacity', 'current', 'durationNum', 'playCurIndex', 'circular', '995720HFonzR',
					'tailPlay', 'loadShow', 'finalList', '161RTtAdl', 'swiperChange', 'openSpot', 'changeIndex',
					'beginLoad', '5pVehnT', '769012zOYsOG', 'vodCurIndex', 'loadTime', 'detail', 'slice', 'vodList',
					'videoIndex', 'setSliceList', '299518nhinui', '3402837hrmFPd'
				];
				_0xb6e7 = function() {
					return _0x3c3675;
				};
				return _0xb6e7();
			}
			this['vodCurIndex'] + 0x1 >= this[_0x314f31(0x17f)]['length'] - this[_0x314f31(0x17f)]['length'] % this[
				_0x314f31(0x19f)] && !this['loadStart'] && this[_0x314f31(0x17f)][_0x314f31(0x17e)] >= this[
				_0x314f31(0x19f)] && (clearTimeout(this['loadTime']), this[_0x314f31(0x197)] = setTimeout(() => {
				const _0x13da7a = _0x314f31;
				this['$emit'](_0x13da7a(0x185));
			}, 0x12c));
		},
		/* 重新定位播放 */
		againLocatePlay() {
			function _0x3bf9(_0x547baa, _0x3ba319) {
				const _0x589701 = _0x5897();
				return _0x3bf9 = function(_0x3bf90d, _0x2ce60a) {
					_0x3bf90d = _0x3bf90d - 0x1db;
					let _0x2ee684 = _0x589701[_0x3bf90d];
					return _0x2ee684;
				}, _0x3bf9(_0x547baa, _0x3ba319);
			}
			const _0x51e36c = _0x3bf9;
			(function(_0x4b0bfd, _0xcde30c) {
				const _0x329710 = _0x3bf9,
					_0xc0f045 = _0x4b0bfd();
				while (!![]) {
					try {
						const _0x91db7b = -parseInt(_0x329710(0x1df)) / 0x1 * (parseInt(_0x329710(0x1db)) / 0x2) + -
							parseInt(_0x329710(0x1e3)) / 0x3 * (parseInt(_0x329710(0x1dd)) / 0x4) + parseInt(
								_0x329710(0x1e0)) / 0x5 * (parseInt(_0x329710(0x1e5)) / 0x6) + -parseInt(_0x329710(
								0x1e6)) / 0x7 + parseInt(_0x329710(0x1dc)) / 0x8 + -parseInt(_0x329710(0x1e1)) /
							0x9 + parseInt(_0x329710(0x1e4)) / 0xa * (parseInt(_0x329710(0x1de)) / 0xb);
						if (_0x91db7b === _0xcde30c) break;
						else _0xc0f045['push'](_0xc0f045['shift']());
					} catch (_0x210659) {
						_0xc0f045['push'](_0xc0f045['shift']());
					}
				}
			}(_0x5897, 0x3afac), this[_0x51e36c(0x1eb)] = 0x0);
			let currentNum = 0x0;
			this[_0x51e36c(0x1ea)][_0x51e36c(0x1e2)]((_0x4a8674, _0x2ec8c1) => {
				const _0x3c029a = _0x51e36c;
				this[_0x3c029a(0x1e8)] == _0x4a8674['videoIndex'] && (currentNum = _0x2ec8c1);
			}), this[_0x51e36c(0x1e9)] = currentNum, this[_0x51e36c(0x1e7)] = currentNum, setTimeout(() => {
				const _0x83c41c = _0x51e36c;
				this['swiperPlay'](this[_0x83c41c(0x1e7)]), this[_0x83c41c(0x1eb)] = 0x12c;
			}, 0x64);

			function _0x5897() {
				const _0x6f902e = ['113296NEJojJ', '16qoDpNQ', '3682283qYdSvl', '1qLIOip', '15LODyUd', '93762DabgWT',
					'filter', '112410kVCQIU', '30vuzrfR', '395946JkdCmQ', '2535981soKmxp', 'vodIndex',
					'vodCurIndex', 'currentIndex', 'vodList', 'durationNum', '904466KtqLna'
				];
				_0x5897 = function() {
					return _0x6f902e;
				};
				return _0x5897();
			}
		},
		/* 获取当前视频播放对象 */
		getVodInfo() {
			function _0x643b() {
				var _0x2d8fdd = ['beforeVodInfo', '2921864mteUAr', 'videoIndex', '2349152nOaARK', '1783831XbeOsE',
					'1494tqGgfH', '597447pwjbhI', '9wpcNFv', '2729BNNdKg', 'vodCurIndex', '206ZFQxQH', '24CccBeA',
					'filter', '184940XUXMnC', '260bCELOR', '10OFYlMF', '40CvZhPW', 'vodList'
				];
				_0x643b = function() {
					return _0x2d8fdd;
				};
				return _0x643b();
			}

			function _0x2651(_0x106fe2, _0x51df83) {
				var _0x643bd5 = _0x643b();
				return _0x2651 = function(_0x265172, _0x4c3908) {
					_0x265172 = _0x265172 - 0x8a;
					var _0x7c6eab = _0x643bd5[_0x265172];
					return _0x7c6eab;
				}, _0x2651(_0x106fe2, _0x51df83);
			}
			var _0x345092 = _0x2651;
			(function(_0x3c80b0, _0x1a1614) {
				var _0x2f1ae8 = _0x2651,
					_0x3e744a = _0x3c80b0();
				while (!![]) {
					try {
						var _0x17ddd2 = parseInt(_0x2f1ae8(0x8f)) / 0x1 * (parseInt(_0x2f1ae8(0x91)) / 0x2) + -
							parseInt(_0x2f1ae8(0x8e)) / 0x3 * (parseInt(_0x2f1ae8(0x94)) / 0x4) + parseInt(
								_0x2f1ae8(0x95)) / 0x5 * (-parseInt(_0x2f1ae8(0x8c)) / 0x6) + -parseInt(_0x2f1ae8(
								0x8b)) / 0x7 + parseInt(_0x2f1ae8(0x97)) / 0x8 * (-parseInt(_0x2f1ae8(0x8d)) /
								0x9) + -parseInt(_0x2f1ae8(0x96)) / 0xa * (-parseInt(_0x2f1ae8(0x9a)) / 0xb) + -
							parseInt(_0x2f1ae8(0x92)) / 0xc * (-parseInt(_0x2f1ae8(0x8a)) / 0xd);
						if (_0x17ddd2 === _0x1a1614) break;
						else _0x3e744a['push'](_0x3e744a['shift']());
					} catch (_0x4e8744) {
						_0x3e744a['push'](_0x3e744a['shift']());
					}
				}
			}(_0x643b, 0x296f6), this[_0x345092(0x98)][_0x345092(0x93)](_0x215c8c => {
				var _0x347c78 = _0x345092;
				this[_0x347c78(0x90)] == _0x215c8c[_0x347c78(0x9b)] && (this[_0x347c78(0x99)] = _0x215c8c);
			}));
		},
		/* 截取要播放的视频列表 */
		getVodSliceList() {
			const _0x25efd3 = _0x2f85;
			(function(_0x55439a, _0x1c30bf) {
				const _0x53a600 = _0x2f85,
					_0x1550f8 = _0x55439a();
				while (!![]) {
					try {
						const _0x3d51b1 = -parseInt(_0x53a600(0x129)) / 0x1 * (parseInt(_0x53a600(0x134)) / 0x2) + -
							parseInt(_0x53a600(0x137)) / 0x3 + -parseInt(_0x53a600(0x13c)) / 0x4 + parseInt(
								_0x53a600(0x12f)) / 0x5 * (-parseInt(_0x53a600(0x12c)) / 0x6) + -parseInt(_0x53a600(
								0x132)) / 0x7 + -parseInt(_0x53a600(0x130)) / 0x8 * (-parseInt(_0x53a600(0x13b)) /
								0x9) + -parseInt(_0x53a600(0x12b)) / 0xa * (-parseInt(_0x53a600(0x136)) / 0xb);
						if (_0x3d51b1 === _0x1c30bf) break;
						else _0x1550f8['push'](_0x1550f8['shift']());
					} catch (_0x15a855) {
						_0x1550f8['push'](_0x1550f8['shift']());
					}
				}
			}(_0x32b6, 0xd7c25));
			let videoIndex = this[_0x25efd3(0x131)][this[_0x25efd3(0x12e)]]['videoIndex'],
				starIdx = videoIndex - this['keepVodNum'] < 0x0 ? 0x0 : videoIndex - this[_0x25efd3(0x13a)],
				endIdx = videoIndex == 0x0 ? this[_0x25efd3(0x133)] : videoIndex + this[_0x25efd3(0x13a)] + 0x1,
				resultList = JSON[_0x25efd3(0x139)](JSON[_0x25efd3(0x12d)](this['totalPlayList'][_0x25efd3(0x135)](
					starIdx, endIdx)));
			for (let i = 0x0; i < this[_0x25efd3(0x133)]; i++) {
				resultList['filter'](_0x4cd342 => {
					const _0x4c027a = _0x25efd3;
					_0x4cd342[_0x4c027a(0x138)] % this[_0x4c027a(0x133)] == i && (this[_0x4c027a(0x131)][i][
						_0x4c027a(0x138)
					] = _0x4cd342['videoIndex']);
				});
			}

			function _0x2f85(_0x44455d, _0x6538c) {
				const _0x32b64b = _0x32b6();
				return _0x2f85 = function(_0x2f8575, _0x44fe80) {
					_0x2f8575 = _0x2f8575 - 0x129;
					let _0x5ce009 = _0x32b64b[_0x2f8575];
					return _0x5ce009;
				}, _0x2f85(_0x44455d, _0x6538c);
			}
			this[_0x25efd3(0x12a)] = resultList;

			function _0x32b6() {
				const _0x4b51d9 = ['235EXDJxq', '128936XISBFv', 'vodList', '1233953mQhYHn', 'vodPageNum', '6mkNRhD',
					'slice', '11UfIwfb', '2145876SwWOyd', 'videoIndex', 'parse', 'keepVodNum', '666hsmSOg',
					'3081892QeXSWt', '208507cANLkl', 'finalList', '35685250KFqpqp', '202962noTeaE', 'stringify',
					'changeIndex'
				];
				_0x32b6 = function() {
					return _0x4b51d9;
				};
				return _0x32b6();
			}
		},
		/* swiper播放视频 */
		swiperPlay(newIndex) {
			function _0x12c5(_0x12261d, _0x4ebd84) {
				const _0x5b5005 = _0x5b50();
				return _0x12c5 = function(_0x12c5e8, _0x5e69f0) {
					_0x12c5e8 = _0x12c5e8 - 0xd1;
					let _0xcb3307 = _0x5b5005[_0x12c5e8];
					return _0xcb3307;
				}, _0x12c5(_0x12261d, _0x4ebd84);
			}

			function _0x5b50() {
				const _0x578178 = ['9688WQuxKC', 'shakePlay', 'videoPlay', '3195350iIehCp', '6290634CskJRW', '6KIBSiH',
					'633464TfORNQ', '12INorFi', '609576jfDdgi', '454798arabjM', '773458FDaqKn', 'failTime',
					'repeatTime', '$refs', 'myVideo', '5472oFWLLZ', '10aTeOkm', 'muteVideo'
				];
				_0x5b50 = function() {
					return _0x578178;
				};
				return _0x5b50();
			}
			const _0xcb6fd3 = _0x12c5;
			(function(_0x534e0d, _0x1bb960) {
				const _0x1b5c08 = _0x12c5,
					_0x4f12af = _0x534e0d();
				while (!![]) {
					try {
						const _0x209b5c = -parseInt(_0x1b5c08(0xd3)) / 0x1 + parseInt(_0x1b5c08(0xd2)) / 0x2 * (-
							parseInt(_0x1b5c08(0xe2)) / 0x3) + -parseInt(_0x1b5c08(0xe1)) / 0x4 + parseInt(
							_0x1b5c08(0xde)) / 0x5 + -parseInt(_0x1b5c08(0xe0)) / 0x6 * (-parseInt(_0x1b5c08(
							0xdf)) / 0x7) + -parseInt(_0x1b5c08(0xdb)) / 0x8 * (-parseInt(_0x1b5c08(0xd8)) /
							0x9) + -parseInt(_0x1b5c08(0xd9)) / 0xa * (-parseInt(_0x1b5c08(0xd1)) / 0xb);
						if (_0x209b5c === _0x1bb960) break;
						else _0x4f12af['push'](_0x4f12af['shift']());
					} catch (_0x316f7c) {
						_0x4f12af['push'](_0x4f12af['shift']());
					}
				}
			}(_0x5b50, 0x77250), this['playOpen'] = ![], clearInterval(this[_0xcb6fd3(0xd4)]), clearInterval(this[
				_0xcb6fd3(0xd5)]), this[_0xcb6fd3(0xda)](![]));
			let newVideoInfo = null;
			newVideoInfo = this[_0xcb6fd3(0xd6)][_0xcb6fd3(0xd7) + newIndex + this['swId']][0x0];
			newVideoInfo && (this[_0xcb6fd3(0xdc)] = ![], this[_0xcb6fd3(0xdd)](newIndex));
			this[_0xcb6fd3(0xd6)]['menuRef' + newIndex + ''][0x0]['likeeffect'] = null;
		},
		/* 视频加载成功 */
		loadchange(ev, index) {
			// console.log('视频加载成功==========>',ev,index)
			var _0x4ab957 = _0x68e4;

			function _0x68e4(_0x2a474c, _0x34b5fe) {
				var _0x26913f = _0x2691();
				return _0x68e4 = function(_0x68e498, _0x37f9aa) {
					_0x68e498 = _0x68e498 - 0x96;
					var _0x45f36a = _0x26913f[_0x68e498];
					return _0x45f36a;
				}, _0x68e4(_0x2a474c, _0x34b5fe);
			}(function(_0x3d79d2, _0x8f35c8) {
				var _0x2ba5a5 = _0x68e4,
					_0x2101b5 = _0x3d79d2();
				while (!![]) {
					try {
						var _0x326964 = -parseInt(_0x2ba5a5(0x97)) / 0x1 + parseInt(_0x2ba5a5(0x9a)) / 0x2 +
							parseInt(_0x2ba5a5(0x9e)) / 0x3 * (-parseInt(_0x2ba5a5(0x9d)) / 0x4) + -parseInt(
								_0x2ba5a5(0xa1)) / 0x5 * (parseInt(_0x2ba5a5(0x9c)) / 0x6) + parseInt(_0x2ba5a5(
								0x99)) / 0x7 + -parseInt(_0x2ba5a5(0xa0)) / 0x8 * (parseInt(_0x2ba5a5(0x98)) /
								0x9) + parseInt(_0x2ba5a5(0x9f)) / 0xa;
						if (_0x326964 === _0x8f35c8) break;
						else _0x2101b5['push'](_0x2101b5['shift']());
					} catch (_0x4c5686) {
						_0x2101b5['push'](_0x2101b5['shift']());
					}
				}
			}(_0x2691, 0x2f586));
			index == this['vodIndex'] && this[_0x4ab957(0x9b)] && this[_0x4ab957(0x96)]();

			function _0x2691() {
				var _0x42ad23 = ['178780xDIEtI', 'autoplayVideo', '6iGCFgC', '746588dVBNbI', '3AzdwlA', '4661970aHxEzY',
					'8FeJsyU', '26405yieUIZ', 'againLocatePlay', '61877HpNgLo', '2008161XDsjxl', '806911ngoJVM'
				];
				_0x2691 = function() {
					return _0x42ad23;
				};
				return _0x2691();
			}
		},
		/* 当开始/继续播放时 */
		startPlay(index) {
			var _0x3d3cc5 = _0x8bf2;

			function _0x48e4() {
				var _0xe9bc75 = ['2805865lDCYoQ', 'vodIndex', '12UvMEqg', '194438jSSPuZ', 'rotateImgShow',
					'2016091dWAsGc', '2193842yncmuH', '16689872PiDvDE', '4554832cOYqGL', 'palyCartoon',
					'repeatTime', 'failTime', 'beforeVodInfo', '1733520uTAkyv'
				];
				_0x48e4 = function() {
					return _0xe9bc75;
				};
				return _0x48e4();
			}(function(_0x3a2d11, _0x3a89c9) {
				var _0x41551a = _0x8bf2,
					_0x216603 = _0x3a2d11();
				while (!![]) {
					try {
						var _0x2778ae = parseInt(_0x41551a(0xe4)) / 0x1 + parseInt(_0x41551a(0xe7)) / 0x2 + -
							parseInt(_0x41551a(0xe0)) / 0x3 + parseInt(_0x41551a(0xe9)) / 0x4 + parseInt(_0x41551a(
								0xe1)) / 0x5 * (parseInt(_0x41551a(0xe3)) / 0x6) + -parseInt(_0x41551a(0xe6)) /
							0x7 + -parseInt(_0x41551a(0xe8)) / 0x8;
						if (_0x2778ae === _0x3a89c9) break;
						else _0x216603['push'](_0x216603['shift']());
					} catch (_0x34f2d2) {
						_0x216603['push'](_0x216603['shift']());
					}
				}
			}(_0x48e4, 0x92906));

			function _0x8bf2(_0x2480c2, _0x2091d8) {
				var _0x48e48a = _0x48e4();
				return _0x8bf2 = function(_0x8bf213, _0xf86b07) {
					_0x8bf213 = _0x8bf213 - 0xde;
					var _0x423d6b = _0x48e48a[_0x8bf213];
					return _0x423d6b;
				}, _0x8bf2(_0x2480c2, _0x2091d8);
			}
			this[_0x3d3cc5(0xe2)] == index && (this['playOpen'] = ![], this[_0x3d3cc5(0xdf)][_0x3d3cc5(0xe5)] && (this[
				_0x3d3cc5(0xea)] = !![]), clearInterval(this[_0x3d3cc5(0xde)]), clearInterval(this[_0x3d3cc5(
				0xeb)]));
		},
		/* 视频出现缓冲 */
		bufferVod(index) {
			function _0x2ed2(_0x38f03f, _0x9db2ae) {
				var _0x1a7c40 = _0x1a7c();
				return _0x2ed2 = function(_0x2ed2c8, _0x3c51b4) {
					_0x2ed2c8 = _0x2ed2c8 - 0xff;
					var _0x5a0faf = _0x1a7c40[_0x2ed2c8];
					return _0x5a0faf;
				}, _0x2ed2(_0x38f03f, _0x9db2ae);
			}
			var _0x905fe2 = _0x2ed2;
			(function(_0x168cc2, _0x4f3bfd) {
				var _0x23027c = _0x2ed2,
					_0x1ab937 = _0x168cc2();
				while (!![]) {
					try {
						var _0x59238c = -parseInt(_0x23027c(0xff)) / 0x1 * (parseInt(_0x23027c(0x10d)) / 0x2) +
							parseInt(_0x23027c(0x10a)) / 0x3 * (parseInt(_0x23027c(0x104)) / 0x4) + parseInt(
								_0x23027c(0x10b)) / 0x5 + -parseInt(_0x23027c(0x107)) / 0x6 + parseInt(_0x23027c(
								0x109)) / 0x7 * (-parseInt(_0x23027c(0x10e)) / 0x8) + -parseInt(_0x23027c(0x10f)) /
							0x9 * (parseInt(_0x23027c(0x103)) / 0xa) + parseInt(_0x23027c(0x100)) / 0xb;
						if (_0x59238c === _0x4f3bfd) break;
						else _0x1ab937['push'](_0x1ab937['shift']());
					} catch (_0x1e90b6) {
						_0x1ab937['push'](_0x1ab937['shift']());
					}
				}
			}(_0x1a7c, 0x806b9));

			function _0x1a7c() {
				var _0x4bc1cd = ['20205306ToPEGc', 'vodIndex', 'scheduleLoad', '377680UktMBk', '29248xNHYao', 'length',
					'vodList', '1581624jVWGzv', 'changeIndex', '10850vtIlqC', '51KZFfXq', '1002570rFEGOf',
					'bufferShow', '2RgAfRD', '4016SaVidw', '36lQAIWj', 'vodPaly', '442879abxKDF'
				];
				_0x1a7c = function() {
					return _0x4bc1cd;
				};
				return _0x1a7c();
			}
			this[_0x905fe2(0x106)][_0x905fe2(0x105)] > 0x0 && this[_0x905fe2(0x108)] == this[_0x905fe2(0x101)] && !this[
				_0x905fe2(0x10c)] && this['beforeVodInfo'][_0x905fe2(0x110)] && (this['playOpen'] = !![], this[
				_0x905fe2(0x102)]());
		},
		/* 视频播放失败 */
		errVod(index) {
			function _0x55aa() {
				var _0x305774 = ['385206izgYWQ', '6rlDOPQ', 'bufferShow', '2821872vmCHla', '181994swydHc',
					'3209856tFjcNG', 'playOpen', 'vodList', 'vodIndex', 'scheduleLoad', '4367622xhtRhz', 'vodPaly',
					'playErrTime', '1457145zeIwuR', '3GPdqEO', '149710UFwMER', 'palyCartoon', 'length'
				];
				_0x55aa = function() {
					return _0x305774;
				};
				return _0x55aa();
			}

			function _0x6cc3(_0x4a7289, _0x33368c) {
				var _0x55aacc = _0x55aa();
				return _0x6cc3 = function(_0x6cc39c, _0x23e3cb) {
					_0x6cc39c = _0x6cc39c - 0x187;
					var _0x5e572b = _0x55aacc[_0x6cc39c];
					return _0x5e572b;
				}, _0x6cc3(_0x4a7289, _0x33368c);
			}
			var _0x22731b = _0x6cc3;
			(function(_0x1a58a9, _0x2b012f) {
				var _0x565eae = _0x6cc3,
					_0x2ad1c8 = _0x1a58a9();
				while (!![]) {
					try {
						var _0xb35b76 = -parseInt(_0x565eae(0x195)) / 0x1 + parseInt(_0x565eae(0x191)) / 0x2 * (
								parseInt(_0x565eae(0x18d)) / 0x3) + parseInt(_0x565eae(0x194)) / 0x4 + parseInt(
								_0x565eae(0x18e)) / 0x5 + -parseInt(_0x565eae(0x192)) / 0x6 * (parseInt(_0x565eae(
								0x189)) / 0x7) + parseInt(_0x565eae(0x196)) / 0x8 + -parseInt(_0x565eae(0x18c)) /
							0x9;
						if (_0xb35b76 === _0x2b012f) break;
						else _0x2ad1c8['push'](_0x2ad1c8['shift']());
					} catch (_0x4f2ee4) {
						_0x2ad1c8['push'](_0x2ad1c8['shift']());
					}
				}
			}(_0x55aa, 0x583b8), clearTimeout(this[_0x22731b(0x18b)]), this[_0x22731b(0x18b)] = setTimeout(() => {
				var _0x276917 = _0x22731b;
				this[_0x276917(0x198)][_0x276917(0x190)] > 0x0 && this['changeIndex'] == this[_0x276917(
					0x187)] && !this[_0x276917(0x193)] && this['beforeVodInfo'][_0x276917(0x18a)] && (this[
					_0x276917(0x197)] = !![], this[_0x276917(0x18f)] = ![], this[_0x276917(0x188)]());
			}, 0x12c));
		},
		/* 播放进度变化时触发 */
		timeupdateVod(ev, index) {
			var _0x15a76e = _0x54c6;
			(function(_0x3bafa4, _0x593163) {
				var _0x4ae8da = _0x54c6,
					_0x2c6867 = _0x3bafa4();
				while (!![]) {
					try {
						var _0x3427ce = -parseInt(_0x4ae8da(0x1ab)) / 0x1 + -parseInt(_0x4ae8da(0x19a)) / 0x2 * (
							parseInt(_0x4ae8da(0x19e)) / 0x3) + parseInt(_0x4ae8da(0x197)) / 0x4 * (parseInt(
							_0x4ae8da(0x19f)) / 0x5) + -parseInt(_0x4ae8da(0x198)) / 0x6 + parseInt(_0x4ae8da(
							0x19d)) / 0x7 + parseInt(_0x4ae8da(0x1a5)) / 0x8 * (parseInt(_0x4ae8da(0x19c)) /
							0x9) + -parseInt(_0x4ae8da(0x1a3)) / 0xa * (-parseInt(_0x4ae8da(0x1a9)) / 0xb);
						if (_0x3427ce === _0x593163) break;
						else _0x2c6867['push'](_0x2c6867['shift']());
					} catch (_0x54e934) {
						_0x2c6867['push'](_0x2c6867['shift']());
					}
				}
			}(_0x41ae, 0xd7b9a));
			if (this[_0x15a76e(0x196)] != index) return ![];

			function _0x54c6(_0x32c2c8, _0x26ff08) {
				var _0x41ae6c = _0x41ae();
				return _0x54c6 = function(_0x54c6d8, _0x48029c) {
					_0x54c6d8 = _0x54c6d8 - 0x192;
					var _0x3a1429 = _0x41ae6c[_0x54c6d8];
					return _0x3a1429;
				}, _0x54c6(_0x32c2c8, _0x26ff08);
			}

			function _0x41ae() {
				var _0x514ef8 = ['bufferNum', 'vodList', 'vodIndex', '5946652yZwCse', '1952886WIeaZw', 'duration',
					'3384VREZsO', 'videoTime', '117495PXLFjC', '732900IIYZMe', '2328LkvDGw', '5xPCqRe',
					'repeatTime', 'currentTime', 'beforeVodInfo', '320EpuPca', 'loadingShow', '688fzeBJs',
					'screenWidth', 'bufferShow', 'bufferTime', '163262stSIpM', 'sliderTime', '666954KKpDqD',
					'sliderDrag', 'detail'
				];
				_0x41ae = function() {
					return _0x514ef8;
				};
				return _0x41ae();
			}
			ev['detail'][_0x15a76e(0x1a1)] > 0x0 && (this['shadeNum'] = 0x0);
			!this[_0x15a76e(0x192)] && (this[_0x15a76e(0x19b)] = ev[_0x15a76e(0x193)][_0x15a76e(0x199)], this[_0x15a76e(
				0x1aa)] = ev['detail'][_0x15a76e(0x1a1)], this['sliderProgress'] = ev[_0x15a76e(0x193)][
				_0x15a76e(0x1a1)
			] / ev[_0x15a76e(0x193)]['duration'] * this[_0x15a76e(0x1a6)]);
			this[_0x15a76e(0x195)]['length'] > 0x0 && (this[_0x15a76e(0x194)] = ev['detail'][_0x15a76e(0x1a1)], this[
				_0x15a76e(0x1a7)] = ![], this[_0x15a76e(0x1a2)][_0x15a76e(0x1a4)] = ![], clearTimeout(this[
				_0x15a76e(0x1a8)]), clearInterval(this['failTime']), clearInterval(this[_0x15a76e(0x1a0)]));
		},
		/* 显示进度加载动画 */
		scheduleLoad() {
			function _0x2802() {
				var _0x5f40e9 = ['115598BaVlce', 'beforeVodInfo', '56WKXOQr', 'loadingShow', 'playOpen', 'bufferShow',
					'620vglDCq', 'bufferTime', '288438LAaPCk', '10184JCXpKn', '1152PnExIN', '398965wdPDad',
					'12OpFsAr', 'vodLoad', '6809892luTnpp', '24912XVCJeq', '40KVkoBg', '527219CVCBvT'
				];
				_0x2802 = function() {
					return _0x5f40e9;
				};
				return _0x2802();
			}

			function _0xe6e0(_0x536231, _0x208b93) {
				var _0x280224 = _0x2802();
				return _0xe6e0 = function(_0xe6e0a9, _0x5829d5) {
					_0xe6e0a9 = _0xe6e0a9 - 0xac;
					var _0xede989 = _0x280224[_0xe6e0a9];
					return _0xede989;
				}, _0xe6e0(_0x536231, _0x208b93);
			}
			var _0x406e94 = _0xe6e0;
			(function(_0x5cafdb, _0x3ed1d7) {
				var _0x181e20 = _0xe6e0,
					_0x3c2568 = _0x5cafdb();
				while (!![]) {
					try {
						var _0x1e5263 = parseInt(_0x181e20(0xbb)) / 0x1 + -parseInt(_0x181e20(0xb0)) / 0x2 * (
								parseInt(_0x181e20(0xbc)) / 0x3) + -parseInt(_0x181e20(0xb9)) / 0x4 * (parseInt(
								_0x181e20(0xb6)) / 0x5) + -parseInt(_0x181e20(0xb8)) / 0x6 * (-parseInt(_0x181e20(
								0xb2)) / 0x7) + parseInt(_0x181e20(0xba)) / 0x8 * (-parseInt(_0x181e20(0xad)) /
								0x9) + parseInt(_0x181e20(0xae)) / 0xa * (-parseInt(_0x181e20(0xaf)) / 0xb) +
							parseInt(
								_0x181e20(0xac)) / 0xc;
						if (_0x1e5263 === _0x3ed1d7) break;
						else _0x3c2568['push'](_0x3c2568['shift']());
					} catch (_0x3c00b6) {
						_0x3c2568['push'](_0x3c2568['shift']());
					}
				}
			}(_0x2802, 0x34348));
			!this[_0x406e94(0xb5)] && (this[_0x406e94(0xb5)] = !![], this[_0x406e94(0xb7)] = setTimeout(() => {
				var _0x2979ad = _0x406e94;
				this[_0x2979ad(0xb1)][_0x2979ad(0xb3)] = !![], this[_0x2979ad(0xb4)] && this[_0x2979ad(
					0xbd)]();
			}, 0x9c4));
		},
		/* 重新播放视频 */
		vodLoad() {
			/* 视频播放失败，重新播放视频 */
			function _0x1af5(_0xd92315, _0x9aba10) {
				var _0x2a67c1 = _0x2a67();
				return _0x1af5 = function(_0x1af5b9, _0x1ac9b8) {
					_0x1af5b9 = _0x1af5b9 - 0x12f;
					var _0x5d9ed7 = _0x2a67c1[_0x1af5b9];
					return _0x5d9ed7;
				}, _0x1af5(_0xd92315, _0x9aba10);
			}
			var _0x592b70 = _0x1af5;
			(function(_0x4bf59a, _0x22e343) {
				var _0x18ebf3 = _0x1af5,
					_0x2145d9 = _0x4bf59a();
				while (!![]) {
					try {
						var _0x32f521 = parseInt(_0x18ebf3(0x134)) / 0x1 * (parseInt(_0x18ebf3(0x142)) / 0x2) + -
							parseInt(_0x18ebf3(0x13c)) / 0x3 * (parseInt(_0x18ebf3(0x13b)) / 0x4) + parseInt(
								_0x18ebf3(0x137)) / 0x5 * (parseInt(_0x18ebf3(0x139)) / 0x6) + -parseInt(_0x18ebf3(
								0x13a)) / 0x7 + -parseInt(_0x18ebf3(0x141)) / 0x8 + parseInt(_0x18ebf3(0x133)) /
							0x9 + -parseInt(_0x18ebf3(0x13f)) / 0xa;
						if (_0x32f521 === _0x22e343) break;
						else _0x2145d9['push'](_0x2145d9['shift']());
					} catch (_0x5c47dd) {
						_0x2145d9['push'](_0x2145d9['shift']());
					}
				}
			}(_0x2a67, 0x295ab));

			function _0x2a67() {
				var _0x2bc992 = ['vodIndex', '22086oQjCjk', '332318BBYTJw', '24FxnXNP', '68100NgQOvl', 'failTime',
					'bufferShow', '1160390YjSRDl', 'stop', '736512JnrKnW', '38716HEsnDG', 'sliderTime',
					'createVideoContext', 'swId', 'myVideo', '2266461Syhkye', '4DgkZvD', 'playOpen', 'videoPlay',
					'315seYGbO'
				];
				_0x2a67 = function() {
					return _0x2bc992;
				};
				return _0x2a67();
			}
			this[_0x592b70(0x135)] && (this[_0x592b70(0x135)] = ![], this[_0x592b70(0x12f)] == 0x0 && uni[_0x592b70(
				0x130)](_0x592b70(0x132) + this[_0x592b70(0x138)] + this[_0x592b70(0x131)], this)[_0x592b70(
				0x140)](), this[_0x592b70(0x13d)] = setTimeout(() => {
				var _0x2c2462 = _0x592b70;
				this[_0x2c2462(0x135)] = !![], this[_0x2c2462(0x13e)] = ![], this[_0x2c2462(0x136)](this[
					'vodIndex']);
			}, 0x3e8));
		},
		/* 视频播放结束 */
		endedVod(index) {
			const _0x5e64f1 = _0x225a;
			(function(_0x3e74f4, _0x1cf27e) {
				const _0x2f3809 = _0x225a,
					_0x53aa12 = _0x3e74f4();
				while (!![]) {
					try {
						const _0x5cc7fa = parseInt(_0x2f3809(0x1a2)) / 0x1 + parseInt(_0x2f3809(0x194)) / 0x2 * (-
								parseInt(_0x2f3809(0x199)) / 0x3) + -parseInt(_0x2f3809(0x1a3)) / 0x4 + -parseInt(
								_0x2f3809(0x19f)) / 0x5 + parseInt(_0x2f3809(0x191)) / 0x6 * (parseInt(_0x2f3809(
								0x192)) / 0x7) + parseInt(_0x2f3809(0x19a)) / 0x8 + -parseInt(_0x2f3809(0x193)) /
							0x9 * (parseInt(_0x2f3809(0x19b)) / 0xa);
						if (_0x5cc7fa === _0x1cf27e) break;
						else _0x53aa12['push'](_0x53aa12['shift']());
					} catch (_0x4aa95d) {
						_0x53aa12['push'](_0x53aa12['shift']());
					}
				}
			}(_0x221a, 0xcab55));

			function _0x225a(_0x334c7d, _0x2cd6d8) {
				const _0x221add = _0x221a();
				return _0x225a = function(_0x225abe, _0x3c53a6) {
					_0x225abe = _0x225abe - 0x191;
					let _0x25808e = _0x221add[_0x225abe];
					return _0x25808e;
				}, _0x225a(_0x334c7d, _0x2cd6d8);
			}
			let endNum = this[_0x5e64f1(0x1a0)][_0x5e64f1(0x195)] - this[_0x5e64f1(0x1a0)][_0x5e64f1(0x195)] % this[
					'vodPageNum'],
				residueNum = this['totalPlayList'][_0x5e64f1(0x195)] % this[_0x5e64f1(0x19e)];

			function _0x221a() {
				const _0x447670 = ['nextPlay', 'currentIndex', 'vodPageNum', '3131070dXsfeu', 'totalPlayList',
					'videoPlay', '358763hfbOhk', '2794164yVVvDT', 'loopVod', 'vodIndex', '9654yCvhlt', '5551zLFTCR',
					'2556DKfRHg', '46lbOFtX', 'length', 'vodCurIndex', '$forceUpdate', '$nextTick', '87105PPJTWO',
					'9984616DHudXh', '2110engShV'
				];
				_0x221a = function() {
					return _0x447670;
				};
				return _0x221a();
			}
			if (this[_0x5e64f1(0x196)] + 0x1 >= endNum && this[_0x5e64f1(0x1a5)] == index && this[_0x5e64f1(0x19c)] &&
				this[_0x5e64f1(0x196)] + 0x1 < this['totalPlayList'][_0x5e64f1(0x195)]) this[_0x5e64f1(0x1a5)] < this[
				_0x5e64f1(0x19e)] + residueNum - 0x1 && (this[_0x5e64f1(0x1a5)] += 0x1);
			else this[_0x5e64f1(0x1a5)] == index && this[_0x5e64f1(0x19c)] && this[_0x5e64f1(0x196)] + 0x1 < endNum ?
				this[_0x5e64f1(0x1a5)] < this[_0x5e64f1(0x19e)] - 0x1 ? this[_0x5e64f1(0x1a5)] += 0x1 : this[_0x5e64f1(
					0x1a5)] = 0x0 : (this[_0x5e64f1(0x1a4)] = !![], setTimeout(() => {
					const _0x529040 = _0x5e64f1;
					this[_0x529040(0x1a1)](this['vodIndex']);
				}));
			this[_0x5e64f1(0x198)](() => {
				const _0xed9bad = _0x5e64f1;
				this[_0xed9bad(0x19d)] = this['vodIndex'], this[_0xed9bad(0x197)]();
			});
		},
		// 根据秒获取时间
		formatSeconds(a) {
			let hh = parseInt(a / 3600);
			let mm = parseInt((a - hh * 3600) / 60);
			if (mm < 10) mm = "0" + mm;
			let ss = parseInt((a - hh * 3600) % 60);
			if (ss < 10) ss = "0" + ss;
			if (hh < 10) hh = hh == 0 ? '' : `0${hh}:`;
			let length = hh + mm + ":" + ss;
			if (a >= 0) {
				return length;
			} else {
				return "00:00";
			}
		},
		/* 进度条滑动 */
		touchmoveSlider(event) {
			// #ifndef APP-NVUE
			let objclientX = event.changedTouches[0].clientX
			// #endif

			// #ifdef APP-NVUE
			let objclientX = event.changedTouches[0].screenX
			// #endif
			function _0x27d9(_0x41c133, _0x5a4ea3) {
				const _0x177497 = _0x1774();
				return _0x27d9 = function(_0x27d9a0, _0x532f36) {
					_0x27d9a0 = _0x27d9a0 - 0x1f3;
					let _0x7e8910 = _0x177497[_0x27d9a0];
					return _0x7e8910;
				}, _0x27d9(_0x41c133, _0x5a4ea3);
			}
			const _0x6e59ce = _0x27d9;
			(function(_0x2b5f46, _0x26fc36) {
				const _0xf82ac0 = _0x27d9,
					_0x263bcc = _0x2b5f46();
				while (!![]) {
					try {
						const _0x4b9ea8 = -parseInt(_0xf82ac0(0x1fd)) / 0x1 + parseInt(_0xf82ac0(0x200)) / 0x2 + -
							parseInt(_0xf82ac0(0x1f7)) / 0x3 + parseInt(_0xf82ac0(0x1f5)) / 0x4 + -parseInt(
								_0xf82ac0(0x1fa)) / 0x5 * (parseInt(_0xf82ac0(0x1fe)) / 0x6) + -parseInt(_0xf82ac0(
								0x1ff)) / 0x7 * (parseInt(_0xf82ac0(0x201)) / 0x8) + parseInt(_0xf82ac0(0x1f8)) /
							0x9;
						if (_0x4b9ea8 === _0x26fc36) break;
						else _0x263bcc['push'](_0x263bcc['shift']());
					} catch (_0xc6b463) {
						_0x263bcc['push'](_0x263bcc['shift']());
					}
				}
			}(_0x1774, 0xd93d4), this['sliderDrag'] = !![]);

			function _0x1774() {
				const _0x563a1f = ['40QnhTzJ', 'endTime', 'screenWidth', '2293256cScOzg', 'videoTime', '1234428blcvcq',
					'23524056tVlsTG', 'sliderEndTime', '5641055XAapRM', 'sliderTime', 'sliderProgress',
					'1129520fcLakK', '6xHtBdV', '1555463CoLZuZ', '2965932qGCuks'
				];
				_0x1774 = function() {
					return _0x563a1f;
				};
				return _0x1774();
			}
			if (objclientX >= 0x0 && objclientX <= this[_0x6e59ce(0x1f4)] - 0x2) {
				clearTimeout(this[_0x6e59ce(0x1f9)]), this['brightSlider'] = !![], this[_0x6e59ce(0x1fc)] = objclientX;
				let num = this[_0x6e59ce(0x1fc)] / (this[_0x6e59ce(0x1f4)] - 0x2);
				this[_0x6e59ce(0x1fb)] = num * this[_0x6e59ce(0x1f6)], this[_0x6e59ce(0x1f3)] = num * this[_0x6e59ce(
					0x1f6)];
			}
		},
		/* 进度条滑动结束 */
		touchendSlider() {
			function _0x496d(_0xa07ed8, _0x4810a3) {
				const _0x49d886 = _0x49d8();
				return _0x496d = function(_0x496daf, _0x3d00c0) {
					_0x496daf = _0x496daf - 0x1ab;
					let _0x1c83ef = _0x49d886[_0x496daf];
					return _0x1c83ef;
				}, _0x496d(_0xa07ed8, _0x4810a3);
			}
			const _0x6e1fbc = _0x496d;

			function _0x49d8() {
				const _0x47e1be = ['9nxhbKY', 'beforeVodInfo', '4QwnPRU', '201397JOIHsk', '$refs', 'vodPaly',
					'15050136oImEXb', '24hYTgnf', '197875HhRHVi', '9724830LiBDfo', '6247545BMtjKs', '11UowWwN',
					'swId', 'brightSlider', 'vodIndex', '39213ITaScP', 'endTime', '20dXUPvq', '3873656OkPEKW',
					'myVideo', 'pauseShow', 'seek'
				];
				_0x49d8 = function() {
					return _0x47e1be;
				};
				return _0x49d8();
			}(function(_0x4bddc1, _0x154cdc) {
				const _0x452301 = _0x496d,
					_0x2d3a3e = _0x4bddc1();
				while (!![]) {
					try {
						const _0x38bb5e = parseInt(_0x452301(0x1bb)) / 0x1 + -parseInt(_0x452301(0x1ae)) / 0x2 * (
							parseInt(_0x452301(0x1ac)) / 0x3) + parseInt(_0x452301(0x1b5)) / 0x4 * (-parseInt(
							_0x452301(0x1bd)) / 0x5) + -parseInt(_0x452301(0x1ba)) / 0x6 * (-parseInt(_0x452301(
							0x1b6)) / 0x7) + parseInt(_0x452301(0x1af)) / 0x8 * (-parseInt(_0x452301(0x1b3)) /
							0x9) + parseInt(_0x452301(0x1bc)) / 0xa + parseInt(_0x452301(0x1be)) / 0xb * (
							parseInt(_0x452301(0x1b9)) / 0xc);
						if (_0x38bb5e === _0x154cdc) break;
						else _0x2d3a3e['push'](_0x2d3a3e['shift']());
					} catch (_0x4ccef1) {
						_0x2d3a3e['push'](_0x2d3a3e['shift']());
					}
				}
			}(_0x49d8, 0xa4d7a), this['sliderDrag'] = ![]);
			let videoCtx = null;
			videoCtx = this[_0x6e1fbc(0x1b7)][_0x6e1fbc(0x1b0) + this[_0x6e1fbc(0x1ab)] + this[_0x6e1fbc(0x1bf)]][0x0],
				videoCtx[_0x6e1fbc(0x1b2)](this[_0x6e1fbc(0x1ad)]), videoCtx['play'](), this['beforeVodInfo'][_0x6e1fbc(
					0x1b8)] = !![], this[_0x6e1fbc(0x1b4)][_0x6e1fbc(0x1b1)] = ![], this['sliderEndTime'] = setTimeout(
					() => {
						const _0x31dbe8 = _0x6e1fbc;
						this[_0x31dbe8(0x1c0)] = ![];
					}, 0x7d0);
		},
		/* 触碰的坐标 */
		vodViewStart(e) {
			// #ifndef APP-NVUE
			this.touchClientY = e.changedTouches[0].clientY
			// #endif
			// #ifdef APP-NVUE
			this.touchClientY = e.changedTouches[0].screenY
			// #endif
		},
		/* 上下滑动的坐标 */
		vodViewMove(e) {
			// #ifndef APP-NVUE
			this.moveClientY = e.changedTouches[0].clientY - this.touchClientY
			// #endif
			// #ifdef APP-NVUE
			this.moveClientY = e.changedTouches[0].screenY - this.touchClientY
			// #endif
			var _0x56cc31 = _0x43a9;

			function _0x43a9(_0x59a956, _0x29590b) {
				var _0x108222 = _0x1082();
				return _0x43a9 = function(_0x43a962, _0x12904a) {
					_0x43a962 = _0x43a962 - 0x7f;
					var _0x360b88 = _0x108222[_0x43a962];
					return _0x360b88;
				}, _0x43a9(_0x59a956, _0x29590b);
			}(function(_0x26fcdd, _0x5746a1) {
				var _0x2e7531 = _0x43a9,
					_0xbf8cb9 = _0x26fcdd();
				while (!![]) {
					try {
						var _0x1b657d = -parseInt(_0x2e7531(0x80)) / 0x1 * (-parseInt(_0x2e7531(0x89)) / 0x2) +
							parseInt(_0x2e7531(0x8e)) / 0x3 + parseInt(_0x2e7531(0x81)) / 0x4 + -parseInt(_0x2e7531(
								0x86)) / 0x5 + parseInt(_0x2e7531(0x88)) / 0x6 * (parseInt(_0x2e7531(0x91)) / 0x7) +
							parseInt(_0x2e7531(0x8b)) / 0x8 * (-parseInt(_0x2e7531(0x90)) / 0x9) + -parseInt(
								_0x2e7531(0x8a)) / 0xa * (parseInt(_0x2e7531(0x87)) / 0xb);
						if (_0x1b657d === _0x5746a1) break;
						else _0xbf8cb9['push'](_0xbf8cb9['shift']());
					} catch (_0x4883a0) {
						_0xbf8cb9['push'](_0xbf8cb9['shift']());
					}
				}
			}(_0x1082, 0xa5bf5));
			this[_0x56cc31(0x84)] > 0x0 || this[_0x56cc31(0x84)] < 0x0 ? this[_0x56cc31(0x83)] = !![] : this[_0x56cc31(
				0x83)] = ![];

			function _0x1082() {
				var _0x410555 = ['3237544IkytPc', 'vodCurIndex', 'refreshShow', '3331305jDaINz', 'refreshOpen',
					'27lqTNXc', '1295007yMTocc', 'refreshOpacity', '413087jOEsqO', '4362728rAGVXJ',
					'refreshclientY', 'moveOpacity', 'moveClientY', 'loadOpen', '627880gaUwMV', '176tthbAF',
					'12azDZxb', '6fcyuMd', '1119890pfVmgg'
				];
				_0x1082 = function() {
					return _0x410555;
				};
				return _0x1082();
			}
			this[_0x56cc31(0x85)] && this[_0x56cc31(0x8c)] == 0x0 && !this[_0x56cc31(0x8f)] && (this[_0x56cc31(0x84)] >
				0xa ? (this[_0x56cc31(0x8d)] = !![], this[_0x56cc31(0x84)] > 0xa && this[_0x56cc31(0x84)] <= 0x3c &&
					this[_0x56cc31(0x8d)] && (this[_0x56cc31(0x7f)] = this[_0x56cc31(0x84)] / 0x3c, this[_0x56cc31(
						0x82)] = this['moveClientY'] / 0x2)) : this['refreshShow'] = ![]);
		},
		/* 滑动结束的坐标 */
		vodViewEnd(e) {
			// #ifndef APP-NVUE
			this.moveClientY = e.changedTouches[0].clientY - this.touchClientY
			// #endif
			// #ifdef APP-NVUE
			this.moveClientY = e.changedTouches[0].screenY - this.touchClientY
			// #endif
			function _0x4319(_0x30c804, _0x3e86ae) {
				var _0x5392fa = _0x5392();
				return _0x4319 = function(_0x431977, _0x56eff5) {
					_0x431977 = _0x431977 - 0x84;
					var _0x314c08 = _0x5392fa[_0x431977];
					return _0x314c08;
				}, _0x4319(_0x30c804, _0x3e86ae);
			}
			var _0x194066 = _0x4319;
			(function(_0x40cdad, _0x48fe0e) {
				var _0x4f98a4 = _0x4319,
					_0x8eed36 = _0x40cdad();
				while (!![]) {
					try {
						var _0x442b9a = -parseInt(_0x4f98a4(0x8d)) / 0x1 + parseInt(_0x4f98a4(0x93)) / 0x2 + -
							parseInt(_0x4f98a4(0x87)) / 0x3 + parseInt(_0x4f98a4(0x91)) / 0x4 + -parseInt(_0x4f98a4(
								0x92)) / 0x5 * (-parseInt(_0x4f98a4(0x95)) / 0x6) + -parseInt(_0x4f98a4(0x84)) /
							0x7 * (-parseInt(_0x4f98a4(0x90)) / 0x8) + -parseInt(_0x4f98a4(0x85)) / 0x9;
						if (_0x442b9a === _0x48fe0e) break;
						else _0x8eed36['push'](_0x8eed36['shift']());
					} catch (_0x1f5ea7) {
						_0x8eed36['push'](_0x8eed36['shift']());
					}
				}
			}(_0x5392, 0x73618), this['moveOpacity'] = ![]);

			function _0x5392() {
				var _0x3bfbcf = ['refreshOpacity', 'refreshShow', '748150bZOAqA', 'refreshclientY', '$emit',
					'3172352mxTjJY', '2687008XCEyHw', '10CpFxrf', '1273794tdmblE', 'loadOpen', '2321184ziVPvV',
					'7tRckKX', '4561749AtoWeX', 'refreshOpen', '2253930tTbtpq', 'vodCurIndex', 'moveClientY',
					'refreshData'
				];
				_0x5392 = function() {
					return _0x3bfbcf;
				};
				return _0x5392();
			}
			if (this[_0x194066(0x94)] && this[_0x194066(0x88)] == 0x0 && this[_0x194066(0x8c)]) {
				if (this[_0x194066(0x89)] > 0x1 && this[_0x194066(0x89)] < 0x3c && !this[_0x194066(0x86)]) this[
					_0x194066(0x8b)] = 0x0, this[_0x194066(0x8e)] = 0x0, setTimeout(() => {
					var _0x1fb713 = _0x194066;
					this[_0x1fb713(0x8c)] = ![];
				}, 0x12c);
				else {
					if (this[_0x194066(0x86)]) return;
					this['refreshOpen'] = !![], this[_0x194066(0x8f)](_0x194066(0x8a));
				}
			}
		},
		/* 重置状态数据 */
		resetData() {
			function _0x567c(_0x292f89, _0x38ef48) {
				var _0x1f54c3 = _0x1f54();
				return _0x567c = function(_0x567c02, _0x18d352) {
					_0x567c02 = _0x567c02 - 0x1cc;
					var _0x363c64 = _0x1f54c3[_0x567c02];
					return _0x363c64;
				}, _0x567c(_0x292f89, _0x38ef48);
			}
			var _0x44ec45 = _0x567c;
			(function(_0x141c2d, _0x7a8eb) {
				var _0x40f3ea = _0x567c,
					_0x1186f1 = _0x141c2d();
				while (!![]) {
					try {
						var _0x1c4fa4 = -parseInt(_0x40f3ea(0x1dc)) / 0x1 * (-parseInt(_0x40f3ea(0x1d5)) / 0x2) +
							parseInt(_0x40f3ea(0x1da)) / 0x3 + parseInt(_0x40f3ea(0x1cc)) / 0x4 + parseInt(
								_0x40f3ea(0x1d1)) / 0x5 * (parseInt(_0x40f3ea(0x1d8)) / 0x6) + parseInt(_0x40f3ea(
								0x1d7)) / 0x7 * (-parseInt(_0x40f3ea(0x1d4)) / 0x8) + -parseInt(_0x40f3ea(0x1db)) /
							0x9 + -parseInt(_0x40f3ea(0x1d2)) / 0xa;
						if (_0x1c4fa4 === _0x7a8eb) break;
						else _0x1186f1['push'](_0x1186f1['shift']());
					} catch (_0x16a6e4) {
						_0x1186f1['push'](_0x1186f1['shift']());
					}
				}
			}(_0x1f54, 0x198a0), this[_0x44ec45(0x1d6)] = 0x0, this[_0x44ec45(0x1cd)] = 0x0, this[_0x44ec45(
				0x1cf)] = 0x0, this['endTime'] = 0x0, this['bufferNum'] = null, this[_0x44ec45(0x1d3)] = ![], this[
				_0x44ec45(0x1ce)] = ![], this[_0x44ec45(0x1d0)] = ![], this[_0x44ec45(0x1d9)] = null);

			function _0x1f54() {
				var _0x38ef93 = ['290274gzlGRt', '1402767sxYsJK', '13NbDmVs', '832596McFOBX', 'sliderTime',
					'sliderDrag', 'videoTime', 'brightSlider', '260465UfcUNm', '574660Farrek', 'bufferShow',
					'80tPjXKL', '7978XpmzrX', 'sliderProgress', '63644WIRAyM', '6BwhkMC', 'sliderEndTime'
				];
				_0x1f54 = function() {
					return _0x38ef93;
				};
				return _0x1f54();
			}
		},
		// 单击或双击
		handClick(event, index) {
			function _0x4022(_0x4bf317, _0x1dcfca) {
				const _0x58cc6c = _0x58cc();
				return _0x4022 = function(_0x402282, _0x49c9cc) {
					_0x402282 = _0x402282 - 0x105;
					let _0xf3cb9a = _0x58cc6c[_0x402282];
					return _0xf3cb9a;
				}, _0x4022(_0x4bf317, _0x1dcfca);
			}

			function _0x58cc() {
				const _0x2c22a8 = ['clearDoubleTime', 'vodList', 'doubleOutTime', '1795710XRVTnl', '44pQNZGD', '95px',
					'clientX', 'playSpot', 'menuRef', '$refs', 'clientY', '2joqXBj', 'getTime', 'doubleClick',
					'4RqIAJF', '$emit', '6072966vKkqJg', '434638pJzSMk', '3231620gDQQFj', 'likeId', 'vodIndex',
					'doubleHeart', '523800qezFkg', '5344175bMzhxN', 'changedTouches', 'doubleAddClass',
					'3969831AGZiwN', 'fabulousBtn', 'doubleOpen', '56ZNHFuN', '-15deg', 'likeList', 'push',
					'lastTapTimeoutFunc', '15deg'
				];
				_0x58cc = function() {
					return _0x2c22a8;
				};
				return _0x58cc();
			}
			const _0x4d47dd = _0x4022;
			(function(_0x3881fe, _0x2437f0) {
				const _0x4cc8a1 = _0x4022,
					_0x430633 = _0x3881fe();
				while (!![]) {
					try {
						const _0x462729 = -parseInt(_0x4cc8a1(0x122)) / 0x1 * (parseInt(_0x4cc8a1(0x11c)) / 0x2) +
							parseInt(_0x4cc8a1(0x108)) / 0x3 + -parseInt(_0x4cc8a1(0x11f)) / 0x4 * (-parseInt(
								_0x4cc8a1(0x105)) / 0x5) + -parseInt(_0x4cc8a1(0x121)) / 0x6 + -parseInt(_0x4cc8a1(
								0x123)) / 0x7 + -parseInt(_0x4cc8a1(0x10b)) / 0x8 * (parseInt(_0x4cc8a1(0x127)) /
								0x9) + parseInt(_0x4cc8a1(0x114)) / 0xa * (parseInt(_0x4cc8a1(0x115)) / 0xb);
						if (_0x462729 === _0x2437f0) break;
						else _0x430633['push'](_0x430633['shift']());
					} catch (_0x2ba61b) {
						_0x430633['push'](_0x430633['shift']());
					}
				}
			}(_0x58cc, 0xc1fa9));
			if (!this[_0x4d47dd(0x10a)]) return this[_0x4d47dd(0x118)](index), ![];
			const curTime = new Date()[_0x4d47dd(0x11d)](),
				lastTime = this['lastTapDiffTime'];
			this['lastTapDiffTime'] = curTime;
			const diff = curTime - lastTime;
			if (diff < 0x12c) {
				clearTimeout(this[_0x4d47dd(0x10f)]);
				!this[_0x4d47dd(0x112)][this['vodIndex']]['fabulousShow'] && this[_0x4d47dd(0x11a)][_0x4d47dd(0x119) +
					this[_0x4d47dd(0x125)] + ''
				][0x0][_0x4d47dd(0x109)](index);
				if (!this[_0x4d47dd(0x126)]) return;
				if (this[_0x4d47dd(0x113)]) return;
				this[_0x4d47dd(0x113)] = setTimeout(() => {
					const _0xccfd5a = _0x4d47dd;
					let _0x3740ad = event['changedTouches'][0x0][_0xccfd5a(0x11b)],
						_0x5f93ad = event[_0xccfd5a(0x106)][0x0][_0xccfd5a(0x117)],
						_0x352eb5 = ['0deg', _0xccfd5a(0x110), _0xccfd5a(0x10c)],
						_0x3ed995 = Math['floor'](Math['random']() * 0x3),
						_0x33dcc = {
							'id': this[_0xccfd5a(0x124)]++,
							'width': _0xccfd5a(0x116),
							'height': '95px',
							'top': _0x3740ad - 0x8c + 'px',
							'left': _0x5f93ad - 0x5f / 0x2 + 'px',
							'rotate': _0x352eb5[_0x3ed995],
							'className': '',
							'isShow': !![]
						};
					this[_0xccfd5a(0x10d)][_0xccfd5a(0x10e)](_0x33dcc), this[_0xccfd5a(0x107)](_0x33dcc['id']),
						this[_0xccfd5a(0x113)] = null, clearTimeout(this['clearDoubleTime']), this[_0xccfd5a(
							0x111)] = setTimeout(() => {
							const _0x1d3dc5 = _0xccfd5a;
							this[_0x1d3dc5(0x10d)] = [];
						}, 0x5dc), this[_0xccfd5a(0x120)](_0xccfd5a(0x11e), this['vodList'][this['vodIndex']]);
				}, 0x32);
			} else this[_0x4d47dd(0x10f)] = setTimeout(() => {
				const _0x2b1e78 = _0x4d47dd;
				this[_0x2b1e78(0x118)](index);
			}, 0x12c);
		},
		/* px转换rpx */
		pxToRpx(px) {
			return (750 * Number.parseInt(px)) / this.screenWidth
		},
		/* 双击点赞添加移除动画 */
		doubleAddClass(id) {
			function _0x46d9(_0x211be4, _0xca376e) {
				var _0x2f3a8a = _0x2f3a();
				return _0x46d9 = function(_0x46d964, _0xa99da1) {
					_0x46d964 = _0x46d964 - 0x1d1;
					var _0xf42b5 = _0x2f3a8a[_0x46d964];
					return _0xf42b5;
				}, _0x46d9(_0x211be4, _0xca376e);
			}

			function _0x2f3a() {
				var _0x1d0f6c = ['29000bZCStQ', '30098MLlNxJ', '3926184mkAEzt', '294505afscJc', 'likeList',
					'248544FUTwSz', 'isShow', '66UQUPTj', '3789mddKnr', '4489316AGCWuj', '5RhxlFm', '22XcxgOF',
					'2416CpYiqn', '6202XrvaLC', 'filter'
				];
				_0x2f3a = function() {
					return _0x1d0f6c;
				};
				return _0x2f3a();
			}(function(_0xa09ece, _0x47e292) {
				var _0x24f1bd = _0x46d9,
					_0x88045b = _0xa09ece();
				while (!![]) {
					try {
						var _0x29f1f4 = -parseInt(_0x24f1bd(0x1db)) / 0x1 + parseInt(_0x24f1bd(0x1d9)) / 0x2 * (
								parseInt(_0x24f1bd(0x1df)) / 0x3) + parseInt(_0x24f1bd(0x1d2)) / 0x4 * (parseInt(
								_0x24f1bd(0x1d3)) / 0x5) + parseInt(_0x24f1bd(0x1da)) / 0x6 + parseInt(_0x24f1bd(
								0x1d6)) / 0x7 * (parseInt(_0x24f1bd(0x1d5)) / 0x8) + parseInt(_0x24f1bd(0x1d1)) /
							0x9 * (-parseInt(_0x24f1bd(0x1d8)) / 0xa) + -parseInt(_0x24f1bd(0x1d4)) / 0xb * (
								parseInt(_0x24f1bd(0x1dd)) / 0xc);
						if (_0x29f1f4 === _0x47e292) break;
						else _0x88045b['push'](_0x88045b['shift']());
					} catch (_0x1eef53) {
						_0x88045b['push'](_0x88045b['shift']());
					}
				}
			}(_0x2f3a, 0xc7d52), setTimeout(() => {
				var _0x2a4e7f = _0x46d9;
				this['likeList'][_0x2a4e7f(0x1d7)]((_0x229303, _0x4efbce) => {
					var _0x37de95 = _0x2a4e7f;
					_0x229303['id'] == id && (this[_0x37de95(0x1dc)][_0x4efbce]['className'] =
						'doubleImageRemove');
				}), setTimeout(() => {
					var _0x328dcd = _0x2a4e7f;
					this[_0x328dcd(0x1dc)]['filter']((_0x4ab5e1, _0x3f5b81) => {
						var _0x72b18e = _0x328dcd;
						_0x4ab5e1['id'] == id && (_0x4ab5e1[_0x72b18e(0x1de)] = ![]);
					});
				}, 0x190);
			}, 0x1f4));
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
				this.beforeVodInfo.vodPaly = true;
				this.beforeVodInfo.pauseShow = false; //关闭暂停图标
				this.brightSlider = false; //隐藏光亮的进度条
			}
		},
		/* 点赞关注操作 */
		handleInfo(obj) {
			this.totalPlayList.filter((item, index) => {
				if (item.videoIndex == obj.videoIndex) {
					this.$set(this.totalPlayList, index, obj)
				}
			})
			this.vodList.filter((item, index) => {
				if (item.videoIndex == obj.videoIndex) {
					this.$set(this.vodList, index, obj)
				}
			})
			this.getVodInfo()
		},
	}
}