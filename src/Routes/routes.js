import {createRouter, createWebHistory} from 'vue-router'
import Login from '../Page/LoginRegister/Login/Login.vue'
import Register from '../Page/LoginRegister/Register/Register.vue'

const routes = [
    {
        path: '/',
        component: Login
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/register',
        component: Register
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router