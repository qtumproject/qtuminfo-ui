import Vue from 'vue'
import VueI18N from 'vue-i18n'
import moment from 'moment'
import {locales, messages} from '@/locales'

Vue.use(VueI18N)

export let i18n

export function getLanguages(req) {
  if (process.server) {
    let languageString = req.headers['accept-language'] || ''
    return languageString.split(',').map(string => {
      let index = string.indexOf(';')
      return (index >= 0 ? string.slice(0, index) : string).toLowerCase()
    })
  } else if (process.client) {
    return navigator.languages
  }
}

export function getLocale(req) {
  let languages = getLanguages(req)
  for (let language of languages) {
    if (locales.includes(language)) {
      return language
    }
  }
  for (let language of languages) {
    if (locales.includes(language.slice(0, 2))) {
      return language.slice(0, 2)
    }
  }
  return 'en'
}

export default function({app, req}) {
  let i18nLocale = getLocale(req)
  let languages = getLanguages(req)
  for (let language of languages) {
    if (moment.locale(language) == language.toLowerCase()) {
      break
    }
  }
  i18n = app.i18n = new VueI18N({
    locale: i18nLocale,
    fallbackLocale: 'en',
    messages
  })
}
