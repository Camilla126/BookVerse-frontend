import { createApp } from 'vue'
import App from './App.vue'
import router from './Routes/routes.js'
import api from 'axios'
import './assets/styles/globals.scss'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)

app.config.globalProperties.$api = api

app.use(router)
app.mount('#app')