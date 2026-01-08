import request from '@/common/request/index.js'
import apis from '@/utils/config.js'
import store from '@/common/store/index.js'
/**
 * 数据重新分组 (固定每个分组数组的长度)
 * @param { Array }  data 原数组
 * @param { Number }  chunk 每个分组数组长度
 * @return { Array }  [[chunk], [chunk], ...]
 */
const regroupLength = (data, chunk) => {
	if (!data || !data.length || !chunk) {
		console.log("error => 缺少参数!");
		return
	}
	const len = data.length,
		result = []
	for (let i = 0; i < len; i += chunk) {
		result.push(data.slice(i, i + chunk))
	}
	return result
}

/**
 * 数组重新分组 (固定分组的数量, 分组数组的长度不固定)
 * @param { Array }  data 原数组
 * @param { Number }  chunk 生成分组的个数
 * @return { Array }  [[...], [...]]
 */
const regroupAmount = (data, chunk) => {
	let result = []
	for (let index = 0; index < data.length; index++) {
		if (result[index % chunk]) {
			result[index % chunk].push(data[index])
		} else {
			result[index % chunk] = [data[index]]
		}
	}
	return result
}

/**
 * 时间戳转换日期时间
 * @param { String }  timestamp 时间戳
 * @return { String }  Y-M-D h:m
 */
const timestampToTime = (timestamp) => {
	let date = new Date(timestamp * 1000), // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
		Y = date.getFullYear() + '-',
		M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
		D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ',
		h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':',
		m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())

	// m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':',
	// s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())

	return Y + M + D + h + m
}

/**
 * 图片尺寸
 * @param { Boolean }  long 长边 = s / 短边 = s
 * @param { Number }  w 原图片宽度
 * @param { Number }  h 原图片高度
 * @param { Number }  s 短边的尺寸
 * @returns
 */
const sizePicture = (long = false, w, h, s = 450) => {
	const img = {
		w: 0,
		h: 0
	}
	if (!w || !h) {
		Promise.reject("图片尺寸异常 => 已拦截")
		return img
	}
	if (long) {
		img.w = w == h ? s : w > h ? s : (s / h) * w
		img.h = w == h ? s : w > h ? (s / w) * h : s
	} else {
		img.w = w == h ? s : w > h ? (s / h) * w : s
		img.h = w == h ? s : w > h ? s : (s / w) * h
	}

	return img
}

/**
 * 判断平台
 */
const platforms = () => {
	// #ifdef H5
	const en = navigator.userAgent.toLowerCase()
	if (en.match(/MicroMessenger/i) == 'micromessenger') {
		return 'wxOfficialAccount'
	} else {
		return 'H5'
	}
	// #endif

	// #ifdef MP-WEIXIN
	return 'wxMiniProgram'
	// #endif

	// #ifdef APP-PLUS
	return 'App'
	// #endif
}
/**
 * 获取当前运行平台
 * @returns {string}  'ios' | 'android' | 'devtools' | 'other'
 */
 function getPlatform () {
  // #ifdef H5
  // H5 端：靠 UA 区分
  const ua = navigator.userAgent.toLowerCase()
  if (/iphone|ipad|ipod/.test(ua)) return 'ios'
  if (/android/.test(ua)) return 'android'
  return 'other'
  // #endif

  // #ifndef H5
  // App、小程序、快应用端：用官方 API
  try {
    const { platform } = uni.getSystemInfoSync()
    // 微信小程序里 ios 返回 'ios'，android 返回 'android'，devtools 返回 'devtools'
    return platform.toLowerCase()
  } catch (e) {
    console.error('getPlatform error:', e)
    return 'other'
  }
  // #endif
}
/**
 * 验证密码
 */
const checkPassword = (rule, value, callback) => {
	!value && callback()
	const reg = /^(?=.*[0-9])(?=.*[a-zA-Z])[\w!@#$%^&*()-+=<>?/\[\]{}|~]{6,20}$/
	if (!reg.test(value)) {
		callback("密码格式有误")
	} else {
		callback()
	}
}

/**
 * 确认密码
 */
const checkAgainPassword = (rule, value, callback, params) => {
	!value && callback()
	if (params == value) {
		callback()
	} else {
		callback("两次密码不一致")
	}
}

/**
 * 返回上一页
 */
const navBack = () => {
	const canNavBack = getCurrentPages()
	if (canNavBack && canNavBack.length > 1) {
		uni.navigateBack()
	} else {
		try {
			history.back()
		} catch (e) {
			uni.switchTab({
				url: '/pages/home/index'
			})
		}
	}
}

/**
 * 秒转时分秒
 */
const formatTime = seconds => {
	const hours = Math.floor(seconds / 3600),
		minutes = Math.floor((seconds % 3600) / 60),
		remainingSeconds = seconds % 60,
		h = (hours < 10 ? "0" + hours : hours) + ":",
		m = (minutes < 10 ? "0" + minutes : minutes) + ":",
		s = (remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds),
		time = hours > 0 ? h + m + s : m + s

	return time;
}

/**
 * 获取字符串字符数量，中文+2，英文+1
 */
const countCharacters = str => {
	const pattern = /[^\u4e00-\u9fa5]/;
	let count = 0;
	for (let i = 0; i < str.length; i++) {
		// 检查每个字符是否为英文字符
		if (pattern.test(str.charAt(i))) {
			count++;
		} else {
			count += 2
		}
	}
	return count;
}

/**
 * 获取url参数
 */
const getUrlParams = () => {
	const url = window.location.href;
	const querys = url.substring(url.indexOf('?') + 1).split('&')
	const result = {}
	for (let i = 0; i < querys.length; i++) {
		const temp = querys[i].split('=')
		if (temp.length < 2) {
			result[temp[0]] = ''
		} else {
			result[temp[0]] = temp[1]
		}
	}
	return result
}
const tokenKey = 'token';
const getToken = () => {
	return uni.getStorageSync(tokenKey);
}
const setToken = (token) => {
	uni.setStorageSync(tokenKey, token)
}
const removeToken = () => {
	uni.removeStorageSync('tokenKey')
}
// 确保游客已登录（无 id 才会触发）
export const ensureGuestLogin = async () => {
	const userId = uni.getStorageSync('id')
	if (userId) return
	try {
		// 1. 游客登录
		const loginRes = await request('login.guestLogin', {})
		if (loginRes.code !== 200) {
			uni.$u.toast('游客登录失败')
			throw new Error('游客登录失败')
		}
		store.dispatch('user/getUserInfo', loginRes.result.token)
		// 2. 绑定账号
		const accountData = {
			accountNumber: loginRes.result.accountNumber,
			sysOrgCode: apis.sysOrgCode,
		}

		const accountRes = await request(
			'common.memberAccountNumberAdd',
			accountData
		)

		if (accountRes.code !== 200) {
			uni.$u.toast('游客账号创建失败')
			throw new Error('游客账号创建失败')
		}

		// 3. 持久化用户信息
		const {
			id,
			tenantId,
			sysOrgCode,
			memberId,
		} = accountRes.result

		const storageMap = {
			id,
			tenantId,
			sysOrgCode,
			memberId,
		}

		Object.keys(storageMap).forEach(key => {
			uni.setStorageSync(key, storageMap[key])
		})
		uni.setStorageSync('role', 'visitor');

	} catch (err) {
		uni.$u.toast('[游客登录异常]')
		throw new Error('[游客登录异常]')
		// 这里可以统一 toast / 上报 / fallback
	}
}
const getAppPlatform = () => {
	// #ifdef APP-PLUS
	const p = uni.getSystemInfoSync().platform // 只有 'ios' 或 'android'
	return p === 'ios' ? 'ios' : 'android'
	// #endif
	return '' // 非 App 端返回空串，方便统一判断
}
const judgment = (callback) => {
	const role = uni.getStorageSync('role');
	if (role === 'user') {
		callback && callback();
	} else {
		uni.navigateTo({
			url: '/pages/login/login'
		})
	}
}
export default {
	regroupLength,
	timestampToTime,
	sizePicture,
	regroupAmount,
	platforms,
	checkPassword,
	checkAgainPassword,
	navBack,
	formatTime,
	countCharacters,
	getUrlParams,
	setToken,
	getToken,
	removeToken,
	ensureGuestLogin,
	judgment,
	getAppPlatform,
	getPlatform
}