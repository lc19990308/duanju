<template>
	<view class="page_content">
		<statusBar />
		<u-navbar  :title="$t(`team.page_title`)" :autoBack="true" :fixed='false' :placeholder='true' bgColor='transparent'
			:titleStyle='titleStyle' leftIconColor='#fff'>
		</u-navbar>
		<view class="main_content">
			<scroll-view class="scroll_view" :scroll-y="true" @scrolltolower="scrollBottom">
				<view class="scroll_content">
					<view class="top_card">
						<!-- <view class="text1">{{ info.count }}人</view> -->
						<view class="text2">
							<view class="text2_lie">
								<span>{{ info.count_direct }}</span><br>{{$t(`team.total`)}}
							</view>
							<view class="text2_lie">
								<span>{{ info.count_indirect }}</span><br>{{$t(`team.profit`)}}
							</view>

						</view>
					</view>
					<view class="content_box">
						<view class="title">{{$t(`team.invitation`)}}</view>
						<view class="list_box" v-if="list.length">
							<view class="item" v-for="(item, index) in list" :key="index">
								<view class="left">
									<view class="photo">
										<image class="image" :src="item.avatar" mode="aspectFill"></image>
									</view>
									<view class="info">
										<view class="text1">{{ item.memberName }}</view>
										<view class="text2">{{ item.bindTime }}</view>
									</view>
								</view>
								<view class="right">+{{ item.todayDivideAmount }}</view>
							</view>
						</view>

					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {
					count: 0,
					count_direct: 0,
					count_indirect: 0
				},
				list: [],
				page: 1,
				memberId: uni.getStorageSync('id') || '',
				pagesize: 10,
				titleStyle: {
					color: '#fff',
					fontFamily: 'PingFang SC, PingFang SC',
					fontWeight: 800,
					color: '#FFFFFF',
				},
			}
		},
		onLoad() {
			this.teamList()
		},
		methods: {
			scrollBottom() {
				this.page++
				this.teamList()
			},
			teamList() {
				this.$request('share.teamNum', {
					memberId: this.memberId,
				}).then(res => {
					this.info = {
						count_direct: res.result.totalExtendNumber,
						count_indirect: res.result.todayGiveaway
					}
				})
				this.$request('share.teamNew', {
					memberId: this.memberId,
				}).then(res => {
					this.list = res.result;
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		background: #000000;
		background-image: url('/static/images/navbar-bg.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;

		.main_content {
			overflow: hidden;

			.scroll_view {
				height: 100%;

				.scroll_content {
					padding: 24rpx 40rpx 60rpx 40rpx;
				}
			}

			.top_card {
				height: 220rpx;
				border-radius: 16rpx;
				position: relative;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-weight: bold;
				color: #fff;

				&::before {
					content: "";
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
					background-image: url('~@/static/images/texture.png');
					background-repeat: no-repeat;
					background-size: 100% 100%;
				}

				.text1 {
					font-size: 40rpx;
					margin-bottom: 20rpx;
				}

				.text2 {
					height: 220rpx;
					width: 100%;
					font-size: 32rpx;
					display: flex;
					justify-content: space-between;
					flex-direction: row;

					.text2_lie {
						width: 46%;
						padding-top: 5%;
						text-align: center;
						background: linear-gradient(186deg, rgba(255, 224, 157, 0.4) 0%, rgba(237, 194, 103, 0) 100%);
						border-radius: 16rpx 16rpx 16rpx 16rpx;
						border: 0rpx solid;
						border-image: linear-gradient(199deg, rgba(237, 194, 103, 1), rgba(237, 194, 103, 0.2)) 1 1;

						span {
							color: #EDC267;
						}
					}
				}
			}

			.content_box {
				margin-top: 40rpx;

				.title {
					font-size: 36rpx;
					font-weight: 700;
					color: #fff;
				}

				.list_box {
					.item {
						padding: 40rpx 20rpx;
						margin-top: 24rpx;
						height: 154rpx;
						background: #2B2B2B;
						border-radius: 20rpx 20rpx 20rpx 20rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.left {
							display: flex;
							align-items: center;

							.photo {
								width: 100rpx;
								height: 100rpx;
								border-radius: 20rpx;
								background: #fff;
								box-shadow: 0 0 60rpx 0 rgba(202, 202, 202, 0.3);
								overflow: hidden;
								display: flex;
								align-items: center;
								justify-content: center;

								.image {
									width: 100%;
									height: 100%;
								}
							}

							.info {
								margin-left: 40rpx;

								.text1 {
									font-size: 32rpx;
									font-weight: 700;
									color: #D1D1D1;
									margin-bottom: 12rpx;
								}

								.text2 {
									font-size: 24rpx;
									color: #D1D1D1;
								}
							}
						}

						.right {
							font-size: 32rpx;
							font-weight: 700;
							color: #D1D1D1;
						}
					}
				}

				.be_empty {
					font-size: 28rpx;
					color: #999;
					text-align: center;
					padding: 40rpx 0;
				}
			}
		}
	}
</style>