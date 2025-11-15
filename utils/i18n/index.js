import Vue from "vue";
//引入vue-i18n
import VueI18n from "vue-i18n";
Vue.use(VueI18n);
//引入本地自己创建的中英文js语言包(注意路径改为自己的本地js路径)
import viLocale from "./json/vi-VN.js";
import zhLocale from "./json/zh-CN.js";
//注册vue-i18n实例i18n，并引入语言文件
const i18n = new VueI18n({
  locale: 'vi_VN',		//这里的locale对应的是当前的语言标识。
  messages: {
    zh_CN:zhLocale,
    vi_VN:viLocale,
  }
});

export default i18n;
