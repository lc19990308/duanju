import Vue from "vue";
//引入vue-i18n
import VueI18n from "vue-i18n";
Vue.use(VueI18n);
//引入本地自己创建的中英文js语言包(注意路径改为自己的本地js路径)
import vi_VN from "./json/vi-VN.js";
import zh_CN from "./json/zh-CN.js";
import zh_EN from "./json/zh-EN.js";
//注册vue-i18n实例i18n，并引入语言文件
const i18n = new VueI18n({
	locale: uni.getStorageSync('lang') || 'vi_VN', //这里的locale对应的是当前的语言标识。
	messages: {
		zh_CN: zh_CN,
		vi_VN: vi_VN,
		zh_EN:zh_EN,
	},
	silentTranslationWarn: true
});

export default i18n;