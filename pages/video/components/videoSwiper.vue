<template>
	<swiper class="m-tiktok-video-swiper" circular :current="current" :vertical="true" duration="300"
		@change="swiperChange">
		<swiper-item v-for="(item, index) in displaySwiperList" :key="index">
			<view class="swiper-item" @click="handleClick">
				<video :id="'video__' + index" :controls="controls" :autoplay="false" :loop="loop" @ended="ended"
					object-fit='fill' @controlstoggle="controlstoggle" @play="onPlay" @error="onError"
					class="m-tiktok-video-player" play-btn-position='center' :src="item.videoUrl"
					v-if="index === 0 || !isFirstLoad">
					<cover-view class="video_menu">
						<cover-image v-if="item.dramaPoster && displayIndex != index" :src="item.dramaPoster"
							class="m-tiktok-video-poster" mode="aspectFit"></cover-image>
						<slot :item="item"></slot>
					</cover-view>
				</video>
			</view>
		</swiper-item>
	</swiper>
</template>

<script>
	export default {
		props: {
			videoList: {
				type: Array,
				default: () => []
			},
			loop: {
				type: Boolean,
				default: true
			},
			controls: {
				type: Boolean,
				default: true
			},
			autoplay: {
				type: Boolean,
				default: true
			},
			autoChange: {
				type: Boolean,
				default: false
			},
			loadMoreOffsetCount: {
				type: Number,
				default: 2
			}
		},

		data() {
			return {
				originList: [],
				displaySwiperList: [],

				displayIndex: 0,
				originIndex: 0,
				current: 0,

				oid: 0,
				showControls: "",
				toggleShow: true,

				videoContexts: [],
				isFirstLoad: true,

				loadTimer: null
			};
		},

		watch: {
			videoList: {
				handler(val) {
					if (val && val.length) {
						this.originList = val;
						if (this.isFirstLoad || !this.videoContexts.length) {
							this.initSwiperData();
							this.initVideoContexts();
						}
					}
				},
				immediate: true
			}
		},

		onLoad() {
			this.loadTimer = setTimeout(() => {
				this.isFirstLoad = false;
				clearTimeout(this.loadTimer);
			}, 5000);
		},

		onUnload() {
			clearTimeout(this.loadTimer);
		},

		methods: {
			initVideoContexts() {
				this.videoContexts = [
					uni.createVideoContext("video__0", this),
					uni.createVideoContext("video__1", this),
					uni.createVideoContext("video__2", this)
				];
			},

			onPlay(e) {
				this.$emit("play", e);
			},

			onError(e) {
				this.$emit("error", e);
			},

			handleClick(e) {
				this.toggleShow = !this.toggleShow;
				this.$emit("click", e);
			},

			ended() {
				if (this.autoChange) {
					if (this.displayIndex < 2) {
						this.current = this.displayIndex + 1;
					} else {
						this.current = 0;
					}
				}
				this.$emit("ended");
			},

			/** 初始化三屏列表 */
			initSwiperData(originIndex = this.originIndex) {
				const len = this.originList.length;
				const display = [];

				display[this.displayIndex] = this.originList[originIndex];
				display[this.displayIndex - 1 === -1 ? 2 : this.displayIndex - 1] =
					this.originList[originIndex - 1 === -1 ? len - 1 : originIndex - 1];

				display[this.displayIndex + 1 === 3 ? 0 : this.displayIndex + 1] =
					this.originList[originIndex + 1 === len ? 0 : originIndex + 1];

				this.displaySwiperList = display;

				this.videoContexts.forEach(v => v && v.stop());

				setTimeout(() => {
					if (this.autoplay) {
						uni.createVideoContext("video__" + this.displayIndex, this).play();
					}
				}, 500);

				this.$emit("change", {
					index: originIndex,
					detail: this.originList[originIndex]
				});

				let pCount = len - this.loadMoreOffsetCount;
				if (originIndex === pCount) {
					this.$emit("loadMore");
				}
			},

			/** swiper 滚动事件 */
			swiperChange(e) {
				const current = e.detail.current;
				this.isFirstLoad = false;
				const len = this.originList.length;

				// 向后
				if (this.displayIndex - current === 2 || this.displayIndex - current === -1) {
					this.originIndex = this.originIndex + 1 === len ? 0 : this.originIndex + 1;
					this.displayIndex = this.displayIndex + 1 === 3 ? 0 : this.displayIndex + 1;
					this.oid = this.originIndex - 1;
					this.initSwiperData(this.originIndex);
				}
				// 向前
				else if (this.displayIndex - current === -2 || this.displayIndex - current === 1) {
					this.originIndex = this.originIndex - 1 === -1 ? len - 1 : this.originIndex - 1;
					this.displayIndex = this.displayIndex - 1 === -1 ? 2 : this.displayIndex - 1;
					this.oid = this.originIndex + 1;
					this.initSwiperData(this.originIndex);
				}

				this.toggleShow = true;
			},

			controlstoggle(e) {
				this.showControls = e.detail.show;
				this.$emit("controlstoggle", e);
			}
		}
	};
</script>
<style lang="scss" scoped>
	.m-tiktok-video-swiper,
	.m-tiktok-video-player {
		height: 100vh;
		width: 100vw;
		background-color: #000;
		position: relative;
		z-index: 1;
	}

	.m-tiktok-video-swiper {
		.swiper-item {
			position: relative;
			height: 100vh;
			width: 100vw;
		}

		.m-tiktok-video-poster {
			// background-color: #000;
			position: absolute;
			width: 100%;
			height: 100%;
		}
	}
</style>