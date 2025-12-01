<template>
	<view class="set">
		<statusBar />
		<u-navbar :title="$t(`setting.page_title`)" :autoBack="true" :fixed='true' bgColor='transparent' :titleStyle='titleStyle'
			leftIconColor='#fff' :placeholder='true' />
		<navigator class="user-info" url="/pages/user/account/changeUserName" hover-class="none">
			<view class="left">
				<image class="profile" :src="userInfo.avatar" mode=""></image>
				<view class="nickName">{{userInfo.realname}}</view>
			</view>
			<view class="right">
				<u-icon name="arrow-right" color="#939393" size="15"></u-icon>
			</view>
		</navigator>
		<view class="cell-box">
			<u-cell-group :border="false">
				<u-cell :title="$t(`setting.cell_item1`)" :border="false"
					url='/pages/user/about/detail/detail?id=1791523044515913730'>
					<template slot='value'>
						<u-icon name="arrow-right" color="#939393" size="15"></u-icon>
					</template>
				</u-cell>
				<u-cell :title="$t(`setting.cell_item2`)" :border="false"
					url='/pages/user/about/detail/detail?id=1791523044515913731'>
					<template slot='value'>
						<u-icon name="arrow-right" color="#939393" size="15"></u-icon>
					</template>
				</u-cell>
				<u-cell :title="$t(`setting.cell_item3`)" :border="false" url='/pages/user/seting/opinion'>
					<template slot='value'>
						<u-icon name="arrow-right" color="#939393" size="15"></u-icon>
					</template>
				</u-cell>
				<u-cell :title="$t(`setting.cell_item4`)" :border="false" url='/pages/login/unsubscribe'>
					<template slot='value'>
						<u-icon name="arrow-right" color="#939393" size="15"></u-icon>
					</template>
				</u-cell>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: false,
				titleStyle: {
					color: '#fff',
					fontFamily: 'PingFang SC, PingFang SC',
					fontWeight: 800,
					color: '#FFFFFF',
				},
				customStyle: {
					color: '#fff'
				},
				userInfo: {
					realname: '',
					avatar: '',
				},
			}
		},
		methods: {
			change(e) {
				console.log('change', e);
			},
			login() {
				uni.navigateTo({
					url: '/pages/user/login/login'
				})
				uni.removeStorageSync('id');
			},
			//获取用户信息
			getUserInfo() {
				this.$request('user.getUserInfo').then(res => {
					const userInfo = res.result.userInfo;
					this.userInfo = {
						realname: userInfo.realname,
						avatar: userInfo.avatar,
					}
				})
			},
		},
		onLoad() {
			this.getUserInfo();
		}
	}
</script>

<style lang="scss" scoped>
	.set {
		background-color: #000;
		background-image: url('/static/images/navbar-bg.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-position: 100% 100%;
		min-height: 100vh;
	}

	::v-deep .u-cell__title-text {
		color: #fff;
	}

	.user-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 678rpx;
		height: 89rpx;
		border-radius: 20rpx;
		margin: 100rpx auto 36rpx auto;

		.left {
			display: flex;
			align-items: center;

			.profile {
				width: 88rpx;
				height: 88rpx;
				border-radius: 50%;
			}

			.nickName {
				margin-left: 24rpx;
				font-family: Inter, Inter;
				font-weight: 400;
				font-size: 28rpx;
				color: #FFFFFF;
			}
		}

		.right {
			margin-right: 30rpx;
		}
	}

	.cell-box {
		width: 678rpx;
		background: linear-gradient(185deg, #262626 0%, #252525 100%);
		border-radius: 40rpx;
		box-shadow: 2rpx 2rpx 2rpx #000;
		margin: 0 auto;
		padding: 20rpx 0;
	}
</style>