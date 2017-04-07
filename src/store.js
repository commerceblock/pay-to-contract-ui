import Vue from 'vue'
import Vuex from 'vuex'
import bitcore from 'bitcore-lib'

Vue.use(Vuex)

const state = {
  callingAPI: false,
  searching: '',
  serverURI: 'http://10.110.1.136:8080',
  privateKey: null,
  network: null,
  items: [
  ]
}

const mutations = {
  TOGGLE_LOADING (state) {
    state.callingAPI = !state.callingAPI
  },
  TOGGLE_SEARCHING (state) {
    state.searching = (state.searching === '') ? 'loading' : ''
  },
  SET_USER (state, user) {
    state.user = user
  },
  SET_TOKEN (state, token) {
    state.token = token
  },
  SET_NETWORK_TYPE (state, network) {
    state.network = network
    state.network = network

    bitcore.Networks.defaultNetwork = bitcore.Networks[network]

    console.log('Default Network:' + bitcore.Networks.defaultNetwork)
  },
  SET_PRIVATE_KEY (state, privateKey) {
    state.privateKey = privateKey
  },
  ADD_ITEM (state, item) {
    state.items.push(item)
  }
}

const getters = {
  privateKey: (state) => state.privateKey,
  items: (state) => state.items
}

export default new Vuex.Store({
  state,
  mutations,
  getters
})
