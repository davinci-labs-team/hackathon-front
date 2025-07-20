import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import './assets/vuetify-overload.css'

import App from './App.vue'
import router from './router'

import './assets/tailwind.css'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import fr from './locales/fr'
import en from './locales/en'

const savedLocale = localStorage.getItem('lang') || navigator.language.split('-')[0] || 'en'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: {
    fr,
    en,
  },
})

// Vuetify
// TODO : Add custom theme colors
const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
})

const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(vuetify)

app.mount('#app')
