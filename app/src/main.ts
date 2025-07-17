import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'

import './assets/tailwind.css'

import fr from './locales/fr'
import en from './locales/en'

const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'en',
  messages: {
    fr,
    en
  }
})
const app = createApp(App)

app.use(router)
app.use(i18n)
app.mount('#app')
