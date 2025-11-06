# porter-tuniaoswiper3
TuniaoUi for porter-tuniaoswiper3 v0.0.1| by 白日梦想家 2023-6-30

使用方式：
```
Tips:本插件完美贴合图鸟UI，如果需获得更好的使用体验请引用图鸟UI:https://ext.dcloud.net.cn/plugin?id=7088

<template>
	<!-- 渲染组件 -->
	<tuniaoswiper3 ref="tuniaoswiper3"  :cardCur="cardCur" :regular-show="true" @callBack="callBack"></tuniaoswiper3>
</template>

<script>
	//引用组件
	import tuniaoswiper3 from "@/uni_modules/porter-tuniaoswiper3/components/porter-tuniaoswiper3/porter-tuniaoswiper3.vue"
	export default {
		components: {
			tuniaoswiper3, //注册组件
		},
		data() { 
			return {
				swiperList:  [{
					id: 0,
					type: 'image',
					name: '新年快乐，恭喜发财',
					url: 'https://tnuiimage.tnkjapp.com/bless/bless-1.jpg',
					pngurl: 'https://tnuiimage.tnkjapp.com/swiper/c4d1.png'
				}, {
					id: 1,
					type: 'image',
					name: '年年有福，开门大红',
					url: 'https://tnuiimage.tnkjapp.com/bless/bless-2.jpg',
					pngurl: 'https://tnuiimage.tnkjapp.com/swiper/c4d2.png'
				}, {
					id: 2,
					type: 'image',
					name: '眼疾手快，票子多多',
					url: 'https://tnuiimage.tnkjapp.com/bless/bless-3.jpg',
					pngurl: 'https://tnuiimage.tnkjapp.com/swiper/c4d3.png'
				}, {
					id: 3,
					type: 'image',
					name: '如虎添亿，其乐融融',
					url: 'https://tnuiimage.tnkjapp.com/bless/bless-4.jpg',
					pngurl: 'https://tnuiimage.tnkjapp.com/swiper/c4d4.png'
				}], //数据源
				cardCur: 0, //当前选中下标
			}
		},
		methods: {
			//点击了立即体验的回调方法
			callBack(v) {
				console.log(v) // 返回当前下标
			}
		}
	}
</script>

<style>
</style>
	 
```
```
props结构:
swiperList:数据源
cardCur:当前选中值
duration:滑动动画时长 
interval:自动切换时间间隔
circular:是否采用衔接滑动，即播放到末尾后重新回到开头
autoplay:是否自动切换 
contentColor:内容文字颜色- 固定内容包括切换内容
regularShow:是否显示固定内容
regularContent:固定内容
swiperList结构
[{
	id: 3,
	type: 'image',
	name: '如虎添亿，其乐融融',
	url: 'https://tnuiimage.tnkjapp.com/bless/bless-4.jpg',
	pngurl: 'https://tnuiimage.tnkjapp.com/swiper/c4d4.png'
},]
```
仅供开发，如作它用所承受的法律责任一概与作者无关
图鸟文档地址:[](https://vue2.tuniaokj.com/)
uniapp插件社区:[](https://ext.dcloud.net.cn/publisher?id=356088)
*使用TuniaoUi开发扩展与插件时，请注明基于tuniao字眼
## 图鸟开源项目

[![开源项目](https://tnuiimage.tnkjapp.com/uniapp_market/qr-code-new3.jpg "开源项目")](https://tnuiimage.tnkjapp.com/uniapp_market/qr-code-new3.jpg "开源项目")
