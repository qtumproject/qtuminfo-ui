import Vue from 'vue'
import VueI18N from 'vue-i18n'
import moment from 'moment'
import {locales, messages} from '@/locales'

Vue.use(VueI18N)

export let i18n

export default function({app, isClient, isServer, req}) {
  let i18nLocale = null
  let momentLocale = false
  let languages = []

  if (isServer) {
    let languageString = req.headers['accept-language'] || ''
    let index = languageString.indexOf(';')
    if (index >= 0) {
      languageString = languageString.slice(0, index)
    }
    languages = languageString.split(',')
  } else if (isClient) {
    languages = navigator.languages
  }

  for (let language of languages) {
    if (!momentLocale && moment.locale(language) == language.toLowerCase()) {
      momentLocale = true
    }
    if (!i18nLocale && locales.includes(language.toLowerCase())) {
      i18nLocale = language
    }
  }

  i18n = app.i18n = new VueI18N({
    locale: i18nLocale || 'en',
    fallbackLocale: 'en',
    messages
  })
}
