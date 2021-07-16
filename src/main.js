import Vue from 'vue'
import App from './App.vue'
import radioTable from './component/radioTable/radioTable'
import pageSelect from './component/pageSelect/pageSelect'
import router from './router/index.js'

Vue.prototype.$radioTable  = radioTable;
Vue.prototype.$pageSelect  = pageSelect;

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
