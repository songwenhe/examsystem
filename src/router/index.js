import Vue from 'vue'
import VueRouter from 'vue-router'
import Test from '@/components/Test'
import Subjects from '@/components/Subjects'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: localStorage.getItem('index') },
  { path: '/_contests', component: Test },
  { path: '/_subjects', component: Subjects },
  { path: '/demo', component: () => import('@/components/Demo') }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
