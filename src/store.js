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
  GENERATE_INVOICE_REQUEST_DATA (state, metaData) {
    const paymentId = metaData.paymentId
    const contractHash = metaData.contractHash
    const paymentIdentityHDPublicKey = state.privateKey
      .derive(paymentId)
      .hdPublicKey
    const paymentIdentityPublicKey = paymentIdentityHDPublicKey.toString()
    const paymentIdentityAddress = paymentIdentityHDPublicKey.publicKey
      .toAddress()
      .toString()
    const paymentBasePath = contract.derivePath(contractHash)
    const paymentBaseHDPublicKey = state.privateKey
      .derive(paymentBasePath)
      .hdPublicKey
    const paymentBasePublicKey = paymentBaseHDPublicKey.toString()
    const paymentBaseAddress = paymentBaseHDPublicKey.publicKey
      .toAddress()
      .toString()
    const invoiceRequestFileName = `invoice-request-${paymentId}.json`
    const fileContent = {
      payment_id: paymentId,
      contract_hash: contractHash,
      payment_identity_public_key: paymentIdentityPublicKey,
      payment_identity_address: paymentIdentityAddress,
      payment_base_public_key: paymentBasePublicKey,
      payment_base_address: paymentBaseAddress
    }
    const invoiceRequestFileData = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fileContent, null, 2))
    state.invoiceRequestData = {
      paymentId,
      contractHash,
      paymentIdentityPublicKey,
      paymentBasePublicKey,
      paymentBaseAddress,
      invoiceRequestFileData,
      invoiceRequestFileName
    }
  },
  CLEAR_INVOICE_REQUEST_DATA (state) {
    state.invoiceRequestData = null
  },
  GENERATE_INVOICE_DATA (state, metaData) {
  },
  CLEAR_INVOICE_DATA (state) {
    // state.invoiceRequestData = null
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
