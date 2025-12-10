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
const setLang = () => {
	const lang = uni.getStorageSync('lang')
	let originLang = '';
	switch (lang) {
		case 'zh_CN':
			originLang = 'zh'
			break;
		case 'zh_EN':
			originLang = 'en'
			break;
		case 'vi_VN':
			originLang = 've'
			break;
	}
	return originLang;
}
// 发起请求的函数
const request = (path, data, error = true, customHeaders = {}) => {
	const config = {
		'default': '',
		'MP-WEIXIN': apiMoen.MPWEIXIN, //线上测试
		// 其他平台的配置可以在这里添加
	};

	// 根据当前平台获取对应的 BASE_URL
	let platform = 'MP-WEIXIN'; // 当前平台，这里以 MP-WEIXIN 为例
	let BASE_URL = config[platform] || config['default'];
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
				'X-Access-Token': store.state.user.token,
				'x-lang': setLang(),
				...customHeaders,
			},
			success: res => {
				if (res.data.code === 200 || res.data.code === 0) {
					resolve(res.data)
				} else if (res.data.code === 401) {
					store.dispatch('user/logout')
					uni.showModal({
						title: i18n.t('model_box.sys_tip'),
						content: i18n.t('model_box.login_required'),
						confirmText: i18n.t('model_box.confirm'),
						cancelText: i18n.t('model_box.cancel'),
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
				// uni.showToast({
				// 	title: `服务器开小差`,
				// 	icon: 'none'
				// })
				reject(err)
			}
		})
	})
}

export default request