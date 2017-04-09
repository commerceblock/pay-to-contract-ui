<template>
<section class='content'>

  <invoice-modal v-if="showInvoice" @close="closeInvoiceModal" />

  <div class="row center-block">
    <h2>Fill in information</h2>

    <div class="input-group form-group">
      <label>Payment Identity Public Key</label>
      <div>
        <input class="form-control public-key-input" type="text" v-model="paymentIdentityPublicKey" placeholder="Insert the Payment Identity Public Key" />
      </div>
    </div>

    <div class="input-group form-group">
      <label>Payment Base Public Key</label>
      <div>
        <input class="form-control public-key-input" type="text" v-model="paymentBasePublicKey" placeholder="Insert the Payment Base Public Key" />
      </div>
    </div>

    <div class="input-group form-group">
      <label>Upload the contract template files</label>
      <dropzone id="templateDropzone" url="/" v-on:vdropzone-file-added="templateFileAdded" v-on:vdropzone-removed-file="templateFileRemoved" />
    </div>

    <div v-if=erroResponse class="text-red"><p>{{erroResponse}}</p></div>

    <div class='btn-toolbar'>
      <div class="btn-group mr-4" role="group">
        <button class='btn btn-primary btn-lg forms-buttons' v-on:click='validate'>Validate</button>
      </div>
      <div class="btn-group" role="group">
        <button class='btn btn-primary btn-lg forms-buttons' v-on:click='reset'>Reset</button>
      </div>
    </div>

    <div v-if=showSignedContractSection>
      <div class="input-group form-group">
        <label>Upload the signed contract files</label>
        <dropzone id="contractDropzone" url="/" v-on:vdropzone-file-added="contractFileAdded" v-on:vdropzone-removed-file="contractFileRemoved" />
      </div>
    </div>

  </div>

</section>
</template>

<script>
import Dropzone from 'vue2-dropzone'
import crypto from 'crypto'
import _ from 'lodash'
import InvoiceModal from './InvoiceModal.vue'

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
    'invoice-modal': InvoiceModal
  },
  data: function () {
    return {
      paymentIdentityPublicKey: null,
      paymentBasePublicKey: null,
      templateFileHashes: [],
      showSignedContractSection: false,
      showInvoice: false
    }
  },
  methods: {
    validate: function () {
      this.showSignedContractSection = true
    },
    reset: function () {
      this.showSignedContractSection = false
      this.paymentIdentityPublicKey = null
      this.paymentBasePublicKey = null
    },
    generate: function () {
    },
    templateFileAdded: function (file) {
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
    templateFileRemoved: function (file, error, xhr) {
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

.public-key-input {
  width: 950px;
}

.forms-buttons {
  width: 100px;
}
</style>
