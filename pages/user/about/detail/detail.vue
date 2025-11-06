<template>
	<view class="detail">
		<view class="de_title">
			
			《{{protocolName}}》
		</view>
		<view class="de_content">
			<u-parse :content="content"></u-parse>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: '',
				protocolName:'',
				id: null,
			};
		},
		onLoad(options) {
			this.id = options.id
			this.handleToAllocatProtocolById()
		},
		methods: {
			//获取详情
			handleToAllocatProtocolById() {
				this.$request('wchatapi.allocatProtocolById', {
					id: this.id
				}).then(res => {
					if (res.code == 200) {
						this.content = res.result.protocolDescribe
						this.protocolName = res.result.protocolName
						
					}
				}).catch(res => {
					console.log(res);
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.detail {
		padding-top: 60rpx;
		width: 90%;
		margin: auto;
		display: flex;
		flex-direction: column;
		align-items: center;

		.de_title {
			font-weight: bold;
			font-size: 36rpx;
		}

		.de_content {
			padding-top: 40rpx;
			width: 100%;
			word-wrap: break-word;
		}

		.de_time {
			display: flex;
			align-self: flex-end;
		}
	}
</style>