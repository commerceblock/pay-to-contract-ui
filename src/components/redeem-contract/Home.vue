<template>
<section class='content'>
  <modal v-if="showModal" @close="closeInvoiceModal" />
  <div class="row center-block">
    <h2>Fill in information</h2>
    <div class="input-group form-group">
      <label>Payment Id</label>
      <div>
        <input class="form-control public-key-input" type="text" v-model="paymentId" placeholder="Insert the payment id" />
      </div>
    </div>
    <div class="input-group form-group">
      <label>Contract Template Hash</label>
      <div>
        <input class="form-control public-key-input" type="text" v-model="contractTemplateHash" placeholder="Insert the contract template hash" />
      </div>
    </div>
    <div class="input-group form-group">
      <label>Upload the signed contract files</label>
      <dropzone id="contractDropzone" url="/" v-on:vdropzone-file-added="contractFileAdded" v-on:vdropzone-removed-file="contractFileRemoved" />
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
  computeFileHash,
  computeFilesHash
} from '../../helpers'

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
    Modal
  },
  data: function () {
    return {
      paymentId: null,
      contractTemplateHash: null,
      contractFileHashes: [],
      erroResponse: null,
      showModal: false
    }
  },
  methods: {
    reset: function () {
      this.showSignedContractSection = false
      this.showModal = false
      this.paymentIdentityPublicKey = null
      this.paymentBasePublicKey = null
      this.erroResponse = null
    },
    generate: function () {
      const signedContractHash = computeFilesHash(this.contractFileHashes)
      this.$parent.store.commit('GENERATE_REDEEM_CONTRACT_MODAL_DATA', {
        paymentId: this.paymentId,
        contractTemplateHash: this.contractTemplateHash,
        signedContractHash
      })
      this.showModal = true
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
      this.showModal = false
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
