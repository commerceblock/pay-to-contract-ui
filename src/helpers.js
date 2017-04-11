import _ from 'lodash'
import crypto from 'crypto'
import contract from 'pay-to-contract-lib/lib/contract'
import HDPublicKey from 'bitcore-lib/lib/hdpublickey'

exports.computeFilesHash = function (fileHashes) {
  const hashArray = _.values(fileHashes).map((f) => f.fileHash)
  if (_.isEmpty(hashArray)) {
    return null
  } else if (hashArray.length === 1) {
    // in case of one, use it as is.
    return hashArray[0]
  } else {
    const combinedHashes = _.values(fileHashes).sort().join()
    return computeTextHash(combinedHashes)
  }
}

exports.computeFileHash = function (file) {
  return readAsText(file).then(computeTextHash)
}

exports.validatePaymentBase = function (paymentIdentityPublicKey, paymentBasePublicKey, contractTemplateHash) {
  const paymentBasePath = contract.derivePath(contractTemplateHash)
  const paymentIdentityHDPublicKey = new HDPublicKey(paymentIdentityPublicKey)
  const actualPaymentBasePublicKey = paymentIdentityHDPublicKey
    .derive(paymentBasePath)
    .toString()
  if (actualPaymentBasePublicKey === paymentBasePublicKey) {
    return null
  } else {
    return 'Payment base is not derived from the given files'
  }
}

exports.generateQRData = function (data) {
  const encodedData = encodeURIComponent(JSON.stringify(data, null, 2))
  return `data:text/json;charset=utf-8,${encodedData}`
}

const computeTextHash = exports.computeTextHash = function (text) {
  const hash = crypto.createHash('sha512')
  hash.update(text, 'utf8')
  return hash.digest('hex')
}

const readAsText = exports.readAsText = function (file) {
  /* global Blob */
  if (!(file instanceof Blob)) {
    throw new TypeError('Must be a File or Blob')
  }
  return new Promise(function (resolve, reject) {
    const reader = new window.FileReader()
    reader.onload = function (e) {
      resolve(e.target.result)
    }
    reader.onerror = function (e) {
      reject('Error reading' + file.name + ': ' + e.target.result)
    }
    reader.readAsText(file)
  })
}

// workaround to prevent dragging or dropping of files on max file count
// based on https://www.bountysource.com/issues/1444818-prevent-dragging-dropping-of-files-on-max-file-count
exports.disableDropzoneOnMaxfilesExceeded = function (dropzone) {
  dropzone.on('maxfilesexceeded', function (file) {
    dropzone.removeFile(file)
  })
}
