<!--我的钱包-->
<template>
	<view class="app-container">
		<statusBar />
		<u-navbar :title="$t(`wallet.page_title`)" :fixed='false' :autoBack="true" bgColor='transparent' :titleStyle='titleStyle'
			leftIconColor='#fff' :placeholder='true' />
		<view class="wallet">
			<view class="wallet-row">
				<view class="wallet-item">
					<image class="wallet-item-icon" src="/static/images/gold.png" mode=""></image>
					<text class="wallet-value">{{info.totalBalance}}</text>
				</view>
				<view class="wallet-item">
					<image class="wallet-item-icon" src="/static/images/diamond.png" mode=""></image>
					<text class="wallet-value">{{info.currency}}</text>
				</view>
			</view>
			<view class="action">
				<navigator class="action-item" hover-class="none" url="/pages/user/recharge/recharge">
					<image class="action-item-icon" src="/static/images/Frame-40.png" mode=""></image>
					<text class="action-item-value">{{$t(`wallet.wallet_icon`)}}</text>
				</navigator>
				<navigator class="action-item" hover-class="none" url="/pages/user/integral/integal-conversion">
					<image class="action-item-icon" src="/static/images/Frame-41.png" mode=""></image>
					<text class="action-item-value">{{$t(`wallet.exchange`)}}</text>
				</navigator>
			</view>
		</view>
		<view class="tabs">
			<view class="tabs-item" :class="current === 0 ? 'tabs-item_active':'' " @tap="tabChange(0)">
				{{$t(`wallet.gold_title`)}}
			</view>
			<view class="tabs-item" :class="current === 1 ? 'tabs-item_active':'' " @tap="tabChange(1)">
				{{$t(`wallet.info_title`)}}
			</view>
		</view>
		<view class="list" v-if="current === 1">
			<view class="list-item" v-for="(item,index) in list" :key="index">
				<view class="item-row">
					<view class="label"> {{item.payMethod}} </view>
					<view class="value">¥{{item.unrealMoney}}</view>
				</view>
				<view class="item-row">
					<view class="time">{{item.createTime}}</view>
				</view>
			</view>
		</view>
		<view class="list" v-else>
			<view class="list-item" v-for="(item,index) in list" :key="index">
				<view class="item-row">
					<view class="label">{{$t(`wallet.unlocked`)}} {{item.dramaName}} {{item.dramaSeriesName}}</view>
					<view class="value">-{{item.payMoney}} {{$t(`wallet.unit`)}}</view>
				</view>
				<view class="item-row">
					<view class="time">{{item.createTime}}</view>
				</view>
			</view>
		</view>
		<u-loadmore :status="status" />
	</view>
</template>

<script>
	import {
		mapState,
	} from "vuex"
	export default {
		data() {
			return {
				titleStyle: {
					color: '#fff',
					fontFamily: 'PingFang SC, PingFang SC',
					fontWeight: 800,
					color: '#FFFFFF',
				},
				memberId:uni.getStorageSync('memberId') || '',
				info: {
					currency: 0,
					totalBalance: 0,
				},
				query: {
					sysOrgCode: 'A03A01',
					pageNo: 1,
					pageSize: 10,
				},
				list: [],
				status: 'loadmore',
				total: 0,
				current: 0,
			}
		},
		computed: {
			...mapState('user', ['userInfo']),
		},
		methods: {
			getIntegral() {
				this.$request('withdraw.getBalance', {
					memberId: this.memberId
				}).then(res => {
					this.info = res.result;
				})
			},
			//明细列表
			getIntegralList() {
				this.status = 'loading';
				this.$request('withdraw.rechargeDetailList', {
					...this.query,
					memberId: this.memberId
				}).then(res => {
					this.total = res.result.total;
					this.list = this.list.concat(res.result.records);
					uni.stopPullDownRefresh();
					if (this.total === this.list.length) {
						this.status = 'nomore'
					} else {
						this.status = 'loadmore'
					}
				})
			},
			//钱包明细列表
			getWalletInfoList() {
				this.$request('withdraw.consumptionDetailList', {
					pageNo: this.query.pageNo,
					pageSize: this.query.pageSize,
					memberId: this.memberId
				}).then(res => {
					this.total = res.result.total;
					this.list = this.list.concat(res.result.records);
					uni.stopPullDownRefresh();
					if (this.total === this.list.length) {
						this.status = 'nomore'
					} else {
						this.status = 'loadmore'
					}
				})
			},
			resetQuery() {
				this.query.pageNo = 1;
				this.list = [];
			},
			tabChange(val) {
				this.resetQuery();
				this.current = val;
				switch (this.current) {
					case 0:
						this.getWalletInfoList();
						break;
					case 1:
						this.getIntegralList();
						break;
				}
			},
			getList(){
				switch (this.current) {
					case 0:
						this.getWalletInfoList();
						break;
					case 1:
						this.getIntegralList();
						break
				}
			},
		},
		onLoad() {
			this.getIntegral();
			this.getList();
		},
		
		onPullDownRefresh() {
			this.resetQuery();
			this.getList();
		},
		onReachBottom() {
			console.log(this.list.length < this.total,'this.list.length < this.total')
			if (this.list.length < this.total) {
				this.query.pageNo += 1;
				this.getList();
			}
		},
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #000;

	}

	.app-container {
		min-height: 100vh;
		background-image: url('/static/images/navbar-bg.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-position: 100% 100%;
	}

	.wallet {
		margin: 18rpx auto 0 auto;
		padding: 36rpx;
		box-sizing: border-box;
		width: 678rpx;
		background: linear-gradient(220deg, #181818 0%, #545454 50%, #252525 100%);
		border-radius: 16px 16px 16px 16px;
		border: 2rpx solid #eee;

		.wallet-row {
			display: flex;
			padding-bottom: 36rpx;
			border-bottom: 1px solid #5E5E5E;

			.wallet-item {
				display: flex;
				align-items: center;
				flex: 1;

				.wallet-item-icon {
					width: 42rpx;
					height: 42rpx;
				}

				.wallet-value {
					margin-left: 21rpx;
					font-family: Inter, Inter;
					font-weight: 400;
					font-size: 36rpx;
					color: #FFCD03;
				}
			}
		}

		.action {
			display: flex;
			padding-top: 19rpx;

			.action-item {
				display: flex;
				align-items: center;
				flex: 1;

				.action-item-icon {
					width: 32rpx;
					height: 32rpx;
				}

				.action-item-value {
					font-family: Inter, Inter;
					font-weight: 400;
					font-size: 26rpx;
					color: #D1D1D1;
					margin-left: 21rpx;
				}
			}
		}
	}

	.tabs {
		display: flex;
		position: sticky;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 999;
		padding: 0 36rpx;
		margin-top: 16rpx;
	}

	.tabs-item {
		flex: 1;
		text-align: center;
		width: 205px;
		height: 88rpx;
		line-height: 88rpx;
		font-family: Inter, Inter;
		font-weight: 400;
		font-size: 32rpx;
		color: #999999;
	}

	.tabs-item_active {
		color: #fff;
	}

	.list-item {
		width: 678rpx;
		margin: 16rpx auto 0 auto;
		background: #2F2D34;
		box-sizing: border-box;
		padding: 26rpx 24rpx;
		border-radius: 20rpx;
		box-shadow: 2rpx 2rpx 2rpx #2F2D34;

		.item-row {
			margin-top: 17rpx;
			display: flex;
			justify-content: space-between;
			font-family: Inter, Inter;
			font-weight: 400;
			font-size: 30rpx;
			color: #D1D1D1;

			.time {
				font-family: Inter, Inter;
				font-weight: 400;
				font-size: 24rpx;
				color: #A1A0A2;
			}
		}

		.red {
			color: red;
		}
	}
</style>