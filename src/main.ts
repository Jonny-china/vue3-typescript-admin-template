import { createApp } from 'vue'
import Cookies from 'js-cookie'
import App from './App.vue'

import store from './store'
import router from './router'

import './permission'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import ElementPlus from 'element-plus'
import './styles/element-variables.scss'
import locale from 'element-plus/lib/locale/lang/zh-CN' // 中文语言

import '@/styles/index.scss' // global css

import SvgIcon from '@/icons'
import 'virtual:svg-icons-register'

import i18n from '@/lang'

const app = createApp(App)

app
  .use(store)
  .use(router)
  .use(ElementPlus, {
    size: Cookies.get('size') ?? 'medium', // set element-plus default size
    locale
  })
  .use(i18n)
  .component('SvgIcon', SvgIcon)

app.mount('#app')
