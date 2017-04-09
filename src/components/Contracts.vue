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
      <div class="col-md-6"></div>
      <div class="divider-vertical"></div>
      <div class="col-md-5"></div>
      <div class="input-group form-group" id="contractDropzoneSection">
        <label>Upload the signed contract files</label>
        <dropzone id="contractDropzone" url="/" v-on:vdropzone-file-added="contractFileAdded" v-on:vdropzone-removed-file="contractFileRemoved" />
      </div>
      <div class='btn-toolbar'>
        <div class="btn-group mr-4" role="group">
          <button class='btn btn-primary btn-lg forms-buttons' v-on:click='generate'>Generate</button>
        </div>
      </div>
    </div>

  </div>

</section>
</template>

<script>
import Dropzone from 'vue2-dropzone'
import InvoiceModal from './InvoiceModal.vue'
import { computeFileHash } from '../helpers'
import $ from 'jquery'

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
      $('html, body').animate({ scrollTop: $('#contractDropzoneSection').offset().top }, 500)
    },
    reset: function () {
      this.showSignedContractSection = false
      this.paymentIdentityPublicKey = null
      this.paymentBasePublicKey = null
    },
    generate: function () {
      this.showInvoice = true
    },
    templateFileAdded: function (file) {
      const that = this
      that.fileHashes[file.name] = {
        status: 'initial'
      }
      computeFileHash(file)
        .then((fileHash) => {
          that.fileHashes[file.name] = {
            status: 'digested',
            fileHash: fileHash
          }
        })
    },
    templateFileRemoved: function (file, error, xhr) {
      delete this.fileHashes[file.name]
    },
    closeInvoiceModal: function () {
      this.showInvoice = false
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

.divider-vertical {
  height: 50px;
  float: left;
  opacity: 0.5;
  margin: 0 15px;
}
</style>
