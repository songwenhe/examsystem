import Vue from 'vue'
import VueRouter from 'vue-router'
import Test from '@/components/Test'
import Questions from '@/components/Questions'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: localStorage.getItem('index') },
  { path: '/_contests', component: Test },
  { path: '/_questions', component: Questions },
  {path:'/_subjects',component:()=>import('@/components/Subjects')},
  { path: '/demo', component: () => import('@/components/Demo') }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
