<template>
	<view class="login">
		<!-- 品牌标志 -->
		<view class="band">
			<view class="band-logo">
				<image :src="AllocatProgram.brandLogo" mode="aspectFill"></image>
			</view>
			<view class="band-name">
				{{AllocatProgram.programName}}
			</view>
		</view>

		<view class="login_from">
			<uv-form labelPosition="left" :model="userInfo" :rules="rules" ref="form">
				<uv-form-item label="" prop="accountNumber" borderBottom>
					<uv-input v-model="userInfo.accountNumber" border="none" placeholder="请输入手机号码进行登录">
					</uv-input>
				</uv-form-item>
				<!-- <uv-form-item label="" prop="password" borderBottom>
					<uv-input v-model="userInfo.password" border="none" placeholder="请输入密码" type="password">
					</uv-input>
				</uv-form-item> -->
				<view class="buttom">
					<uv-button type="primary" shape="circle" size="large " text="登录" customStyle="margin-top: 20rpx"
						@click="submit"></uv-button>
				</view>
			</uv-form>
		</view>
		<!-- 登录区域 -->
		<!-- 登录方式 -->
		<!-- 相关协议 -->
	</view>
</template>

<script>
	import { mapMutations } from 'vuex'
	import apiMoen from '../../../utils/config.js';
	export default {
		data() {
			return {
				userInfo: {
					accountNumber: '',
					// password: ''
					sysOrgCode: apiMoen.sysOrgCode,
				},
				AllocatProgram: {},
				rules: {
					accountNumber: [{
						type: 'string',
						required: true,
						message: '请填写手机号',
						trigger: ['blur'],
					}],
					password: [{
						type: 'string',
						required: true,
						message: '请输入密码',
						trigger: ['blur']
					}]
				}
			}
		},
		onLoad() {
			this.getAllocatProgram()
		},
		methods: {
			...mapMutations('user', ['setUserInfo']),
			getAllocatProgram() {
				this.$request('wchatapi.allocatProgram', {
					sysOrgCode: apiMoen.sysOrgCode,
					tenantId: apiMoen.tenantId
				}).then(res => {
					console.log(res)
					this.AllocatProgram = res.result
				})
			},
			submit() {
				this.$request('common.memberAccountNumberAdd', this.userInfo).then(res => {
					console.log("登录", res)
					if (res.code != 200) {
						uni.showToast({
							title: this.$t('toast.sys_error'),
							icon: 'none',
							duration: 2000 // 提示框显示时长
						});
					} else {
						uni.showToast({
							title: this.$t('toast.login_success'),
							icon: 'none',
							duration: 2000 // 提示框显示时长
						});
						const id = res.result.id
						const tenantId = res.result.tenantId
						const memberName = res.result.memberName
						const sysOrgCode = res.result.sysOrgCode
						this.setUserInfo(res.result) 
						uni.setStorageSync('id', id)
						uni.setStorageSync('tenantId', tenantId)
						uni.setStorageSync('sysOrgCode', sysOrgCode)
						uni.switchTab({
							url: '/pages/home/index'
						})
					}
				}).catch(err => {
					console.log(err)
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'login.scss'
</style>