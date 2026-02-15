import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import router from './Routes/routes.js'

createApp(App).use(router).mount('#app')
