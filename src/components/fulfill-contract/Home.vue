<template>
<section class='content'>
  <modal v-if="showInvoice" @close="closeInvoiceModal" />
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
      <label>Upload contract template files</label>
      <dropzone id="templateDropzone" url="/" v-on:vdropzone-file-added="templateFileAdded" v-on:vdropzone-removed-file="templateFileRemoved" :autoProcessQueue=false />
    </div>
    <div v-if=erroResponse class="text-red">
      <p>{{erroResponse}}</p>
    </div>
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
        <label>Upload signed contract files</label>
        <dropzone id="contractDropzone" url="/" v-on:vdropzone-file-added="contractFileAdded" v-on:vdropzone-removed-file="contractFileRemoved" :autoProcessQueue=false />
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
import $ from 'jquery'
import Dropzone from 'vue2-dropzone'
import Modal from './Modal.vue'
import {
  computeFileHash,
  validatePaymentBase,
  computeFilesHash
} from '../../helpers'
import _ from 'lodash'

export default {
  name: 'MainApp',
  components: {
    Dropzone,
    Modal
  },
  data: function () {
    return {
      paymentIdentityPublicKey: null,
      paymentBasePublicKey: null,
      templateFileHashes: [],
      contractFileHashes: [],
      erroResponse: null,
      showSignedContractSection: false,
      showInvoice: false
    }
  },
  methods: {
    validate: function () {
      const contractTemplateHash = computeFilesHash(this.templateFileHashes)
      const error = validatePaymentBase(this.paymentIdentityPublicKey, this.paymentBasePublicKey, contractTemplateHash)
      if (error) {
        this.erroResponse = error
      } else {
        this.erroResponse = false
        this.showSignedContractSection = true
        // TODO:: use proper vue animaiton
        setTimeout(() => {
          $('html, body').animate({ scrollTop: $('#contractDropzoneSection').offset().top }, 500)
        }, 150)
      }
    },
    reset: function () {
      this.showSignedContractSection = false
      this.showInvoice = false
      this.paymentIdentityPublicKey = null
      this.paymentBasePublicKey = null
      this.erroResponse = null
      _.find(this.$children, { id: 'templateDropzone' }).removeAllFiles()
      _.find(this.$children, { id: 'contractDropzone' }).removeAllFiles()
    },
    generate: function () {
      const signedContractHash = computeFilesHash(this.templateFileHashes)
      this.$parent.store.commit('GENERATE_FULFILL_CONTRACT_MODAL_DATA', {
        signedContractHash,
        paymentBasePublicKey: this.paymentBasePublicKey
      })
      this.showInvoice = true
    },
    templateFileAdded: function (file) {
      const that = this
      that.templateFileHashes[file.name] = {
        status: 'initial'
      }
      computeFileHash(file)
        .then((fileHash) => {
          that.templateFileHashes[file.name] = {
            status: 'digested',
            fileHash: fileHash
          }
        })
    },
    templateFileRemoved: function (file, error, xhr) {
      delete this.templateFileHashes[file.name]
    },
    contractFileAdded: function (file) {
      const that = this
      that.contractFileHashes[file.name] = {
        status: 'initial'
      }
      computeFileHash(file)
        .then((fileHash) => {
          that.contractFileHashes[file.name] = {
            status: 'digested',
            fileHash: fileHash
          }
        })
    },
    contractFileRemoved: function (file, error, xhr) {
      delete this.contractFileHashes[file.name]
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
