<template>
	<view class="app-container">
		<u-navbar title="Liên hệ h hỗ trợ khách hàng" bgColor='transparent' leftIconColor='#fff' :autoBack="true"
			:placeholder='true'>
			<template slot='center'>
				<view class="tabs">
					<view class="tabs-item" :class="current === 0 ? 'tabs-item_active':'' " @tap="tabChange(0)">
						Phản hồi ý kiến
					</view>
					<view class="tabs-item" :class="current === 1 ? 'tabs-item_active':'' " @tap="tabChange(1)">
						Lịch sử
					</view>
				</view>
			</template>
		</u-navbar>
		<view class="form" v-if="current === 0">
			<u--form :model="form" ref="uForm" :rules='rules' labelPosition='top' labelWidth='120' :borderBottom='false'
				:labelStyle='labelStyle'>
				<u-form-item label="email điện tử" prop="name" :borderBottom='false'>
					<u--textarea v-model="form.content" :placeholderStyle='placeholderStyle'
						placeholder="Vui lòng mô tả chi tiết câu hỏi và phản hồi của bạn"></u--textarea>
				</u-form-item>
				<u-form-item label="mật khẩu" prop="name" :borderBottom='false'>
					<view class="upload-box" v-if="form.picture.length === 0" @tap="uploadImage">
						<view class="upload-item">
							<image class="icon" src="/static/images/Frame-45.png" mode=""></image>
						</view>
					</view>
					<view class="upload-box" v-else>
						<view class="upload-item" v-for="(item,index) in form.picture" :key='index'>
							<image class="cover" :src="item.picture" mode=""></image>
						</view>
					</view>
				</u-form-item>
			</u--form>
			<u-button class="submt-btn" @click="submit">đăng ký</u-button>
		</view>
		<view class="list" v-if="current === 1">
			<view class="list-item" v-for="(item,index) in  list" :key="index">
				<view class="item-row">
					<view class="label">{{item.content}}</view>
				</view>
				<view class="time">{{item.createTime}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	// import {
	// 	mapState,
	// } from "vuex"
	import apis from '@/utils/config.js'
	import apiMoen from '@/utils/config.js';
	export default {
		data() {
			return {
				current: 0,
				placeholderStyle: 'color: #666;',
				titleStyle: {
					color: '#fff',
					fontFamily: 'PingFang SC, PingFang SC',
					fontWeight: 800,
					color: '#FFFFFF',
				},
				labelStyle: {
					color: '#FFFFFF',
					fontFamily: 'Inter, Inter',
					fontWeight: 400,
					fontsize: '32rpx',
				},
				form: {
					content: '',
					picture: [],
					createBy: '',
					tenantId: apiMoen.tenantId,
				},
				rules: {
					picture: [{
						required: true,
						message: '请选择图片',
						trigger: ['blur', 'change']
					}],
					content: [{
						required: true,
						message: '请输入',
						trigger: ['blur', 'change']
					}]
				},
				placeholderStyle: {
					color: '#666'
				},
				api: apis.MPWEIXIN,
				query: {
					pageNo: 1,
					pageSize: 10,
					createBy: '',
					tenantId: apiMoen.tenantId,
				},
				list:[],
				total:0,
			}
		},
		// computed: {
		// 	...mapState('user', ['uid']),
		// },
		methods: {
			tabChange(val) {
				this.query.pageNo = 1;
				this.list = [];
				this.current = val;
				switch (this.current) {
					case 1:
						this.getList();
						break;
				}
			},
			uploadImage() {
				let that = this;
				uni.chooseImage({
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						uni.uploadFile({
							url: `${that.api}/api/appApi/uploadFile`, //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
								createBy: that.form.createBy
							},
							header: {
								'X-Tenant-Id': apiMoen.tenantId
							},
							success: (uploadFileRes) => {
								const res = JSON.parse(uploadFileRes.data);
								that.form.picture.push({
									picture: res.result.savePath
								})
							}
						});
					}
				});
			},
			submit() {
				this.$refs.uForm.validate().then(res => {
					this.$request('user.addFeedback', {
						...this.form,
					}).then(res => {
						this.resetForm();
					})
				})
			},
			resetForm() {
				this.form.content = '';
				this.form.picture = '';
			},
			getList() {
				this.$request('user.feedbackList', {
					...this.query,
				}).then(res => {
					uni.stopPullDownRefresh();
					this.list = this.list.concat(res.result.records);
					this.total = res.result.total;
				})
			},
		},
		onLoad() {
			this.form.createBy = uni.getStorageSync('id');
			this.query.createBy = uni.getStorageSync('id');
			this.getList();
		},
		onPullDownRefresh() {
			this.list = [];
			this.query.pageNo = 1;
			this.getList();
		},
		onReachBottom() {
			if(this.total < this.list.length){
				this.query.total+=1;
				this.getList();
			}
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

	.tabs {
		display: flex;
		justify-content: center;
		width: 60%;
		margin: 0 auto;
	}

	.tabs-item {
		flex: 1;
		text-align: center;
		width: 205px;
		height: 88rpx;
		line-height: 88rpx;
		font-family: Inter, Inter;
		font-weight: 400;
		font-size: 32rpx;
		color: #999999;
	}

	.tabs-item_active {
		color: #fff;
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

	::v-deep .u-textarea {
		background: #282828;
	}
	::v-deep .uni-textarea-textarea{
		color: #fff;
	}
	::v-deep .uni-input-input {
		color: #f7f7f7;
	}

	.input-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 24rpx;
	}

	.upload-box {
		margin-top: 12rpx;

		.upload-item {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 256rpx;
			height: 256rpx;
			background: #282828;
			border-radius: 40rpx;

			.icon {
				width: 112rpx;
				height: 112rpx;
			}

			.cover {
				width: 100%;
				height: 100%;
			}
		}
	}

	.submt-btn {
		width: 678rpx;
		height: 88rpx;
		margin: 86rpx auto 0 auto;
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

	.list-item {
		width: 678rpx;
		margin: 16rpx auto 0 auto;
		background: #2F2D34;
		box-sizing: border-box;
		padding: 26rpx 24rpx;
		border-radius: 20rpx;
		box-shadow: 2rpx 2rpx 2rpx #2F2D34;

		.item-row {
			margin-top: 17rpx;
			display: flex;
			justify-content: space-between;
			font-family: Inter, Inter;
			font-weight: 400;
			font-size: 30rpx;
			color: #D1D1D1;
		}

		.time {
			text-align: right;
			font-family: Inter, Inter;
			font-weight: 400;
			font-size: 24rpx;
			color: #666666;
		}
	}
</style>