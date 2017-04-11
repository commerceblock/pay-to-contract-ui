import HomeView from './components/Home.vue'
import NotFoundView from './components/404.vue'

// Import Views - Dash
import CreateContractView from './components/create-contract/Home.vue'
import FulfillContractView from './components/fulfill-contract/Home.vue'
import RedeemContractView from './components/redeem-contract/Home.vue'

// Routes
const routes = [
  {
    path: '/',
    component: HomeView,
    auth: true,
    children: [
      {
        path: '/',
        component: CreateContractView,
        name: 'Create Invoice Contract',
        meta: {description: ''}
      }, {
        path: '/fulfill',
        component: FulfillContractView,
        name: 'Fulfill Contract',
        meta: {description: ''}
      }, {
        path: '/redeem',
        component: RedeemContractView,
        name: 'Redeem Contract',
        meta: {description: ''}
      }
    ]
  }, {
    // not found handler
    path: '*',
    component: NotFoundView
  }
]

export default routes
