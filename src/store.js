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
  userInfo: {
    messages: [{1: 'test', 2: 'test'}],
    notifications: [],
    tasks: []
  }
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
  SET_PRIVATE_KEY (state, privateKey) {
    state.privateKey = privateKey
  },
  SET_NETWORK_TYPE (state, network) {
    state.network = network
    console.log(bitcore.Networks)
    console.log(network)

    state.network = network
    bitcore.Networks.defaultNetwork = bitcore.Networks[network]

    console.log('Network ' + bitcore.Networks.defaultNetwork)
  }
}

export default new Vuex.Store({
  state,
  mutations
})
