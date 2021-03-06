// Import System requirements
import Vue from 'vue'
import Resource from 'vue-resource'
import VueRouter from 'vue-router'
import crypto from 'crypto'

import routes from './routes'
import store from './store'

// Import Helpers for filters
import { domain, count, prettyDate, pluralize } from './filters'

// Import Views - Top level

import AppView from './components/App.vue'

// Import Install and register helper items
Vue.filter('count', count)
Vue.filter('domain', domain)
Vue.filter('prettyDate', prettyDate)
Vue.filter('pluralize', pluralize)

// Resource logic
Vue.use(Resource)
Vue.use(VueRouter)

// Routing logic
var router = new VueRouter({
  routes: routes,
  mode: 'history',
  scrollBehavior: function (to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 }
  }
})

// Start out app!
// eslint-disable-next-line no-new
new Vue({
  el: '#root',
  router: router,
  store: store,
  render: h => h(AppView)
})

// Check local storage to handle refreshes
if (window.localStorage) {
  // if (store.state.user !== window.localStorage.getItem('privateKeySeed')) {
  //   store.commit('SET_PRIVATE_KEY_SEED', window.localStorage.getItem('privateKeySeed'))
  // }
}

// workaround to https://github.com/bitpay/bitcore-lib/issues/34
if (!crypto._createHash) {
  crypto._createHash = crypto.createHash
  crypto.createHash = function createHash (alg) {
    if (alg === 'ripemd160') {
      alg = 'rmd160'
    }
    return crypto._createHash(alg)
  }
}
