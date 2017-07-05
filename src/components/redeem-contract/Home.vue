<template>
<section class='content'>
  <modal v-if="showModal" @close="closeInvoiceModal" />
  <div class="row center-block">
    <h2>Fill in information</h2>
    <div class="input-group form-group">
      <div>Upload contract file or fill in contract details.</div>
      <input type="file" id="contractFile" accept="application/json" ref="contractFile" @change="processFile($event)">
      <div v-if=contractFileErroResponse class="text-red">
        <p>{{contractFileErroResponse}}</p>
      </div>
    </div>
    <div class="input-group form-group">
      <label>Contract Id</label>
      <div>
        <input class="form-control public-key-input" type="text" v-model="contractId" placeholder="Insert contract id" />
      </div>
    </div>
    <div class="input-group form-group">
      <label>Contract Template Hash</label>
      <div>
        <input class="form-control public-key-input" type="text" v-model="contractTemplateHash" placeholder="Insert contract template hash" />
      </div>
    </div>
    <div class="input-group form-group">
      <label>Upload signed contract files</label>
      <dropzone id="contractDropzone" ref="contractDropzone" url="/" v-on:vdropzone-file-added="contractFileAdded" v-on:vdropzone-removed-file="contractFileRemoved" :autoProcessQueue=false />
    </div>
    <div v-if=erroResponse class="text-red">
      <p>{{erroResponse}}</p>
    </div>
    <div class='btn-toolbar'>
      <div class="btn-group mr-4" role="group">
        <button class='btn btn-primary btn-lg forms-buttons' v-on:click='generate'>Generate</button>
      </div>
      <div class="btn-group" role="group">
        <button class='btn btn-primary btn-lg forms-buttons' v-on:click='reset'>Reset</button>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import Dropzone from 'vue2-dropzone'
import Modal from './Modal.vue'
import {
  computeFilesHash,
  disableDropzoneOnMaxfilesExceeded,
  updateFileHashes,
  readAsText
} from '../../helpers'

export default {
  name: 'RedeemContractHome',
  components: {
    Dropzone,
    Modal
  },
  data: function () {
    return {
      contractId: null,
      contractTemplateHash: null,
      contractFileHashes: [],
      erroResponse: null,
      contractFileErroResponse: null,
      showModal: false
    }
  },
  methods: {
    reset: function () {
      this.contractId = null
      this.contractTemplateHash = null
      this.contractFileHashes = null
      this.erroResponse = null
      this.showModal = false
      if (this.$refs.contractDropzone) {
        this.$refs.contractDropzone.dropzone.removeAllFiles()
      }
    },
    generate: function () {
      const signedContractHash = computeFilesHash(this.contractFileHashes)
      this.$parent.store.commit('GENERATE_REDEEM_CONTRACT_MODAL_DATA', {
        contractId: this.contractId,
        contractTemplateHash: this.contractTemplateHash,
        signedContractHash
      })
      this.showModal = true
    },
    contractFileAdded: function (file) {
      updateFileHashes(file, this.contractFileHashes)
    },
    contractFileRemoved: function (file, error, xhr) {
      delete this.contractFileHashes[file.name]
    },
    closeInvoiceModal: function () {
      this.showModal = false
    },
    processFile: function (event) {
      // reset error message
      this.contractFileErroResponse = null
      const fileContentPromise = readAsText(event.target.files[0])
      const that = this
      fileContentPromise
        .then(content => {
          const contractDef = JSON.parse(content)
          if (contractDef.contract_id && contractDef.contract_hash) {
            that.contractId = contractDef.contract_id
            that.contractTemplateHash = contractDef.contract_hash
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
      const dropzoneComponent = this.$refs.contractDropzone
      disableDropzoneOnMaxfilesExceeded(dropzoneComponent.dropzone)
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
