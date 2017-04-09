<template>
<section class='content'>

  <invoice-request v-if="showInvoiceRequest" @close="closeInvoiceRequestModal" />

  <div class="row center-block">
    <h2>Fill in information</h2>

    <div class="input-group">
      <p>Invoice contracts are created by uploading files and then generating hashes which are used as part of the payment address.</p>
      <p>Payment address can be used by customer to validate associated data (uploaded files) with the derived address.</p>
      <p>By generating this payment address you are associate the files with the derived address. </p>
    </div>

    <div class="input-group form-group">
      <label>Payment Id</label>
      <div>
        <input class="form-control payment-id-input" readonly="readonly" type="text" v-model="paymentId" />
      </div>
    </div>

    <div class="ui form">
      <div class="input-group">
        <div class="form-group">
          <label>Upload your files</label>
          <dropzone id="mainDropzone" url="/" v-on:vdropzone-file-added="fileAdded" v-on:vdropzone-removed-file="fileRemoved" />
        </div>
      </div>

      <div class="input-group form-group">
        <label>Hash (SHA-512)</label>
        <div>
          <input class="form-control contact-hash-input" readonly="readonly" type="text" v-model="contractHash" />
        </div>
      </div>

      <div >
        <button class='btn btn-primary btn-lg' v-on:click='generate'>Generate</button>
      </div>
    </div>

  </div>

</section>
</template>

<script>
import Dropzone from 'vue2-dropzone'
import crypto from 'crypto'
import _ from 'lodash'
import randomNumber from 'random-number-csprng'
import InvoiceRequestModal from './InvoiceRequestModal.vue'

Dropzone.props.autoProcessQueue = {
  type: Boolean,
  required: false,
  default: function () {
    return false
  }
}

export default {
  name: 'MainApp',
  components: {
    Dropzone,
    'invoice-request': InvoiceRequestModal
  },
  data: function () {
    const data = {
      paymentId: null,
      contractHash: null,
      fileHashes: [],
      showInvoiceRequest: false
    }
    const randomId = randomNumber(1000000, 5000000)
    randomId
      .then((number) => { data.paymentId = number })
      .catch((err) => { console.log('Failed to create random id', err) })
    return data
  },
  methods: {
    generate: function () {
      this.$parent.store.commit('GENERATE_INVOICE_REQUEST_DATA', {
        paymentId: this.paymentId,
        contractHash: this.contractHash
      })
      this.showInvoiceRequest = true
    },
    fileAdded: function (file) {
      const that = this
      that.fileHashes[file.name] = {
        status: 'initial'
      }
      const fileReader = new window.FileReader()
      const hash = crypto.createHash('sha512')
      fileReader.onload = function (e) {
        that.fileHashes[file.name] = {
          status: 'loaded'
        }
        hash.update(e.target.result, 'utf8')
        const fileHash = hash.digest('hex')
        that.fileHashes[file.name] = {
          status: 'digested',
          fileHash: fileHash
        }
        that.computeContractHash()
      }
      fileReader.readAsText(file)
    },
    fileRemoved: function (file, error, xhr) {
      delete this.fileHashes[file.name]
      this.computeContractHash()
    },
    computeContractHash: function () {
      const hashArray = _.values(this.fileHashes).map((f) => f.fileHash)
      if (_.isEmpty(hashArray)) {
        this.contractHash = null
      } else if (hashArray.length === 1) {
        // in case of one, use it as is.
        this.contractHash = hashArray[0]
      } else {
        const combinedHashes = _.values(this.fileHashes).sort().join()
        const hash = crypto.createHash('sha512')
        hash.update(combinedHashes, 'utf8')
        this.contractHash = hash.digest('hex')
      }
    },
    closeInvoiceRequestModal: function () {
      this.showInvoiceRequest = false
    }
  }
}
</script>

<style scoped>
@import url('~dropzone/dist/dropzone.css');
@import 'https://fonts.googleapis.com/css?family=Roboto';

.vue-dropzone {
  width: 600px;
  height: 300px;
}

.contact-hash-input {
  width: 950px;
}

.payment-id-input {
  width: 300px;
}
</style>
