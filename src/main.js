import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import router from './Routes/routes.js'
import axios from 'axios'

const app = createApp(App)
axios.defaults.baseURL = 'http://localhost:3000'
app.config.globalProperties.$api = axios
app.use(router)
app.mount('#app')
