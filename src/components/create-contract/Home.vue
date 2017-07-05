<template>
<section class='content'>
  <modal v-if="showInvoiceRequest" @close="closeInvoiceRequestModal" />
  <div class="row center-block">
    <h2>Fill in information</h2>
    <div class="input-group form-group">
      <div>Invoice contracts are created by uploading files and then generating hashes which are used as part of the addresses.</div>
      <div>Public keys can be used by the buyer to validate associated data (uploaded files) with the derived addresses.</div>
      <div>By generating these public keys you are associate the files with the derived addresses.</div>
    </div>
    <div class="input-group form-group">
      <label>Contract Id</label>
      <div>
        <input class="form-control contract-id-input" readonly="readonly" type="text" v-model="contractId" />
      </div>
    </div>
    <div class="ui form">
      <div class="input-group">
        <div class="form-group">
          <label>Upload contract template files</label>
          <dropzone id="templateDropzone" ref="templateDropzone" url="/" v-on:vdropzone-file-added="fileAdded" v-on:vdropzone-removed-file="fileRemoved" :autoProcessQueue=false :maxNumberOfFiles=2 />
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
import Modal from './Modal.vue'
import {
  computeFilesHash,
  disableDropzoneOnMaxfilesExceeded,
  updateFileHashes
} from '../../helpers'

export default {
  name: 'CreateContractHome',
  components: {
    Dropzone,
    Modal
  },
  data: function () {
    return {
      contractId: null,
      fileHashes: [],
      showInvoiceRequest: false
    }
  },
  methods: {
    generateContractId: function () {
      const that = this
      const randomId = randomNumber(1000000, 5000000)
      randomId
        .then((number) => { that.contractId = number })
        .catch((err) => { console.log('Failed to generate contract id', err) })
    },
    reset: function () {
      this.contractId = null
      this.fileHashes = []
      this.showInvoiceRequest = false
      this.generateContractId()
      if (this.$refs.templateDropzone) {
        this.$refs.templateDropzone.dropzone.removeAllFiles()
      }
    },
    generate: function () {
      const contractTemplateHash = computeFilesHash(this.fileHashes)
      this.$parent.store.commit('GENERATE_CREATE_CONTRACT_MODAL_DATA', {
        contractId: this.contractId,
        contractTemplateHash
      })
      this.showInvoiceRequest = true
    },
    fileAdded: function (file) {
      updateFileHashes(file, this.fileHashes)
    },
    fileRemoved: function (file, error, xhr) {
      delete this.fileHashes[file.name]
    },
    closeInvoiceRequestModal: function () {
      this.showInvoiceRequest = false
    }
  },
  mounted: function () {
    this.generateContractId()
    const dropzoneComponent = this.$refs.templateDropzone
    disableDropzoneOnMaxfilesExceeded(dropzoneComponent.dropzone)
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

.contract-id-input {
  width: 300px;
}
</style>
