<template>
	<view>
		<!-- 底部标题 -->
		<view class="back" v-if="showSelectShow">
			<view class="back-left" @tap.stop="JumpBtn(7)">
				<u-icon name="arrow-left" color="#fff" size="20"></u-icon>
				<text class="back-text" v-if="lang =='zh_CN'">第{{item.dramaSeries}}集</text>
				<text class="back-text" v-if="lang =='vi_VN'">Tập {{item.dramaSeries}}</text>
				<text class="back-text" v-if="lang =='zh_EN'">Episode {{item.dramaSeries}}</text>
			</view>
			<!-- 	<view  class="top-menu">
				<text  @tap.stop="JumpBtn(7)">111</text>
			</view>
			<image v-if="resolutionList.length" @tap.stop="openDefinition" class="top-menu" src="/static/images/dot.png" mode=""></image>
					<view class="top-menu" v-if="resolutionList.length">
				<text class="top-menu-item" @tap.stop="resolutionChange(index)" v-for="(item,index) in resolutionList" :key="index">{{item.definition}}</text>
			</view> -->
		</view>
		<view @tap.stop.prevent="moveHandle" class="footTitle" v-if="menuShow"
			:class="[vodIndex == index?(sliderDrag?'vodMenu-bright1':(moveOpacity?'vodMenu-bright2':'vodMenu-bright0')):'']">
			<view style="margin-left: 30rpx;">
				<view><text class="foot-name">{{item.dramaName}}</text></view>
				<view style="width: 500rpx;position: relative;font-size: 28rpx;" v-if="item.desc">
					<text style="width: 450rpx;" class="foot-cont"
						:class="[(item.desc.length > 33 && !expandDesc) ?'text_two':'']">{{item.desc}}</text>
				</view>
			</view>
			<view class="video-info" v-if="!showSelectShow" @tap.stop="JumpBtn(1,item)">
				<view class="video-info-left">
					<image class="icon" src="/static/icons/file-copy-fill.png"></image>
					<text v-if="lang =='zh_CN'" class="label">汇总 · 全部 第{{discussNum}}集 · 看全集</text>
					<text v-if="lang =='vi_VN'" class="label">Tổng hợp · Toàn bộ · Tập {{discussNum}} · Xem
						trọnbộ</text>
					<text v-if="lang =='zh_EN'" class="label">Summary · Full series · Episode {{discussNum}} ·
						Watchcomplete</text>
				</view>
				<uni-icons type="right" color="#fff" size="18"></uni-icons>
			</view>
			<view class="video-info" v-else @tap.stop="JumpBtn(5,item)">
				<view class="video-info-left">
					<image class="icon" src="/static/icons/file-copy-fill.png"></image>
					<text v-if="lang =='zh_CN'" class="label">汇总 · 全部 第{{discussNum}}集 · 看全集</text>
					<text v-if="lang =='vi_VN'" class="label">Tổng hợp · Toàn bộ · Tập {{discussNum}} · Xem
						trọnbộ</text>
					<text v-if="lang =='zh_EN'" class="label">Summary · Full series · Episode {{discussNum}} ·
						Watchcomplete</text>
				</view>
				<uni-icons type="right" color="#fff" size="18"></uni-icons>
			</view>
			<!-- 	<view class="video-resolution" v-if="resolutionList.length">
				<text class="video-resolution-item" @tap.stop="resolutionChange(index)" v-for="(item,index) in resolutionList"
					:key="index">{{item.definition}}</text>
			</view> -->
		</view>
		<!-- 右侧操作栏 -->
		<view class="menuBox" :style="{height:vodHeight+'px'}" @tap.stop.prevent="moveHandle">
			<view class="vodMenu"
				:class="[vodIndex == index?(sliderDrag?'vodMenu-bright1':(moveOpacity?'vodMenu-bright2':'vodMenu-bright0')):'']">
				<!-- 点赞 -->
				<view class="fabulous" @tap="JumpBtn(2)" style="position: relative;padding-top: 5rpx;">
					<view class="likeBox" :ref="'pelRef'+index">
						<view class="like-pellet" :class="'like-pellet'+j" v-for="(lt,j) in 8" :key="j"></view>
					</view>
					<view class="fabulous-image" @tap="fabulousBtn" :ref="'likeRef'+index">
						<image src="/static/icon/selectTaoxin.png" mode="" class="fabulous-image" v-if="likeStatus">
						</image>
						<image src="/static/icon/taoxin.png" mode="" class="fabulous-image" v-else></image>
					</view>
					<text class="fabulous-num" v-if="likeTotal"> {{likeTotal}}</text>
				</view>
				<!-- 评论 -->
				<view class="fabulous" style="margin-top: 30rpx;" @tap="JumpBtn(3)">
					<view class="fabulous-image" v-if="!collectStatus">
						<image src="/static/images/Frame-15.png" mode="" class="fabulous-image"></image>
					</view>
					<view class="fabulous-image" v-if="collectStatus">
						<image src="/static/images/Frame-16.png" mode="" class="fabulous-image"></image>
					</view>
					<text class="fabulous-num" v-if="collectTotal">{{collectTotal}}</text>
				</view>
				<!-- 转发 -->
				<view class="fabulous" style="margin-top: 30rpx;" @tap="JumpBtn(4)">
					<view class="fabulous-image">
						<image src="/static/icon/ward.png" mode="" class="fabulous-image"></image>
					</view>
					<text class="fabulous-num" style="font-size: 26rpx;">{{language[lang].share}}</text>
				</view>
				<view class="fabulous" style="margin-top: 30rpx;" @tap="menuBotomHide">
					<view class="fabulous-image">
						<image src="/static/images/hide.png" mode="" class="hide-image"></image>
						<!-- <image v-else src="/static/images/show.png" mode="" class="fabulous-image"></image> -->
					</view>
				</view>
				<view class="fabulous" style="margin-top: 30rpx;" v-if="resolutionList.length" @tap="definitionShow = !definitionShow">
					<view class="fabulous-image">
						<image src="/static/images/dot.png" mode="" class="fabulous-image"></image>
						<!-- <image v-else src="/static/images/show.png" mode="" class="fabulous-image"></image> -->
					</view>
				</view>

			</view>
		</view>
		<u-popup :show="show" :closeOnClickOverlay='true' :closeable='true' bgColor='#000' @close.stop="show = false"
			:round="15">
			<view class="selected-video">
				<view class="selected-video-head">
					<image class="cover" v-if="videoInfo.dramaPoster" :src="videoInfo.dramaPoster" mode=""></image>
					<view class="content">
						<view class="content-info" @tap.stop="JumpBtn(6)">
							<text class="content-info-title">{{videoInfo.dramaName}}</text>
							<uni-icons type="right" color="#fff" size="14"></uni-icons>
						</view>
						<text class="des-text">
							{{videoInfo.dramaDescribe}}
						</text>
					</view>
				</view>

				<scroll-view scroll-y="true" class="video-box">
					<view class="video-box-item" @tap.stop="pickerVideoPlay(videoIndex,videoItem)"
						:class="item.id === videoItem.id ? 'video-box-item_active':'' "
						v-for="(videoItem,videoIndex) in videoList" :key="videoItem.id">
						<text class="video-box-item-text">{{videoItem.dramaSeries}}</text>
						<view class="lock-box" v-if="videoItem.unlockStatus === 3">
							<u-icon name="lock-opened-fill" color="#fff" size="18"></u-icon>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
		<u-popup :show="definitionShow" :closeOnClickOverlay='true' :closeable='true' bgColor='#202020'
			@close.stop="definitionShow = false" :round="15">
			<view class="definitionShow">
				<view class="definitionShow-row">
					<text class="definition-label">{{language[this.lang].resolution}}</text>
					<text class="definition-value" :class="definitionIndex === index ?'active':'' " @tap.stop="resolutionChange(index)" v-for="(item,index) in resolutionList" :key="index">{{item.definition}}</text>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	// #ifndef APP-HARMONY
	import UniShare from '@/uni_modules/uni-share/js_sdk/uni-share.js';
	const uniShare = new UniShare();
	// #endif
	import api from '@/utils/config.js'
	import selectedVideo from '../tsp-menu/selected-video'
	import {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} from "vuex"
	const animation = uni.requireNativePlugin('animation')
	import apis from '@/utils/config.js'
	export default {
		components: {
			selectedVideo
		},
		props: {
			//视频部分的高度
			vodHeight: {
				type: Number,
				default: 0
			},
			//下标索引
			index: {
				type: Number,
				default: 0
			},
			//当前播放的视频下标
			vodIndex: {
				type: Number,
				default: 0
			},
			//当前视频的整个对象
			item: {
				type: Object,
				default: () => {
					return {}
				}
			},
			//数据总数
			discussNum: {
				type: Number,
				default: 0
			},
			//是否在拖动进度
			sliderDrag: {
				type: Boolean,
				default: false
			},
			//是否透明
			moveOpacity: {
				type: Boolean,
				default: false
			},
			showSelectShow: {
				type: Boolean,
				default: false
			},
			lang: {
				type: {
					type: String,
					default: false,
				}
			},
			resolutionList: {
				type: Array,
				default: () => {
					return []
				}
			},
		},
		onBackPress({
			from
		}) {
			if (from == 'backbutton') {
				this.$nextTick(function() {
					uniShare.hide()
				})
				return uniShare.isShow;
			}
		},
		computed: {
			...mapState('video', ['likeStatus', 'likeTotal', 'collectStatus', 'collectTotal', 'menuShow'])
		},
		data() {
			return {
				language: {
					zh_CN: {
						unfold: '展开',
						pack: '收起',
						share: '分享',
						watchFull: '看全集',
						episode: '第集',
						all: '全部',
						collect: '汇总',
						next: '请先解锁上一集',
						systemShare: "系统分享",
						cancelShare: "取消分享",
						videoShare: "视频分享",
						resolution:'清晰度'
					},
					vi_VN: {
						unfold: 'Mở rộng',
						pack: 'Thu gọn',
						share: 'Chia sẻ',
						watchFull: 'Xem trọn bộ',
						episode: 'Tập',
						all: 'Tất cả',
						collect: 'Tổng hợp',
						next: 'Vui lòng mở khóa tập trước trước tiên.',
						systemShare: "share",
						cancelShare: "Hủy chia sẻ",
						videoShare: "Chia sẻ video",
						resolution:'độ phân giải'
					},
					zh_EN: {
						unfold: 'Expand',
						pack: 'Collapse',
						share: 'Share',
						watchFull: 'Watch Full',
						episode: 'Episode',
						all: 'All',
						collect: 'Summary',
						next: 'Please unlock the previous episode first.',
						systemShare: "share",
						cancelShare: "Cancel share",
						videoShare: "Share video",
						resolution:'resolution'
					},
				},
				followShow: null,
				fabuTimeOut: null,
				likeNum: 0,
				pelletNum: 0,
				expandDesc: false,
				/* 点赞动画 */
				likeDropList: {
					list: [{
							transform: 'scale(1)'
						},
						{
							transform: 'scale(0)'
						},
						{
							transform: 'scale(0.5)'
						},
						{
							transform: 'scale(1)'
						},
						{
							transform: 'scale(1.2)'
						},
						{
							transform: 'scale(1)'
						},
						{
							transform: 'scale(1.1)'
						},
						{
							transform: 'scale(1)'
						}
					],
					duration: 62
				},
				/* 取消点赞动画 */
				likeCancelList: {
					list: [{
							transform: 'scale(1)'
						},
						{
							transform: 'scale(0.7)'
						},
						{
							transform: 'scale(1)'
						}
					],
					duration: 66
				},
				/* 小圆点闪出的动画 */
				pelletList: {
					list: [{
							transform: 'scale(0.5)',
							opacity: '0.8'
						},
						{
							transform: 'scale(1)',
							opacity: '1'
						},
						{
							transform: 'scale(1.1)',
							opacity: '0'
						}
					],
					duration: 166
				},
				memberId: uni.getStorageSync('id') || '',
				videoList: [],
				videoInfo: {
					dramaDescribe: '',
					dramaName: '',
					dramaPoster: '',
				},
				show: false,
				definitionShow: false,
				definitionIndex:2,
			}
		},
		methods: {
			...mapMutations('video', [
				'setMenuShow'
			]),
			...mapActions('video', ['setLike', 'getVideoInfo']),
			/* 阻止事件冒泡 */
			moveHandle(event) {
				event.stopPropagation()
			},
			menuBotomHide() {
				this.setMenuShow(!this.menuShow);
			},
			/* 旋转头像动画 */
			rotateAvatar() {
				let testEl = this.$refs['rotateImg' + this.vodIndex]
				animation.transition(testEl, {
					styles: {
						transform: 'rotate(0deg)',
					},
					duration: 0, //ms
					timingFunction: 'linear',
					delay: 0 //ms
				}, () => {
					this.rotateAvatar1();
				})
			},
			rotateAvatar1() {
				let testEl = this.$refs['rotateImg' + this.vodIndex]
				animation.transition(testEl, {
					styles: {
						transform: 'rotate(360deg)',
					},
					duration: 3000, //ms
					timingFunction: 'linear',
					delay: 0 //ms
				}, () => {
					this.rotateAvatar();
				})
			},
			/* 视频点赞动效 */
			fabulousBtn() {
				let obj = Object.assign({}, this.item)
				obj.fabulousShow = !obj.fabulousShow
				this.likeNum = 0
				this.pelletNum = 0
				let result = obj.fabulousShow ? this.likeDropList : this.likeCancelList
				this.addAnimation('likeRef', result, this.likeNum) //点赞动画
				if (obj.fabulousShow) { //小圆点闪出动画
					this.addAnimation('pelRef', this.pelletList, this.pelletNum)
				}
				this.$emit('fabulousBtn', {
					obj: obj,
					index: this.index
				}) //点赞成功
				/* clearTimeout(this.fabuTimeOut)
				this.fabuTimeOut = setTimeout(()=>{
					console.log('发送请求')
				},300) */
			},
			/* 关注动效 */
			followBtn(index) {
				let obj = Object.assign({}, this.item)
				obj.followReally = true
				this.followShow = 0
				setTimeout(() => {
					this.followShow = 1
					setTimeout(() => {
						this.followShow = 2
						setTimeout(() => {
							this.$emit('fabulousBtn', {
								obj: obj,
								index: this.index
							}) //关注成功
						}, 500)
					}, 50)
				}, 300)
			},
			/* 点击右侧菜单选项 1头像 2点赞 3评论 4转发 5旋转头像 */
			async JumpBtn(index, item) {
				let that = this;
				switch (index) {
					case 1:
						setTimeout(() => {
							uni.navigateTo({
								url: `/pages/video/testVideoInfo?dramaId=${item.dramaId}`
							})
						}, 200)
						break;
					case 2:
						uni.$u.throttle(async () => {
							that.judgment(that.toLike)
						}, 2000)
						break;
					case 3:
						uni.$u.throttle(() => {
							that.judgment(that.toCollect)
						}, 2000)
						break;
					case 4:
						this.uniShare();
						break;
					case 5:
						this.getVideData();
						break;
					case 6:
						uni.navigateTo({
							url: `/pages/video/details?dramaId=${this.item.filmDramaId}`
						})
						break;
					case 7:
						uni.navigateBack()
						break
				}
			},
			//点赞
			async toLike() {
				const data = {
					calculateType: this.likeStatus ? 2 : 1,
					dramaId: this.item.filmDramaId,
					dramaSeries: this.item.dramaSeries,
					memberId: this.memberId,
					secondType: 2,
					seriesId: this.item.id,
					sysOrgCode: apis.sysOrgCode,
					tenantId: api.tenantId,
				}
				await this.setLike(data);
				await this.getVideoInfo({
					seriesId: this.item.id,
					memberId: this.memberId,
				})
			},
			//收藏
			async toCollect() {
				const params = {
					calculateType: this.collectStatus ? 2 : 1,
					dramaId: this.item.filmDramaId,
					dramaSeries: this.item.dramaSeries,
					memberId: this.memberId,
					secondType: 3,
					seriesId: this.item.id,
					sysOrgCode: apis.sysOrgCode,
					tenantId: api.tenantId,
				}
				await this.setLike(params);
				await this.getVideoInfo({
					seriesId: this.item.id,
					memberId: this.memberId,
				})
			},
			//角色判断 
			judgment(callback) {
				const role = uni.getStorageSync('role');
				if (role === 'user') {
					callback && callback.call(this)
				} else {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				}
			},
			//获取剧集列表
			async getVideData() {
				const [error, res] = await uni.request({
					url: `${api.MPWEIXIN}/api/appApi/filmDramaSeriesList`,
					method: 'GET',
					data: {
						dramaId: this.item.filmDramaId,
						memberId: this.memberId,
						pageNo: 1,
						pageSize: 1000,
					},
					header: {
						'content-type': 'application/json', // 添加 content-type
						"X-Tenant-Id": api.tenantId,
					},
				})
				if (res.data.code === 200) {
					this.videoList = res.data.result.records;
				}
				const [errorVideoInfo, videoInfo] = await uni.request({
					url: `${api.MPWEIXIN}/api/appApi/filmDramaById`,
					method: 'GET',
					data: {
						id: this.item.filmDramaId,
					},
					header: {
						'content-type': 'application/json', // 添加 content-type
						"X-Tenant-Id": api.tenantId,
					},
				})
				this.videoInfo = videoInfo.data.result;
				this.show = true;
			},
			/* 动画方法 */
			addAnimation(name, dataList, num) {
				let testEl = this.$refs[name + this.vodIndex]
				animation.transition(testEl, {
					styles: dataList.list[num],
					duration: dataList.duration, //ms
					timingFunction: 'linear',
					delay: 0 //ms
				}, () => {
					num = num + 1
					if (num < dataList.list.length) {
						this.addAnimation(name, dataList, num);
					}
				})
			},
			//选集
			pickerVideoPlay(index, item) {
				const that = this;
				// that.setPickerVideoIndex(index);
				that.show = false;
				if (index === 0) {
					return that.$emit('pickerVideoPlay', {
						index,
						item
					});
				}
				//获取当前身份
				const role = uni.getStorageSync('role');
				//判断上一集是否收费
				const currentVideoUnlockStatus = this.videoList[index].unlockStatus === 3;
				//如果当前剧集需要解锁 角色不是游客
				if (role !== 'user' && currentVideoUnlockStatus) {
					return uni.navigateTo({
						url: '/pages/login/login'
					})
				}
				//切换剧集
				this.$emit('pickerVideoPlay', {
					index,
					item
				});
			},
			uniShare() {
				console.log(this.item, 'item')
				// #ifndef APP-HARMONY
				uniShare.show({
					content: { //公共的分享参数配置  类型（type）、链接（herf）、标题（title）、summary（描述）、imageUrl（缩略图）
						type: 0,
						href: `?dramaId=${this.item.dramaId}`,
						title: this.item.dramaName,
						summary: this.language[this.lang].videoShare,
						imageUrl: this.item.dramaPoster,
					},
					menus: [{
						"img": "/static/app-plus/sharemenu/more.png",
						"text": this.language[this.lang].systemShare,
						"share": "shareSystem"
					}],
					cancelText: this.language[this.lang].cancelShare,
				}, e => { //callback
					console.log(uniShare.isShow);
					console.log(e);
				})
				// #endif
			},
			resolutionChange(index) {
				this.definitionIndex = index;
				this.definitionShow = false;
				this.$emit('resolutionChange', index);
			},
			openDefinition() {
				console.log('触发')
			}
		},
	}
</script>

<style lang="scss" scoped>
	.menuBox {
		position: absolute;
		right: 10rpx;
		width: 115rpx;
		z-index: 8;
		justify-content: center;
	}

	.avatarMenu {
		position: absolute;
		bottom: 20px;
		right: 10rpx;
		width: 115rpx;
		z-index: 8;
		align-items: center;
		flex-direction: column;
	}

	.vodMenu {
		margin-top: 100rpx;
		width: 115rpx;
		width: 115rpx;
		align-items: center;
		flex-direction: column;
	}

	.vodMenu-bright0 {
		opacity: 1;
		transition-property: opacity;
		transition-timing-function: linear;
		transition-duration: 0.3s;
	}

	.vodMenu-bright1 {
		opacity: 0;
		transition-property: opacity;
		transition-timing-function: linear;
		transition-duration: 0.3s;
	}

	.vodMenu-bright2 {
		opacity: 0.2;
		transition-property: opacity;
		transition-timing-function: linear;
		transition-duration: 0.3s;
	}

	.vodMenu-top {
		height: 140rpx;
		width: 115rpx;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.menu-avatar {
		position: relative;
		width: 115rpx;
		height: 115rpx;
		border-radius: 115rpx;
		background-color: #FFFFFF;
		align-items: center;
		justify-content: center;
	}

	.avatar-image {
		width: 100rpx;
		height: 100rpx;
		border-radius: 100rpx;
	}

	.follow {
		position: absolute;
		bottom: 0;
		width: 40rpx;
		height: 40rpx;
		background-color: #FFFFFF;
		border-radius: 40rpx;
		align-items: center;
		justify-content: center;
	}

	.follow:active {
		transition-property: transform;
		transition-timing-function: linear;
		transition-duration: 0.4s;
		transform: scale(0.7);
	}

	.follow-guanzhu {
		width: 40rpx;
		height: 40rpx;
	}

	.guanzhu-gou {
		width: 30rpx;
		height: 30rpx;
	}

	.followActive {
		transition-property: transform;
		transition-timing-function: linear;
		transition-duration: 0.5s;
		transform: rotate(180deg);
	}

	.followHide {
		transition-property: transform;
		transition-timing-function: linear;
		transition-duration: 0.5s;
		transform: scale(0.1);
	}

	.fabulous {
		width: 100rpx;
		margin-top: 80rpx;
		align-items: center;
		flex-direction: column;
	}

	.fabulous-image {
		width: 80rpx;
		height: 80rpx;
	}

	.hide-image {
		margin: 15rpx 15rpx;
		width: 50rpx;
		height: 50rpx;
	}

	.fabulous-num {
		width: 100rpx;
		font-size: 28rpx;
		color: #FFFFFF;
		text-align: center;
		margin-top: 10rpx;
	}

	.likeBox {
		position: absolute;
		width: 100rpx;
		height: 94rpx;
		opacity: 0;
		transform: scale(0.1);
	}

	.like-pellet {
		width: 5rpx;
		height: 5rpx;
		background-color: #FF0000;
		border-radius: 5rpx;
		position: absolute;
	}

	.like-pellet0 {
		top: 10rpx;
		left: 5rpx;
	}

	.like-pellet1 {
		top: 10rpx;
		right: 5rpx;
	}

	.like-pellet2 {
		bottom: 13rpx;
		left: 13rpx;
	}

	.like-pellet3 {
		bottom: 13rpx;
		right: 13rpx;
	}

	.like-pellet4 {
		top: 0;
		left: 46rpx;
	}

	.like-pellet5 {
		bottom: 2rpx;
		left: 46rpx;
	}

	.like-pellet6 {
		left: 0;
		top: 44rpx;
	}

	.like-pellet7 {
		right: 0;
		top: 44rpx;
	}

	/* 底部标题部分 */
	.footTitle {
		position: absolute;
		bottom: 20px;
		left: 0;
		width: 750rpx;
		/* padding-left: 30rpx; */
		/* margin-left: 30rpx; */
	}

	.footTitle-commodity {
		margin-bottom: 50rpx;
		width: 400rpx;
		background-color: rgba(0, 0, 0, 0.4);
		padding: 10rpx;
		border-radius: 7rpx;
		flex-direction: row;
		align-items: center;
	}

	.footTitle-commodity-icon {
		width: 40rpx;
		height: 40rpx;
		background-color: #f98607;
		border-radius: 7rpx;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.footTitle-commodity-icon-img {
		width: 30rpx;
		height: 30rpx;
	}

	.footTitle-commodity-name {
		width: 330rpx;
		font-size: 24rpx;
		color: #FFFFFF;
		margin-left: 15rpx;
	}

	.foot-name {
		font-size: 32rpx;
		color: #FFFFFF;
		font-weight: bold;
		margin-bottom: 15rpx;
	}

	.foot-cont {
		font-size: 28rpx;
		color: #FFFFFF;
	}

	.foot-primary {
		margin-top: 15rpx;
		font-size: 25rpx;
		color: #FFFFFF;
	}

	.foot-expand {
		position: absolute;
		bottom: 0;
		right: 0;
		font-size: 25rpx;
		color: #FFFFFF;
	}

	/*字体单行省略*/
	.text_one {
		lines: 1;
	}

	/*字体两行省略*/
	.text_two {
		lines: 2;
	}

	.rotate-avatar {
		width: 95rpx;
		height: 95rpx;
		border-radius: 95rpx;
		background-color: #333333;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.rotate-image {
		width: 55rpx;
		height: 55rpx;
		border-radius: 55rpx;
	}

	.video-info {
		flex-direction: row;
		/* 最关键：横向排列 */
		align-items: center;
		justify-content: space-between;
		/* 左中右结构必备 */
		/* 垂直居中，可选 */
		width: 750rpx;
		margin-top: 20rpx;
		padding: 10rpx 16rpx;
		background-color: rgba(0, 0, 0, 0.1);
	}

	.video-info-left {
		flex-direction: row;
		flex: 1;
		/* 最关键：横向排列 */
		align-items: center;
	}

	.icon {
		width: 46rpx;
		height: 46rpx;
	}

	.label {
		margin-left: 10rpx;
		/* 控制图标与文字间距 */
		lines: 1;
		color: #fff;
		margin-left: 8px;
		font-size: 32rpx;
		/* 保持一行，可选 */
	}

	.selected-video {
		padding: 90rpx 30rpx 30rpx 30rpx;
		// background-color: #000;
		// height: 700rpx;
	}

	.selected-video-head {
		flex-direction: row;
	}

	.cover {
		width: 150rpx;
		height: 200rpx;
	}

	.content {
		margin-left: 30rpx;
		flex: 1;
	}

	.content-info {
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 30rpx;

		.content-info-title {
			font-size: 36rpx;
			font-weight: 500;
			color: #fff;
		}
	}

	.des-text {
		color: #fff;
		font-size: 30rpx;
		margin-top: 10rpx;
		lines: 2;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.video-box {
		position: relative;
		flex-direction: row;
		flex-wrap: wrap;
		margin-top: 20rpx;
		height: 500rpx;

		.video-box-item {
			flex-direction: row;
			justify-content: center;
			align-items: center;
			width: 90rpx;
			height: 90rpx;
			background: #2a2a2a;
			border-radius: 8rpx;
			margin-right: 15rpx;
			margin-bottom: 15rpx;

			.video-box-item-text {
				color: #fff;
				font-size: 24rpx;
			}
		}

		.video-box-item_active {
			background-color: rgb(25, 23, 23) !important;
		}

	}

	.lock-box {
		position: absolute;
		right: 0;
		top: 0;
		background-color: #90630F;
		border-radius: 0px 8rpx 0px 8rpx;
	}

	.back {
		position: relative;
		top: 50rpx;
		left: 20rpx;
		z-index: 999999;
		flex-direction: row;
		align-items: center;
		width: 750rpx;
		justify-content: space-between;

		.back-left {
			flex-direction: row;
			align-items: center;

			.back-text {
				color: #fff;
				font-size: 28rpx;
			}
		}

		.top-menu {
			width: 80rpx;
			height: 80rpx;
			margin-right: 40rpx;
		}
	}

	.video-resolution {
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		height: 60rpx;
		width: 750rpx;
		margin-right: 40rpx;
		background-color: rgba(0, 0, 0, .1);
		border-radius: 20rpx;

		.video-resolution-item {
			color: rgba(255, 255, 255, .7);
			font-size: 20rpx;
			padding: 0rpx 5rpx;
		}

		.active {
			color: #fff;
			font-size: 21rpx;
		}
	}

	.definitionShow {
		position: relative;
		flex-direction: row;
		flex-wrap: wrap;
		margin-top: 20rpx;
		height: 150rpx;
		padding: 40rpx 40rpx 0 40rpx;

		.definitionShow-row {
			flex-direction: row;
			justify-content: center;

			.definition-label {
				padding: 5rpx;
				color: #fff;
				font-size: 26rpx;
				height: 50rpx;
				margin-right: 20rpx;
			}

			.definition-value {
				width: 100rpx;
				text-align: center;
				margin-right: 10rpx;
				border-radius: 10rpx;
				height: 50rpx;
				color: #fff;
				padding: 5rpx;
				font-size: 24rpx;
				background-color: #2a2a2a;
			}

			.active {
				color: #F5CF02;
			}
		}
	}
</style>