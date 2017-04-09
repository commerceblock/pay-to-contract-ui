import Vue from 'vue'
import Vuex from 'vuex'
import bitcore from 'bitcore-lib'
import contract from 'pay-to-contract-lib/lib/contract'

Vue.use(Vuex)

const state = {
  callingAPI: false,
  searching: '',
  serverURI: 'http://10.110.1.136:8080',
  privateKey: null,
  network: null,
  invoiceRequestData: null
}

const mutations = {
  TOGGLE_LOADING (state) {
    state.callingAPI = !state.callingAPI
  },
  TOGGLE_SEARCHING (state) {
    state.searching = (state.searching === '') ? 'loading' : ''
  },
  SET_NETWORK_TYPE (state, network) {
    state.network = network
    bitcore.Networks.defaultNetwork = bitcore.Networks[network]
    console.log('Default Network:' + bitcore.Networks.defaultNetwork)
  },
  SET_PRIVATE_KEY (state, privateKey) {
    state.privateKey = privateKey
  },
  SET_INVOICE_REQUEST_DATA (state, data) {
    if (data) {
      const paymentIdentityHDPublicKey = state.privateKey
        .derive(data.paymentId)
        .hdPublicKey
      data.paymentIdentityPublicKey = paymentIdentityHDPublicKey.toString()
      data.paymentIdentityAddress = paymentIdentityHDPublicKey.publicKey
        .toAddress()
        .toString()
      const paymentBasePath = contract.derivePath(data.contractHash)
      const paymentBaseHDPublicKey = state.privateKey
        .derive(paymentBasePath)
        .hdPublicKey
      data.paymentBasePublicKey = paymentBaseHDPublicKey.toString()
      data.paymentBaseAddress = paymentBaseHDPublicKey.publicKey
        .toAddress()
        .toString()
    }
    state.invoiceRequestData = data
  }
}

const getters = {
  privateKey: (state) => state.privateKey,
  invoiceRequestData: (state) => state.invoiceRequestData
}

export default new Vuex.Store({
  state,
  mutations,
  getters
})
