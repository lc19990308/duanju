<template>
	<view class="app-container">
		<u-navbar title="Thay đổi tên" :autoBack="true" :placeholder='true' rightText='保存' />
		<view class="form">
			<view class="upload-box">
				<view class="avatar">
					<view class="upload-icon">
						<u-icon name="plus" color="#fff" size="28"></u-icon>
					</view>
					<view class="avatar-shade"></view>
				</view>
				<view class="upload-tips">
					Upload ảnh đại diện
				</view>
			</view>
			<u--form :model="form" ref="uForm" labelPosition='top' labelWidth='120' :borderBottom='false'
				:labelStyle='labelStyle'>
				<u-form-item label="Tên người dùng" prop="name" :borderBottom='false'>
					<u-input v-model="form.name" border='none'  placeholder='Visitor'
						 />
				</u-form-item>
			</u--form>
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
					name: '',

				},
				rules: {
					name: [{
						required: true,
						message: '请输入姓名',
						trigger: ['blur', 'change']
					}]
				},
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #000000;
	}

	.upload-box {
		width: 678rpx;
		height: 308rpx;
		margin: 60rpx auto 0 auto;
		border-radius: 0px 0px 0px 0px;

		.avatar {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 168rpx;
			height: 168rpx;
			margin: 0 auto 0 auto;
			background: red;
			border-radius: 50%;
			border: 5rpx solid #A8A8A8;

			.avatar-shade {
				position: absolute;
				top: 0;
				left: 0;
				width: 168rpx;
				height: 168rpx;
				border-radius: 50%;
				opacity: .5;
			}
		}

		.upload-tips {
			margin-top: 26rpx;
			text-align: center;
			font-family: Inter, Inter;
			font-weight: 400;
			font-size: 28rpx;
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
</style>