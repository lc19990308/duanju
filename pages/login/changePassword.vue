<template>
	<view class="app-container">
		<u-navbar title="" :autoBack="true" :placeholder='true'>
		</u-navbar>
		<u-toast ref="uToast"></u-toast>
		<u-code :seconds="seconds" ref="uCode" @change="codeChange" />

		<view class="title">
			<view class="title-text">Đặt lại mật khẩu</view>
			<view class="tips-text">Vui lòng nhập mật khẩu mới của bạn</view>
		</view>
		<view class="form">
			<u--form :model="form" ref="uForm" labelPosition='top' labelWidth='120' :borderBottom='false'
				:labelStyle='labelStyle'>
				<u-form-item label="email điện tử" prop="name" :borderBottom='false'>
					<u-input v-model="form.name" border='none' prefixIcon="search" placeholder='Vui lòng nhập email'
						prefixIconStyle="font-size: 22px;color: #fff" />
				</u-form-item>
				<u-form-item label="Mã xác minh" prop="name" :borderBottom='false'>
					<u-input v-model="form.name" border='none' prefixIcon="search" placeholder='Nhập mã xác nhận'
						prefixIconStyle="font-size: 22px;color: #fff" />
					<u-button class="code-btn" slot="right" @tap="getCode">{{tips}}</u-button>

				</u-form-item>
				<u-form-item label="mật khẩu" prop="name" :borderBottom='false'>
					<u-input v-model="form.name" border='none' prefixIcon="search" placeholder='Nhập mật khẩu mới'
						prefixIconStyle="font-size: 22px;color: #fff" />
				</u-form-item>
				<u-form-item label="Xác nhận mật khẩu" prop="name" :borderBottom='false'>
					<u-input v-model="form.name" border='none' prefixIcon="search" placeholder='Nhập lại mật khẩu mới'
						prefixIconStyle="font-size: 22px;color: #fff" />
				</u-form-item>
			</u--form>
			<u-button class="submt-btn" @click="submit">提交</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				labelStyle: {
					color: '#FFFFFF',
					fontFamily: 'Inter, Inter',
					fontWeight: 400,
					fontsize: '32rpx',
				},
				form: {
					name: '',

				},
				rules: {
					name: [{
						required: true,
						message: '请输入姓名',
						trigger: ['blur', 'change']
					}]
				},
				tips: 'lấy',
				// refCode: null,
				seconds: 10,
			}
		},
		methods: {
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					setTimeout(() => {
						uni.hideLoading();
						// 这里此提示会被this.start()方法中的提示覆盖
						uni.$u.toast('验证码已发送');
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
					}, 2000);
				} else {
					uni.$u.toast('倒计时结束后再发送');
				}
			},
			submit() {
				this.$refs.uForm.validate().then(res => {
					uni.$u.toast('校验通过')
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	page {
		min-height: 100vh;
		background-color: #000000;
	}

	.title {
		padding: 0 36rpx;
		margin-top: 16rpx;
		box-sizing: border-box;

		.title-text {
			font-family: Inter, Inter;
			font-weight: bold;
			font-size: 36rpx;
			color: #D1D1D1;
			font-style: normal;
			text-transform: none;
		}

		.tips-text {
			font-family: Inter, Inter;
			font-weight: 400;
			font-size: 24rpx;
			color: #666666;
		}
	}

	.form {
		padding: 0 36rpx;
		box-sizing: border-box;
	}

	::v-deep .u-input__content {
		background: #282828;
		border-radius: 20rpx;
		padding: 10rpx 20rpx;
	}
	.code-btn{
		margin-left: 20rpx !important;
		width: 200rpx !important;
		height: 68rpx !important;
		background: #282828 !important;
		border-radius: 20rpx !important;
		font-family: Inter, Inter;
		font-weight: 400;
		font-size: 28rpx;
		color: #FFCD03;
	}
	.submt-btn{
		margin-top: 36rpx;
		width: 678rpx;
		height: 88rpx;
		background: #EDC267;
		border-radius: 62rpx;
		font-family: Inter, Inter;
		font-weight: 400;
		font-size: 28rpx;
		color: #000000;
	}
</style>