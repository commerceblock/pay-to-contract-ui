import DashView from './components/Dash.vue'
import NotFoundView from './components/404.vue'

// Import Views - Dash
import DashboardView from './components/dash/Dashboard.vue'
import TablesView from './components/dash/Tables.vue'

// Routes
const routes = [
  {
    path: '/',
    component: DashView,
    auth: true,
    children: [
      {
        path: '',
        component: DashboardView,
        name: 'Contract Form',
        meta: {description: 'generate contract form and create payment base'}
      }, {
        path: '/tables',
        component: TablesView,
        name: 'Sign Contract',
        meta: {description: 'sign contract and generates payment address'}
      }
    ]
  }, {
    // not found handler
    path: '*',
    component: NotFoundView
  }
]

export default routes
