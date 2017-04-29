import Vue from 'vue'
import Vuex from 'vuex'
import Networks from 'bitcore-lib/lib/networks'
import HDPublicKey from 'bitcore-lib/lib/hdpublickey'
import contract from 'pay-to-contract-lib/lib/contract'
import { generateQRData } from './helpers'
import _ from 'lodash'

Vue.use(Vuex)

function initialState () {
  return {
    privateKey: null,
    network: null,
    invoiceRequestData: {},
    invoiceData: {},
    redeemContractData: {}
  }
}

const state = initialState()

const mutations = {
  SET_NETWORK_TYPE (state, networkType) {
    if (Networks[networkType] !== Networks.defaultNetwork) {
      state.network = Networks[networkType]
      Networks.defaultNetwork = Networks[networkType]
    } else {
      state.network = Networks.defaultNetwork
    }
    console.log('Active Network:' + Networks.defaultNetwork)
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
    console.log('paymentId: ' + paymentId)
    const paymentIdentityPublicKey = paymentIdentityHDPublicKey.toString()
    const paymentIdentityAddress = paymentIdentityHDPublicKey.publicKey
      .toAddress()
      .toString()
    const paymentBasePath = contract.derivePath(contractTemplateHash)
    console.log('paymentBasePath: ' + paymentBasePath)
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
    state.invoiceRequestData = {}
  },
  GENERATE_FULFILL_CONTRACT_MODAL_DATA (state, metaData) {
    const { signedContractHash, paymentBasePublicKey } = metaData
    const paymentAddressPath = contract.derivePath(signedContractHash)
    const paymentBaseHDPublicKey = new HDPublicKey(paymentBasePublicKey)
    console.log('paymentAddressPath: ' + paymentAddressPath)
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
    state.invoiceData = {}
  },
  GENERATE_REDEEM_CONTRACT_MODAL_DATA (state, metaData) {
    const { paymentId, contractTemplateHash, signedContractHash } = metaData
    console.log('paymentId: ' + paymentId)
    const paymentBaseRelativePathPath = contract.derivePath(contractTemplateHash).substring(2) // remove m/ prefix
    console.log('paymentBaseRelativePathPath: ' + paymentBaseRelativePathPath)
    const paymentAddressRelativePath = contract.derivePath(signedContractHash).substring(2) // remove m/ prefix
    console.log('paymentAddressRelativePath: ' + paymentAddressRelativePath)
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
    state.redeemContractData = {}
  },
  RESET (state) {
    const initial = initialState()
    // since state is a proxy (observer), we can't set state instance directly,
    // rather we should update properties by name
    _.forOwn(initial, (val, key) => { state[key] = val })
  }
}

const getters = {
  privateKey: (state) => state.privateKey,
  network: (state) => state.network,
  invoiceRequestData: (state) => state.invoiceRequestData,
  invoiceData: (state) => state.invoiceData,
  redeemContractData: (state) => state.redeemContractData
}

export default new Vuex.Store({
  state,
  mutations,
  getters
})
