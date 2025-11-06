// // 配置对象，包含不同平台下的 BASE_URL
// const config = {
//     'default': '',
//     'MP-WEIXIN': 'https://47.120.46.16',
//     // 其他平台的配置可以在这里添加
// };

// // 根据当前平台获取对应的 BASE_URL
// let platform = 'MP-WEIXIN'; // 当前平台，这里以 MP-WEIXIN 为例
// let BASE_URL = config[platform] || config['default'];

// console.log('BASE_URL:', BASE_URL);



// #ifdef MP-WEIXIN
// let BASE_URL = ''
// BASE_URL = 'https://47.120.46.16'
// let BASE_URL = '', SIGN = ''
// const extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
// if(Object.keys(extConfig).length === 0) {
// 	uni.showModal({
// 		title: '未配置ext信息，请联系管理员'
// 	})
// } else {
// 	if(!extConfig.domain) {
// 		uni.showModal({
// 			title: '域名信息有误，请联系管理员'
// 		})
// 	}
// 	BASE_URL = 'http://47.120.46.16' + extConfig.domain
// 	SIGN = extConfig.sign
// }
// #endif

// // #ifdef H5
// let BASE_URL = '', SIGN = ''
// if (process.env.NODE_ENV === 'development') {
// 	BASE_URL = 'https://duanju.domain.com'
// 	SIGN = ''
// } else {
// 	BASE_URL = window.location.origin
// 	SIGN = window.location.search.replace(/\?/g, "")
// }
// // #endif

// // #ifdef APP-PLUS
// let BASE_URL = 'https://duanju.domain.com',
// 	SIGN = ''
// // #endif


// export {
// 	BASE_URL,
// 	SIGN
// }