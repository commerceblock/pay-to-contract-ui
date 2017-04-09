import _ from 'lodash'
import crypto from 'crypto'

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
