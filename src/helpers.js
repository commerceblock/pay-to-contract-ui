import _ from 'lodash'
import crypto from 'crypto'
import contract from 'pay-to-contract-lib/lib/contract'
import HDPublicKey from 'bitcore-lib/lib/hdpublickey'

// 5MB
const MAX_ALLOWED_FILE_SIZE_IN_BYTES = 5 * 1024 * 1024

const isAllowedSize = exports.isAllowedSize = function (file) {
  return file.upload.total <= MAX_ALLOWED_FILE_SIZE_IN_BYTES
}

const computeFileHash = exports.computeFileHash = function (file) {
  return readAsText(file).then(computeTextHash)
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

exports.updateFileHashes = function (file, fileHashes) {
  if (isAllowedSize(file)) {
    fileHashes[file.name] = {
      status: 'initial'
    }
    return computeFileHash(file)
      .then((fileHash) => {
        const fileHashHolder = fileHashes[file.name]
        if (fileHashHolder) {
          // Only updates if holder exists, this could be null
          // if the file removed manually or automaically
          // if the user exceeded the max number of files
          fileHashHolder.status = 'digested'
          fileHashHolder.fileHash = fileHash
        }
      })
  } else {
    return Promise.reject(`file is larger than the max allowed size: ${MAX_ALLOWED_FILE_SIZE_IN_BYTES}`)
  }
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
// workaround to prevent dragging or dropping of files when max file count reached
// based on https://www.bountysource.com/issues/1444818-prevent-dragging-dropping-of-files-on-max-file-count
exports.disableDropzoneOnMaxfilesExceeded = function (dropzone) {
  dropzone.on('maxfilesexceeded', function (file) {
    dropzone.removeFile(file)
  })
}
