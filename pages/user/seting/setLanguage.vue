<template>
	<view class="app-container">
		<u-navbar title="Liên hệ h hỗ trợ khách hàng" bgColor='transparent' :titleStyle='titleStyle'
			leftIconColor='#fff' :autoBack="true" :placeholder='true' />
		<view class="issue-card">
			<u-radio-group v-model="value" iconPlacement="right">
				<u-radio activeColor="#FFCD03" name='Tiếng Anh' label='Tiếng Anh' labelColor='#d1d1d1'></u-radio>
				<u-radio activeColor="#FFCD03" name='Việt Nam' label="Việt Nam" labelColor='#d1d1d1'></u-radio>
			</u-radio-group>
		</view>
		<u-button class="submt-btn" @click="submit">đăng ký</u-button>
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
			submit(){
				if(this.value){
					setTimeout(()=>{
						uni.$u.toast('操作成功！');
						uni.navigateBack()
					},500)
				}else{
					uni.$u.toast('请选择语言设置！');
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	page {
		background-image: url('/static/images/navbar-bg.png');
		background-size: 100% 100%;

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