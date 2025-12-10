<template>
	<view class="app-container">
		<!-- 导航栏 -->
		<status-bar />
		<u-navbar :title="$t(`creation.page_title`)" :fixed='true' :autoBack="true" bgColor='transparent'
			:titleStyle='titleStyle' leftIconColor='#fff' :placeholder='true' />

		<!-- 表单区域 -->
		<view class="form-card">
			<view class="row">
				<text class="label">{{$t(`creation.videoName`)}}</text>
				<view class="input-box">
					<input type="text" v-model="videoName" :placeholder="placeholderText" />
				</view>
			</view>
			<!-- 1. 上传封面 -->
			<view class="row">
				<text class="label">{{$t(`creation.uploadCover`)}}</text>
				<view class="upload-box" @tap="chooseCover">
					<cover-image v-if="coverPath" class="close" @tap.stop='closeUpload(0)'
						src="/static/images/Frame-11.png"></cover-image>
					<image v-if="coverPath" :src="coverPath" mode="aspectFill" class="preview-img" />
					<text v-else class="upload-txt">+ {{$t(`creation.chooseCover`)}}</text>
				</view>
			</view>

			<!-- 2. 上传视频 -->
			<view class="row">
				<text class="label">{{$t(`creation.uploadVideo`)}}</text>
				<view class="video-box" @tap="chooseVideo">
					<cover-image class="close" v-if="videoPath" @tap.stop='closeUpload(1)'
						src="/static/images/Frame-11.png"></cover-image>
					<video v-if="videoPath" :src="videoPath" class="preview-video" controls poster="" />
					<text v-else class="upload-txt">+ {{$t(`creation.chooseVideo`)}}</text>
				</view>
			</view>

			<!-- 3. 提交按钮 -->
			<view class="btn-box">
				<view class="submit-btn" @tap="handleSubmit">{{$t(`creation.submit`)}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import i18n from '@/utils/i18n/index.js'
	import {
		ossUpload
	} from '@/js_sdk/jason-alioss-upload/oss.js'
	import apis from '@/utils/config.js'
	import {
		mapState
	} from 'vuex'

	export default {
		data() {
			return {
				coverUrl: '', // 封面回显地址
				videoUrl: '', // 视频回显地址
				coverPath: '', // 封面后台保存路径（提交用）
				videoPath: '', // 视频 OSS 路径（提交用）
				videoName: '',
				titleStyle: {
					color: '#fff',
					fontFamily: 'PingFang SC, PingFang SC',
					fontWeight: 800,
					color: '#FFFFFF',
				},
				placeholderText: i18n.t('creation.inputText'),
			}
		},
		computed: {
			...mapState('user', ['uid'])
		},
		methods: {
			/* 1. 选封面 */
			chooseCover() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						uni.showLoading({
							title: this.$t('creation.uploadLoading')
						})
						const temp = res.tempFiles[0]
						this.coverUrl = temp.path // 本地预览
						this.uploadCover(temp) // 上传后台
					}
				})
			},
			/* 上传封面到业务服务器 */
			uploadCover(file) {
				uni.uploadFile({
					url: `${apis.MPWEIXIN}/api/appApi/uploadFile`,
					filePath: file.path,
					name: 'file',
					formData: {
						createBy: this.uid
					},
					header: {
						'X-Tenant-Id': apis.tenantId
					},
					success: (upRes) => {
						const {
							success,
							result
						} = JSON.parse(upRes.data)
						if (success) {
							this.coverPath = result.savePath
							uni.showToast({
								title: this.$t('creation.videoSuccess'),
								icon: 'none'
							})
						}
					},
					fail: () => uni.showToast({
						title: this.$t('creation.coverFail'),
						icon: 'none'
					}),
					complete() {
						uni.hideLoading()
					}
				})
			},

			/* 2. 选视频 */
			chooseVideo() {
				uni.chooseVideo({
					count: 1,
					compressed: true,
					sourceType: ['album'],
					success: async (res) => {
						uni.showLoading({
							title: this.$t('creation.uploadLoading'),
						})
						const MAX_SIZE = 500 * 1024 * 1024; // 50 MB，按需改
						const mb = (res.size / 1024 / 1024).toFixed(2);
						const maxMB = MAX_SIZE / 1024 / 1024;

						if (mb > MAX_SIZE) {
							uni.showToast({
								title: this.$t('creation.videoTooLarge').replace('{size}', maxMB),

								icon: 'none'
							});
							return;
						}
						this.videoUrl = res.tempFilePath // 本地预览
						const {
							success,
							data
						} = await ossUpload(res.tempFilePath, res.tempFilePath, 'video/')
						uni.hideLoading();
						if (success) {
							this.videoPath = data
							uni.showToast({
								title: this.$t('creation.videoSuccess'),
								icon: 'none'
							})
						} else {
							uni.showToast({
								title: this.$t('creation.videoFail'),
								icon: 'none'
							})
						}
					}
				})
			},

			/* 3. 最终提交 */
			handleSubmit() {
				if (!this.coverPath || !this.videoPath) {
					uni.showToast({
						title: this.$t('creation.needBoth'),
						icon: 'none'
					})
					return
				}
				this.$request('video.memberVideoUpload', {
					memberId: uni.getStorageSync('id'),
					pictureUrl: this.coverPath,
					videoUrl: this.videoPath,
					tenantId: apis.tenantId,
					videoName: this.videoName,
				}).then(res => {
					uni.$u.toast(this.$t('creation.submitSuccess'))
					setTimeout(() => {
						uni.navigateBack();
					}, 500)
				})
			},
			closeUpload(val) {
				switch (val) {
					case 0:
						this.coverUrl = '';
						this.coverPath = '';
						break;
					case 1:
						this.videoUrl = '';
						this.videoPath = '';
						break;
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.app-container {
		min-height: 100vh;
		background-image: url('/static/images/navbar-bg.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		color: #fff;
	}

	.nav-box {
		height: 88rpx;
		padding: 0 32rpx;
		display: flex;
		align-items: center;
		position: relative;

		.nav-back {
			font-size: 40rpx;
			margin-right: 24rpx;
		}

		.nav-title {
			font-size: 34rpx;
			font-weight: 800;
		}
	}

	.form-card {
		margin: 32rpx;
		padding: 32rpx;
		background: rgba(255, 255, 255, .08);
		border-radius: 16rpx;
	}

	.row {
		margin-bottom: 40rpx;
	}

	.label {
		display: block;
		font-size: 30rpx;
		margin-bottom: 16rpx;
	}

	.upload-box {
		width: 200rpx;
		height: 200rpx;
		border: 2rpx dashed rgba(255, 255, 255, .6);
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;

		.close {
			position: absolute;
			right: 10rpx;
			top: 1 0rpx;
			padding: 5rpx;
			border-radius: 50%;
			background-color: #666;
			z-index: 999;
			color: #fff;
			width: 20rpx;
			height: 20rpx;
		}

		.upload-txt {
			font-size: 28rpx;
			color: rgba(255, 255, 255, .6);
		}

		.preview-img,
		.preview-video {
			width: 100%;
			height: 100%;
			border-radius: 8rpx;
		}
	}

	.btn-box {
		margin-top: 60rpx;
	}

	.submit-btn {
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		background: linear-gradient(135deg, #FFD500 0%, #FF9A00 100%);
		border-radius: 44rpx;
		font-size: 32rpx;
		font-weight: 600;
		color: #fff;
	}

	/* 大视频容器 */
	.video-box {
		width: 100%;
		height: 420rpx;
		/* 约 9:16 比例 */
		border: 2rpx dashed rgba(255, 255, 255, .6);
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;

		.close {
			position: absolute;
			right: 20rpx;
			top: 20rpx;
			padding: 5rpx;
			border-radius: 50%;
			background-color: #666;
			z-index: 999;
			color: #fff;
			width: 20rpx;
			height: 20rpx;
		}

		.upload-txt {
			font-size: 32rpx;
			color: rgba(255, 255, 255, .6);
		}

		.preview-video {
			width: 100%;
			height: 100%;
			border-radius: 12rpx;
		}
	}

	/* 封面保持原尺寸不变 */
	.upload-box {
		width: 200rpx;
		height: 200rpx;
	}

	.input-box {
		padding: 20rpx;
		border-radius: 20rpx;
		border: 2rpx solid #f7f7f7;
	}
</style>