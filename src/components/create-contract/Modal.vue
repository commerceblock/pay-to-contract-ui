<template>
<transition name="modal">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              <button type="button" class="close" data-dismiss="modal" @click="close">&times;</button>
              <h4 class="modal-title">Invoice Request</h4>
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
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
              </div>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <a :href="invoiceMerchantFileData" :download="invoiceMerchantFileName">
                <button type="button" class="btn btn-primary">Export Merchant Data</button>
              </a>
              <a :href="invoiceCustomerFileData" :download="invoiceCustomerFileName">
                <button type="button" class="btn btn-primary">Export Customer Data</button>
              </a>
              <button type="button" class="btn btn-primary" @click="close">Close</button>
            </slot>
          </div>

      </div>
    </div>
  </div>
</transition>
</template>

<script>
export default {
  name: 'CreateContractModal',
  components: {},
  methods: {
    close: function () {
      this.$emit('close')
      this.store.commit('CLEAR_CREATE_CONTRACT_MODAL_DATA')
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
    },
    invoiceMerchantFileData: function () {
      return this.invoiceRequestData.invoiceMerchantFileData
    },
    invoiceMerchantFileName: function () {
      return this.invoiceRequestData.invoiceMerchantFileName
    },
    invoiceCustomerFileData: function () {
      return this.invoiceRequestData.invoiceCustomerFileData
    },
    invoiceCustomerFileName: function () {
      return this.invoiceRequestData.invoiceCustomerFileName
    }
  }
}
</script>

<style scoped>
.modal-mask {
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

.modal-wrapper {
  /*display: table-cell;*/
  vertical-align: middle;
  margin-top: 40px;
}

.modal-container {
  width: 800px;
  height: 730px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.qr-container {
  margin: 10px 10px 0px 0px
}
</style>
