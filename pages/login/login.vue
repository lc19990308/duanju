<template>
	<view class="app-container">
		<!-- <web-view class="webView" v-if="showWebView" :src="webUrl"></web-view> -->
		<view class="logo-box">
			<image class="logo-icon" src="/static/images/logo.png" mode=""></image>
			<image class="logo-text" src="/static/images/logo-text.png" mode=""></image>
		</view>
		<view class="form">
			<u--form :model="form" ref="uForm" :rules='rules' labelPosition='top' labelWidth='120' :borderBottom='false'
				:labelStyle='labelStyle'>
				<u-form-item :label="$t(`login.email`)" prop="email" :borderBottom='false'>
					<u-input v-model="form.email" border='none' :placeholder='$t(`login.email_input`)'
						:placeholderStyle='placeholderStyle'>
						<template slot='prefix'>
							<image class="input-icon" src="/static/images/Frame-23.png" mode=""></image>
						</template>
					</u-input>
				</u-form-item>
				<u-form-item :label="$t(`login.password`)" prop="password" :borderBottom='false'>
					<u-input v-model="form.password" type='password' border='none'
						:placeholder='$t(`login.password_input`)' :placeholderStyle='placeholderStyle'>
						<template slot='prefix'>
							<image class="input-icon" src="/static/images/Frame-24.png" mode=""></image>
						</template>
					</u-input>
				</u-form-item>
			</u--form>
			<navigator hover-class="none" url="/pages/login/changePassword" class="forgot_password_tips">
				{{$t(`login.forgot_password_tips`)}}
			</navigator>
			<u-button class="submt-btn" @click="submit">{{$t(`login.login_btn`)}}</u-button>
			<u-button class="reset-btn" @click="reset">{{$t(`login.register_btn`)}}</u-button>
		</view>
		<view class="btn-groud">
			<view class="btn-groud-item" v-show="item.show" v-for="(item,index) in providersList" :key="index">
				<image :src="item.icon" mode="" @click="submitGA(item.key)"></image>
			</view>
<!-- 			<view class="btn-groud-item">
				<image src="/static/images/Frame-27.png" mode="" @click="submitGA('apple')"></image>
			</view>
			<view class="btn-groud-item">
				<image src="/static/images/Frame-28.png" mode=""></image>
			</view>
			<view class="btn-groud-item">
				<image src="/static/images/Frame-29.png" mode=""></image>
			</view> -->
		</view>
		<view class="agreement-checked">
			<u-checkbox-group shape='circle' activeColor='#EDC267' @change="checkboxChange">
				<u-checkbox :checked='checked' :customStyle="{marginBottom: '8px'}" name="1" inactiveColor='#000000'>
				</u-checkbox>
			</u-checkbox-group>
			<view class="agreement-tips">
				{{$t(`login.login_tips`)}}
			</view>
		</view>
	</view>
</template>

<script>
	import i18n from '@/utils/i18n/index.js'
	import apiMoen from '@/utils/config.js';
	import webview from '@/common/uni.webview.1.5.4.js'
	let that;
	import {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} from "vuex"
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
					password: [{
						required: true,
						message: () => i18n.t('form.pwdRequired'),
						trigger: ['blur', 'change']
					}]
				},
				providersList:[
					{
						icon:'/static/images/Frame-26.png',
						key:'google',
						show:false,
					},
					{
						icon:'/static/images/Frame-27.png',
						key:'apple',
						show:false,
					},
					{
						icon:'/static/images/Frame-28.png',
						key:'facebook',
						show:false,
					},
					{
						icon:'/static/images/Frame-29.png',
						key:'instagram',
						show:false,
					}
				],
				placeholderStyle: {
					color: '#666'
				},
				tips: 'lấy',
				// refCode: null,
				seconds: 10,
				checked: false,
				titleStyle: {
					color: '#fff'
				}
			}
		},
		methods: {
			...mapActions('user', ['getUserInfo']),
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: this.$t('toast.get_code_loing')
					})
					setTimeout(() => {
						uni.hideLoading();
						// 这里此提示会被this.start()方法中的提示覆盖
						uni.$u.toast(this.$t('toast.emailCodeSuccess'));
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
					}, 2000);
				} else {
					uni.$u.toast('倒计时结束后再发送');
				}
			},
			submitGAList() {
				this.$request('login.loginGAList').then(res => {
					console.log(res.result.whitelistProviders,'xxx')
					
					this.providersList.forEach((item,index)=>{
						res.result.whitelistProviders.map((childItem)=>{
							if(item.key === childItem){
								item.show = true;
							}
						})
					})
				})
			},
			submitGA(val) {
				if (!this.checked) {
					return uni.showToast({
						title: this.$t('toast.agreement'),
						icon: 'none'
					})
				}
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
				console.log('postMessage run')
				// console.log(webview.postMessage,'webview')
				// console.log(uni.webView)
				webview.postMessage({
					data: obj
				});
				// this.$request('login.loginGA', obj).then(res => {
				// 	this.webUrl = res.result.authorizationUrl
				// 	console.log(res.result.authorizationUrl,'res.result.authorizationUrl')
				// 	this.showWebView = true;
				// 	// let intervalId = setInterval(function() {
				// 	// 	if (this.webUrl.includes("token")) {
				// 	// 		let queryString = this.webUrl.split('?')[1];
				// 	// 		this.urlToken = queryString.split('=')[1];
				// 	// 		clearInterval(intervalId);
				// 	// 	}
				// 	// }, 1000);
				// })
			},
			submit() {
				if (!this.checked) {
					return uni.showToast({
						title: this.$t('toast.agreement'),
						icon: 'none'
					})
				}
				let obj = {
					"email": this.form.email,
					"loginType": "password",
					"password": this.form.password
				}

				that.$refs.uForm.validate().then(async res => {
					const resp = await that.$request('login.loginEmail', obj);
					if (resp.code === 200) {
						uni.setStorageSync('accountNumber', obj.email);
						that.$u.toast(this.$t('toast.login_success'))
						const userInfo = await that.getUserInfo(resp.result.token);
						that.memberAccountNumberAdd();
						if (userInfo.code === 200) {
							setTimeout(() => {
								uni.reLaunch({
									url: '/'
								})
							}, 500)
						}
					}

					// that.getUserInfo(resp.result.token).then(resp => {
					// 	setTimeout(() => {
					// 		uni.reLaunch({
					// 			url: '/'
					// 		})
					// 	}, 500)
					// })
				})
			},
			memberAccountNumberAdd() {
				const {
					deviceBrand,
					deviceModel,
					deviceId,
					osName,
					osVersion
				} = uni.getSystemInfoSync();

				var datas = {
					accountNumber: uni.getStorageSync('accountNumber'),
					sysOrgCode: apiMoen.sysOrgCode,
				};

				this.$request('common.memberAccountNumberAdd', datas).then(res => {
					console.log("登录", res)
					if (res.code != 200) {
						uni.showToast({
							title: this.$t('toast.sys_error'),
							icon: 'none',
							duration: 2000 // 提示框显示时长
						});
					} else {
						// uni.showToast({
						// 	title: '登录成功',
						// 	icon: 'none',
						// 	duration: 2000 // 提示框显示时长
						// });
						const id = res.result.id
						const tenantId = res.result.tenantId
						const memberName = res.result.memberName
						const sysOrgCode = res.result.sysOrgCode
						const memberId = res.result.memberId
						uni.setStorageSync('id', id)
						uni.setStorageSync('tenantId', tenantId)
						uni.setStorageSync('sysOrgCode', sysOrgCode)
						uni.setStorageSync('memberId', memberId)
						// this.longinopenid()
						// uni.switchTab({
						// 	url: '/pages/home/index'
						// })
					}
				}).catch(err => {
					console.log(err)
				})
			},
			reset() {
				uni.reLaunch({
					url: '/pages/login/register'
				})
			},
			checkboxChange() {
				this.checked = !this.checked;
			},
			//谷歌登录获取token的回调
			async googleCallBack({token,email}) {
				console.log(token,email,'email')
				uni.setStorageSync('accountNumber',email);
				const userInfo = await that.getUserInfo(token);
				console.log(token, 'token')
				uni.$u.toast(this.$t('toast.login_success'));
				if (userInfo.code === 200) {
					that.memberAccountNumberAdd();
					setTimeout(() => {
						uni.reLaunch({
							url: '/'
						})
					}, 500)
				}
			},
		},
		onLoad() {
			that = this;
			that.submitGAList();
			window.msgFromApp = window.msgFromApp || function(data) {
				// console.log('接收到 uni-app 参数（默认）:', data.idToken);
				that.googleCallBack(data);
				// let form = {
				// 	access_token: '',
				// 	idToken:data.idToken,
				// }
				// that.$request('login.verifyGoogle', form).then(res=>{
				// 	console.log(res,'xx')
				// })


			};
		}
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
		padding: 0 36rpx;
		margin: 55rpx 0 0 0;
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
		width: 600rpx;
		margin: 103rpx auto 0 auto;
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

	.forgot_password_tips {
		color: #999;
		font-size: 22rpx;

	}
</style>