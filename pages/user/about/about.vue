<template>
	<view class="about">
		<view class="ab_top">
			<view class="top_img">
				<u-avatar-group :urls="urls" size="60"></u-avatar-group>
			</view>
			<view class="top_name">
				{{programName}}
			</view>
			<view class="top_version">
				{{version}}
			</view>
		</view>
		<view class="ab_bottom">
			<view class="bot">
				<u-cell size="large" :title="item.protocolName" isLink :border="false"
					v-for="(item,index) in protocolList" :key="index" @click="handleToDeatil(item.id)" v-if="item.protocolStatus == 1">
				</u-cell>
			</view>
		</view>
	</view>
</template>

<script>
	import apiMoen from '../../../utils/config.js';
	export default {
		data() {
			return {
				urls: [],
				version: '',
				protocolList: [],
				programName: '',
				tenantId: null,
				sysOrgCode: null,
			};
		},
		onLoad() {
			this.tenantId = apiMoen.tenantId
			this.sysOrgCode = apiMoen.sysOrgCode
			this.handleToWChatInfo()
			this.handleToAllocatProtocolList()
		},
		methods: {
			//logo、版本、名字
			handleToWChatInfo() {
				this.$request('wchatapi.allocatProgram', {
					tenantId: this.tenantId,
					sysOrgCode: this.sysOrgCode
				}).then(res => {
					if (res.code == 200) {
						console.log(res);
						this.urls.push(res.result.brandLogo)
						this.version = res.result.version
						this.programName = res.result.programName
					}
				}).catch(res => {
					console.log(res);
				})
			},
			//协议列表
			handleToAllocatProtocolList() {
				this.$request('wchatapi.allocatProtocolList', {
					tenantId: this.tenantId,
					sysOrgCode: this.sysOrgCode
				}).then(res => {
					if (res.code == 200) {
						this.protocolList = res.result

					}
					console.log("协议列表",res);
				}).catch(res => {
					console.log(res);
				})
			},
			//跳转协议详情
			handleToDeatil(id) {
				console.log(id);
				uni.navigateTo({
					url: `/pages/user/about/detail/detail?id=${id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.about {
		width: 90%;
		margin: auto;

		.ab_top {
			padding-top: 80rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.top_name {
				margin-top: 20rpx;
				font-weight: bold;
				font-size: 28rpx;
			}

			.top_version {
				margin-top: 20rpx;
				font-size: 26rpx;
			}
		}

		.ab_bottom {
			margin-top: 40rpx;
		}
	}
</style>