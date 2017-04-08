<template>
<transition name="modal">
  <div class="invoice-request-modal-mask">
    <div class="invoice-request-modal-wrapper modal">
      <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content invoice-request-modal-container">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" @click="close">&times;</button>
            <h4 class="modal-title">Invoice Request</h4>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Payment Id</label>
              <input class="form-control" readonly="readonly" type="text" v-model="paymentId" />
            </div>
            <div class="form-group">
              <label>Contract Hash</label>
              <input class="form-control" readonly="readonly" type="text" v-model="contractHash" />
            </div>
            <div class="form-group">
              <label>Payment Identity</label>
              <input class="form-control" readonly="readonly" type="text" v-model="paymentIdentityPublicKey" />
            </div>
            <div class="form-group">
              <label>Payment Base</label>
              <input class="form-control" readonly="readonly" type="text" v-model="paymentBasePublicKey" />
              <!-- <qrcode val="ddddd" /> -->
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="close">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import Qrcode from 'vue-qrcode'

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
      this.store.commit('SET_INVOICE_REQUEST_DATA', null)
    }
  },
  computed: {
    store: function () {
      return this.$parent.$store
    },
    invoiceRequestData: function () {
      return this.store.getters.invoiceRequestData
    },
    paymentId: function () {
      return this.invoiceRequestData.paymentId
    },
    contractHash: function () {
      return this.invoiceRequestData.contractHash
    },
    paymentIdentityPublicKey: function () {
      return this.invoiceRequestData.paymentIdentityPublicKey
    },
    paymentBasePublicKey: function () {
      return this.invoiceRequestData.paymentBasePublicKey
    }
  }
}
</script>

<style scoped>
@import 'https://fonts.googleapis.com/icon?family=Material+Icons';

.invoice-request-button {
  width: 90px
}

.invoice-request-modal-mask {
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

.invoice-request-modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.invoice-request-modal-container {
  width: 750px;
  height: 750px;
  margin: 0px auto;
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.invoice-request-modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.invoice-request-modal-body {
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

.invoice-request-modal-enter {
  opacity: 0;
}

.invoice-request-modal-leave-active {
  opacity: 0;
}

.invoice-request-modal-enter .invoice-request-modal-container,
.invoice-request-modal-leave-active .invoice-request-modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
