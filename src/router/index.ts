import Vue from 'vue'
import Router from 'vue-router'
import home from '@/template/home/index.vue'
import demo from '@/template/home/demo.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/demo',
      name: 'demo',
      component: demo
    }
  ]
})
