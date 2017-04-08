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
        name: 'Create Contract',
        meta: {description: 'manage and create contract'}
      }, {
        path: '/contracts',
        component: ContractsView,
        name: 'Contracts',
        meta: {description: 'manage and sign contracts'}
      }
    ]
  }, {
    // not found handler
    path: '*',
    component: NotFoundView
  }
]

export default routes
