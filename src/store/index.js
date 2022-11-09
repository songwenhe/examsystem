import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
function setItem(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value))
}
function getItem(key) {
  const str = sessionStorage.getItem(key)
  try {
    return JSON.parse(str)
  } catch (error) {
    return ''
  }
}
export default new Vuex.Store({
  state: {
    postDetail: {},
    contest: getItem('currentContest'),
    problem: {}
  },
  getters: {},
  mutations: {
    setPostDetail(state, payload) {
      state.postDetail = payload
    },
    setContest(state, payload) {
      state.contest = payload
      setItem('currentContest', payload)
    },
    setProblem(state, payload) {
      state.problem = payload
    }
  },
  actions: {},
  modules: {}
})
