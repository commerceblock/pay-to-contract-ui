import Vue from 'vue'
import Vuex from 'vuex'
import Networks from 'bitcore-lib/lib/networks'
import HDPublicKey from 'bitcore-lib/lib/hdpublickey'
import contractUtil from 'pay-to-contract-lib/lib/contract'
import { generateFileData } from './helpers'
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
    const contractId = metaData.contractId
    const contractHash = metaData.contractTemplateHash
    const contractIdHDPublicKey = state.privateKey
      .derive(contractId, true)
      .hdPublicKey
    console.log('contractId: ' + contractId)
    const contractIdPublicKey = contractIdHDPublicKey.toString()
    const paymentBasePath = contractUtil.derivePath(contractHash)
    console.log('paymentBasePath: ' + paymentBasePath)
    const paymentBaseHDPublicKey = contractIdHDPublicKey.derive(paymentBasePath)
    const paymentBasePublicKey = paymentBaseHDPublicKey.toString()
    const invoiceMerchantFileName = 'invoice-merchant.json'
    const invoiceMerchantFileData = generateFileData({
      contract_id: contractId,
      contract_hash: contractHash,
      contract_id_public_key: contractIdPublicKey,
      payment_base_public_key: paymentBasePublicKey
    })
    const invoiceCustomerFileName = 'invoice-customer.json'
    const invoiceCustomerFileData = generateFileData({
      contract_id_public_key: contractIdPublicKey,
      payment_base_public_key: paymentBasePublicKey
    })
    state.invoiceRequestData = {
      contractId,
      contractHash,
      contractIdPublicKey,
      paymentBasePublicKey,
      invoiceMerchantFileData,
      invoiceMerchantFileName,
      invoiceCustomerFileData,
      invoiceCustomerFileName
    }
  },
  CLEAR_CREATE_CONTRACT_MODAL_DATA (state) {
    state.invoiceRequestData = {}
  },
  GENERATE_FULFILL_CONTRACT_MODAL_DATA (state, metaData) {
    const { signedContractHash, paymentBasePublicKey } = metaData
    const paymentBaseHDPublicKey = new HDPublicKey(paymentBasePublicKey)
    const paymentAddressPath = contractUtil.derivePath(signedContractHash)
    const address = paymentBaseHDPublicKey.derive(paymentAddressPath)
      .publicKey
      .toAddress()
      .toString()
    const invoiceFileName = 'invoice.json'
    const invoiceFileData = generateFileData({
      address
    })
    state.invoiceData = {
      address,
      invoiceFileName,
      invoiceFileData
    }
  },
  CLEAR_FULFILL_CONTRACT_MODAL_DATA (state) {
    state.invoiceData = {}
  },
  GENERATE_REDEEM_CONTRACT_MODAL_DATA (state, metaData) {
    const { contractId, contractTemplateHash, signedContractHash } = metaData
    console.log('contractId: ' + contractId)
    const paymentBaseRelativePathPath = contractUtil.derivePath(contractTemplateHash).substring(2) // remove m/ prefix
    console.log('paymentBaseRelativePathPath: ' + paymentBaseRelativePathPath)
    const paymentAddressRelativePath = contractUtil.derivePath(signedContractHash).substring(2) // remove m/ prefix
    console.log('paymentAddressRelativePath: ' + paymentAddressRelativePath)
    const paymentAddressAbsolutePath = `m/${contractId}'/${paymentBaseRelativePathPath}/${paymentAddressRelativePath}`
    const paymentAddressPrivateKey = state.privateKey.derive(paymentAddressAbsolutePath).toString()
    const fileName = 'invoice-prv.json'
    const fileData = generateFileData({
      payment_address_path: paymentAddressAbsolutePath,
      payment_address_private_key: paymentAddressPrivateKey
    })
    state.redeemContractData = {
      paymentAddressAbsolutePath,
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
