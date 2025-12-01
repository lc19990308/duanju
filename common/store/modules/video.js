import request from 'common/request/index.js'
import store from '../index.js'

export default {
	namespaced: true,
	state: {
		likeStatus: '',
		likeTotal: '',
		collectStatus: '',
		collectTotal: '',
		pickerList:[],
	},
	mutations: {
		setLikeStatus(state, val) {
			state.likeStatus = val
		},
		setLikeTotal(state, val) {
			state.likeTotal = val
		},
		setCollectStatus(state, val) {
			state.collectStatus = val
		},
		setCollectTotal(state, val) {
			state.collectTotal = val
		},
	},
	actions: {
		//点赞追剧
		async getVideoInfo({
			commit,
			dispatch,
			getters,
			state
		}, params) {
			const result = await new Promise((resolve, reject) => {
				request("video.selectByIdAndMemberId", params)
					.then(res => {
						console.log(res.result.collectTotal,'res.result.collectTotal',res.result.collectStatus)
						commit("setLikeStatus", res.result.likeStatus)
						commit("setLikeTotal", res.result.likeTotal)
						commit("setCollectStatus", res.result.collectStatus)
						commit("setCollectTotal", res.result.collectTotal)
						console.log('点赞追剧')
						resolve(res)
					})
					.catch(err => {
						reject(err)
					})
			})
			return result
		},
		//点赞
		async setLike({
			commit,
			dispatch,
			getters,
			state
		}, params) {
			const result = await new Promise((resolve, reject) => {
				console.log('setLike')
				request("video.likes", params)
					.then(res => {
						resolve(res)
					})
					.catch(err => {
						reject(err)
					})
			})
			return result
		},

	}
}