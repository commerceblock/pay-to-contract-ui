import Vue from 'vue'
import Vuex from 'vuex'
import Networks from 'bitcore-lib/lib/networks'
import HDPublicKey from 'bitcore-lib/lib/hdpublickey'
import { derivePath } from 'pay-to-contract-lib/lib/contract'
import { generateFileData } from './helpers'
import _ from 'lodash'

// TODO: extract to pay-to-contract-lib m / purpose' / coin_type' / contract_id' / subcontract_ids
const PURPOSE = 200
const COIN_TYPE_BITCOIN_MAINNET = 0
const COIN_TYPE_BITCOIN_TESTNET = 1
// All BIP44 compliant wallets start with 0/0 addresses
const ADDRESS_BIP44_SUFFIX = '0/0'

Vue.use(Vuex)

function initialState () {
  return {
    privateKey: null,
    network: null,
    invoiceRequestData: {},
    invoiceData: {},
    receiptPrivateData: {}
  }
}

const state = initialState()

const constrcutAddressPrefixPath = function (purpose, coinType) {
  return `m/${purpose}'/${coinType}'`
}

const getAddressPrefix = () => {
  if (state.network.name === 'mainnet' || state.network.alias === 'mainnet') {
    return constrcutAddressPrefixPath(PURPOSE, COIN_TYPE_BITCOIN_MAINNET)
  } else if (state.network.name === 'testnet') {
    return constrcutAddressPrefixPath(PURPOSE, COIN_TYPE_BITCOIN_TESTNET)
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
    const contractIdPublicKey = contractIdHDPublicKey.toString()
    const paymentBasePath = 'm/' + derivePath(contractHash)
    const paymentBaseHDPublicKey = contractIdHDPublicKey.derive(paymentBasePath)
    const paymentBasePublicKey = paymentBaseHDPublicKey.toString()
    const invoicePrivateFileName = 'invoice-private.json'
    const invoicePrivateFileData = generateFileData({
      contract_id: contractId,
      contract_hash: contractHash,
      contract_id_public_key: contractIdPublicKey,
      payment_base_public_key: paymentBasePublicKey
    })
    const invoicePublicFileName = 'invoice-public.json'
    const invoicePublicFileData = generateFileData({
      contract_id_public_key: contractIdPublicKey,
      payment_base_public_key: paymentBasePublicKey
    })
    state.invoiceRequestData = {
      contractId,
      contractHash,
      contractIdPublicKey,
      paymentBasePublicKey,
      invoicePrivateFileData,
      invoicePrivateFileName,
      invoicePublicFileData,
      invoicePublicFileName
    }
  },
  CLEAR_CREATE_CONTRACT_MODAL_DATA (state) {
    state.invoiceRequestData = {}
  },
  GENERATE_FULFILL_CONTRACT_MODAL_DATA (state, metaData) {
    const { signedContractHash, paymentBasePublicKey } = metaData
    const paymentBaseHDPublicKey = new HDPublicKey(paymentBasePublicKey)
    const paymentAddressPath = `m/${derivePath(signedContractHash)}/${ADDRESS_BIP44_SUFFIX}`
    const address = paymentBaseHDPublicKey.derive(paymentAddressPath)
      .publicKey
      .toAddress()
      .toString()
    const receiptFileName = 'receipt.json'
    const receiptFileData = generateFileData({
      address
    })
    state.receiptData = {
      address,
      receiptFileName,
      receiptFileData
    }
  },
  CLEAR_FULFILL_CONTRACT_MODAL_DATA (state) {
    state.receiptData = {}
  },
  GENERATE_REDEEM_CONTRACT_MODAL_DATA (state, metaData) {
    const { contractId, contractTemplateHash, signedContractHash } = metaData
    const paymentBaseRelativePathPath = derivePath(contractTemplateHash)
    const paymentAddressRelativePath = derivePath(signedContractHash)
    const paymentAddressAbsolutePath = `${getAddressPrefix()}/${contractId}'/${paymentBaseRelativePathPath}/${paymentAddressRelativePath}`
    const paymentAddressPrivateKey = state.privateKey.derive(paymentAddressAbsolutePath).toString()
    const address = state.privateKey.derive(paymentAddressAbsolutePath)
      .derive(`m/${ADDRESS_BIP44_SUFFIX}`)
      .publicKey
      .toAddress()
      .toString()
    const fileName = 'receipt-private.json'
    const fileData = generateFileData({
      payment_address_path: paymentAddressAbsolutePath,
      payment_address_private_key: paymentAddressPrivateKey,
      payment_address: address
    })
    state.receiptPrivateData = {
      paymentAddressAbsolutePath,
      paymentAddressPrivateKey,
      fileName,
      fileData
    }
  },
  CLEAR_REDEEM_CONTRACT_MODAL_DATA (state) {
    state.receiptPrivateData = {}
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
  receiptData: (state) => state.receiptData,
  receiptPrivateData: (state) => state.receiptPrivateData
}

export default new Vuex.Store({
  state,
  mutations,
  getters
})
