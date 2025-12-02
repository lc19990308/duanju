<template>
	<view class="app-container">
		<statusBar />
		<u-navbar title="" :fixed='false' bgColor='transparent' leftIconColor='#fff' :autoBack="true"
			:placeholder='true'>
		</u-navbar>
		<u-toast ref="uToast"></u-toast>
		<u-code :seconds="seconds" ref="uCode" @change="codeChange" />

		<view class="title">
			<view class="title-text">{{$t('changePassword.title')}}</view>
			<view class="tips-text">{{$t('changePassword.title_tips')}}</view>
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
					<u-input v-model="form.password" type='password' border='none' prefixIcon="search"
						placeholder='Nhập mật khẩu mới' :placeholderStyle='placeholderStyle'>
						<template slot='prefix'>
							<image class="input-icon" src="/static/images/Frame-24.png" mode=""></image>
						</template>
					</u-input>
				</u-form-item>
				<u-form-item label="Xác nhận mật khẩu" prop="confirmpassword" :borderBottom='false'>
					<u-input v-model="form.confirmpassword" type='password' border='none'
						placeholder='Nhập lại mật khẩu mới' :placeholderStyle='placeholderStyle'>
						<template slot='prefix'>
							<image class="input-icon" src="/static/images/Frame-24.png" mode=""></image>
						</template>
					</u-input>
				</u-form-item>
			</u--form>
			<u-button class="submt-btn" @click="submit">{{$t('changePassword.btn_text')}}</u-button>
		</view>
		<u-code :seconds="seconds" ref="uCode" @change="codeChange"></u-code>
	</view>
</template>

<script>
	import i18n from '@/utils/i18n/index.js'
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
							message: () => i18n.t('form.emailRequired'),
							trigger: ['blur', 'change']
						},
						{
							type: 'email',
							message: () => i18n.t('form.emailFormat'),
							trigger: ['blur', 'change']
						}
					],

					/* 验证码 */
					emailcode: [{
						required: true,
						message: () => i18n.t('form.captchaRequired'),
						trigger: ['blur', 'change']
					}],

					/* 密码 */
					password: [{
						required: true,
						message: () => i18n.t('form.pwdRequired'),
						trigger: ['blur', 'change']
					}],

					/* 确认密码：必填 + 与 password 实时比对 */
					confirmpassword: [{
							required: true,
							message: () => i18n.t('form.pwdAgain'),
							trigger: ['blur', 'change']
						},
						{
							validator: (rule, value, callback) =>
								value === this.form.password ?
								callback() : callback(new Error(i18n.t('form.pwdMismatch'))),
							trigger: ['blur', 'change']
						}
					]
				},
				tips: i18n.t('form.getCode'),
				seconds: 30,
				placeholderStyle: 'color:#666;'


			}
		},
		methods: {
			codeChange(text) {
				if (text === '获取验证码' || text === '重新获取') {
					this.tips = `${i18n.t('form.getCode')}`;
				} else {
					this.tips = `${this.extractNumber(text)} ${i18n.t('form.regain')}`;
				}
			},
			getCode() {
				if (uni.$u.test.isEmpty(this.form.email)) {
					return uni.$u.toast(this.$t('toast.emailEmpty'))
				}
				const emailState = uni.$u.test.email(this.form.email)
				if (!emailState) {
					return uni.$u.toast(this.$t('toast.emailTrue'))
				}
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: `${this.$t('toast.get_code_loing')}`
					})
					const form = {
						email: this.form.email,
						emailmode: 2,
					}
					this.$request('login.sendEmailCode', form).then(res => {
						uni.hideLoading();
						uni.$u.toast(this.$t('toast.emailCodeSuccess'));
						this.$refs.uCode.start();
					})
				} else {
					uni.$u.toast('倒计时结束后再发送');
				}
			},
			submit() {
				this.$refs.uForm.validate().then(res => {
					this.$request('login.resetPasswordByEmail', this.form).then(res => {
						uni.$u.toast(this.$t('toast.resetMsg'))
						setTimeout(() => {
							uni.clearStorageSync();
							uni.redirectTo({
								url: '/pages/login/login'
							})
						}, 500)
					})
				})
			},
			extractNumber(text) {
				if (!text) return null;
				const m = text.match(/\p{Nd}+/u); // 使用 u 标志支持 Unicode 数字
				return m ? Number(m[0]) : null;
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
		font-size: 22rpx;
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