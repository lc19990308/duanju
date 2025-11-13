<!--积分明细-->
<template>
	<view class="app-container">
		<u-navbar title="Chi tiết" :autoBack="true" bgColor='transparent' :titleStyle='titleStyle' leftIconColor='#fff'
			:placeholder='true' />
		<view class="list">
			<view class="list-item" v-for="(item,index) in list" :key="index">
				<view class="item-row">
					<view class="label">Đổi {{item.currencyQuantity}} điểm</view>
				</view>
				<view class="item-row">
					<view class="time">{{item.createTime}}</view>
					<view class="red value">+{{item.virtualQuantity}} vàng</view>
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
				query: {
					memberId:uni.getStorageSync('memberId') || '',
					sysOrgCode: 'A03A01',
					pageNo: 1,
					pageSize: 10,
				},
				list: [],
				status: 'loadmore',
				total: 0,
			}
		},
		computed: {
			...mapState('user', ['userInfo']),
		},
		methods: {
			//获取积分兑换金币
			getIntegralList() {
				this.status = 'loading';
				this.$request('withdraw.goldCoinExchangeDetailList', this.query).then(res => {
					this.total = res.result.total;
					this.list = this.list.concat(res.result.records);
					uni.stopPullDownRefresh();
					if (this.total === this.list.length) {
						this.status = 'nomore'
					}else{
						this.status = 'loadmore'
					}
				})
			},
			resetQuery() {
				this.query.pageNo = 1;
				this.list = [];
			},
		},
		onLoad() {
			this.getIntegralList();
		},
		onPullDownRefresh() {
			this.resetQuery();
			this.getIntegralList();
		},
		onReachBottom() {
			if (this.list.length < this.total) {
				this.query.pageNo += 1;
				this.getIntegralList();
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
				color: #D1D1D1;
			}
		}

		.red {
			color: red;
		}

		.gray {
			color: #666666;
		}
	}
</style>