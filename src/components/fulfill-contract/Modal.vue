<template>
<transition name="modal">
  <div class="invoice-modal-mask">
    <div class="invoice-modal-wrapper modal">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content invoice-modal-container">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" @click="close">&times;</button>
            <h4 class="modal-title">Invoice</h4>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Singed Contract Hash</label>
              <input class="form-control" readonly="readonly" type="text" v-model="signedContractHash" />
            </div>
            <div class="form-group">
              <label>Payment Address</label>
              <input class="form-control" readonly="readonly" type="text" v-model="paymentAddressPublicKey" />
              <div>
                <qrcode :cls="'invoice-qr'" value="paymentAddressAddress" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <a :href="invoiceFileData" :download="invoiceFileName">
              <button type="button" class="btn btn-primary">Export</button>
            </a>
            <button type="button" class="btn btn-primary" @click="close">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import Qrcode from 'v-qrcode'

export default {
  name: 'InvoiceRequestModal',
  components: {
    Qrcode
  },
  data: function () {
    return {}
  },
  methods: {
    close: function () {
      this.$emit('close')
      this.store.commit('CLEAR_INVOICE_REQUEST_DATA')
    }
  },
  computed: {
    store: function () {
      return this.$parent.$store
    },
    invoiceData: function () {
      return this.store.getters.invoiceData
    },
    signedContractHash: function () {
      return this.invoiceData.signedContractHash
    },
    paymentAddressPublicKey: function () {
      return this.invoiceData.paymentAddressPublicKey
    },
    paymentAddressAddress: function () {
      return this.invoiceData.paymentAddressAddress
    },
    invoiceFileName: function () {
      return this.invoiceData.invoiceFileName
    },
    invoiceFileData: function () {
      return this.invoiceData.invoiceFileData
    }
  }
}
</script>

<style scoped>
@import 'https://fonts.googleapis.com/icon?family=Material+Icons';

.invoice-button {
  width: 90px
}

.invoice-modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.invoice-modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.invoice-modal-container {
  width: 800px;
  height: 500px;
  margin: 0px auto;
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.invoice-modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.invoice-modal-body {
  margin: 20px 0;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.invoice-modal-enter {
  opacity: 0;
}

.invoice-modal-leave-active {
  opacity: 0;
}

.invoice-modal-enter .invoice-modal-container,
.invoice-modal-leave-active .invoice-modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.invoice-qr {
  margin: 10px 10px 0px 0px
}
</style>
