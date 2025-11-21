<template>
	<view class="">
		<!-- <view class="src-appid">
			<text>提审方appid:</text>
			<input type="text" bindinput="onSrcAppidInput" :value="srcAppid" />
		</view>
		<view class="drama-id">
			<text>剧id:</text><input type="text" bindinput="onDramaidInput" :value="dramaId" />
		</view>
		<button type="primary" id="show" @click="onJumpPlayer">跳转播放页</button> -->

		<view class="">
			<view class="src-appid">
				<text>提审方appid:</text>
				<input type="text" @input="onSrcAppidInput" v-model="srcAppid" />
			</view>
			<view class="drama-id">
				<text>剧id:</text><input type="text" @input="onDramaidInput" v-model="dramaId" />
			</view>
			<button type="primary" id="show" @tap="onJumpPlayer">跳转播放页</button>
		</view>
		<button type="primary" id="show" @click="getHandpickList">精选剧集列表</button>
		<button type="primary" id="shows" @tap="cslink">测试</button>
		<!-- <Chargedialog></Chargedialog> -->
	</view>
</template>

<script>
	
	// import Chargedialog from '@/components/charge-dialog1/charge-dialog.vue';
	// import PlayerManager from '../../utils/playerManager'; // 使用 import 导入模块
	const PlayerManager = require("../../utils/playerManager.js");
	// const playletPlugin = requirePlugin("playlet-plugin");
	let playletPlugin;
	
	// 检查当前是否在小程序环境中
	if (typeof wx !== 'undefined' && wx.getSystemInfo) {
	    try {
	        // 在小程序中执行 requirePlugin
	        playletPlugin = requirePlugin("playlet-plugin");
	    } catch (error) {
	        console.error('Failed to requirePlugin in WeChat Mini Program:', error);
	    }
	} else {
	    // 在其他环境中的处理
	    console.log('This code is executed only in WeChat Mini Program environment.');
	}
	// const app = getApp();
	export default {
		data() {
			return {
				dramaId: '100149',
				srcAppid: 'wxda2c3eef7d7e3413' // 推荐的测试剧集 - 开局3000块
				// srcAppid: '100001' // 推荐的测试剧集 - 开局3000块
			}
		},
		// components:{
		// 	Chargedialog
		// },
		onLoad() {
			
			// this.srcAppid = uni.getStorageSync('SRC_APPID');
			// this.dramaId = uni.getStorageSync('DRAMAID');
			// console.log("222222222222222",this.srcAppid,this.dramaId)
			// if (this.srcAppid && this.dramaId) {
			// 	this.onJumpPlayer()
			// }
			// PlayerManager.navigateToPlayer({
			// srcAppid: data.appId ||"",
			// dramaId: data.dramaId||"",
			// serialNo: this.courseObj.serialNo||"",
			// });
			playletPlugin.onPageLoad(this._onPlayerLoad.bind(this));
		},
		onShow() {
			// playletPlugin.onPageLoad(this._onPlayerLoad.bind(this))
		},
		methods: {
			// 获取精选剧集列表
			getHandpickList(){
				this.$request('video.handpickList').then(res=>{
					console.log("获取精选剧集列表",res);
				})
			},
			_onPlayerLoad(info) {
				const playerManager = new PlayerManager()
				playerManager._onPlayerLoad(info)
			},
			clinon() {
				var that = this
				uni.login({
					provider:"weixin",
					success(res) {
						console.log(res)
						that.moopid(res.code)
					}
				})
				
			},
			cslink(){
				 uni.showToast({
				        title: this.$t('toast.loading'),
				        icon: 'loading',
				        duration: 2000,
				        position: 'bottom'
				      });
				      // 模拟加载数据的过程
				      setTimeout(() => {
				        // 数据加载完毕后，可以关闭Toast
				        uni.hideToast();
				      }, 2000);
				// this.$request('player.filmDlassifyList').then(res => {
				// 	console.log(res,"res:")
				// 	// if(res.code === 1) {
				// 	// 	this.$u.toast("登录成功")
				// 	// 	this.getUserInfo(res.data.token)
				// 	// 	this.redirectPath()
				// 	// }
				// })
			},
			moopid(code){
				var codes = code
				// GET请求示例
				uni.request({
				    url: 'http://47.120.46.16/api/noauth/encrypt/demo',// 你的API接口地址
				    method: 'GET',
					// header: {
					// 	'Content-Type': 'application/json' 
					// },
					data:{
						code:code,
						// openid:openid,
						// src_appid:'wxda2c3eef7d7e3413',
						// drama_id:'100149',
					},
				    success: (res) => {
				        console.log('GET请求成功：', res);
				    },
				    fail: (err) => {
				        console.error('GET请求失败：', err);
				    }
				});
				return
				var that = this
				  // 调用uni.request发送请求获取用户openid
				      uni.request({
				        method: 'GET',
				        url: 'https://api.weixin.qq.com/sns/jscode2session',
				        data: {
				          appid: 'wxda2c3eef7d7e3413',
				          secret: '90c74aae689afea712c2c68df3bdec0c',
				          js_code: codes,
				          grant_type: 'authorization_code'
				        },
				        success: res => {
							console.log("openid",res.data.openid)
							that.moinunbo(codes,res.data.openid)
				          // this.openid = res.data.openid
				        }
				      })
				
			},
			moinunbo(code,openid){
				// GET请求示例
				uni.request({
				    url: 'http://47.120.46.16/api/noauth/encrypt/demo',// 你的API接口地址
				    method: 'GET',
					// header: {
					// 	'Content-Type': 'application/json' 
					// },
					data:{
						code:code,
						// openid:openid,
						// src_appid:'wxda2c3eef7d7e3413',
						// drama_id:'100149',
					},
				    success: (res) => {
				        console.log('GET请求成功：', res.data);
				    },
				    fail: (err) => {
				        console.error('GET请求失败：', err);
				    }
				});
			},
			onJumpPlayer() {
				// const {
				// 	srcAppid,
				// 	dramaId
				// } = this.data
				
				const dramaId = this.dramaId
				const srcAppid = this.srcAppid
				console.log("222222222222222", srcAppid, dramaId)
				if (!srcAppid || !dramaId) {
					wx.showToast({
						icon: 'none',
						title: this.$t('toast.input_msg')
					})
					return
				}
				PlayerManager.navigateToPlayer({
					srcAppid,
					dramaId,
					// extParam: encodeURIComponent('a=b&c=d'), // 分享会携带的参数，可自定义
				})
			},
			onSrcAppidInput(e) {
				console.log("e", e);
				this.setData({
					srcAppid: e.detail.value
				})

				wx.setStorageSync('SRC_APPID', e.detail.value)
				return
			},
			onDramaidInput(e) {
				console.log("e1", e);
				this.setData({
					dramaId: e.detail.value
				})
				wx.setStorageSync('DRAMAID', e.detail.value)
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.src-appid,
	.drama-id {
		padding: 8px;
		padding-bottom: 0;
	}

	input {
		border: 1px solid rgba(0, 0, 0, 0.8);
	}

	button {
		margin-top: 8px;
	}
</style>