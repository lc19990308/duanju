<template>
	<view class="page_content">
		
		<view class="infoBox">
			
			<view class="userinfo_box" v-if="userInfoStore">
				<view class="avatar">
					<image class="imageloog" v-if="userInfoStore.backgLogo" :src="userInfoStore.backgLogo" mode=""></image>
					<!-- <image class="imageloog"  src="/static/images/avatar.png" mode=""></image> -->
					<image class="image" v-if="userInfoStore.themeLogo" :src="userInfoStore.themeLogo" mode="aspectFill"></image>
					<image class="image" v-else src="/static/images/avatar.png" mode="aspectFill"></image>
				</view>
				<view class="info">
					<!-- <view class="nickname">
						<text class="text">{{ userInfoStore.nickname }}</text>
						<image class="image" v-if="userInfoStore.backgLogo" :src="userInfoStore.backgLogo"
							mode="widthFix" @click="openVip"></image>
					</view> -->
					<view class="msg">
						<text class="membername">{{ userInfoStore.memberName || 'Visitor'}}</text>
						<!-- <text class="copy" @click.stop="copyText(userInfoStore.user_id)">复制</text> -->
					</view>
					<view class="msg">
						<text class="text" v-if="userInfoStore.activate !='已开通'">ID：{{ userInfoStore.memberId || '000001'}}</text>
						<!-- <text class="text" style="margin: 0 16rpx;" v-if="userInfoStore.activate=='已开通'"></text> -->
						<text class="text" v-if="userInfoStore.activate=='已开通' && userInfoStore.rechargeVal">VIP会员{{userInfoStore.expireTime}}到期</text>
						<!-- <text class="copy" @click.stop="copyText(userInfoStore.user_id)">复制</text> -->
					</view>
					
				</view>
				<u-button class="user-btn">Đăng nhập</u-button>
				<!-- <image class="arrow" src="/static/icons/arrow.png" mode="widthFix"></image> -->
			</view>
			<view class="userinfo_box" v-else >
				<view class="avatar">
					<image class="image" src="/static/images/avatar.png" mode="aspectFill"></image>
				</view>
				<view class="info">
					<view class="nickname">
						<text class="text">{{memberName}}</text>
					</view>
					<view class="msg"></view>
				</view>
			</view>
		</view>
		<view class="main_content">
			<!-- VIP充值 -->
			<view class="vip_card" v-if="userInfoStore.rechargeVal">
				<image class="imagssl" :src="userInfoStore.backgRound" mode="scaleToFill"></image>
				<view class="vip_box">
					<view class="left" @click="openVip">
						<view class="line1">
							<!-- <image class="backgLogo" :src="userInfoStore.backgLogo" mode="aspectFill"></image> -->
							<!-- <view class="kaitong">{{userInfoStore.activate}}</view> -->
						</view>
						<view class="line2">{{userInfoStore.remarks || ''}}<u-icon name="arrow-right" color="$uni-text-color-vip" size="14"></u-icon>
						</view>
					</view>
				</view>
			</view>
			<view class="integral_box" v-if="userInfoStore.rechargeVal" >
				<view class="right">
					<text class="text">帐户余额:</text>
					<!-- <image class="image" src="/static/icons/integral.png" mode=""></image> -->
					<text class="text usable">{{ userInfoStore.totalBalance || 0 }}</text>
					<text class="text">{{userInfoStore.currencyName || '' }}</text>
				</view>
				<view class="left" @click="recharbtn">充值</view>
			</view>
			<view class="moinublock">
				<view class="oinuntlist">
					Xem lịch sử
					<!-- <image src="../../static/hunjiaotoa.png" mode=""></image> -->
				</view>
				<view class="list">
					<u-scroll-list :indicator="false" @right="handleToRight" :indicatorActiveColor="'#f2f5f7'">
						<view v-for="(item, index) in mounList" :key="index" style="position: relative;" @click="abunbtn(item)">
							<view class="mouns">
								<view class="count">
									<u-icon name="play-right-fill" color="#fff" size="14"></u-icon>{{item.totalPlay || '0'}}
								</view>
							</view>
							<image class="img" :src="item.dramaPoster"></image>
							<view class="title">
								<u--text :lines="1" size="24rpx" color="#fff" align="left" :text="item.dramaName || 'bộ phim cổ ...'"></u--text>
							</view>
						</view>
						<!-- <view class="" style="width: 20px;">
							查看更多
						</view> -->
					</u-scroll-list>
				</view>
				<view class="dalisewier">
					<view class="item" @click="jumpView(`/${item.url}`)" v-for="(item,index) in videoList" v-if="item.functionStatus == 1">
						<!-- <view class="icon">
							<image class="image" :src="item.img" mode="aspectFill"></image>
						</view> -->
						<!-- <view class="text">{{ item.text }}</view> -->
						<view class="vlist" :key="item.id" >
							<image class="video-pic" :src="item.img" mode="widthFix"></image>
							<view style="color: #000;" class="text">{{ item.text }}</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="menu_box">
				<view class="item" v-for="(item, index) in menuList" :key="item.id"
					@click="menuItemClick(item.rid, item.text, item.path)">
					<view class="left">
						<view class="icon">
							<image class="image" :src="item.img" :style="{ width: item.width }" mode="widthFix"></image>
						</view>
						<view class="text">{{ item.text }}</view>
					</view>
					<view class="right">
						<u-icon name="arrow-right" color="#fff" size="12" :bold="true"></u-icon>
						<!-- <image class="image" src="/static/icons/arrow.png" mode="widthFix"></image> -->
					</view>
				</view>
			</view>
			<view class="copyright" v-if="copyrightData.length" @click="debugClick">
				<view class="item" v-for="(item, index) in copyrightData" :key="index">
					<image class="image" v-if="item.image" :src="item.image" mode="widthFix"></image>
					<!-- #ifdef MP-WEIXIN -->
					<text class="text">{{ item.name }}</text>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<a v-if="item.url" :href="item.url" target="_blank" rel="">
						<text class="text">{{ item.name }}</text>
					</a>
					<text v-else class="text">{{ item.name }}</text>
					<!-- #endif -->
				</view>
			</view>
			<view class="alert_box"
				v-if="platform != 'H5' && token && userInfoStore && configStore.system.mobile_switch == 1">
				<view class="item" v-if="!userInfoStore.verification.mobile">
					<text class="text">您还没有绑定手机号</text>
					<text class="btn" @click="alertBindButton('mobile')">去绑定</text>
				</view>
			</view>
			<u-modal :show="cdkey.show" :title="cdkey.title" :showCancelButton="true" @confirm="cdkeyConfirm"
				@cancel="cdkey.show = false">
				<view style="width: 100%;">
					<u-input v-model="cdkey.value" :customStyle="inputStyle" clearable placeholder="请输入兑换码"
						@change="inputChange" @blur="inputChange"></u-input>
				</view>
			</u-modal>
		</view>
	</view>
</template>

<script>
	import apiMoen from '../../utils/config.js';
	const PlayerManager = require("../../utils/playerManager.js");
	// const playletPlugin = requirePlugin("playlet-plugin");
	let playletPlugin;
	
	// 检查当前是否在小程序环境中
	if (typeof wx !== 'undefined' && wx.getSystemInfo) {
	    try {
	        // 在小程序中执行 requirePlugin
	        playletPlugin = requirePlugin("playlet-plugin");
	    } catch (error) {
	        console.error('Failed to requirePlugin in WeChat Mini Program:', error);
	    }
	} else {
	    // 在其他环境中的处理
	    console.log('This code is executed only in WeChat Mini Program environment.');
	}
	import {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} from "vuex"
	export default {
		data() {
			return {
				allocatProgram:{},
				tenantId: null,
				sysOrgCode: null,
				memberId: null,
				memberName: null,
				buttonStyle: {
					width: '100%',
					height: '100%',
					border: 'none',
					fontSize: '24rpx',
					color: '#DF9B45',
					background: '#fff',
					borderRadius: '8rpx',
					fontWeight: 'bold'
				},
				cardList: [{
						id: 1,
						img: '/static/icons/menu_2.png',
						text: '观看记录',
						path: '/pages/video/record'
					},
					{
						id: 2,
						img: '/static/icons/menu_3.png',
						text: '申请分销商',
						path: '/pages/user/dealer/index'
					},
					{
						id: 3,
						img: '/static/icons/menu_4.png',
						text: '分享赚钱',
						path: '/pages/user/share/index'
					},
					{
						id: 4,
						img: '/static/icons/menu_1.png',
						text: '卡密兑换',
						path: ''
					},
				],
				menuList: [
					// #ifndef APP-PLUS
					{
						id: 1,
						img: '/static/icons/list_2.png',
						width: '32rpx',
						text: '邀请好友',
						rid: '',
						path: '/pages/user/share/poster'
					},
					// #endif
					{
						id: 7,
						img: '/static/icons/list_2.png',
						width: '28rpx',
						text: '获取积分',
						rid: '',
						path: '/pages/user/integral/task'
					},
					{
						id: 2,
						img: '/static/icons/list_4.png',
						width: '28rpx',
						text: '用户协议',
						rid: ''
					},
					{
						id: 3,
						img: '/static/icons/list_2.png',
						width: '28rpx',
						text: '隐私协议',
						rid: ''
					},
					{
						id: 4,
						img: '/static/icons/list_3.png',
						width: '28rpx',
						text: '法律声明',
						rid: ''
					},
					{
						id: 5,
						img: '/static/icons/list_5.png',
						width: '32rpx',
						text: '联系我们',
						rid: ''
					},
					{
						id: 6,
						img: '/static/icons/list_3.png',
						width: '28rpx',
						text: '关于我们',
						rid: ''
					},
				],
				copyrightData: this.$store.state.app.copyright || [], // 版权说明
				platform: this.$utils.platforms(),
				configStore: this.$store.state.app.config,
				userInfoStore: {},
				debug: {
					count: 0,
					timer: null
				},
				cdkey: {
					show: false,
					title: '卡密兑换',
					value: '',
				},
				VipListmu:{},
				inputStyle: {},
				platform:'',
				videoList: [],
				mounList: [{
					id: 1,
					image: '../../static/01.jpg',
					name: '测试',
					es: '100集',
					description: '穿越',
					number: '1000'
				}, {
					id: 1,
					image: '../../static/01.jpg',
					name: '测试',
					es: '100集',
					description: '穿越',
					number: '1000'
				}, {
					id: 1,
					image: '../../static/01.jpg',
					name: '测试测试测试',
					es: '100集',
					description: '穿越',
					number: '1000'
				}, {
					id: 1,
					image: '../../static/01.jpg',
					name: '测试测试测试测试测试测试测试测试测试',
					es: '100集',
					description: '穿越',
					number: '1000'
				}]
			}
		},
		computed: {
			...mapGetters("user", ["token", "userInfo"]),
			...mapGetters("app", ["config", "copyright", "richtext", "iosIsPay"]),
		},
		watch: {
			config: {
				deep: true,
				handler: function(newValue, oldValue) {
					this.configStore = newValue
				}
			},
			userInfo: {
				deep: true,
				handler: function(newValue, oldValue) {
					// this.userInfoStore = newValue
				}
			},
			copyright(newValue, oldValue) {
				this.copyrightData = newValue
			},
			richtext(newValue, oldValue) {
				newValue && this.initMenuList(newValue)
			}
		},
		onPullDownRefresh() {
			// if(this.token) {
			// 	this.getUserInfo().then(res => {
			// 		uni.stopPullDownRefresh()
			// 	}).catch(err => {
			// 		uni.stopPullDownRefresh()
			// 	})
			// } else {
			// 	uni.stopPullDownRefresh()
			// }
		},
		onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			let platform;
			 
			if (systemInfo.platform === 'android') {
			  this.platform = 'Android';
			} else if (systemInfo.platform === 'ios') {
			  this.platform = 'iOS';
			}
			 
			console.log(this.platform); // 输出设备平台信息
			uni.$on('updateUserInfo', () => {
				// this.getUserInfo()
			})
			
			this.tenantId = apiMoen.tenantId
			this.sysOrgCode = apiMoen.sysOrgCode
			
			
			this.memberId = uni.getStorageSync('id')
			this.id = uni.getStorageSync('id')
			if(!this.memberId){
				uni.redirectTo({
					url:'/pages/user/login/login'
				})
				return
			}
			this.handleTovideoList()
			this.richtext && this.initMenuList(this.richtext)
			this.getAllocatProgram()
			this.getDeviceid()
		},
		onShow() {
			this.handleToFilmDramaMember()
			this.handleToFilmViewHistoryList()
		},
		onUnload() {
			uni.$off('updateUserInfo')
		},
		methods: {
			...mapActions('user', ['getUserInfo']),
			recharbtn(){
				uni.navigateTo({
					url:'../user/recharge/recharge'
				})
			},
			// 获取设备
			getDeviceid(){
				// 获取设备品牌、型号、设备 id 、系统名称、osVersion
				const {deviceBrand, deviceModel, deviceId, osName, osVersion} = uni.getSystemInfoSync();
				console.log("获取设备品牌、型号、设备 id 、系统名称、osVersion",deviceBrand, deviceModel, deviceId, osName, osVersion);
			},
			abunbtn(item){
				
				this.$myGlobalMethod(item.dramaId); // 调用全局方法
			},
			// 调试
			debugClick() {
				// #ifdef MP-WEIXIN
				const env = wx.getAccountInfoSync().miniProgram.envVersion
				if (env != "release") {
					clearTimeout(this.debug.timer);
					this.debug.count++;
					this.debug.timer = setTimeout(() => {
						if (this.debug.count >= 5) {
							uni.showModal({
								title: '配置信息',
								content: `
									(env => ${env}) -
									(domain => ${this.$BASE_URL}) -
									(sign => ${this.$SIGN})
								`
							})
						}
						this.debug.count = 0;
					}, 500);
				}
				// #endif
			},
			alertBindButton(type) {
				if (type == 'wxmp') {
					console.log("绑定微信小程序");
				} else if (type == 'wxoa') {
					console.log("绑定微信公众号");
				} else if (type == 'mobile') {
					console.log("绑定手机号");
					this.jumpView('/pages/user/info/index')
				}
			},
			// 复制
			copyText(info) {
				uni.setClipboardData({
					data: String(info),
					success: () => {
						this.$u.toast('复制成功')
					}
				});
			},
			// 充值会员中心
			openVip() {
				 uni.navigateTo({
				        url: "/pages/user/activate/activate"
				    })
				
			},
			// 小程序信息查询
			getAllocatProgram() {
				this.$request('common.allocatProgram', {
					tenantId: uni.getStorageSync('tenantId'),
					sysOrgCode: uni.getStorageSync('sysOrgCode'),
					appId: uni.getStorageSync('srcAppid'),
				}).then(res => {
					if (res != 200 && res.message != "") {
						uni.showToast({
							title: res.message,
							icon: 'error',
							duration: 2000,
							position: 'top'
						});
					}
					this.allocatProgram = res.result
					console.log('小程序信息查询:', res);
				})
			},
			//功能列表
			handleTovideoList() {
				this.$request('wchatapi.allocatFunctionList', {
					tenantId: this.tenantId,
					sysOrgCode: this.sysOrgCode
				}).then(res => {
					console.log("功能列表",res);
					if (res.code == 200) {
						this.videoList = res.result.map(it => ({
							id: it.id,
							img: it.functionLogo,
							width: '28rpx',
							text: it.functionName,
							url: it.functionUrl,
							functionStatus:it.functionStatus
						}))
						console.log(this.videoList);
					}
				}).catch(res => {
					console.log(res);
				})
			},
			//会员信息
			handleToFilmDramaMember() {
				this.$request('wchatapi.filmDramaMember', {
					memberId: this.memberId
				}).then(res => {
					if (res.code == 200) {
						this.memberName = res.result.memberName
						this.VipListmu = res.result
						this.userInfoStore = res.result
					}
					console.log("会员信息",res);
				}).catch(res => {
					console.log(res);
				})
			},
			//历史记录
			handleToFilmViewHistoryList() {
				this.$request('wchatapi.filmViewHistoryList', {
					memberId: this.memberId
				}).then(res => {
					if (res.code == 200) {
						console.log(res);
						this.mounList = res.result
					}
				}).catch(res => {
					console.log(res);
				})
			},
			//向左滑触发right
			handleToRight() {
				console.log('11111111111111111111111')
			},
		}
	}
</script>

<style lang="scss" scoped>
	.mouns {
		width: 100%;
		// height: 282rpx;
		border-radius: 16rpx;
		// overflow: hidden;
		position: absolute;
		left: 10rpx;
		bottom: 50rpx;
	
		.image {
			width: 100%;
			height: 100%;
		}
	
		.count {
			// position: absolute;
			left: 24rpx;
			bottom: 24rpx;
			color: #fff;
			display: flex;
			align-items: center;
			font-size: 24rpx;
		}
	}
	.page_content {
		position: relative;
		overflow-y: auto;
		background-image: url(/static/images/navbar-bg.png);
		background-position: center center;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		.infoBox {
			position: relative;
			padding-left: 36rpx;
			padding-top: 80rpx;
			.imagess{
				width: 100%;
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				z-index: 1;
			}
			.navbar {
				font-size: 48rpx;
				font-weight: bold;
				margin-bottom: 46rpx;
				color: #fff;
				position: relative;
				z-index: 2;
			}

			.userinfo_box {
				position: relative;
				z-index: 2;
				display: flex;
				align-items: center;
				position: relative;

				.arrow {
					position: absolute;
					top: 50%;
					right: 0;
					transform: translateY(-50%) rotate(0deg);
					width: 44rpx;
				}

				.avatar {
					width: 104rpx;
					height: 104rpx;
					border-radius: 50%;
					border: 2rpx solid #fff;
					// overflow: hidden;
					position: relative;

					.image {
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
					.imageloog{
						position: absolute;
						top: -8rpx;
						right: 0;
						width: 40rpx;
						height: 40rpx;
						
					}
				}

				.info {
					flex: 1;
					margin-left: 32rpx;
					.nickname {
						display: flex;

						.text {
							font-size: 34rpx;
							color: #fff;
							font-weight: 900;
						}

						.image {
							width: 52rpx;
							margin-left: 8rpx;
						}
					}

					.msg {
						.membername{
							font-size: 36rpx;
							margin-top: 20rpx;
							color: #fff;
							font-weight: bold;
						}
						
						.text {
							color: $uni-text-color-inverse;
							font-size: 24rpx;
							margin-top: 0;
						}

						.copy {
							color: #5E5E5E;
							margin-left: 8rpx;
							text-decoration: underline;
							display: inline-block;
						}
					}
				}
				.user-btn {
					width: 202rpx;
					height: 65rpx;
					margin-right: 36rpx;
					text-align: center;
					line-height: 65rpx;
					border-radius: 94rpx;
					background-color: transparent;
					font-family: Inter, Inter;
					font-weight: 400;
					font-size: 27rpx;
					color: #FFCD03;
					border: 2rpx solid #FFCD03;
				}
			}
		}

		.main_content {
			padding: 0 32rpx 152rpx 32rpx;
			
			.vip_card {
				border-radius: 8rpx;
				overflow: hidden;
				margin-top: 24rpx;
				position: relative;
				height: 204rpx;
				.imagssl{
					width: 100%;
					height: 204rpx;
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					z-index: 1;
				}
				.vip_box {
					position: relative;
					z-index: 2;
					width: 100%;
					padding: 32rpx 24rpx;
					box-sizing: border-box;
					// background: #DF9B45;
					// background-image: url('~@/static/images/vip_bg.png');
					background-size: 100% 100%;
					background-repeat: no-repeat;
					display: flex;
					align-items: center;
					justify-content: space-between;
					
					.left {
						color: #fff;
						display: flex;
						justify-content: space-between;
						align-items: center;
						width: 100%;

						.line1 {
							font-size: 32rpx;
							font-weight: bold;
							display: flex;
							align-items: center;
							.backgLogo{
								width: 30rpx;
								height: 40rpx;
							}
							.kaitong {
								font-size: 24rpx;
								margin-left: 124rpx;
								padding: 0 16rpx;
								background-color: #FDE1CB;
								color: #62472A;
								font-weight: 400;
								border-radius: 8rpx;
								line-height: 40rpx;
								text-align: center;
							}
						}
						
						.line2 {
							font-size: 28rpx;
							display: flex;
							align-items: center;
							color: #fff;

							::v-deep .u-icon {
								margin-top: 6rpx;
							}
						}
					}

					.right {
						// width: 156rpx;
						// height: 60rpx;
					}
				}


			}

			.integral_box {
				margin-top: 24rpx;
				height: 112rpx;
				background: #fff;
				display: flex;
				align-items: center;
				justify-content: space-between;
				color: #4D4D4D;
				padding: 0 24rpx;
				font-size: 28rpx;
				font-weight: 600;
				border-radius: 8rpx;

				.left {
					color: #fff;
					border-radius: 68rpx;
					width: 144rpx;
					height: 68rpx;
					font-size: 28rpx;
					background-color: #FF0066;
					line-height: 68rpx;
					text-align: center;
				}

				.right {
					display: flex;
					align-items: center;

					.image {
						width: 30rpx;
						margin-right: 8rpx;
						margin-left: 12rpx;
					}

					.text {
						font-size: 28rpx;
						font-weight: bold;
					}
					.usable{
						margin-left: 12rpx;
						margin-right: 8rpx;
						font-size: 36rpx;
						color: #000;
					}
				}
			}

			.oinuntlist {
				font-size: 28rpx;
				font-weight: 800;
				color: #fff;
				position: relative;

				image {
					width: 26rpx;
					height: 26rpx;
					position: absolute;
					top: 50%;
					right: 0;
					transform: translateY(-50%);
				}
			}

			.moinublock {
				border-radius: 8rpx;
				padding: 36rpx 24rpx 0 24rpx;
				background: transparent;
				margin-top: 24rpx;
				.list {
					margin-top: 15rpx;
				}

				.img {
					width: 164rpx;
					height: 218rpx;
					border-radius: 12rpx;
					margin-right: 16rpx;
				}

				.title {
					width: 100%;
					margin-top: 8rpx;
				}
			}

			.card_box {
				border-radius: 8rpx;
				padding-top: 32rpx;
				background: #fff;
				padding-left: 24rpx;
				min-height: 200rpx;
				margin-top: 24rpx;
				padding-bottom: 32rpx;
				.dalisewier {
					display: flex;
					padding-top: 20rpx;
					flex-wrap: wrap;
					margin-left: 20rpx;
				}
				
				.vlist {
					// margin-right: 64rpx;
					image {
						width: 60rpx;
						height: 60rpx;
						display: block;
						margin: auto;
						overflow: hidden;
					}
				}
				
				.item {
					margin-right: 72rpx;
					margin-bottom: 20rpx;
					
					.icon {
						width: 84rpx;
						height: 84rpx;
						margin: 0 auto;

						.image {
							width: 100%;
							height: 100%;
						}
					}

					.text {
						font-size: 24rpx;
						color: #999;
						color: #fff;
						text-align: center;
						margin-top: 8rpx;
					}
				}

				.item:nth-child(4n) {
					margin-right: 0rpx;
				}
			}

			.menu_box {
				background: #fff;
				border-radius: 8rpx;
				padding: 30rpx 40rpx;
				margin-top: 40rpx;
				background: transparent;

				.item {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 28rpx 0;

					.left {
						display: flex;
						align-items: center;

						.icon {
							width: 36rpx;
							height: 36rpx;
							display: flex;
							align-items: center;
							justify-content: center;

							.image {
								width: 100%;
							}
						}

						.text {
							font-size: 28rpx;
							// color: #333;
							color: #fff;
							margin-left: 40rpx;
							font-weight: bold;
						}
					}

					.right {
						.image {
							width: 32rpx;
						}
					}
				}
			}

			.copyright {
				margin-top: 60rpx;

				.item {
					display: flex;
					align-items: center;
					justify-content: center;
					line-height: 36rpx;

					a {
						text-decoration: none;
					}

					.image {
						width: 30rpx;
						margin-right: 8rpx;
					}

					.text {
						font-size: 24rpx;
						color: rgba(#999, 0.5);
					}
				}
			}

			.alert_box {
				width: 100%;
				padding: 0 40rpx;
				position: absolute;
				bottom: 20rpx;
				left: 0;

				.item {
					padding: 20rpx;
					border-radius: 20rpx;
					background: rgba(0, 0, 0, 0.9);
					color: #fff;
					font-size: 28rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.text {}

					.btn {
						background: #C78021;
						padding: 8rpx 20rpx;
						border-radius: 10rpx;
					}
				}
			}
		}
	}
</style>