import apiList from './api.js';
import apiMoen from '../../utils/config.js';
import i18n from '@/utils/i18n/index.js'
import store from '@/common/store/index.js'

// 组装接口路径
const getApiPath = path => {
	let apiArray = path.split("."),
		api = apiList
	apiArray.forEach(v => {
		api = api[v]
	});
	return api
}

// 发起请求的函数
const request = (path, data, error = true, customHeaders = {}) => {
	console.log(customHeaders, 'customHeaders')
	const config = {
		'default': '',
		'MP-WEIXIN': apiMoen.MPWEIXIN, //线上测试
		// 其他平台的配置可以在这里添加
	};

	// 根据当前平台获取对应的 BASE_URL
	let platform = 'MP-WEIXIN'; // 当前平台，这里以 MP-WEIXIN 为例
	let BASE_URL = config[platform] || config['default'];

	console.log('BASE_URL:', BASE_URL);

	if (!BASE_URL) {
		uni.showModal({
			title: '未检测到域名地址，请联系管理员'
		})
		throw (`未检测到域名, 已阻止此次API请求`)
	}
	const api = getApiPath(path)
	if (!api) throw (`接口未定义, 已阻止此次API请求`)
	const url = BASE_URL + api.url,
		method = api.method
	// 通过Promise封装请求, 返回异步请求结果
	return new Promise(async (resolve, reject) => {
		uni.request({
			url,
			data,
			method,
			header: {
				'X-Tenant-Id': apiMoen.tenantId,
				// 'X-Access-Token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NjI4OTQxNTAsInVzZXJuYW1lIjoiMTU4NzIzNzU0N0BxcS5jb20ifQ.VI-KZgFro8DJFpfgOuTWonli85ji-zFOGr64P438xYs',
				'X-Access-Token':store.state.user.token,
				...customHeaders,
			},
			success: res => {
				// console.log('xxx',this.$t('model_box.sys_tip'))
				if (res.data.code === 200 || res.data.code === 0) {
					resolve(res.data)
				} else if (res.data.code === 401) {
					store.dispatch('user/logout')
					// console.log('xxx',this.$t('model_box.sys_tip'))
					uni.showModal({
						title: i18n.t('model_box.sys_tip'),
						content: i18n.t('model_box.login_required'),
						confirmText:i18n.t('model_box.confirm'),
						cancelText:i18n.t('model_box.cancel'),
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/login/login'
								})
							}
						}
					})
				} else {
					uni.showToast({
						title: res.data.message,
						icon: 'none'
					})
					reject(res);
				}
			},
			fail: err => {
				uni.showToast({
					title: `服务器开小差`,
					icon: 'none'
				})
				reject(err)
			}
		})
	})
}

export default request