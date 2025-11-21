<!-- components/swiper-3d/swiper-3d.vue -->
<template>
	<swiper class="swiper-3d" :style="heightStyle" :current="innerCurrent" :duration="duration" circular autoplay
		previous-margin="175rpx" next-margin="175rpx" @change="onChange">
		<swiper-item v-for="(item, index) in list" :key="index" @click="onTap(item)">
			<view class="swiper-3d-item" :class="{
          active: innerCurrent === index,
          left: innerCurrent > index,
          right: innerCurrent < index
        }">
				<image class="auto-image" :src="item.image" mode="widthFix" />
				<!-- 如果外部需要自定义覆盖层，可在这里放 slot -->
				<slot :item="item" :index="index" />
			</view>
		</swiper-item>
	</swiper>
</template>

<script>
	export default {
		name: 'Swiper3d',
		props: {
			// 轮播图数组，必填
			list: {
				type: Array,
				required: true
			},
			// 初始索引
			current: {
				type: Number,
				default: 0
			},
			//  swiper 高度，默认 600rpx
			height: {
				type: String,
				default: '500rpx'
			},
			// 切换动画时长
			duration: {
				type: Number,
				default: 1000
			}
		},
		data() {
			return {
				innerCurrent: this.current
			}
		},
		computed: {
			heightStyle() {
				return `height:${this.height}`
			}
		},
		watch: {
			current(val) {
				this.innerCurrent = val
			}
		},
		methods: {
			onChange(e) {
				this.innerCurrent = e.detail.current
				this.$emit('change', e)
			},
			onTap(item) {
				this.$emit('touch', item)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.swiper-3d {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.swiper-3d-item {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		transform: scale(0.8);
		transition: all 0.5s ease;
		overflow: hidden;
		border-radius: 16rpx;
	}

	.swiper-3d-item.left {
		transform: scale(0.9) rotateY(-40deg);
	}

	.swiper-3d-item.right {
		transform: scale(0.9) rotateY(40deg);
	}

	.swiper-3d-item.active {
		transform: scale(1);
	}

	.auto-image {
		width: 100%;
		height: auto;
		vertical-align: top;
	}
</style>