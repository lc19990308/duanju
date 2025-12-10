<template>
	<view class="centert-lsty">
		<u-navbar :title="$t(`store.page_title`)" :autoBack="true" :fixed='true' :placeholder='true' bgColor='transparent'
			:titleStyle='titleStyle' leftIconColor='#fff'>
		</u-navbar>
		<view class="mon-list">
			<view class="rechargeView_title">
				<span>{{$t(`store.balance`)}}: {{balanceData.totalBalance}} {{$t(`store.balance_unit`)}}</span>
			</view>
			<view class="rechargeView_list">
				<view class="rechargeView_lists top3" v-for="(item,index) in goldList"
					@click="handleToActive(index,item)" :key="index">
					<view class="rechargeView_top">{{item.actualReceipt}} {{$t(`store.balance_unit`)}}</view>
					<view class="rechargeView_cen">+{{item.rechargeCoins}} {{$t(`store.balance_unit`)}}</view>
					<view class="rechargeView_bottom">{{$t('currency')}}{{item.packageMoney}}</view>
				</view>
			</view>
		</view>
		<view class="act_prompt">
			{{$t(`store.page_tips`)}}
		</view>
	</view>
</template>

<script>
	import apiMoen from '../../../utils/config.js';
	import WenTag from '../../../components/tag-select/tag-select.vue'
	import config from '@/utils/config.js'
	export default {
		components: {
			WenTag
		},
		data() {
			return {
				goldList: [],
				width: '320rpx',
				money: '',
				tenantId: null,
				sysOrgCode: null,
				activeIndex: 0,
				activeIndexPay: 0,
				allocatRechargeList: {},
				userCode: '',
				falishui: {},
				openid: 'ogvdF6U0Z36PmXdEg7QQEO6Tfh1w',
				memberId: uni.getStorageSync('memberId') || '',
				id:uni.getStorageSync('id') || '',
				titleStyle: {
					color: '#fff',
					fontFamily: 'PingFang SC, PingFang SC',
					fontWeight: 800,
					color: '#FFFFFF',
				},
				totalPrice:0,
				balanceData:{
					currency: '',
					totalBalance: '',
				},
			};
		},
		onLoad() {
			this.tenantId = apiMoen.tenantId
			this.sysOrgCode = apiMoen.sysOrgCode
			this.getRechargePackageList(this.tenantId, this.sysOrgCode)
			this.filmDramaMember();
			this.getIntegral();
		},
		methods: {
			// 查询会员信息
			filmDramaMember() {
				var data = {
					memberId: this.memberId,
				}
				// return 
				this.$request('player.filmDramaMember', data).then(res => {
					this.falishui = res.result
				})
			},
			// 账户充值套餐列表
			getRechargePackageList(tenantId, sysOrgCode) {
				console.log('套餐查询参数',{
					tenantId,
					sysOrgCode,
					memberId: this.id,
				})
				this.$request('wchatapi.rechargePackageList', {
					tenantId,
					sysOrgCode,
					memberId: this.id,
				}).then(res => {
					if (res.code == 200) {
						this.goldList = res.result.list;
						this.totalPrice = res.result.totalPrice;
					}
				}).catch(res => {
					console.log(res);
				})
			},
			// 充值支付
			handleToActive(index, item) {
				this.activeIndex = index;
				this.money = item.money
			},

			handleToactivePay(index, item) {
				// console.log(index);
				// console.log(this.width);
			},
			getIntegral() {
				this.$request('withdraw.getBalance', {
					memberId: this.id
				}).then(res => {
					this.balanceData = res.result;
				})
			},
		}
	}
</script>

<style lang="scss" scoped>

	.act_prompt {
		margin-top: 25rpx;
		padding: 20rpx 40rpx;
		font-family: Inter, Inter;
		font-weight: 400;
		font-size: 24rpx;
		line-height: 44rpx;
		color: #D1D1D1;

		.pro_title {
			color: #333;
			margin-bottom: 25rpx;
			font-size: 28rpx;
		}

		.text {
			font-size: 24rpx;
			color: #999;
			margin-bottom: 12rpx;
			display: flex;
		}

		.tt {
			// font-weight: bold;
			color: $uni-color-error;
		}
	}

	.centert-lsty {
		width: 100%;
		height: 100vh;
		box-sizing: border-box;
		position: relative;
		background-image: url('/static/images/navbar-bg.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;

		.c-top {
			padding: 0 20rpx;
			box-sizing: border-box;
			width: 100%;
			height: 88rpx;
			line-height: 88rpx;
			// display: flex;
			// justify-content: space-between;
			text-align: center;
			background-color: rgba(253, 234, 240, 1);

			view {
				font-size: 28rpx;
				color: rgba(121, 121, 121, 1);
			}

			.color-az {
				font-weight: bold;
				color: $uni-color-error;
			}
		}

		.c-yminsoer {
			width: 100%;
			padding: 0 24rpx;
			box-sizing: border-box;

			.solonun {
				margin-top: 24rpx;
				font-size: 36rpx;
				color: $uni-color-error;
				font-weight: bold;
			}

			.moinun {
				margin-top: 24rpx;
				font-size: 28rpx;

				span {
					color: $uni-color-error;
					font-weight: bold;
					margin: 0 6rpx;
				}
			}
		}

		.mon-list {
			width: 100%;
			padding: 0 24rpx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			margin-top: 0rpx;
			// display: grid;
			grid-gap: 24rpx 24rpx;
			grid-template-columns: 1fr 1fr;
			justify-content: space-between;

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
						background: linear-gradient(180deg, #EDC267 0%, #60D2FF 100%);
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
					background: linear-gradient(186deg, rgba(255, 224, 157, 0.4) 0%, rgba(237, 194, 103, 0) 100%);
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
					background: linear-gradient(186deg, rgba(255, 148, 122, 0.4) 0%, rgba(255, 148, 122, 0) 100%);
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

			.moinuns-view {
				// width: 320rpx;
				// height: 140rpx;
				padding: 20rpx;
				border-radius: 18rpx;
				border: 1rpx solid $uni-color-bgc;
				// margin-bottom: 14rpx;

				.mv-two {
					width: 100%;
					color: rgba(121, 121, 121, 1);
					font-size: 26rpx;
					margin-top: 4rpx;
				}

				.mv-ones {
					width: 100%;
					display: flex;

					span {
						font-size: 30rpx;
						font-weight: bold;
						margin-right: 6rpx;
					}

					.coloir {
						margin-left: 6rpx;
						line-height: 50rpx;
						color: #999;
						font-size: 24rpx;

					}
				}
			}

			.m-ativoe {
				background-color: rgba(253, 234, 240, 1);
				border: 1rpx solid $uni-color-error;
			}
		}

		.moinunstile {
			width: 100%;
			padding: 0 24rpx;
			font-size: 28rpx;
			box-sizing: border-box;
			color: #666;
			margin-top: 14rpx;
		}

		.moinunsdiv {
			width: 100%;
			margin-top: 24rpx;
			padding: 0 24rpx;
			box-sizing: border-box;

			.ouinmino {
				width: 280rpx;
				height: 100rpx;
				display: flex;
				// padding:  18rpx;
				border-radius: 8rpx;
				border: 1rpx solid $uni-color-error;
				padding: 20rpx 50rpx;
				box-sizing: border-box;

				image {
					width: 60rpx;
					height: 60rpx;
				}

				view {
					font-size: 28rpx;
					line-height: 54rpx;
				}
			}
		}

		.moninsun-button {
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			color: $uni-color-error;
			font-size: 30rpx;
			background-color: rgba(253, 234, 240, 1);
		}
	}
</style>