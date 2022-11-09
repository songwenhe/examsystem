import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/_login' },
  { path: '/_login', component: () => import('@/components/Login') },
  {
    path: '/_backstagepage',
    component: () => import('@/components/Backstagepage'),
    redirect: '/_backstagepage/_contests',
    children: [
      { path: '_contests', component: () => import('@/components/backstages/Test') },
      { path: '_questions', component: () => import('@/components/backstages/Questions') },
      { path: '_subjects', component: () => import('@/components/backstages/Subjects') },
      { path: '_grades', component: () => import('@/components/backstages/Grades.vue') },
      { path: '_user', component: () => import('@/components/backstages/User') },
      { path: '_posts', component: () => import('@/components/backstages/Posts') },
      { path: '_comments', component: () => import('@/components/backstages/Comments') },
      { path: '_problems/:id/:contestName', component: () => import('@/components/backstages/problems/Problems') },
      { path: '_grade/:id/:contestName', component: () => import('@/components/backstages/garde/Garde') }
      // { path: '_tests/:id/:contestName', component: () => import('@/components/backstages/test/Tests') }
    ]
  },
  {
    path: '/_frontpage',
    component: () => import('@/components/Frontpage'),
    redirect: '/_frontpage/index',
    children: [
      { path: 'index', component: () => import('@/components/fronts/Index') },
      {
        path: 'main',
        component: () => import('@/components/fronts/Main'),
        children: [
          { path: '/_frontpage/contest', component: () => import('@/components/fronts/Contest') },
          { path: '/_frontpage/subject', component: () => import('@/components/fronts/Sub') },
          { path: '/_frontpage/shares', component: () => import('@/components/fronts/Shares') },
          { path: '/_frontpage/subs/:id', component: () => import('@/components/fronts/subs/Subs') },
          { path: '/_frontpage/problem/:id', component: () => import('@/components/fronts/subs/Problem') },
          { path: '/_frontpage/share/:id', component: () => import('@/components/fronts/posts/Share') },
          { path: '/_frontpage/contests/:id/:contestName', component: () => import('@/components/fronts/contests/Contests') },
          {
            path: '/_frontpage/users',
            component: () => import('@/components/fronts/users/Users'),
            redirect: '/_frontpage/users/person',
            children: [
              { path: 'person', component: () => import('@/components/fronts/users/Person') },
              { path: 'password', component: () => import('@/components/fronts/users/Password') },
              { path: 'exam', component: () => import('@/components/fronts/users/Exam') },
              { path: 'mypost', component: () => import('@/components/fronts/users/Mypost') }
            ]
          }
        ]
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  //to表示将要访问的路由信息

  //from 表示将要离开的路由信息对象
  // console.log(from)
  // next()表示放行的意思
  next()
  // if (to.path === '@/App.vue') {
  //   const token = localStorage.getItem('token')
  //   if (token) {
  //     next()
  //   } else {
  //     next('@/components/Login.vue')
  //   }
  // }
  //分析：1.要拿到用户将要访问的哈希地址
  //     2.判断hash地址是否等于 /main
  //     2.1 如果等于 /main，证明需要登录之后，才能访问成功
  //     2.2 如果不等于 /main，则不需要登录，直接放行 next()
  //     3.如果访问的地址是 /main。则需要读取 localStorage 中的 token 值
  //     3.1 如果有token，则强制跳转到 /login页面
})

export default router
