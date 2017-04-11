<template>
<section class='content'>
  <modal v-if="showInvoiceRequest" @close="closeInvoiceRequestModal" />
  <div class="row center-block">
    <h2>Fill in information</h2>
    <div class="input-group form-group">
      <div>Invoice contracts are created by uploading files and then generating hashes which are used as part of the payment address.</div>
      <div>Payment address can be used by customer to validate associated data (uploaded files) with the derived address.</div>
      <div>By generating this payment address you are associate the files with the derived address.</div>
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
          <label>Upload contract template files</label>
          <dropzone id="mainDropzone" url="/" v-on:vdropzone-file-added="fileAdded" v-on:vdropzone-removed-file="fileRemoved" :autoProcessQueue=false />
        </div>
      </div>
      <div class="input-group form-group">
        <label>Hash (SHA-512)</label>
        <div>
          <input class="form-control contact-hash-input" readonly="readonly" type="text" v-model="contractTemplateHash" />
        </div>
      </div>
      <div class='btn-toolbar'>
        <div class="btn-group" role="group">
          <button class='btn btn-primary btn-lg forms-buttons' v-on:click='generate'>Generate</button>
        </div>
        <div class="btn-group" role="group">
          <button class='btn btn-primary btn-lg forms-buttons' v-on:click='reset'>Reset</button>
        </div>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import Dropzone from 'vue2-dropzone'
import randomNumber from 'random-number-csprng'
import { computeFilesHash, computeFileHash } from '../../helpers'
import Modal from './Modal.vue'
import _ from 'lodash'

export default {
  name: 'MainApp',
  components: {
    Dropzone,
    Modal
  },
  data: function () {
    return {
      paymentId: null,
      contractTemplateHash: null,
      fileHashes: [],
      showInvoiceRequest: false
    }
  },
  methods: {
    generatePaymentId: function () {
      const that = this
      const randomId = randomNumber(1000000, 5000000)
      randomId
        .then((number) => { that.paymentId = number })
        .catch((err) => { console.log('Failed to generate payment id', err) })
    },
    reset: function () {
      this.paymentId = null
      this.contractTemplateHash = null
      this.fileHashes = []
      this.showInvoiceRequest = false
      this.generatePaymentId()
      _.find(this.$children, { id: 'mainDropzone' }).removeAllFiles()
    },
    generate: function () {
      this.$parent.store.commit('GENERATE_CREATE_CONTRACT_MODAL_DATA', {
        paymentId: this.paymentId,
        contractTemplateHash: this.contractTemplateHash
      })
      this.showInvoiceRequest = true
    },
    fileAdded: function (file) {
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
          that.updateContractHash()
        })
    },
    fileRemoved: function (file, error, xhr) {
      delete this.fileHashes[file.name]
      this.updateContractHash()
    },
    updateContractHash: function () {
      this.contractTemplateHash = computeFilesHash(this.fileHashes)
    },
    closeInvoiceRequestModal: function () {
      this.showInvoiceRequest = false
    }
  },
  mounted: function () {
    this.generatePaymentId()
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
