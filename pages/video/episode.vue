<template>
	<view class="actor-name">
		<!-- <view class="" @click="showOpen">
			剧集弹窗
		</view> -->
		<!-- 剧集列表 -->
		<view class="episode-listing">
			<uv-popup round=20 ref="popups" mode="bottom" @change="change" custom-style="min-height: 1000rpx;">
				<view class="actor-boxs">
					<view class="actor-box">
						<view class="actor-head">
							<image :src="filmDrama.dramaPoster" mode="aspectFill"></image>
						</view>
						<view class="actor-name" @click.stop="skips">
							<view class="actor-name-box">
								<text>{{filmDrama.dramaName}}</text>
								<uv-icon name="arrow-right" color="#333" size="18"></uv-icon>
							</view>
							<view class="info">
								{{filmDrama.dramaDescribe}}
							</view>
						</view>
					</view>
					<uv-tabs :list="selectedList" :lineHeight="0" @click="clickks"></uv-tabs>
					<!-- #ifdef H5 -->
					<view class="drama-num">
						<view :style="getStyle(item, sid)" @click="episodeSwitching(item,index,1)"
							v-for="(item,index) in SeriesList.slice(0, 30)" :key="index" class="drama-num-box"
							v-if="onShowTab == 0">
							{{item.dramaSeries}}
							<view class="lock-fill" v-if="item.unlockStatus !== 1">
								<uv-icon name="lock-fill" color="#fff" size="14"></uv-icon>
							</view>
						</view>
						<view :style="getStyle(item, sid)" @click="episodeSwitching(item,index+30,2)"
							v-for="(item,index) in SeriesList.slice(30, 60)" :key="index" class="drama-num-box"
							v-if="onShowTab == 1">
							{{item.dramaSeries}}
							<view class="lock-fill" v-if="item.unlockStatus !== 1">
								<uv-icon name="lock-fill" color="#fff" size="14"></uv-icon>
							</view>
						</view>
						<view :style="getStyle(item, sid)" @click="episodeSwitching(item,index+60,3)"
							v-for="(item,index) in SeriesList.slice(60, 90)" :key="index" class="drama-num-box"
							v-if="onShowTab == 2">
							{{item.dramaSeries}}
							<view class="lock-fill" v-if="item.unlockStatus !== 1">
								<uv-icon name="lock-fill" color="#fff" size="14"></uv-icon>
							</view>
						</view>
						<view :style="getStyle(item, sid)" @click="episodeSwitching(item,index+90,4)"
							v-for="(item,index) in SeriesList.slice(90, 120)" :key="index" class="drama-num-box"
							v-if="onShowTab == 3">
							{{item.dramaSeries}}
							<view class="lock-fill" v-if="item.unlockStatus !== 1">
								<uv-icon name="lock-fill" color="#fff" size="14"></uv-icon>
							</view>
						</view>
					</view>
					<!-- #endif -->
				</view>
			</uv-popup>
		</view>
	</view>
</template>

<script>
	const PlayerManager = require("../../utils/playerManager.js");
	import apiMoen from '../../utils/config.js';
	export default {
		data() {
			return {
				onShowTab: 0,
				SeriesList: [],
				moindex: 1,
				// show: false,
				videoList: [],
				videoQuery: {
					tenantId: apiMoen.tenantId,
					sysOrgCode: apiMoen.sysOrgCode,
				},
				dramaId: this.dramaId,
				filmDrama: {},
				totalEpisodes: null, // Replace with your actual totalEpisodes value
				list: [],
				pageNo: 1,
				pageSize: 120,
				jumuIndex: 0,
				selectedList: [], // This will be dynamically set based on totalEpisodes
				sid: 0,
				styles: {
					backgroundColor: '#F2F5F7', // 默认背景颜色
					color: '#000',
				}
			}
		},
		props: {
			dramaId: {
				type: String, // 这里假设 dramaId 是字符串类型，根据实际情况调整
				required: true // 如果父组件没有传递 dramaId，会发出警告
			}
		},
		onLoad() {
			this.getVideoList()
			this.filmDramaById()
			this.filmDramaSeriesList()
		},
		mounted() {
			this.setSelectedList();
		},
		methods: {
			doSomething() {
				// 子组件的方法
				console.log('Something done by the child component');
			},
			change(e) {
				console.log('弹窗状态改变：', e);
			},
			// 跳转至剧目详情
			skips() {
				console.log(1111)
				// 处理页面跳转逻辑
				uni.navigateTo({
					url: '/pages/video/details?dramaId=' + this.dramaId
				});
				this.$refs.popups.close();
			},
			// 剧集切换 
			episodeSwitching(item, index) {
				// if (item.unlockStatus == 2) {

				// } else if (item.unlockStatus == 3) {
				// 	// 调用购买剧集接口
				// 	uni.request({
				// 		// url: MYurl + '/api/wxApi/buyDramaSeries',
				// 		url: apiMoen.MPWEIXIN + '/api/wxApi/buyDramaSeries',
				// 		method: 'POST',
				// 		header: {
				// 			'content-type': 'application/json', // 添加 content-type
				// 			"X-Tenant-Id": uni.getStorageSync('tenantId')
				// 		},
				// 		data: {
				// 			memberId: uni.getStorageSync('id'), //用户ID
				// 			dramaId: item.filmDramaId, //剧集ID
				// 			sysOrgCode: uni.getStorageSync('sysOrgCode'), //部门ID
				// 			tenantId: uni.getStorageSync('tenantId'), //租户ID
				// 			seriesSeries: item.dramaSeries, //解锁的剧集ID
				// 			unlockState: false //剧集是否解锁状态
				// 		},
				// 		success: (res) => {
				// 			console.log('++购买成功返回的数据x', res)
				// 			console.log('++encryptedData', res.encryptedData)
				// 			// 如果余额充足,则提示购买成功
				// 			if (res.data.code !== 600) {
				// 				if (res.data.message != '') {
				// 					uni.showToast({
				// 						title: res.data.message,
				// 						icon: 'success',
				// 						duration: 1200,
				// 					});
				// 				}
				// 				this.getEncryptData({
				// 					serialNo: serialNo,
				// 				}).then(res => {
				// 					// 购买成功之后重新获取后台加密后的数据
				// 					// this.pm.isCanPlay({
				// 					// 	data: res.encryptedData,
				// 					// 	serialNo: serialNo,
				// 					// })
				// 				})
				// 			} else {
				// 				console.log('++购买成功返回的数据1', res)
				// 				if (res.data.message != '') {
				// 					// uni.showToast({
				// 					// 	title: res.data.message,
				// 					// 	icon: 'success',
				// 					// 	duration: 2000,
				// 					// });
				// 				}
				// 				// pm.showChargeDialog()
				// 			}
				// 		}
				// 	})
				// }
				console.log("this.剧集切换", item)
				var mainIndex = 0
				if (index > 0) {
					mainIndex = index - 1
				}
				if (this.SeriesList[mainIndex].unlockStatus != 1) {
					uni.showToast({
						title: this.$t('toast.please_unlock'),
						icon: 'none',
						duration: 2000,
					})
					return
				}
				this.sid = item.dramaSeries
				this.moindex = item.dramaSeries
				this.jumuIndex = index
				this.$emit('changeValue', index);
				this.$refs.popups.close();
			},
			// 显示剧集弹窗详情
			showOpen(ok, mon) {
				this.dramaId = mon
				this.$refs.popups.open();
				this.filmDramaSeriesList()
				this.filmDramaById()
				this.moindex = ok
				console.log("this.totalEpisodes111", mon)
			},

			// 剧集列表
			filmDramaSeriesList() {
				this.$request('video.filmDramaSeriesList', {
					pageNo: this.pageNo,
					pageSize: this.pageSize,
					dramaId: this.dramaId,
					memberId: uni.getStorageSync('id')
				}).then(res => {
					console.log("获取剧集列表11111111111111111111111111", res)
					if (res.code != 200) {
						uni.showToast({
							title: this.$t('toast.sys_error'),
							icon: 'none',
							duration: 2000 // 提示框显示时长
						});
					} else {
						this.SeriesList = res.result.records
					}
				}).catch(err => {
					console.log(err)
				})
			},
			// 剧目详情
			filmDramaById() {
				this.$request('video.filmDramaById', {
					id: this.dramaId
				}).then(res => {
					console.log("获取剧目详情", res)
					if (res.code != 200) {
						uni.showToast({
							title: this.$t('toast.sys_error'),
							icon: 'none',
							duration: 2000 // 提示框显示时长
						});
					} else {
						this.pageSize = res.result.totalEpisodes
						this.filmDrama = res.result
						this.totalEpisodes = parseFloat(res.result.totalEpisodes)
						this.setSelectedList();
						console.log("this.totalEpisodes", this.totalEpisodes)
					}
				}).catch(err => {
					console.log(err)
				})
			},

			// tab切换
			setSelectedList() {
				this.selectedList = []
				// this.filmDramaById()
				// console.log("this.totalEpisodes111333", this.totalEpisodes)
				if (this.totalEpisodes > 0 && this.totalEpisodes <= 30) {
					this.list[0].name = '1-' + this.totalEpisodes
					this.selectedList.push(this.list[0]);
				}
				if (this.totalEpisodes > 30 && this.totalEpisodes <= 60) {
					this.selectedList.push(this.list[0]);
					this.list[1].name = '31-' + this.totalEpisodes
					this.selectedList.push(this.list[1]);
				}
				if (this.totalEpisodes > 60 && this.totalEpisodes <= 90) {
					this.selectedList.push(this.list[0]);
					this.selectedList.push(this.list[1]);
					this.list[2].name = '61-' + this.totalEpisodes
					this.selectedList.push(this.list[2]);
				}
				if (this.totalEpisodes > 90 && this.totalEpisodes <= 120) {
					this.selectedList.push(this.list[0]);
					this.selectedList.push(this.list[1]);
					this.selectedList.push(this.list[2]);
					this.list[3].name = '91-' + this.totalEpisodes
					this.selectedList.push(this.list[3]);
				}
				console.log(this.selectedList, 'this.selectedList')
			},
			clickks(name) {
				this.onShowTab = name.index
				// console.log('Clicked:', name);
				// console.log('this.onShowTab:', this.onShowTab);
				// this.pageNo = name.index + 1
				// console.log('this.pageNo:', this.pageNo);
				// this.filmDramaSeriesList()
				// this.episodeSwitching()
			},

			getStyle(item, sid) {
				console.log('item.dramaStatus:', item.dramaStatus);
				if (item.dramaSeries === this.moindex) {
					// 选中免费剧集及已解锁剧集显示样式
					return {
						...this.styles,
						backgroundColor: '#1A1A1A',
						color: "#fff",
					};
					// } else if (item.dramaSeries === sid && item.uploadStatus == 1) {
				}
				return
				if (item.dramaSeries === sid && item.unlockStatus != 1) {
					// 选中免费剧集及已解锁剧集显示样式
					return {
						...this.styles,
						backgroundColor: 'rgba(25, 185, 204, 0.1)',
						color: "#19B9CC",
					};
					// } else if (item.dramaSeries === sid && item.uploadStatus == 1) {
				} else if (item.dramaSeries === this.moindex && item.unlockStatus == 3) {
					// 未解锁剧集显示样式
					return {
						...this.styles,
						backgroundColor: '#90630F',
						color: '#fff',
					}
				} else if (item.uploadStatus == 1) {
					// 选中未解锁剧集显示样式
					return {
						...this.styles,
						backgroundColor: 'rgba(223, 183, 157, 0.1)',
						color: '#90630F',
					};
				} else {
					return {
						...this.styles,
						backgroundColor: '#F2F5F7',
						color: '#000',
					};
				}
			},

			// 显示演员详情
			open() {
				this.$refs.popup.open();
			},
			// 跳转播放
			openVideoDetail(lItems) {
				PlayerManager.navigateToPlayer({
					srcAppid: uni.getStorageSync('srcAppid'),
					dramaId: lItems.dramaId,
					// extParam: encodeURIComponent('a=b&c=d'), // 分享会携带的参数，可自定义
				})
			},
			// 获取视频列表
			getVideoList() {
				this.$request('video.filmDramaList', this.videoQuery).then(res => {
					// console.log("视频列表:", res);
					if (res.code != 200) {
						uni.showToast({
							title: '视频列表获取失败',
							icon: 'none',
							duration: 2000 // 提示框显示时长
						});
					}
					this.videoList = res.result
					console.log("this.videoList视频列表:", this.videoList);
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	@import 'episode-listing.scss';
</style>