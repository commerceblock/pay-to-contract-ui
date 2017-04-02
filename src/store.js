import Vue from 'vue'
import Vuex from 'vuex'
import Mnemonic from 'bitcore-mnemonic'
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
  SET_PRIVATE_KEY_SEED (state, privateKeySeed) {
    console.log(Mnemonic)

    state.privateKey = bitcore.HDPrivateKey.fromSeed(privateKeySeed)
    console.log(state.privateKey)
  },
  SET_NETWORK_TYPE (state, network) {
    state.network = network
    console.log(bitcore.Networks)
    console.log(network)

    state.network = network
    bitcore.Networks.defaultNetwork = bitcore.Networks[network]

    console.log('Default Network:' + bitcore.Networks.defaultNetwork)
  }
}

const getters = {
  privateKey: (state) => state.privateKey
}

export default new Vuex.Store({
  state,
  mutations,
  getters
})
