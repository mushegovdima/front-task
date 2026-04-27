import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import router from './router'

createApp(App)
  .use(router)
  .use(createPinia())
  .use(VueQueryPlugin)
  .mount('#app')
