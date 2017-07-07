import Vue from 'vue'
import Vuex from 'vuex'
import Networks from 'bitcore-lib/lib/networks'
import HDPublicKey from 'bitcore-lib/lib/hdpublickey'
import { derivePath } from 'pay-to-contract-lib/lib/contract'
import { generateFileData } from './helpers'
import _ from 'lodash'

// TODO: extract to pay-to-contract-lib m / purpose' / coin_type' / contract_id' / subcontract_ids
const ADDRESS_BIP200_MAINNET_PREFIX = "m/200'/0'"
const ADDRESS_BIP200_TESTNET_PREFIX = "m/200'/1'"

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

const getAddressPrefix = () => {
  if (state.network.name === 'mainnet' || state.network.alias === 'mainnet') {
    return ADDRESS_BIP200_MAINNET_PREFIX
  } else if (state.network.name === 'testnet') {
    return ADDRESS_BIP200_TESTNET_PREFIX
  } else {
    throw new Error('Unsupported network ' + state.network)
  }
}

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
    const contractIdPath = `${getAddressPrefix()}/${contractId}'`
    const contractIdHDPublicKey = state.privateKey
      .derive(contractIdPath)
      .hdPublicKey
    console.log('contractIdPath: ' + contractIdPath)
    const contractIdPublicKey = contractIdHDPublicKey.toString()
    const paymentBasePath = 'm/' + derivePath(contractHash)
    console.log('paymentBasePath: ' + paymentBasePath)
    const paymentBaseHDPublicKey = contractIdHDPublicKey.derive(paymentBasePath)
    const paymentBasePublicKey = paymentBaseHDPublicKey.toString()
    const invoiceSellerFileName = 'invoice-seller.json'
    const invoiceSellerFileData = generateFileData({
      contract_id: contractId,
      contract_hash: contractHash,
      contract_id_public_key: contractIdPublicKey,
      payment_base_public_key: paymentBasePublicKey
    })
    const invoiceBuyerFileName = 'invoice-buyer.json'
    const invoiceBuyerFileData = generateFileData({
      contract_id_public_key: contractIdPublicKey,
      payment_base_public_key: paymentBasePublicKey
    })
    state.invoiceRequestData = {
      contractId,
      contractHash,
      contractIdPublicKey,
      paymentBasePublicKey,
      invoiceSellerFileData,
      invoiceSellerFileName,
      invoiceBuyerFileData,
      invoiceBuyerFileName
    }
  },
  CLEAR_CREATE_CONTRACT_MODAL_DATA (state) {
    state.invoiceRequestData = {}
  },
  GENERATE_FULFILL_CONTRACT_MODAL_DATA (state, metaData) {
    const { signedContractHash, paymentBasePublicKey } = metaData
    const paymentBaseHDPublicKey = new HDPublicKey(paymentBasePublicKey)
    const paymentAddressPath = `m/${derivePath(signedContractHash)}/0/0`
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
    const paymentBaseRelativePathPath = derivePath(contractTemplateHash)
    console.log('paymentBaseRelativePathPath: ' + paymentBaseRelativePathPath)
    const paymentAddressRelativePath = derivePath(signedContractHash)
    console.log('paymentAddressRelativePath: ' + paymentAddressRelativePath)
    const paymentAddressAbsolutePath = `${getAddressPrefix()}/${contractId}'/${paymentBaseRelativePathPath}/${paymentAddressRelativePath}/0/0`
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
