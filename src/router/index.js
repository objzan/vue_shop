import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('@/components/Login.vue')
const Home = () => import('@/components/Home.vue')
const Welcome = () => import('@/components/Welcome.vue')
const User = () => import('@/components/user/User.vue')
const Rights = () => import('@/components/power/Rights.vue')
const Roles = () => import('@/components/power/Roles.vue')
const Categories = () => import('@/components/goods/Cate.vue')
const Params = () => import('@/components/goods/Params.vue')
const List = () => import('@/components/goods/list.vue')
const Add = () => import('@/components/goods/Add.vue')
const Edit = () => import('@/components/goods/Edit.vue')
const Order = () => import('@/components/order/Order.vue')
const Report = () => import('@/components/report/Report.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Add },
      { path: '/goods/edit', component: Edit },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next是一个函数，表示放行
  // next()放行    next('/login')强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.localStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
