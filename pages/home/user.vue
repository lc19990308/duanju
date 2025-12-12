<template>
	<view class="page_content">
		<view class="infoBox">
			<view class="userinfo_box" v-if="userInfoStore">
				<view class="avatar">
					<image class="image" v-if="avatar" :src="avatar" mode="aspectFill"></image>
					<image class="image" v-else src="/static/images/avatar.png" mode="aspectFill"></image>
				</view>
				<navigator class="info" url="/pages/user/account/changeUserName" hover-class="none">
					<view class="msg single-line">
						<text class="membername">{{nickname}}</text>
					</view>
					<view class="msg">
						<text class="text" v-if="memberId">ID：{{ memberId || "" }}</text>
					</view>
				</navigator>
				<u-button class="user-btn" @tap="loginOut" v-if='token != ""'>{{$t(`my.get_out`)}}</u-button>
				<u-button class="user-btn" @tap="tologin" v-else>{{$t(`my.login_text`)}}</u-button>
			</view>
			<view class="userinfo_box" v-else>
				<view class="avatar">
					<image class="image" src="/static/images/avatar.png" mode="aspectFill"></image>
				</view>
				<view class="info">
					<view class="nickname">
						<text class="text">{{ memberName }}</text>
					</view>
					<view class="msg"></view>
				</view>
			</view>
		</view>
		<view class="main_content">
			<!-- VIP充值 -->
			<view class="integral_box">
				<view class="integral_box_t" @click="recharbtn">
					<view>{{$t(`my.wallet`)}}</view>
					<span>></span>
				</view>
				<view class="integral_box_info">
					<navigator class="right" url="/pages/user/integral/recharge-info" hover-class="none">
						<text class="text">{{$t(`my.gold`)}}</text>
						<text class="text usable">{{
						  balanceData.currency || 0
						}}</text>
					</navigator>
					<navigator class="right" url="/pages/user/integral/recharge-info" hover-class="none">
						<text class="text">{{$t(`my.points`)}}</text>
						<text class="text usables">{{
              balanceData.totalBalance || 0
            }}</text>
					</navigator>

					<view class="left" @click="recharbtn">{{$t(`my.top_up`)}}</view>
				</view>
			</view>
			<view class="vip_card">
				<view class="vip_box">
					<view class="left" @click="openVip">
						<view class="line1">
							<view class="vipBox">
								<image src="/static/images/Frame-39.png" mode="aspectFill"></image>
								<view>
									<span>{{$t(`my.open_member`)}}</span><br />{{$t(`my.mebmer_tips`)}}
								</view>
							</view>
						</view>
						<view class="line2">
							<image src="/static/images/Frame1000001522-1.png" class="arrowRight" mode="aspectFill">
							</image>
						</view>
					</view>
				</view>
			</view>
			<view class="moinublock">
				<view class="oinuntlist" @click="menuItemClicks">
					<view> {{$t(`my.history`)}} </view>
				</view>
				<view class="list" v-if="mounList.length">
					<u-scroll-list :indicator="false" @right="handleToRight" :indicatorActiveColor="'#f2f5f7'">
						<view v-for="(item, index) in mounList" :key="index" style="position: relative"
							@click="abunbtn(item)">
							<image class="img" :src="item.dramaPoster"></image>
							<view class="title">
								<u--text :lines="1" size="24rpx" color="#fff" align="left"
									:text="item.dramaName"></u--text>
								<u--text :lines="1" size="24rpx" color="#6f6f6f" align="left"
									:text="item.dramaName"></u--text>
							</view>
						</view>
					</u-scroll-list>
				</view>
				<view class="menu_box">
					<view class="item" v-for="(item, index) in menuList" :key="item.id" @click="menuItemClick(item)">
						<view class="left">
							<view class="icon">
								<image class="image" :src="item.img" :style="{ width: item.width }" mode="widthFix">
								</image>
							</view>
							<view class="text">{{$t(`${item.text}`)}}</view>
						</view>
						<view class="right">
							<u-icon name="arrow-right" color="#fff" size="12" :bold="true"></u-icon>
						</view>
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
		</view>
	</view>
</template>

<script>
	import apiMoen from "../../utils/config.js";
	import {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} from "vuex";
	export default {
		data() {
			return {
				nickname: "",
				tenantId: null,
				sysOrgCode: null,
				memberId: uni.getStorageSync("id"),
				memberName: null,
				buttonStyle: {
					width: "100%",
					height: "100%",
					border: "none",
					// fontSize: '24rpx',
					color: "#DF9B45",
					background: "#fff",
					borderRadius: "8rpx",
					fontWeight: "bold",
				},
				menuList: [{
						id: 1,
						img: "/static/images/Frame-34.png",
						width: "32rpx",
						text: "my.invite", //邀请好友
						rid: "",
						path: "/pages/home/watchs",
					},
					{
						id: 2,
						img: "/static/images/Frame-32.png",
						width: "28rpx",
						text: "my.collection", //我的收藏
						rid: "",
						path: "/pages/home/collect",
					},
					{
						id: 3,
						img: "/static/images/Frame-36.png",
						width: "28rpx",
						text: "my.language", //语言
						rid: "",
						path: "/pages/user/seting/setLanguage",
					},
					{
						id: 4,
						img: "/static/images/Frame-35.png",
						width: "28rpx",
						text: "my.team", //我的团队
						rid: "",
						path: "/pages/user/share/team",
					},
					{
						id: 5,
						img: "/static/images/Frame-37.png",
						width: "28rpx",
						text: "my.contact_us", //客服
						rid: "",
						path: "/pages/user/seting/opinion",
					},
					{
						id: 6,
						img: "/static/images/Frame-38.png",
						width: "32rpx",
						text: "my.set", //联系我们
						rid: "",
						path: "/pages/user/seting/seting",
					},
					{
						id: 7,
						img: "/static/images/Frame-30.png",
						width: "32rpx",
						text: "my.creation", //联系我们
						rid: "",
						path: "/pages/user/framer/index",
					},
				],
				copyrightData: this.$store.state.app.copyright || [], // 版权说明
				platform: this.$utils.platforms(),
				configStore: this.$store.state.app.config,
				userInfoStore: {},
				debug: {
					count: 0,
					timer: null,
				},
				cdkey: {
					show: false,
					title: "卡密兑换",
					value: "",
				},
				VipListmu: {},
				inputStyle: {},
				platform: "",
				videoList: [],
				mounList: [],
				avatar: '',
				balanceData: {
					currency: '',
					totalBalance: '',
				},
				id: uni.getStorageSync("id"),
			};
		},
		computed: {
			...mapGetters("user", ["token", "userInfo"]),
			...mapGetters("app", ["config", "copyright", "richtext", "iosIsPay"]),
		},
		watch: {
			config: {
				deep: true,
				handler: function(newValue, oldValue) {
					this.configStore = newValue;
				},
			},
			userInfo: {
				deep: true,
				handler: function(newValue, oldValue) {
					// this.userInfoStore = newValue
				},
			},
			copyright(newValue, oldValue) {
				this.copyrightData = newValue;
			},
			richtext(newValue, oldValue) {
				newValue && this.initMenuList(newValue);
			},
		},
		onLoad() {
			this.tenantId = apiMoen.tenantId;
			this.sysOrgCode = apiMoen.sysOrgCode;
			this.handleTovideoList();
			this.richtext && this.initMenuList(this.richtext);
		},
		onShow() {
			this.memberId = uni.getStorageSync("id");
			console.log(this.memberId,'memberId')
			this.setTab();
			this.getIntegral();
			this.getUserInfo();
		},
		onUnload() {
			uni.$off("updateUserInfo");
		},
		methods: {
			...mapActions("user", ["getUserInfo", 'logout']),
			//获取货币信息
			getIntegral() {
				this.$request('withdraw.getBalance', {
					memberId: this.memberId
				}).then(res => {
					this.balanceData = res.result;
				})
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
			tologin() {
				uni.redirectTo({
					url: '/pages/login/login'
				})
			},
			async loginOut() {
				const [res, model] = await uni.showModal({
					title: this.$t('model_box.tip'),
					content: this.$t('model_box.logout_confirm'),
					confirmText: this.$t('model_box.confirm'),
					cancelText: this.$t('model_box.cancel'),
				})
				if (model.confirm) {
					this.logout();
					setTimeout(() => {
						uni.removeStorageSync('accountNumber')
						uni.removeStorageSync('vuex')
						uni.removeStorageSync('id')
						uni.removeStorageSync('tenantId')
						uni.removeStorageSync('sysOrgCode')
						uni.removeStorageSync('memberId')
						uni.removeStorageSync('bindMemberId')
						uni.redirectTo({
							url: '/pages/login/login'
						})
					}, 500)
				}
			},

			getUserInfo() {
				this.$request('user.getUserInfo').then(res => {
					const result = res.result.userInfo;
					this.nickname = result.realname;
					this.avatar = result.avatar;
					this.handleToFilmDramaMember();
					this.handleToFilmViewHistoryList();
				})
			},
			recharbtn() {
				uni.navigateTo({
					url: "../user/recharge/recharge",
				});
			},
			menuItemClick(val) {
				uni.navigateTo({
					url: val.path,
				});
			},
			menuItemClicks() {
				uni.navigateTo({
					url: "/pages/home/history",
				});
			},
			abunbtn(item) {
				uni.navigateTo({
					url: `/pages/video/testVideoInfo?dramaId=${item.dramaId}`
				})
			},
			// 复制
			copyText(info) {
				uni.setClipboardData({
					data: String(info),
					success: () => {
						uni.$u.toast(this.$t('toast.msg_copy_success'))
					},
				});
			},
			// 充值会员中心
			openVip() {
				uni.navigateTo({
					url: "/pages/user/activate/activate",
				});
			},
			//功能列表
			handleTovideoList() {
				this.$request("wchatapi.allocatFunctionList", {
						tenantId: this.tenantId,
						sysOrgCode: this.sysOrgCode,
					})
					.then((res) => {
						if (res.code == 200) {
							this.videoList = res.result.map((it) => ({
								id: it.id,
								img: it.functionLogo,
								width: "28rpx",
								text: it.functionName,
								url: it.functionUrl,
								functionStatus: it.functionStatus,
							}));
						}
					})
			},
			//会员信息
			handleToFilmDramaMember() {
				this.$request("wchatapi.filmDramaMember", {
						id: this.memberId,
					})
					.then((res) => {
						if (res.code == 200) {
							this.memberName = res.result.memberName;
							this.VipListmu = res.result;
							this.userInfoStore = res.result;
						}
					})
			},
			//历史记录
			handleToFilmViewHistoryList() {
				this.$request("wchatapi.filmViewHistoryList", {
						memberId: this.memberId,
						pageNo: 1,
						pageSize: 10,
					})
					.then((res) => {
						if (res.code == 200) {
							this.mounList = res.result.records;
						}
					})
					.catch((res) => {
						console.log(res);
					});
			},
			//向左滑触发right
			handleToRight() {
				console.log("11111111111111111111111");
			},
		},
	};
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
		background-image: url('/static/images/navbar-bg.png');
		background-position: center center;
		background-repeat: no-repeat;
		background-size: 100% 100%;

		.infoBox {
			position: relative;
			padding-left: 36rpx;
			padding-top: 80rpx;

			.imagess {
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

					.imageloog {
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
						.membername {
							width: 300rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
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
							color: #5e5e5e;
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
					color: #ffcd03;
					border: 2rpx solid #ffcd03;
				}
			}
		}

		.main_content {
			.vip_card {
				margin: 0 40rpx;
				margin-top: 24rpx;
				position: relative;
				background: linear-gradient(220deg,
						#181818 0%,
						#545454 50%,
						#252525 100%);
				border-radius: 20rpx;
				border: 2rpx solid;
				border-image: linear-gradient(135deg,
						rgba(255, 237, 192, 0.2),
						rgba(255, 237, 192, 1),
						rgba(255, 237, 192, 0.2)) 1 1;

				.imagssl {
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
							display: flex;
							align-items: center;
							justify-content: center;

							.vipBox {
								display: flex;
								align-items: center;
								justify-content: center;

								view {
									flex: 1;
									font-family: Inter, Inter;
									font-weight: 400;
									font-size: 26rpx;
									line-height: 44rpx;
									color: #999999;

									span {
										font-family: Inter, Inter;
										font-weight: 400;
										font-size: 28rpx;
										color: #ffcd03;
									}
								}

								image {
									margin-right: 30rpx;
									width: 97rpx;
									height: 97rpx;
								}
							}

							.backgLogo {
								width: 30rpx;
								height: 40rpx;
							}

							.kaitong {
								font-size: 24rpx;
								margin-left: 124rpx;
								padding: 0 16rpx;
								background-color: #fde1cb;
								color: #62472a;
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
							justify-content: center;
							color: #fff;

							.arrowRight {
								width: 54rpx;
								height: 54rpx;
							}

							// ::v-deep .u-icon {
							// 	margin-top: 6rpx;
							// }
						}
					}

					.right {
						// width: 156rpx;
						// height: 60rpx;
					}
				}
			}

			.integral_box {
				height: 260rpx;
				display: flex;
				flex-direction: column;
				color: #fff;
				background-image: url(/static/images/Frame1000001530-1.png);
				background-repeat: no-repeat;
				background-size: 100% 100%;
				padding: 0 24rpx;
				font-size: 28rpx;
				font-weight: 600;
				border-radius: 8rpx;
				margin: 0rpx 40rpx;
				margin-top: 20rpx;

				.integral_box_t {
					height: 100rpx;
					line-height: 100rpx;
					padding-top: 20rpx;
					border-bottom: 2rpx solid #fff;
					margin-bottom: 40rpx;
					font-family: Inter, Inter;
					font-weight: 400;
					font-size: 28rpx;
					color: #ffffff;
					display: flex;
					justify-content: space-between;
					align-items: center;

					span {
						font-family: 宋体;
					}
				}

				.integral_box_info {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.left {
						width: 171rpx;
						height: 65rpx;
						background: #dbb006;
						border-radius: 94rpx;
						line-height: 65rpx;
						text-align: center;
						font-family: Inter, Inter;
						font-weight: bold;
						font-size: 27rpx;
						color: #000000;
					}

					.right {
						display: flex;
						flex-direction: column;
						align-items: center;

						.image {
							width: 30rpx;
							margin-right: 8rpx;
							margin-left: 12rpx;
						}

						.text {
							font-family: Inter, Inter;
							font-weight: 400;
							font-size: 26rpx;
							color: #ffffff;
						}

						.usable {
							margin-left: 12rpx;
							margin-right: 8rpx;
							font-family: Inter, Inter;
							font-weight: 400;
							font-size: 36rpx;
							background-image: url(/static/images/image73.png);
							background-position: left center;
							background-repeat: no-repeat;
							padding-left: 40rpx;
							background-size: 28rpx 27rpx;
							color: #ffcd03;
						}

						.usables {
							margin-left: 12rpx;
							margin-right: 8rpx;
							font-family: Inter, Inter;
							font-weight: 400;
							font-size: 36rpx;
							background-image: url(/static/images/diamond.png);
							background-position: left center;
							background-repeat: no-repeat;
							padding-left: 40rpx;
							background-size: 32rpx 30rpx;
							color: #ffcd03;
						}
					}
				}
			}

			.oinuntlist {
				font-size: 28rpx;
				background-image: url(/static/images/Frame-33.png);
				background-position: left center;
				padding-left: 80rpx;
				background-repeat: no-repeat;
				background-size: 30rpx 30rpx;
				font-weight: 800;
				color: #fff;
				position: relative;
				display: flex;
				justify-content: space-between;
				line-height: 100rpx;

				image {
					width: 26rpx;
					height: 26rpx;
					position: absolute;
					top: 50%;
					right: 0;
					transform: translateY(-50%);
				}

				span {
					font-family: 宋体;
					font-size: 30rpx;
				}
			}

			.moinublock {
				border-radius: 8rpx;
				padding: 36rpx 40rpx 0 40rpx;
				background: transparent;
				margin-top: 24rpx;
				margin: 30rpx 32rpx;
				background: linear-gradient(185deg, #262626 0%, #252525 100%);
				border: 0rpx solid;
				border-image: linear-gradient(135deg,
						rgba(233, 233, 233, 0.2),
						rgba(233, 233, 233, 1),
						rgba(233, 233, 233, 0.2)) 1 1;
				border-radius: 20rpx;

				.list {
					margin-top: 15rpx;
				}

				.img {
					width: 164rpx;
					height: 218rpx;
					border-radius: 12rpx;
					margin-right: 40rpx;
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
				padding: 30rpx 0rpx;
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
						background: #c78021;
						padding: 8rpx 20rpx;
						border-radius: 10rpx;
					}
				}
			}
		}
	}

	.single-line {
		width: 240rpx;
		white-space: nowrap;
		/* 不换行 */
		overflow: hidden;
		/* 溢出部分裁掉 */
		color: #ff;
		text-overflow: ellipsis;
		/* 用 … 代替被裁部分 */
	}
</style>