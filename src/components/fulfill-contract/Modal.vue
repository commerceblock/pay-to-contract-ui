<template>
<transition name="modal">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <slot name="header">
            <button type="button" class="close" data-dismiss="modal" @click="close">&times;</button>
            <h4 class="modal-title">Invoice</h4>
          </slot>
        </div>
        <div class="modal-body">
          <slot name="body">
            <div class="form-group">
              <label>Payment Address</label>
              <input class="form-control" readonly="readonly" type="text" v-model="address" />
              <div>
                <qrcode :cls="'qr-container'" :value="this.address" />
              </div>
            </div>
          </slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <a :href="invoiceFileData" :download="invoiceFileName">
                <button type="button" class="btn btn-primary">Export</button>
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
import Qrcode from 'v-qrcode'

export default {
  name: 'FulfillContractModal',
  components: {
    Qrcode
  },
  methods: {
    close: function () {
      this.$emit('close')
      this.store.commit('CLEAR_FULFILL_CONTRACT_MODAL_DATA')
    }
  },
  data: function () {
    return {}
  },
  computed: {
    store: function () {
      return this.$parent.$store
    },
    invoiceData: function () {
      return this.store.getters.invoiceData
    },
    address: function () {
      return this.invoiceData.address
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
  vertical-align: middle;
  margin-top: 40px;
}

.modal-container {
  width: 800px;
  height: 410px;
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
