import Vue from 'vue'
import VueRouter from 'vue-router'
import Test from '@/components/Test'
import Questions from '@/components/Questions'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: localStorage.getItem('index') },
  { path: '/_contests', component: Test },
  { path: '/_questions', component: Questions },
  { path: '/_subjects', component: () => import('@/components/Subjects') },
  { path: '/_grades', component: () => import('@/components/Grades.vue') },
  { path: '/_user', component: () => import('@/components/User') },
  { path: '/_posts', component: () => import('@/components/Posts') },
  { path: '/_comments', component: () => import('@/components/Comments') }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
