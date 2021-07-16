import radioTable from './component/radioTable/radioTable'
import pageSelect from './component/pageSelect/pageSelect'
import Vue from "vue"
const lycUI = {
  "radioTable":radioTable,
  "pageSelect":pageSelect
}



const install = function( npm  = {}) {
  if (install.installed) return
  Object.keys(lycUI).forEach(key => {
    Vue.component(key, lycUI[key])
  })

  Vue.prototype.$radioTable  = radioTable;
  Vue.prototype.$pageSelect  = pageSelect;
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue) // 通过use方式全部引入
}

const API = {
  install,
  ...lycUI
}

export default API // 通过插件单独引入
