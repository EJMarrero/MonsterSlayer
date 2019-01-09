import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';

export const eventBus = new Vue();
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');


