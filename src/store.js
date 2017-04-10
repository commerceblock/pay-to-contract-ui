import Vue from 'vue'
import Vuex from 'vuex'
import Networks from 'bitcore-lib/lib/networks'
import HDPublicKey from 'bitcore-lib/lib/hdpublickey'
import contract from 'pay-to-contract-lib/lib/contract'
import { generateQRData } from './helpers'

Vue.use(Vuex)

const state = {
  callingAPI: false,
  searching: '',
  serverURI: 'http://10.110.1.136:8080',
  privateKey: null,
  network: null,
  invoiceRequestData: null,
  invoiceData: null
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
    Networks.defaultNetwork = Networks[network]
    console.log('Default Network:' + Networks.defaultNetwork)
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
    const paymentBaseHDPublicKey = paymentIdentityHDPublicKey.derive(paymentBasePath)
    const paymentBasePublicKey = paymentBaseHDPublicKey.toString()
    const paymentBaseAddress = paymentBaseHDPublicKey.publicKey
      .toAddress()
      .toString()
    const invoiceRequestFileName = 'invoice-request.json'
    const invoiceRequestFileData = generateQRData({
      payment_id: paymentId,
      contract_hash: contractHash,
      payment_identity_public_key: paymentIdentityPublicKey,
      payment_identity_address: paymentIdentityAddress,
      payment_base_public_key: paymentBasePublicKey,
      payment_base_address: paymentBaseAddress
    })
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
    const signedContractHash = metaData.signedContractHash
    const paymentAddressPath = contract.derivePath(signedContractHash)
    const paymentBasePublicKey = metaData.paymentBasePublicKey
    const paymentBaseHDPublicKey = new HDPublicKey(paymentBasePublicKey)
    const paymentAddressHDPublicKey = paymentBaseHDPublicKey.derive(paymentAddressPath)
    const paymentAddressPublicKey = paymentAddressHDPublicKey.publicKey.toString()
    const paymentAddressAddress = paymentAddressHDPublicKey.publicKey.toAddress().toString()
    const invoiceFileName = 'invoice.json'
    const invoiceFileData = generateQRData({
      signed_contract_hash: signedContractHash,
      paymentAddressPublicKey: paymentAddressPublicKey,
      paymentAddressAddress: paymentAddressAddress
    })
    state.invoiceData = {
      signedContractHash,
      paymentAddressPublicKey,
      paymentAddressAddress,
      invoiceFileName,
      invoiceFileData
    }
  },
  CLEAR_INVOICE_DATA (state) {
    state.invoiceData = null
  }
}

const getters = {
  privateKey: (state) => state.privateKey,
  invoiceRequestData: (state) => state.invoiceRequestData,
  invoiceData: (state) => state.invoiceData
}

export default new Vuex.Store({
  state,
  mutations,
  getters
})
