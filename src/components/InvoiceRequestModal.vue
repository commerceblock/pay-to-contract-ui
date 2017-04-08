<template>
<transition name="modal" id="invoice-request-modal-template">
  <div class="invoice-request-modal-mask">
    <div class="invoice-request-modal-wrapper">
      <div class="invoice-request-modal-container">
          <h1>{{ message }}</h1>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
export default {
  name: 'InvoiceRequestModal',
  components: {
  },
  data: function () {
    return {
      message: null
    }
  },
  methods: {
  },
  computed: {
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
  width: 650px;
  height: 650px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
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
