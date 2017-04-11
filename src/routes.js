import HomeView from './components/Home.vue'
import NotFoundView from './components/404.vue'

// Import Views - Dash
import CreateContractView from './components/create-contract/Home.vue'
import ContractsView from './components/Contracts.vue'

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
        path: '/contracts',
        component: ContractsView,
        name: 'Redeem Contract',
        meta: {description: 'sign and redeem contracts'}
      }
    ]
  }, {
    // not found handler
    path: '*',
    component: NotFoundView
  }
]

export default routes
