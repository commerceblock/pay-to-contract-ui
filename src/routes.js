import HomeView from './components/Home.vue'
import NotFoundView from './components/404.vue'

// Import Views - Dash
import CreateContractView from './components/create-contract/Home.vue'
import FulfillContractView from './components/fulfill-contract/Home.vue'
import RedeemContractView from './components/redeem-contract/Home.vue'
import EmptyView from './components/empty-page/Home.vue'

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
        name: 'Create Contract',
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
      }, {
        path: '/create-escrow',
        component: EmptyView,
        name: 'Create Escrow',
        meta: {description: ''}
      }, {
        path: '/complete-escrow',
        component: EmptyView,
        name: 'Complete Escrow',
        meta: {description: ''}
      }, {
        path: '/dispute-escrow',
        component: EmptyView,
        name: 'Dispute Escrow',
        meta: {description: ''}
      }, {
        path: '/hedge',
        component: EmptyView,
        name: 'Create Hedge',
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
