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
  GENERATE_CREATE_CONTRACT_MODAL_DATA (state, metaData) {
    const paymentId = metaData.paymentId
    const contractTemplateHash = metaData.contractTemplateHash
    const paymentIdentityHDPublicKey = state.privateKey
      .derive(paymentId, true)
      .hdPublicKey
    const paymentIdentityPublicKey = paymentIdentityHDPublicKey.toString()
    const paymentIdentityAddress = paymentIdentityHDPublicKey.publicKey
      .toAddress()
      .toString()
    const paymentBasePath = contract.derivePath(contractTemplateHash)
    const paymentBaseHDPublicKey = paymentIdentityHDPublicKey.derive(paymentBasePath)
    const paymentBasePublicKey = paymentBaseHDPublicKey.toString()
    const paymentBaseAddress = paymentBaseHDPublicKey.publicKey
      .toAddress()
      .toString()
    const invoiceRequestFileName = 'invoice-template.json'
    const invoiceRequestFileData = generateQRData({
      payment_id: paymentId,
      contract_template_hash: contractTemplateHash,
      payment_identity_public_key: paymentIdentityPublicKey,
      payment_identity_address: paymentIdentityAddress,
      payment_base_public_key: paymentBasePublicKey,
      payment_base_address: paymentBaseAddress
    })
    state.invoiceRequestData = {
      paymentId,
      contractHash: contractTemplateHash,
      paymentIdentityPublicKey,
      paymentBasePublicKey,
      paymentBaseAddress,
      invoiceRequestFileData,
      invoiceRequestFileName
    }
  },
  CLEAR_CREATE_CONTRACT_MODAL_DATA (state) {
    state.invoiceRequestData = null
  },
  GENERATE_FULFILL_CONTRACT_MODAL_DATA (state, metaData) {
    const { signedContractHash, paymentBasePublicKey } = metaData
    const paymentAddressPath = contract.derivePath(signedContractHash)
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
  CLEAR_FULFILL_CONTRACT_MODAL_DATA (state) {
    state.invoiceData = null
  },
  GENERATE_REDEEM_CONTRACT_MODAL_DATA (state, metaData) {
    const { paymentId, contractTemplateHash, signedContractHash } = metaData
    const paymentBaseRelativePathPath = contract.derivePath(contractTemplateHash).substring(2) // remove m/ prefix
    const paymentAddressRelativePath = contract.derivePath(signedContractHash).substring(2) // remove m/ prefix
    const paymentAddressAbsolutePath = `m/${paymentId}'/${paymentBaseRelativePathPath}/${paymentAddressRelativePath}`
    const paymentAddressPrivateKey = state.privateKey.derive(paymentAddressAbsolutePath).privateKey.toWIF()
    const fileName = 'invoice-prv.json'
    const fileData = generateQRData({
      payment_address_private_key: paymentAddressPrivateKey
    })
    state.redeemContractData = {
      paymentAddressPrivateKey,
      fileName,
      fileData
    }
  },
  CLEAR_REDEEM_CONTRACT_MODAL_DATA (state) {
    state.redeemContractData = null
  }
}

const getters = {
  privateKey: (state) => state.privateKey,
  invoiceRequestData: (state) => state.invoiceRequestData,
  invoiceData: (state) => state.invoiceData,
  redeemContractData: (state) => state.redeemContractData
}

export default new Vuex.Store({
  state,
  mutations,
  getters
})
