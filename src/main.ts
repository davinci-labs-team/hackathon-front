import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createVuetify } from 'vuetify'
import { createPinia } from 'pinia'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import './assets/vuetify-overload.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import App from './App.vue'
import router from './router'

import './assets/tailwind.css'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import fr from './locales/fr'
import en from './locales/en'

library.add(faDiscord)

const savedLocale = localStorage.getItem('lang') || navigator.language.split('-')[0] || 'en'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  inheritLocale: true,
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
  defaults: {
    global: {
      class: 'font-sans text-base',
      style: 'font-size: 16px !important;',
    },
  },
})

const app = createApp(App)
app.component('VueDatePicker', VueDatePicker)
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router)
app.use(i18n)
app.use(createPinia())
app.use(vuetify)

app.mount('#app')
