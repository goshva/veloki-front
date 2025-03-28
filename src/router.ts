import { createRouter, createWebHashHistory } from 'vue-router'
import OrderList from './components/OrderList.vue'
import BikeList from './components/BikeList.vue'
import ClientList from './components/ClientList.vue'
import PriceList from './components/PriceList.vue'
import CreateOrder from './components/CreateOrder.vue'

const routes = [
  {
    path: '/',
    redirect: '/orders'
  },
  {
    path: '/orders',
    component: OrderList
  },
  {
    path: '/bikes',
    component: BikeList
  },
  {
    path: '/clients',
    component: ClientList
  },
  {
    path: '/tariffs',
    component: PriceList
  },
  {
    path: '/create-order',
    component: CreateOrder
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})