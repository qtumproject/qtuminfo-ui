import Vue from 'vue'
import VueI18N from 'vue-i18n'
import moment from 'moment'
import {locales, messages} from '@/locales'

Vue.use(VueI18N)

export let i18n

export default function({app, req}) {
  let i18nLocale = null
  let momentLocale = false
  let languages = []

  if (process.server) {
    let languageString = req.headers['accept-language'] || ''
    languages = languageString.split(',').map(string => {
      let index = string.indexOf(';')
      return (index >= 0 ? string.slice(0, index) : string).toLowerCase()
    })
  } else if (process.client) {
    languages = navigator.languages
  }

  for (let language of languages) {
    if (!momentLocale && moment.locale(language) == language.toLowerCase()) {
      momentLocale = true
    }
    if (!i18nLocale && locales.includes(language)) {
      i18nLocale = language
    }
  }

  if (!i18nLocale) {
    for (let language of languages) {
      if (locales.includes(language.slice(0, 2))) {
        i18nLocale = language.slice(0, 2)
      }
    }
  }

  i18n = app.i18n = new VueI18N({
    locale: i18nLocale || 'en',
    fallbackLocale: 'en',
    messages
  })
}
