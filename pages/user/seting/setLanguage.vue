<template>
	<view class="app-container">
		<statusBar />
		<u-navbar :title="$t(`language.page_title`)" :fixed='true' bgColor='transparent' :titleStyle='titleStyle'
			leftIconColor='#fff' :autoBack="true" :placeholder='true' />
		<view class="issue-card">
			<u-radio-group v-model="value" iconPlacement="right">
				<u-radio activeColor="#FFCD03" name='zh_CN' :label='$t(`language.language_cn`)' labelColor='#d1d1d1' />
				<u-radio activeColor="#FFCD03" name='vi_VN' :label='$t(`language.language_vi`)' labelColor='#d1d1d1' />
				<u-radio activeColor="#FFCD03" name='zh_EN' :label='$t(`language.language_en`)' labelColor='#d1d1d1' />
			</u-radio-group>
		</view>
		<u-button class="submt-btn" @click="submit">{{$t(`language.submit_btn`)}}</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: '',
				titleStyle: {
					color: '#fff',
					fontFamily: 'PingFang SC, PingFang SC',
					fontWeight: 800,
					color: '#FFFFFF',
				},
			}
		},
		methods: {
			submit() {
				if (this.value) {
					this.$i18n.locale = this.value;
					uni.setStorageSync('lang', this.value)
					uni.$u.toast(this.$t('toast.msg_success'))
					setTimeout(() => {
						uni.navigateBack();
					}, 500)
				} else {
					uni.$u.toast(this.$t('toast.picker_language_settings'));
				}
			},
		},
		onLoad() {
			this.value = uni.getStorageSync('lang');
		}
	}
</script>

<style lang="scss" scoped>
	.app-container {
		background-image: url('/static/images/navbar-bg.png');
		background-size: 100% 100%;
		min-height: 100vh;
		background-repeat: no-repeat;
	}

	.issue-card {
		width: 678rpx;
		margin: 50rpx auto 0 auto;
		background-image: url('/static/images/frame-card.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		padding: 15rpx;
		border-radius: 20rpx;
		box-shadow: 2rpx 2rpx 2rpx #999;
	}

	::v-deep .u-radio-group--row {
		flex-direction: column;
	}

	.u-radio {
		padding: 25rpx 10rpx;
	}

	.submt-btn {
		width: 678rpx;
		height: 88rpx;
		margin: 86rpx auto 0 auto;
		background: #EDC267;
		border-color: #EDC267;
		border-width: 2rpx;
		border-style: solid;
		border-radius: 62rpx;
		font-family: Inter, Inter;
		font-weight: 400;
		font-size: 28rpx;
		color: #000000;
	}

	::v-deep .u-radio__icon-wrap {
		background-color: transparent !important;
	}
</style>