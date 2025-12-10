<template>
	<view class="app-container">

		<view class="logo-box">
			<image class="logo-icon" src="/static/images/logo.png" mode=""></image>
			<image class="logo-text" src="/static/images/logo-text.png" mode=""></image>
		</view>
		<view class="form">
			<u--form :model="form" ref="uForm" labelPosition='top' labelWidth='120' :borderBottom='false'
				:labelStyle='labelStyle'>
				<u-form-item :label="$t(`regist.email`)" prop="email" :borderBottom='false'>
					<u-input v-model="form.email" border='none' :placeholder='$t(`regist.email_input`)'
						:placeholderStyle='placeholderStyle'>
						<template slot='prefix'>
							<image class="input-icon" src="/static/images/Frame-23.png" mode=""></image>
						</template>
					</u-input>
				</u-form-item>
				<u-form-item :label="$t(`regist.verification`)" prop="verificationCode" :borderBottom='false'>
					<u-input v-model="form.verificationCode" border='none' :maxlength='6'
						:placeholder='$t(`regist.verification_input`)' :placeholderStyle='placeholderStyle'>
						<template slot='prefix'>
							<image class="input-icon" src="/static/images/Frame-25.png" mode=""></image>
						</template>
					</u-input>
					<u-button class="code-btn" slot="right" @tap="getCode">{{tips}}</u-button>


				</u-form-item>
				<u-form-item :label="$t(`regist.password`)" prop="password" :borderBottom='false'>
					<u-input v-model="form.password" border='none' prefixIcon="search"
						:placeholder='$t(`regist.password_input`)' type='password' :placeholderStyle='placeholderStyle'>
						<template slot='prefix'>
							<image class="input-icon" src="/static/images/Frame-24.png" mode=""></image>
						</template>
					</u-input>
				</u-form-item>
			</u--form>
			<u-button class="submt-btn" @click="submit">{{$t(`regist.register_btn`)}}</u-button>
			<u-button class="reset-btn" @click="reset">{{$t(`regist.login_btn`)}}</u-button>
		</view>

		<view class="agreement-checked">
			<u-checkbox-group v-model="checkboxValue1" shape='circle' activeColor='#EDC267' @change="checkboxChange">
				<u-checkbox :customStyle="{marginBottom: '8px'}" name="1" inactiveColor='#000000'>
				</u-checkbox>
			</u-checkbox-group>
			<navigator class="agreement-tips" hover-class="none" url="/pages/user/about/detail/detail?id=1791523044515913730">
				{{$t(`login.login_tips`)}}
			</navigator>
		</view>
		<u-code :seconds="seconds" ref="uCode" @change="codeChange"></u-code>
	</view>
</template>

<script>
	let that;
	import apiMoen from '../../utils/config.js';
	import i18n from '../../utils/i18n/index.js';
	export default {
		data() {
			return {
				urlToken: '',
				webUrl: '',
				showWebView: false,
				labelStyle: {
					color: '#FFFFFF',
					fontFamily: 'Inter, Inter',
					fontWeight: 400,
					fontsize: '32rpx',
				},
				form: {
					email: '',
					verificationCode: '',
					password: '',
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
					verificationCode: [{
						required: true,
						message: () => i18n.t('form.captchaRequired'),
						trigger: ['blur', 'change']
					}],
					password: [{
						required: true,
						message: () => i18n.t('form.pwdRequired'),
						trigger: ['blur', 'change']
					}]
				},
				placeholderStyle: {
					color: '#666'
				},
				tips: i18n.t('form.getCode'),
				// refCode: null,
				seconds: 30,
				checkboxValue1: 1,
				titleStyle: {
					color: '#fff'
				}
			}
		},
		onShow() {
			that = this;
		},
		methods: {
			codeChange(text) {
				if(text === '获取验证码' || text === '重新获取'){
					this.tips = `${i18n.t('form.getCode')}`;
				}else{
					this.tips = `${this.extractNumber(text)} ${i18n.t('form.regain')}`;
				}
				
			},
			getCode() {
				if (this.$refs.uCode.canGetCode) {
					let obj = {
						"email": this.form.email,
						"emailmode": "1",
					}
					this.$request('login.sendEmailCode', obj).then(res => {
						if (res.code === 0) {
							this.$u.toast(this.$t('toast.send_msg_success'))
							this.$refs.uCode.start();
						}
					})
				}
			},
			submitGA(val) {
				const timestamp = Date.now();
				const timestampString = new Date(timestamp).toString();
				let obj = {}
				if (val == "apple") {
					obj = {
						"provider": "apple",
						"state": timestampString
					}
				}
				if (val == "google") {
					obj = {
						"provider": "google",
						"state": timestampString
					}
				}
				this.$request('login.loginGA', obj).then(res => {

					if (res.code === 0) {
						this.webUrl = res.result.authorizationUrl
						this.showWebView = true;
						let intervalId = setInterval(function() {
							if (this.webUrl.includes("token")) {
								let queryString = this.webUrl.split('?')[1];
								this.urlToken = queryString.split('=')[1];
								clearInterval(intervalId);
							}
						}, 1000);
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
					this.$u.toast(res.message);
					that.bindRelationship();
				})
			},
			reset() {
				uni.reLaunch({
					url: '/pages/login/login'
				})
			},
			bindRelationship() {
				var datas = {
					accountNumber: this.form.email,
					sysOrgCode: apiMoen.sysOrgCode,
					bindMemberId: this.getQueryParam('bindMemberId'),
				};
				this.$request('common.memberAccountNumberAdd', datas).then(res => {
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/login/login'
						})
					}, 500)
				})
			},
			getQueryParam(key) {
				// #ifdef H5
				// H5 带 hash 模式：http://localhost:8080/#/pages/login/register?bindMemberId=1989270268829470722
				const hash = window.location.hash || ''; // #/pages/login/register?bindMemberId=1989270268829470722
				const search = hash.split('?')[1] || ''; // bindMemberId=1989270268829470722
				const urlSearch = new URLSearchParams(search);
				return urlSearch.has(key) ? decodeURIComponent(urlSearch.get(key)) : null;
				// #endif

				// #ifndef H5
				// 小程序 / App：从页面路由对象里取
				const pages = getCurrentPages();
				if (!pages.length) return null;
				const options = pages[pages.length - 1].options || {}; // 或 $route.query（vue3）
				return options[key] ? decodeURIComponent(options[key]) : null;
				// #endif
			},
			extractNumber(text) {
				if (!text) return null;
				const m = text.match(/\p{Nd}+/u); // 使用 u 标志支持 Unicode 数字
				return m ? Number(m[0]) : null;
			}
		},
	}
</script>

<style lang="scss" scoped>
	.webView {
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 999999;
	}

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
		font-size: 22rpx;
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
			margin-left: 20rpx;
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

	::v-deep .u-checkbox {
		margin-bottom: 0rpx !important;
	}
</style>