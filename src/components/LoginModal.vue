<template>
<transition name="modal">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">

        <form class="ui form loginForm" @submit.prevent="login">

          <div class="modal-header">
            <slot name="header">
              <div v-if=erroResponse class="text-red">
                <p>{{erroResponse}}</p>
              </div>
              <h2 class="text-center">Login</h2>
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <p>Welcome! Please keep your seed safe. <a href="https://iancoleman.github.io/bip39/" target="_blank">Generate sample seeds</a></p>
              <div class="input-group">
                <span class="input-group-addon"><i class="fa fa-lock"></i></span>
                <textarea class="form-control span6 prvKey" rows="3" name="privateKeySeed" placeholder="Enter your 12/24 seed phrase" type="textarea" v-model="privateKeySeed" />
              </div>
              <div class="input-group">
                <div class="text-center">
                  <label>
                      <bootstrap-toggle v-model="isMainet" :options="{ on: 'Mainet', off: 'Testnet' }"/>
                    </label>
                </div>
              </div>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <div class="text-center col-md-4 col-sm-offset-4">
                <button class="modal-default-button button-center btn btn-primary btn-lg" type="submit">Sign in</button>
              </div>
            </slot>
          </div>
        </form>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import BootstrapToggle from 'vue-bootstrap-toggle'
import Mnemonic from 'bitcore-mnemonic'
import _ from 'lodash'

export default {
  name: 'LoginModal',
  components: { BootstrapToggle },
  data: function () {
    return {
      isMainet: true,
      privateKeySeed: '',
      erroResponse: ''
    }
  },
  methods: {
    login: function (event) {
      this.erroResponse = ''

      // validate key
      const privateKeySeed = this.privateKeySeed.trim()

      if (_.isNull(this.privateKeySeed)) {
        this.erroResponse = 'Seed is empty!'
        return
      }

      const length = privateKeySeed.split(' ').length
      if (length !== 12 && length !== 24) {
        this.erroResponse = 'Invalid seed, seed must be either 12 or 24 words.'
        return
      }

      if (!Mnemonic.isValid(privateKeySeed)) {
        this.erroResponse = 'Invalid seed, seed must be either 12 or 24 words.'
        return
      }

      const store = this.$parent.$store
      // set network
      const networkType = this.isMainet ? 'livenet' : 'testnet'
      store.commit('SET_NETWORK_TYPE', networkType)
      const network = store.getters.network
      // set private key
      const code = new Mnemonic(privateKeySeed)
      const privateKey = code.toHDPrivateKey(null, network)
      store.commit('SET_PRIVATE_KEY', privateKey)

      this.$emit('close')
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
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 650px;
  height: 440px;
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

.loginForm .input-group {
  padding-bottom: 1em;
  height: 4em;
}

.input-group input {
  height: 4em;
}
</style>
