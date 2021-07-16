import Vue from 'vue'
import VueRouter from 'vue-router'//使用路由时，要引入vue-router
import test from 'src/view/test'

// 要告诉 vue 使用 vueRouter
Vue.use(VueRouter)

export default new VueRouter({
  routes: [{
    path: '/home',
    component: test,
  }
  ]
})
