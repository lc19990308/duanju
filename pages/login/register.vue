<template>
	<view class="app-container">
		<view class="logo-box">
			<image class="logo-icon" src="/static/images/logo.png" mode=""></image>
			<image class="logo-text" src="/static/images/logo-text.png" mode=""></image>
		</view>
		<view class="form">
			<u--form :model="form" ref="uForm" labelPosition='top' labelWidth='120' :borderBottom='false'
				:labelStyle='labelStyle'>
				<u-form-item label="email điện tử" prop="email" :borderBottom='false'>
					<u-input v-model="form.email" border='none' placeholder='Vui lòng nhập email'
						:placeholderStyle='placeholderStyle'>
						<template slot='prefix'>
							<image class="input-icon" src="/static/images/Frame-23.png" mode=""></image>
						</template>
					</u-input>
				</u-form-item>
				<u-form-item label="Mã xác minh" prop="verificationCode" :borderBottom='false'>
					<u-input v-model="form.verificationCode" border='none' placeholder='Nhập mã xác nhận'
						:placeholderStyle='placeholderStyle'>
						<template slot='prefix'>
							<image class="input-icon" src="/static/images/Frame-25.png" mode=""></image>
						</template>
					</u-input>
					<u-button class="code-btn" slot="right" @tap="getCode">{{tips}}</u-button>
				</u-form-item>
				<u-form-item label="mật khẩu" prop="password" :borderBottom='false'>
					<u-input v-model="form.password" border='none' prefixIcon="search" placeholder='Nhập mật khẩu mới'
						:placeholderStyle='placeholderStyle'>
						<template slot='prefix'>
							<image class="input-icon" src="/static/images/Frame-24.png" mode=""></image>
						</template>
					</u-input>
				</u-form-item>
			</u--form>
			<u-button class="submt-btn" @click="submit">đăng ký</u-button>
			<u-button class="reset-btn">Đăng nhập</u-button>
		</view>
		<view class="btn-groud">
			<view class="btn-groud-item">
				<image src="/static/images/Frame-26.png" mode=""></image>
			</view>
			<view class="btn-groud-item">
				<image src="/static/images/Frame-27.png" mode=""></image>
			</view>
			<view class="btn-groud-item">
				<image src="/static/images/Frame-28.png" mode=""></image>
			</view>
			<view class="btn-groud-item">
				<image src="/static/images/Frame-29.png" mode=""></image>
			</view>
		</view>

		<view class="agreement-checked">
			<u-checkbox-group v-model="checkboxValue1" shape='circle' activeColor='#EDC267' @change="checkboxChange">
				<u-checkbox :customStyle="{marginBottom: '8px'}" name="1" inactiveColor='#000000'>
				</u-checkbox>
			</u-checkbox-group>
			<view class="agreement-tips">
				Tôi chấp nhận rủi ro xóa và đồng ý xóa tài khoản của mình
			</view>
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
					email: '',
					verificationCode:'',
					password:'',
				},
				rules: {
					name: [{
						required: true,
						message: '请输入姓名',
						trigger: ['blur', 'change']
					}]
				},
				placeholderStyle: {
					color: '#666'
				},
				tips: 'lấy',
				// refCode: null,
				seconds: 10,
				checkboxValue1: 1,
				titleStyle: {
					color: '#fff'
				}
			}
		},
		methods: {
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				// if (this.$refs.uCode.canGetCode) {
				// 	// 模拟向后端请求验证码
				// 	uni.showLoading({
				// 		title: '正在获取验证码'
				// 	})
				// 	setTimeout(() => {
				// 		uni.hideLoading();
				// 		// 这里此提示会被this.start()方法中的提示覆盖
				// 		uni.$u.toast('验证码已发送');
				// 		// 通知验证码组件内部开始倒计时
				// 		this.$refs.uCode.start();
				// 	}, 2000);
				// } else {
				// 	uni.$u.toast('倒计时结束后再发送');
				// }
				
				let obj = {
					"email": this.form.email,
					"emailmode": "1",
				}
				this.$request('login.sendEmailCode', obj).then(res => {
					if(res.code === 0) {
						this.$u.toast(res.message)
					}else if(res.code === 500) {
						this.$u.toast(res.message)
					}else{
						if(res.code === 200) {
							this.$u.toast("发送成功")
						}
					}
				})
			},
			submit() {
				let obj = {
					"email": this.form.email,
					"emailcode": this.form.verificationCode,
					"username": this.form.email,
				    "password": this.form.password,
				    "realname": this.form.email
				}
				this.$request('login.registerEmail', obj).then(res => {
					if(res.code === 0) {
						this.$u.toast(res.message)
					}else if(res.code === 500) {
						this.$u.toast(res.message)
					}else{
						if(res.code === 200) {
							this.$u.toast("注册成功")
						}
					}
				})
			}

		},
	}
</script>

<style lang="scss" scoped>
	page {
		// background-image: url('/static/images/login.png');
		// background-repeat: no-repeat;
		// background-size: 100% 100%;
		// background-position: 100% 100%;
	}

	.app-container {
		background-image: url('/static/images/login.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-position: 100% 100%;
		min-height: calc(100vh);
		padding-top: 69rpx;
		padding-bottom: 40rpx;
	}

	.logo-box {
		.logo-icon {
			width: 168rpx;
			height: 168rpx;
			margin: 0 auto;
			border-radius: 24rpx;
		}

		.logo-text {
			width: 293rpx;
			height: 36rpx;
			margin-top: 21rpx;
			margin: 21rpx auto 0 auto;
		}
	}

	.form {
		margin: 55rpx 0 0 0;
		padding: 0 36rpx;
		box-sizing: border-box;
	}

	::v-deep .u-input__content {
		background: #282828;
		border-radius: 20rpx;
		padding: 18rpx 20rpx;
	}

	.submt-btn {
		width: 678rpx;
		height: 88rpx;
		margin: 36rpx auto 0 auto;
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

	.reset-btn {
		width: 678rpx;
		height: 88rpx;
		margin: 36rpx auto 0 auto;
		background: #000000;
		border-color: #EDC267;
		border-width: 2rpx;
		border-style: solid;
		border-radius: 62rpx;
		font-family: Inter, Inter;
		font-weight: 400;
		font-size: 28rpx;
		color: #EDC267;
	}

	.code-btn {
		margin-left: 20rpx !important;
		width: 200rpx !important;
		height: 68rpx !important;
		background: #282828 !important;
		border-radius: 20rpx !important;
		font-family: Inter, Inter;
		font-weight: 400;
		font-size: 28rpx;
		color: #FFCD03;
		box-shadow: 2rpx 2rpx 2rpx #282828;
		border-color: #282828;
		border-width: 2rpx;
		border-style: solid;
	}

	::v-deep .uni-input-input {
		color: #f7f7f7;
	}

	.input-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 24rpx;
	}

	.agreement-checked {
		display: flex;
		align-items: center;
		padding: 0 57rpx 0 32rpx;
		margin-top: 41rpx;

		.agreement-tips {
			width: 624px;
			font-family: Inter, Inter;
			font-weight: 400;
			font-size: 24rpx;
			color: #939393;
		}
	}

	.btn-groud {
		display: flex;
		justify-content: center;
		margin-top: 103rpx;
	}

	.btn-groud-item {
		margin-right: 41rpx;

		image {

			width: 88rpx;
			height: 88rpx;
			background: #262626;
			border-radius: 44rpx;
		}
	}

	::v-deep .u-checkbox__icon-wrap--circle {
		border: 2rpx solid #EDC267 !important;
		background-color: #000 !important;
	}
	::v-deep .u-checkbox{
		margin-bottom: 0rpx !important;
	}
</style>