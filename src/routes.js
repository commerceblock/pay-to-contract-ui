import HomeView from './components/Home.vue'
import NotFoundView from './components/404.vue'

// Import Views - Dash
import FormsView from './components/Forms.vue'
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
        component: FormsView,
        name: 'Create Contract Template',
        meta: {description: 'manage and create contract templates'}
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
