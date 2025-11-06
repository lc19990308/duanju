<template>
	<view class="set">
		<u-cell-group :border="false">
			<!-- <u-cell title="扣费设置" :border="false">
				<text slot="value">
					<u-switch v-model="value" @change="change"></u-switch>
				</text>
			</u-cell> -->
			<u-cell title="服务电话" :border="false">
				<text slot="value">400-115-1741</text>
			</u-cell>
			<u-cell title="退出登录" :border="false" @click="login">
			</u-cell>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: false
			}
		},
		methods: {
			change(e) {
				console.log('change', e);
			},
			login() {
				uni.navigateTo({
					url: '/pages/user/login/login'
				})
				uni.removeStorageSync('id');
			}
		}
	}
</script>

<style>

</style>
