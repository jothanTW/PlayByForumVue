import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vcookies from "vue-cookies"

Vue.config.productionTip = false
Vue.prototype.$pageTitle = "TEST";
Vue.prototype.$pageCaches = {
  group: {},
  forum: {},
  thread: {}
}

Vue.use(vcookies);

let vm = new Vue({
  router,
  render: h => h(App)
});

vm.$mount('#app')
