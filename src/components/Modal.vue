<template>
<transition name="modal">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">

        <div v-if=erroResponse class="text-red"><p>{{erroResponse}}</p></div>

        <form class="ui form loginForm" @submit.prevent="login">

          <h2 class="text-center">Login</h2>

          <div class="input-group">
            <span class="input-group-addon"><i class="fa fa-lock"></i></span>
            <input class="form-control" name="privateKeySeed" placeholder="Enter your 12/24 seed phrase" type="text" v-model="privateKeySeed">
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
            <button class="button-center" type="submit">Sign in</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import Mnemonic from 'bitcore-mnemonic'
import _ from 'lodash'

export default {
  name: 'Modal',
  data: function () {
    return {
      network: 'livenet',
      privateKeySeed: '',
      erroResponse: ''
    }
  },
  methods: {
    login: function (event) {
      this.erroResponse = ''

      // validate key
      if (_.isNull(this.privateKeySeed) || _.isEmpty(this.privateKeySeed.trim())) {
        this.erroResponse = 'Seed is empty!'
        return
      }

      if (!Mnemonic.isValid(this.privateKeySeed.trim())) {
        this.erroResponse = 'Invalid seed, seed must be either 12 or 24 words.'
        return
      }

      const code = new Mnemonic(this.privateKeySeed.trim())
      const privateKey = code.toHDPrivateKey()

      this.$parent.$store.commit('SET_NETWORK_TYPE', this.network)
      this.$parent.$store.commit('SET_PRIVATE_KEY', privateKey)

      window.localStorage.setItem('privateKeySeed', this.privateKeySeed)
      this.$emit('close')
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
