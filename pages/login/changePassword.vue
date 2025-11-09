<template>
	<view class="app-container">
		<u-navbar title="" bgColor='transparent' leftIconColor='#fff' :autoBack="true" :placeholder='true'>
		</u-navbar>
		<u-toast ref="uToast"></u-toast>
		<u-code :seconds="seconds" ref="uCode" @change="codeChange" />

		<view class="title">
			<view class="title-text">Đặt lại mật khẩu</view>
			<view class="tips-text">Vui lòng nhập mật khẩu mới của bạn</view>
		</view>
		<view class="form">
			<u--form :model="form" ref="uForm" :rules='rules' labelPosition='top' labelWidth='auto'
				:borderBottom='false' :labelStyle='labelStyle'>
				<u-form-item label="email điện tử" prop="email" :borderBottom='false'>
					<u-input v-model="form.email" border='none' placeholder='Vui lòng nhập email'
						placeholderStyle='color:"#666"'>
						<template slot=' prefix'>
							<image class="input-icon" src="/static/images/Frame-23.png" mode=""></image>
						</template>
					</u-input>
				</u-form-item>
				<u-form-item label="Mã xác minh" prop="emailcode" :borderBottom='false'>
					<u-input v-model="form.emailcode" border='none' placeholder='Nhập mã xác nhận'
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
				<u-form-item label="Xác nhận mật khẩu" prop="confirmpassword" :borderBottom='false'>
					<u-input v-model="form.confirmpassword" border='none' placeholder='Nhập lại mật khẩu mới'
						:placeholderStyle='placeholderStyle'>
						<template slot='prefix'>
							<image class="input-icon" src="/static/images/Frame-24.png" mode=""></image>
						</template>
					</u-input>
				</u-form-item>
			</u--form>
			<u-button class="submt-btn" @click="submit">Đặt lại mật khẩu</u-button>
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
				},
				form: {
					email: '',
					emailcode: '',
					password: '',
					confirmpassword: '',
				},
				rules: {
					email: [{
							required: true,
							message: '请输入邮箱',
							trigger: ['blur', 'change']
						},
						{
							type: 'email',
							message: '邮箱格式不正确',
							trigger: ['blur', 'change']
						}
					],

					/* 验证码 */
					emailcode: [{
						required: true,
						message: '请输入验证码',
						trigger: ['blur', 'change']
					}],

					/* 密码 */
					password: [{
						required: true,
						message: '请输入密码',
						trigger: ['blur', 'change']
					}],

					/* 确认密码：必填 + 与 password 实时比对 */
					confirmpassword: [{
							required: true,
							message: '请再次输入密码',
							trigger: ['blur', 'change']
						},
						{
							validator: (rule, value, callback) =>
								value === this.form.password ?
								callback() : callback(new Error('两次输入密码不一致')),
							trigger: ['blur', 'change']
						}
					]
				},
				tips: 'lấy',
				seconds: 30,
				placeholderStyle: 'color:#666;'


			}
		},
		methods: {
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				if (uni.$u.test.isEmpty(this.form.email)) {
					return uni.$u.toast('邮箱不能为空!')
				}
				const emailState = uni.$u.test.email(this.form.email)
				if (!emailState) {
					return uni.$u.toast('请输入正确邮箱!')
				}
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					const form = {
						email: this.form.email,
						emailmode: 2,
					}
					this.$request('login.sendEmailCode', form).then(res => {
						uni.hideLoading();
						uni.$u.toast('验证码已发送');
						this.$refs.uCode.start();
					})
				} else {
					uni.$u.toast('倒计时结束后再发送');
				}
			},
			submit() {
				this.$refs.uForm.validate().then(res => {
					this.$request('login.resetPasswordByEmail', this.form).then(res => {
						uni.$u.toast('重置成功！')
					})
				})
			}
		},
		onShow() {
			console.log(uni.$u.test.email('19139771157@qq.com'))
		}
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

	.submt-btn {
		margin-top: 36rpx;
		width: 678rpx;
		height: 88rpx;
		background: #EDC267;
		box-shadow: 2rpx 2rpx 2rpx #EDC267;
		border-color: #EDC267;
		border-width: 2rpx;
		border-style: solid;
		border-radius: 62rpx;
		font-family: Inter, Inter;
		font-weight: 400;
		font-size: 28rpx;
		color: #000000;
	}

	::v-deep .uni-input-input {
		color: #f7f7f7;
	}

	.input-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 24rpx;
	}
</style>