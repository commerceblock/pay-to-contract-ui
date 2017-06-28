<template>
<section class='content'>
  <modal v-if="showInvoice" @close="closeInvoiceModal" />
  <div class="row center-block">
    <h2>Fill in information</h2>
    <div class="input-group form-group">
      <div>Upload contract file or fill in contract keys</div>
      <input type="file" id="contractFile" accept="application/json" ref="contractFile" @change="processFile($event)">
      <div v-if=contractFileErroResponse class="text-red">
        <p>{{contractFileErroResponse}}</p>
      </div>
    </div>
    <div class="input-group form-group">
      <label>Payment Id Public Key</label>
      <div>
        <input class="form-control public-key-input" type="text" v-model="paymentIdPublicKey" placeholder="Insert payment id public key" />
      </div>
    </div>
    <div class="input-group form-group">
      <label>Payment Base Public Key</label>
      <div>
        <input class="form-control public-key-input" type="text" v-model="paymentBasePublicKey" placeholder="Insert payment base public key" />
      </div>
    </div>
    <div class="input-group form-group">
      <label>Upload contract template files</label>
      <dropzone id="templateDropzone" ref="templateDropzone" url="/" v-on:vdropzone-file-added="templateFileAdded" v-on:vdropzone-removed-file="templateFileRemoved" :autoProcessQueue=false />
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
        <dropzone id="contractDropzone" ref="contractDropzone" url="/" v-on:vdropzone-file-added="contractFileAdded" v-on:vdropzone-removed-file="contractFileRemoved" :autoProcessQueue=false />
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
  validatePaymentBase,
  computeFilesHash,
  disableDropzoneOnMaxfilesExceeded,
  updateFileHashes,
  readAsText
} from '../../helpers'
import _ from 'lodash'

export default {
  name: 'FulfillContractHome',
  components: {
    Dropzone,
    Modal
  },
  data: function () {
    return {
      paymentIdPublicKey: null,
      paymentBasePublicKey: null,
      templateFileHashes: [],
      contractFileHashes: [],
      erroResponse: null,
      contractFileErroResponse: null,
      showSignedContractSection: false,
      showInvoice: false
    }
  },
  methods: {
    validate: function () {
      const contractTemplateHash = computeFilesHash(this.templateFileHashes)
      const error = validatePaymentBase(this.paymentIdPublicKey, this.paymentBasePublicKey, contractTemplateHash)
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
      this.paymentIdPublicKey = null
      this.paymentBasePublicKey = null
      this.erroResponse = null
      this.contractFileErroResponse = null
      this.$refs.contractFile.value = null
      this.$refs.templateDropzone.dropzone.removeAllFiles()
      if (this.$refs.contractDropzone) {
        this.$refs.contractDropzone.dropzone.removeAllFiles()
      }
    },
    generate: function () {
      const signedContractHash = computeFilesHash(this.contractFileHashes)
      this.$parent.store.commit('GENERATE_FULFILL_CONTRACT_MODAL_DATA', {
        signedContractHash,
        paymentBasePublicKey: this.paymentBasePublicKey
      })
      this.showInvoice = true
    },
    templateFileAdded: function (file) {
      updateFileHashes(file, this.templateFileHashes)
    },
    templateFileRemoved: function (file, error, xhr) {
      delete this.templateFileHashes[file.name]
    },
    contractFileAdded: function (file) {
      updateFileHashes(file, this.contractFileHashes)
    },
    contractFileRemoved: function (file, error, xhr) {
      delete this.contractFileHashes[file.name]
    },
    closeInvoiceModal: function () {
      this.showInvoice = false
    },
    processFile: function (event) {
      // reset error message
      this.contractFileErroResponse = null
      const fileContentPromise = readAsText(event.target.files[0])
      const that = this
      fileContentPromise
        .then(content => {
          const contractDef = JSON.parse(content)
          if (contractDef.payment_identity_public_key && contractDef.payment_base_public_key) {
            that.paymentIdPublicKey = contractDef.payment_identity_public_key
            that.paymentBasePublicKey = contractDef.payment_base_public_key
          } else {
            // invalid file
            that.contractFileErroResponse = 'Invalid contract file, please try another file.'
          }
        })
        .catch(err => {
          console.log(err)
          that.contractFileErroResponse = 'Invalid contract file, please try another file.'
        })
    },
    mounted: function () {
      _.forEach(['contractDropzone', 'templateDropzone'], (id) => {
        const dropzoneComponent = this.$refs[id]
        disableDropzoneOnMaxfilesExceeded(dropzoneComponent.dropzone)
      })
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
