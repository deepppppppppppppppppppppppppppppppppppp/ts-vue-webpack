// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
var fundebug = require('fundebug-javascript')

fundebug.apikey = '49d8f390e25ec1582e4d49d7bb6754d0151a5a5ca3c17e98693d04ca5104b40d'

function formatComponentName(vm: any) {
  if (vm.$root === vm) return 'root'
  var name = vm._isVue
    ? (vm.$options && vm.$options.name) || (vm.$options && vm.$options._componentTag)
    : vm.name
  return (
    (name ? 'component <' + name + '>' : 'anonymous component') +
    (vm._isVue && vm.$options && vm.$options.__file
      ? ' at ' + (vm.$options && vm.$options.__file)
      : '')
  )
}

Vue.config.errorHandler = function(err: any, vm: any, info: any) {
  if (vm) {
    var componentName = formatComponentName(vm)
    var propsData = vm.$options && vm.$options.propsData
    fundebug.notifyError(err, {
      metaData: {
        componentName: componentName,
        propsData: propsData,
        info: info
      }
    })
  } else {
    fundebug.notifyError(err)
  }
}

Vue.config.productionTip = false

/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
