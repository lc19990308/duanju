<template>
	<view class="app-container">
		<view class="reward_t">
			{{$t(`reward.my_gold`)}}<br><span>{{totalPrice}}</span>
		</view>
		<view class="reward_list">
			<image src="/static/images/gold.png" class="goldImg" mode=""></image>
			<view class="reward_list_t">{{$t(`reward.reg_to_date`)}}<span>{{signDay}}</span></view>
			<scroll-view scroll-y="true" class="scroll-Y">
				<view class="reward_lists">
					<view class="reward_list_info"
						:class="[item.receiveStatus  ? 'end':'',todayIndex === index ? 'on':''] "
						v-for="(item,index) in signList" :key="index">
						<view>
							<image src="/static/images/gold.png" mode=""></image><span>+{{item.currencyQuantity}}</span>
						</view>
						<span class="reward_list_info_t">{{item.signInName}}</span>
					</view>
				</view>
			</scroll-view>
			<u-button class="reward-btn" @tap="rewardSign">{{$t(`reward.reg_now`)}}</u-button>
		</view>
		<view class="invite">
			<view class="invite_t">{{$t(`reward.invite_friend`)}}</view>
			<view class="invite_info">
				<view class="invite_infos">
					<image src="/static/images/Frame-31.png" class="invite_info_img" mode=""></image>
					<view class="invite_info_left">
						<view>{{$t(`reward.invite_friend`)}}</view>
						<br>
						<image src="/static/images/gold.png" mode=""></image>
						<span>+100</span><i>{{$t(`reward.gold`)}}</i>
					</view>
				</view>
				<u-button class="invite-btn" @click="goBtn">{{$t(`reward.btn`)}}</u-button>
			</view>
		</view>
		<view class="rewardCover" v-if="rewardCover" @tap="closeBtn">
			<view class="rewardCover_t">{{$t(`reward.invite_friend`)}}</view>
			<view class="rewardCover_info">
				<image src="/static/images/gift.png" class="rewardCover_info_img" mode=""></image>
				<view class="rewardCover_info_t">
					<image src="/static/images/Frame-39.png" mode=""></image>
					<view>
						<span>{{nickname}}</span><br>ID {{memberId}}
					</view>
				</view>
				<view class="canvas">
					<canvas canvas-id="qrcode" :style="{width: `${qrcodeSize}px`, height: `${qrcodeSize}px`}" />
				</view>
				<view class="reward_tips">
					{{$t('reward.tips')}}
				</view>
			</view>
			<view class="rewardCover_bottom" @tap="uniShare">
				<image src="/static/images/Frame-44.png" mode=""></image>
				<text>{{$t(`reward.btn_text`)}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	// #ifndef APP-HARMONY
	import UniShare from '@/uni_modules/uni-share/js_sdk/uni-share.js';
	const uniShare = new UniShare();
	// #endif
	import apis from '@/utils/config.js'
	import {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} from "vuex";
	import {
		uQRCode
	} from '@/uni_modules/cc-defineNewQRCode/components/cc-defineNewQRCode/common/uqrcode.js'
	export default {
		data() {
			return {
				rewardCover: false,
				sysOrgCode: apis.sysOrgCode,
				memberId: '',
				totalPrice: 0,
				signList: [],
				signInId: '',
				todayIndex: '',
				qrcodeText: '',
				// 二维码尺寸
				qrcodeSize: 84,

				// 最终生成的二维码图片
				qrcodeSrc: '',
				nickname: '',
				signDay: 0,
				today: '',
			}
		},
		computed: {
			...mapGetters("user", ["token"]),
		},
		onShow() {
			this.init();
		},
		onBackPress({
			from
		}) {
			if (from == 'backbutton') {
				this.$nextTick(function() {
					uniShare.hide()
				})
				return uniShare.isShow;
			}
		},
		methods: {
			//判断哪些接口需要登录了，才能看
			init() {
				if (this.token) {
					this.memberId = uni.getStorageSync('id') || '';
					this.getUserInfo();
					this.getMoeny();
				}
				this.setTab();
				this.getSigninManageList();
			},
			setTab() {
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
			getUserInfo() {
				this.$request('user.getUserInfo').then(res => {
					const result = res.result.userInfo;
					this.nickname = result.realname;
					this.today = this.getTodayDate();
					this.qrcodeText =
						`https://www.vndrama.com:9082/#/pages/login/register?bindMemberId=${this.memberId}`
				})
			},
			//获取金币余额
			getMoeny() {
				this.$request('sign.memberGoldCoin', {
					memberId: this.memberId,
					sysOrgCode: this.sysOrgCode,
				}).then(res => {
					this.totalPrice = res.result.totalPrice;

				})
			},
			getSigninManageList() {
				this.$request('sign.signinManageList', {
					memberId: this.memberId,
					sysOrgCode: this.sysOrgCode,
				}).then(res => {
					this.signList = res.result.list;
					this.signDay = res.result.list.filter(item => item.receiveStatus === true).length;
					let list = res.result.list;
					let lastIndex = -1;
					for (let i = list.length - 1; i >= 0; i--) {
						if (list[i].receiveStatus === true) {
							lastIndex = i;
							break;
						}
					}
					this.todayIndex = lastIndex;

				})
			},
			rewardSign() {
				//从未签到过
				if (this.todayIndex === -1) {
					this.$request('sign.addSigninWelfare', {
						memberId: this.memberId,
						sysOrgCode: this.sysOrgCode,
						signInId: this.signList[0].id,
					}).then(res => {
						uni.$u.toast(this.$t('sgin.sginSuccess'))
						this.getSigninManageList();
						this.getMoeny();
					})
				} else if (this.today == this.getSeDate(this.signList[this.todayIndex].updateTime)) {
					uni.$u.toast(this.$t('sgin.sginEnd'))

				} else {
					this.$request('sign.addSigninWelfare', {
						memberId: this.memberId,
						sysOrgCode: this.sysOrgCode,
						signInId: this.signList[this.todayIndex + 1].id,
					}).then(res => {
						uni.$u.toast(this.$t('sgin.sginSuccess'))
						this.getSigninManageList();
						this.getMoeny();
					})
				}
			},
			//获取接口今天几号
			getSeDate(time) {
				let date = new Date(time.replace(" ", "T")); // 兼容格式
				let day = date.getDate();
				return day
			},
			getTodayDate() {
				return new Date().getDate()
			},
			goBtn() {
				this.rewardCover = true
				this.$nextTick(() => {
					this.make();
				})
			},
			closeBtn() {
				this.rewardCover = false
			},
			make() {
				uni.showLoading({
					title: '二维码生成中',
					mask: true
				})
				// console.log(uQRCode,'uQRCode.make')
				uQRCode.make({
					canvasId: 'qrcode',
					text: this.qrcodeText,
					size: this.qrcodeSize,
					margin: 3,
					success(res) {
						console.log(res, 'xx')
					},
					complete: () => {
						uni.hideLoading()
					}

				})
			},
			uniShare() {
				// #ifndef APP-HARMONY
				uniShare.show({
					content: { //公共的分享参数配置  类型（type）、链接（herf）、标题（title）、summary（描述）、imageUrl（缩略图）
						type: 0,
						href: this.qrcodeText,
						title: '邀请好友',
						summary: '好友分享',
					},
					menus: [{
						"img": "/static/app-plus/sharemenu/more.png",
						"text": "系统分享",
						"share": "shareSystem"
					}],
					cancelText: "取消分享",
				}, e => { //callback
					console.log(uniShare.isShow);
					console.log(e);
				})
				// #endif
			}

		}
	}
</script>

<style lang="scss" scoped>
	.app-container {
		padding: 80rpx 40rpx;
		background: #000;
		background-image: url('/static/images/navbar-bg.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		min-height: 100vh;

		.reward_t {
			font-family: Inter, Inter;
			font-weight: bold;
			font-size: 36rpx;
			color: #D1D1D1;
			// margin-top: 20rpx;
			line-height: 70rpx;

			span {
				font-family: Inter, Inter;
				font-weight: bold;
				font-size: 40rpx;
				color: #FFCD03;
			}
		}

		.reward_list {
			padding: 20rpx;
			margin-top: 30rpx;
			position: relative;
			width: 100%;
			// height: 680rpx;
			background-image: url('/static/images/Frame1000001530.png');
			background-repeat: no-repeat;
			background-size: 100% 100%;

			.goldImg {
				position: absolute;
				z-index: 9;
				right: 0;
				top: -100rpx;
				width: 195rpx;
				height: 184rpx;
			}

			.reward_list_t {
				padding: 0 30rpx;
				line-height: 90rpx;
				font-family: Inter, Inter;
				font-weight: 400;
				font-size: 26rpx;
				color: #D1D1D1;

				span {
					font-size: 32rpx;
					color: #FFCD03;
					margin-left: 20rpx;
				}
			}

			.reward_lists {
				width: 100%;
				float: left;
				height: 415rpx;
				margin-bottom: 20rpx;

				.reward_list_info {
					float: left;
					width: 21%;
					margin: 0 2%;
					margin-bottom: 20rpx;

					view {
						float: left;
						width: 100%;
						height: 143rpx;
						border: 2rpx solid #383838;
						background: #383838;
						border-radius: 16rpx;
						text-align: center;

						image {
							width: 62rpx;
							height: 59rpx;
							margin-top: 30rpx;
							margin-left: 50%;
							margin-left: 40rpx;
						}

						span {
							font-family: Inter, Inter;
							font-weight: 400;
							font-size: 28rpx;
							color: #FFCD03;
						}
					}

					.reward_list_info_t {
						margin-top: 20rpx;
						width: 100%;
						float: left;
						text-align: center;
						font-family: Inter, Inter;
						font-weight: 400;
						font-size: 26rpx;
						color: #D1D1D1;
					}
				}

				.reward_list_info.end {
					view {
						background: rgba(255, 205, 3, 0.2);
						border-radius: 16rpx;
						border: 2rpx solid #FFCD03;

						span {
							color: #D1D1D1;
						}
					}
				}

				.reward_list_info.on {
					.reward_list_info_t {
						color: #FFCD03;
					}
				}
			}

			.reward-btn {
				margin-top: 20rpx;
				margin-bottom: 20rpx;
				height: 88rpx;
				background: linear-gradient(90deg, #3EF2FF 0%, #FFE23E 100%);
				border-radius: 94rpx;
				font-family: Inter, Inter;
				font-weight: 400;
				font-size: 27rpx;
				color: #000000;
			}
		}

		.invite {
			width: 100%;
			float: left;
			padding-bottom: 180rpx;

			.invite_t {
				width: 100%;
				float: left;
				line-height: 60rpx;
				font-family: Inter, Inter;
				font-weight: 400;
				font-size: 28rpx;
				margin-top: 30rpx;
				color: #FFFFFF;
			}

			.invite_info {
				width: 100%;
				height: 141rpx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				background: linear-gradient(185deg, #262626 0%, #252525 100%);
				border-radius: 20rpx;
				border: 2rpx solid;
				border-image: linear-gradient(135deg, rgba(233, 233, 233, 0.2), rgba(233, 233, 233, 1), rgba(233, 233, 233, 0.2)) 1 1;

				.invite_infos {
					width: 70%;

					.invite_info_img {
						float: left;
						margin-left: 32rpx;
						margin-top: 27rpx;
						width: 88rpx;
						height: 88rpx;
					}

					.invite_info_left {
						margin-left: 130rpx;
						line-height: 26rpx;
						margin-top: 30rpx;
						font-family: Inter, Inter;
						font-weight: 400;
						font-size: 28rpx;
						color: #FFFFFF;

						image {
							width: 36rpx;
							height: 34rpx;
							float: left;
						}

						span {
							font-family: Inter, Inter;
							font-weight: 400;
							font-size: 26rpx;
							margin: 0 10rpx;
							color: #FFCD03;
						}

						i {
							font-style: normal;
							font-family: Inter, Inter;
							font-weight: 400;
							font-size: 26rpx;
							color: #999999;
						}
					}
				}

				.invite-btn {
					width: 106rpx;
					height: 65rpx;
					text-align: center;
					font-family: Inter, Inter;
					font-weight: bold;
					font-size: 27rpx;
					color: #000000;
					margin-top: 38rpx;
					margin-right: 36rpx;
					line-height: 65rpx;
					background: linear-gradient(90deg, #3EF2FF 0%, #FFE23E 100%);
					border-radius: 94rpx;
				}
			}
		}

		.rewardCover {
			width: 100%;
			height: 100%;
			position: fixed;
			z-index: 99999;
			left: 0;
			top: 0;
			bottom: 0;
			background-color: #000;
			background-image: url(/static/images/yqpy.png);
			background-repeat: no-repeat;
			background-size: cover;
			background-position: center center;

			.returnBtn {
				position: fixed;
				z-index: 999999;
				left: 34rpx;
				top: 34rpx;
				font-size: 50rpx;
				color: #fff;
				font-family: 宋体;
			}

			.rewardCover_t {
				width: 100%;
				float: left;
				text-align: center;
				margin-top: 188rpx;
				margin-bottom: 70rpx;
				font-family: Inter, Inter;
				font-weight: bold;
				font-size: 40rpx;
				color: #FFCD03;
			}

			.rewardCover_info {
				position: relative;
				width: 100%;
				float: left;
				height: 942rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				background-image: url('/static/images/Frame1000001593.png');
				background-repeat: no-repeat;
				background-size: auto 100%;
				background-position: center bottom;

				.rewardCover_info_img {
					width: 300rpx;
					height: 300rpx;
					position: absolute;
					z-index: 9;
					right: 1%;
					top: -180rpx;
				}

				.rewardCover_info_t {
					margin-top: 100rpx;
					display: flex;
					flex-direction: row;
					margin-bottom: 30rpx;
					font-family: Inter, Inter;
					font-weight: 400;
					font-size: 24rpx;
					line-height: 50rpx;
					color: #333333;

					image {
						width: 100rpx;
						height: 100rpx;
						border-radius: 50%;
						margin-right: 24rpx;
					}

					view {
						span {
							font-family: Inter, Inter;
							font-weight: bold;
							font-size: 30rpx;
							color: #333333;
						}
					}
				}

				.QR_code {
					width: 168rpx;
					height: 168rpx;
				}
			}

			.rewardCover_bottom {
				margin-top: 50rpx;
				width: 100%;
				float: left;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-family: Inter, Inter;
				font-weight: 400;
				font-size: 24rpx;
				color: #D1D1D1;

				image {
					width: 88rpx;
					height: 88rpx;
					margin-bottom: 32rpx;
				}
			}
		}
	}
	.reward_tips{
		margin-top: 70rpx;
		padding: 15rpx 10rpx 0 10rpx;
		width: 450rpx;
		height: 100rpx;
		font-size: 22rpx;
		color: #666;
		background-image: url('/static/images/msg.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}
</style>