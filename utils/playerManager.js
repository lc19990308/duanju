// var playletPlugin = requirePlugin("playlet-plugin");
let playletPlugin;

import apiMoen from './config.js';
var MYurl = apiMoen.MPWEIXIN
import {
	PlayletManager
} from "../utils/playerManager.js"
// 点击按钮触发此函数跳转到播放器页面
function navigateToPlayer(obj) {
	// 下面的${dramaId}变量,需要替换成小程序管理后台的媒资管理上传的剧的dramaId
	// 变量${srcAppid}是提审方appid
	// 变量${serialNo}是活动的页面路径剧集ID
	// 变量${extParam}是分享参数，分享的卡片和二维码会在分享的链接上携带此参数
	const {
		extParam,
		dramaId,
		srcAppid,
		codes
	} = obj
	// console.log(obj,'111111111')
	wx.navigateTo({
		url: `plugin-private://wx94a6522b1d640c3b/pages/playlet/playlet?dramaId=${dramaId}&srcAppid=${srcAppid}&extParam=${extParam || ''}`
	})
}

function deepClone(obj) {
	if (typeof obj !== 'object' || !obj) return obj
	let newObj = obj instanceof Array ? [] : {}
	for (let key in obj) {
		if (typeof obj[key] === 'object') {
			newObj[key] = deepClone(obj[key])
		} else {
			newObj[key] = obj[key]
		}
	}
	return newObj
}
const proto = {
	data: { // 可通过this.data访问
		playerId: '',
		arr: [],
		b: null
	},
	// 注册播放器页面的onLoad事件，接受的参数是函数
	onLaunch(options) {
		// const pp = playletPlugin.onPageLoad(this._onPlayerLoad.bind(this))
		// console.log('--------------------------pp', pp)
		// this._onPlayerLoad()
	},
	_onPlayerLoad(info) {
		// console.log('onPlayerLoad info', info, 'data', this.data)
		// console.log('++++++++++++++++++++++onPlayerLoad info1232121515', info, )
		this.data.playerId = info.playerId

		const pm = playletPlugin.PlayletManager.getPageManager(info.playerId)
		this.pm = pm
		this.loncalis()
		// encryptedData是经过开发者后台加密后(不要在前端加密)的数据，具体实现见下面的加密章节
		this.getEncryptData({
			serialNo: info.serialNo
		}).then(res => {
			// encryptedData是后台加密后的数据，具体实现见下面的加密章节
			// console.log(res, '121212121212121212')
			pm.setCanPlaySerialList({
				data: res.encryptedData,
				freeList: [{ // 1~10集是免费剧,data里面的字段也必须至少设置1~10集可播放
					start_serial_no: res.start_serial_no,
					end_serial_no: res.end_serial_no
				}],
			})
		})
		// 获取当前剧集信息
		const px = pm.getInfo()
		// console.log('++++++++++++++++++++++getInfo9999999999999999999999999999999999px', px)
		// 需要解锁的事件
		pm.onCheckIsCanPlay(this.onCheckIsCanPlay)
		this._initShare()
		// 参考文档章节“数据上报”
		pm.onDataReport((obj) => {
			const {
				dramaId,
				serialNo
			} = this.pm.getInfo()
			// if (obj.event === playletPlugin.REPORT_DATA_EVENTS.VIDEO_PLAY ||
			// 	obj.event === playletPlugin.REPORT_DATA_EVENTS.CHANGE_SERIAL ||
			// 	obj.event === playletPlugin.REPORT_DATA_EVENTS.VIDEO_PAUSE
			// ) {
			// 	console.log('>>>>onDataReport obj', obj)

			// }

			//分享
			if (obj.event === playletPlugin.REPORT_DATA_EVENTS.SHARE) {
				console.log('分享', obj)
				this.collection(0, 4)
			}
			//点赞
			if (obj.event === playletPlugin.REPORT_DATA_EVENTS.LIKE) {
				console.log('点赞', obj)
				this.collection(1, 2)
			}
			//取消点赞
			if (obj.event === playletPlugin.REPORT_DATA_EVENTS.UNLIKE) {
				console.log('取消点赞', obj)
				this.collection(2, 2)
			}
			//在追
			if (obj.event === playletPlugin.REPORT_DATA_EVENTS.FAV) {
				console.log('在追', obj)
				this.collection(1, 3)
			}
			//取消在追
			if (obj.event === playletPlugin.REPORT_DATA_EVENTS.UNFAV) {
				console.log('取消在追', obj)
				this.collection(2, 3)
			}
			//切换剧集CHANGE_SERIAL
			// VIDEO_PLAY 播放事件
			if (obj.event === playletPlugin.REPORT_DATA_EVENTS.CHANGE_SERIAL) {
				console.log('切换剧集', obj)
				uni.request({
						url: MYurl + '/api/wxApi/memberOverdueState',
						method: 'GET',
						header: {
							'content-type': 'application/json', // 添加 content-type
							"X-Tenant-Id": uni.getStorageSync('tenantId')
						},
						data: {
							memberId: uni.getStorageSync('id'), //用户ID
						},
						success: (res) => {
							if (res.data.result) {
								this.getEncryptData({
									serialNo: serialNo,
								}).then(res => {
									// encryptedData是后台加密后的数据，具体实现见下面的加密章节
									this.pm.isCanPlay({
										data: res.encryptedData,
										serialNo: serialNo,
									})
								})
								// this.onCheckIsCanPlay()
							}
						}
					}),
					this.loncalis()
			}
		})
		// 设置右侧固定运营位置跳转路径
		pm.setActivityInfo({
			// url: '/pages/user/account/account', // 活动页面的路径，必填
			// logo: 'https://baixoss.oss-cn-shenzhen.aliyuncs.com/bx_video/panpan/glicon/message-3-line.svg', // 显示的icon的url
			// name: '赚钱', // 显示的名称，默认为活动
		})
		// 设置运营区域
		pm.updateOpenArea({
			showLeft: false,
			showRight: false,
			leftsideAreaList: [{
				left: 16, // 类似绝对定位的样式
				top: 20,
				width: 72,
				height: 32
			}, ],
			ext: 'extInfo',
		})
	},
	//记录播放
	loncalis() {
		const {
			dramaId,
			serialNo
		} = this.pm.getInfo()
		// return
		uni.request({
			url: MYurl + '/api/wxApi/filmDramaSeriesSecond',
			method: 'POST',
			header: {
				'content-type': 'application/json', // 添加 content-type
				"X-Tenant-Id": uni.getStorageSync('tenantId')
			},
			data: {
				secondType: 1, //操作分类 1播放、2点赞、3收藏、4转发
				memberId: uni.getStorageSync('id'), //会员ID
				dramaId: dramaId, //剧目ID
				dramaSeries: serialNo, //剧集集数
				tenantId: uni.getStorageSync('tenantId'), //租户ID
				sysOrgCode: uni.getStorageSync('sysOrgCode'), //部门编码
			},
			success: (res) => {
				// console.log(serialNo,'记录')
			}
		})
	},
	collection(index, secondType) {
		const {
			dramaId,
			serialNo
		} = this.pm.getInfo()
		if (secondType == 4) {
			var datas = {
				secondType: secondType, //操作分类 1播放、2点赞、3收藏、4转发
				memberId: uni.getStorageSync('id'), //会员ID
				dramaId: dramaId, //剧目ID
				dramaSeries: serialNo, //剧集集数
				tenantId: uni.getStorageSync('tenantId'), //租户ID
				sysOrgCode: uni.getStorageSync('sysOrgCode'), //部门编码
			}
		} else {
			var datas = {
				secondType: secondType, //操作分类 1播放、2点赞、3收藏、4转发
				calculateType: index, //计算分类 1加追剧、2减取消追剧
				memberId: uni.getStorageSync('id'), //会员ID
				dramaId: dramaId, //剧目ID
				dramaSeries: serialNo, //剧集集数
				tenantId: uni.getStorageSync('tenantId'), //租户ID
				sysOrgCode: uni.getStorageSync('sysOrgCode'), //部门编码
			}
		}

		uni.request({
			url: MYurl + '/api/wxApi/filmDramaSeriesSecond',
			// url: 'http://47.120.46.16/api/wxApi/buyDramaSeries',
			method: 'POST',
			header: {
				'content-type': 'application/json', // 添加 content-type
				// 'X-Access-Token': 1002, // 将 X-Access-Token 添加到请求头部
				"X-Tenant-Id": uni.getStorageSync('tenantId')
			},
			data: datas,
			success: (res) => {
				// console.log(res, '是否收藏')
			}
		})
	},
	_initShare() {
		const pm = this.pm
		// 关于分享的处理
		// 开启分享以及withShareTicket
		pm.setDramaFlag({
			share: true,
			withShareTicket: true
		})
		// 获取分享参数,页面栈只有短剧播放器一个页面的时候可获取到此参数
		// 例如从分享卡片进入、从投流广告直接跳转到播放器页面，从二维码直接进入播放器页面等情况
		playletPlugin.getShareParams().then(res => {
			// console.log('getLaunch options query res', res)
			// 关于extParam的处理，需要先做decodeURIComponent之后才能得到原值
			const extParam = decodeURIComponent(res.extParam)
			// console.log('getLaunch options extParam', extParam)
			// 如果设置了withShareTicket为true，可通过文档的方法获取更多信息
			// https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html
			const enterOptions = wx.getEnterOptionsSync()
			// console.log('getLaunch options shareTicket', enterOptions.shareTicket)
		}).catch(err => {
			console.log('getLaunch options query err', err)
		})
		// 设置分享参数
		pm.setExtParam('scene')
	},
	onCheckIsCanPlay(param) {
		const pm = this.pm
		const {
			dramaId,
			serialNo
		} = this.pm.getInfo()
		
		// return
		// TODO: 碰到不可以解锁的剧集，会触发此事件，这里可以进行扣币解锁逻辑，如果用户无足够的币，可调用下面的this.isCanPlay设置
		// console.log('onCheckIsCanPlay param', param)
		// this.certerList()
		// 获取需要解锁的剧集ID
		this.getEncryptData({
			serialNo: serialNo,
		}).then(res => {
			console.log("获取后台加密数据",res)
			// encryptedData是后台加密后的数据，具体实现见下面的加密章节
			this.pm.isCanPlay({
				data: res.encryptedData,
				serialNo: serialNo,
			})
			// 从加密的数据中获取可以播放结束剧集ID，在这个基础上加1后就是要解锁的剧集，这样可以实现不管用户点击的是
			const seriesSeries = parseInt(res.end_serial_no) + 1;
			if (seriesSeries < parseInt(serialNo)) {
				uni.showToast({
					title: '请先解锁第' + seriesSeries + '集',
					icon: 'success',
					duration: 2000
				});
				return
			}
			if (serialNo >= seriesSeries) {
				// 如果是广告解锁，那么在用户看完广告后在关闭时调用购买剧集接口
				// 如果是广告解锁剧集开始和结束都是0，则代表都是付费解锁
				// 判断用户今天如果没有超过最大广告解锁上线则可以进入广告解锁逻辑
				if(res.unlockGG){
					pm.setUseAdUnlock({
					    list: [{start_serial_no: res.unlockList.start_serial_no, end_serial_no: res.unlockList.end_serial_no}], // 79~80集会通过广告解锁
					})
					pm.onUseAdUnlock(function() {
					    console.log('>>>USE_AD_UNLOCK拉起激励视频广告去解锁')
					    // 拉起激励视频广告去解锁
						// 若在开发者工具中无法预览广告，请切换开发者工具中的基础库版本
						// 在页面中定义激励视频广告
						let videoAd = null
						// 在页面onLoad回调事件中创建激励视频广告实例
						if (wx.createRewardedVideoAd) {
						  videoAd = wx.createRewardedVideoAd({
						    adUnitId: 'adunit-ea3b7e6acf884135'
						  })
						  console.log('videoAd',videoAd)
						  // 激励视频广告加载成功时
						  videoAd.onLoad(() => {})
						  // 激励视频广告加载失败时
						  videoAd.onError((err) => {
						    console.error('激励视频光告加载失败', err)
						  })
						  // 激励视频广告关闭时
						  videoAd.onClose((res) => {
							  if(res.isEnded){
									console.log('广告看完被关闭了,调用购买剧集接口')
									// 调用购买剧集接口
									uni.request({
										url: MYurl + '/api/wxApi/buyDramaSeries',
										method: 'POST',
										header: {
											'content-type': 'application/json', // 添加 content-type
											"X-Tenant-Id": uni.getStorageSync('tenantId')
										},
										data: {
											memberId: uni.getStorageSync('id'), //用户ID
											dramaId: dramaId, //剧集ID
											sysOrgCode: uni.getStorageSync('sysOrgCode'), //部门ID
											tenantId: uni.getStorageSync('tenantId'), //租户ID
											seriesSeries: seriesSeries, //解锁的剧集ID
											unlockState: false //剧集是否解锁状态
										},
										success: (res) => {
											// if (res.data.message != '') {
											// 	uni.showToast({
											// 		title: res.data.message,
											// 		icon: 'success',
											// 		duration: 2000,
											// 	});
											// }
											// this.getEncryptData({
											// 	serialNo: serialNo,
											// }).then(res => {
											// 	// 购买成功之后重新获取后台加密后的数据
											// 	this.pm.isCanPlay({
											// 		data: res.encryptedData,
											// 		serialNo: serialNo,
											// 	})
											// })
											// pm.showChargeDialog() 
											
											// 如果余额充足,则提示购买成功
											console.log('++购买成功返回的数据1',res)
											if (res.data.code == 200) {
												this.getEncryptData({
													serialNo: serialNo,
												}).then(res => {
													// 购买成功之后重新获取后台加密后的数据
													this.pm.isCanPlay({
														data: res.encryptedData,
														serialNo: serialNo,
													})
												})
												if (res.data.message != '') {
													uni.showToast({
														title: res.data.message,
														icon: 'success',
														duration: 1200,
													});
												}
												
											} else {
												if (res.data.message != '') {
													uni.showToast({
														title: res.data.message,
														icon: 'success',
														duration: 2000,
													});
												}
												// pm.showChargeDialog()
											}
										}
									})
							  }
							  console.log('广告没有看完')
						  })
						}
						
						// 用户触发广告后，显示激励视频广告
						if (videoAd) {
						  videoAd.show().catch(() => {
						    // 失败重试
						    videoAd.load()
						      .then(() => videoAd.show())
						      .catch(err => {
						        console.error('激励视频 广告显示失败', err)
						      })
						  })
						}
					})
				}else{
					// 调用购买剧集接口
					uni.request({
						url: MYurl + '/api/wxApi/buyDramaSeries',
						method: 'POST',
						header: {
							'content-type': 'application/json', // 添加 content-type
							"X-Tenant-Id": uni.getStorageSync('tenantId')
						},
						data: {
							memberId: uni.getStorageSync('id'), //用户ID
							dramaId: dramaId, //剧集ID
							sysOrgCode: uni.getStorageSync('sysOrgCode'), //部门ID
							tenantId: uni.getStorageSync('tenantId'), //租户ID
							seriesSeries: seriesSeries, //解锁的剧集ID
							unlockState: false //剧集是否解锁状态
						},
						success: (res) => {
							console.log('++购买成功返回的数据x',res)
							console.log('++encryptedData',res.encryptedData)
							// 如果余额充足,则提示购买成功
							if (res.data.code !== 600) {
								if (res.data.message != '') {
									uni.showToast({
										title: res.data.message,
										icon: 'success',
										duration: 1200,
									});
								}
								this.getEncryptData({
									serialNo: serialNo,
								}).then(res => {
									// 购买成功之后重新获取后台加密后的数据
									this.pm.isCanPlay({
										data: res.encryptedData,
										serialNo: serialNo,
									})
								})
							} else {
								console.log('++购买成功返回的数据1',res)
								if (res.data.message != '') {
									uni.showToast({
										title: res.data.message,
										icon: 'success',
										duration: 2000,
									});
								}
								pm.showChargeDialog()
							}
						}
					})
				}
			}
		})
	},
	getEncryptData(obj) {
		const {
			serialNo
		} = obj
		// TODO: 此接口请求后台，返回下面的setCanPlaySerialList接口需要的加密参数
		const {
			srcAppid,
			dramaId,
			codes
		} = this.pm.getInfo()
		console.log('getEncryptData start', srcAppid, dramaId, serialNo)

		return new Promise((resolve, reject) => {
			var codes = ''
			uni.login({
				provider: "weixin",
				success(res) {
					console.log(res)
					uni.request({
						// url: MYurl + '/api/noauth/encrypt/demo',
						url: MYurl + '/api/wxApi/selectUnlockRegion',
						method: 'GET',
						data: {
							memberId: uni.getStorageSync('id'),
							dramaId: dramaId,
							sysOrgCode: uni.getStorageSync('sysOrgCode'),
							tenantId: uni.getStorageSync('tenantId'),
							code: res.code,
						},
						
						success: (res) => {
							// console.log('videoPlayer getCanPlayList res', res.data
							// 	.result.encryptData)
							console.log("加密数据最",res)
							resolve({
								unlockGG:res.data.result.unlockGG,
								unlockList:res.data.result.unlockList[0],
								encryptedData: res.data.result.encryptData,
								start_serial_no: res.data.result.freeList[0]
									.start_serial_no,
								end_serial_no: res.data.result.freeList[0]
									.end_serial_no
							})
							return
						},
						fail: (fail) => {
							reject(fail)
						}
					})
				}
			})

		})
	},

}

function PlayerManager() {
	var newProto = Object.assign({}, proto)
	for (const k in newProto) {
		if (typeof newProto[k] === 'function') {
			this[k] = newProto[k].bind(this)
		} else if (typeof newProto[k] === 'object') {
			if (!newProto[k]) {
				this[k] = newProto[k]
			} else {
				this[k] = deepClone(newProto[k])
			}
		}
	}
}

PlayerManager.navigateToPlayer = navigateToPlayer
module.exports = PlayerManager
