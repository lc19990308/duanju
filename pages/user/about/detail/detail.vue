<template>
	<view class="detail">
		<u-navbar :title="protocolName" :titleStyle='titleStyle' bgColor='transparent' leftIconColor='#fff'
			:autoBack="true" :placeholder='true' :fixed='true'>
		</u-navbar>
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
	page {
		background-color: #000;
		background-image: url('/static/images/navbar-bg.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-position: 100% 100%;
	
	}
	.detail {
		padding-top: 60rpx;
		width: 90%;
		margin: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #d1d1d1;

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