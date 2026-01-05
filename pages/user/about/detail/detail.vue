<template>
	<view class="detail">
		<statusBar />
		<u-navbar :title="protocolName" :fixed='true' :titleStyle='titleStyle' bgColor='transparent'
			leftIconColor='#fff' :autoBack="true" :placeholder='true' />
		<scroll-view scroll-y="true" class="de_content">
			<u-parse :content="content"></u-parse>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: '',
				protocolName: '',
				id: null,
				titleStyle: {
					color: '#fff'
				}
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
					console.log('res',res)
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
		padding: 0rpx 30rpx 0 30rpxx;
		min-height: 100vh;
		background-image: url('/static/images/navbar-bg.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-position: 100% 100%;


		color: #d1d1d1;

		.de_title {
			font-weight: bold;
			font-size: 36rpx;
		}

		.de_content {
			padding: 0 30rpx 0 30rpx;
			width: 100%;
			height: 100vh;
			word-wrap: break-word;
		}

		.de_time {
			display: flex;
			align-self: flex-end;
		}
	}
</style>