<template>
<transition name="modal">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">

        <form class="ui form loginForm" @submit.prevent="validateKey">

          <h2 class="text-center">Login</h2>

          <div class="input-group">
            <span class="input-group-addon"><i class="fa fa-lock"></i></span>
            <input class="form-control" name="privatekey" placeholder="Enter your private key" type="text" v-model="privatekey">
          </div>

          <div class="input-group">
            <div class="btn-group" data-toggle="buttons">
              <label class="btn btn-primary active">
                <input type="radio" v-model="network">Mainet
              </label>
              <label class="btn btn-primary">
                <input type="radio" v-model="network">Testnet
              </label>
            </div>
          </div>

          <div class="text-center">
            <button class="button-center" type="submit" @click='login'>Sign in</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
export default {
  name: 'Modal',
  data: function () {
    return {
      network: 'livenet'
    }
  },
  methods: {
    login: function (event) {
      console.log(this.privatekey)
      console.log(this.network)

      // TODO:: add validation
      this.$parent.$store.commit('SET_PRIVATE_KEY', this.privatekey)
      this.$parent.$store.commit('SET_NETWORK_TYPE', this.network)
      this.$emit('close')
    },
    validateKey: function () {
      // key must be BIP 32 compliant
    }
  }
}
</script>

<style>
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
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 1100px;
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
</style>
