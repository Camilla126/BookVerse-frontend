import {createRouter, createWebHistory} from 'vue-router'
import Login from '../Page/LoginRegister/Login/Login.vue'
import Register from '../Page/LoginRegister/Register/Register.vue'
import AppShell from '../Page/Layout/AppShell.vue'
import Feed from '../Page/Feed/Feed.vue'
import Explore from '../Page/Explore/Explore.vue'
import Library from '../Page/Library/Library.vue'
import Write from '../Page/Write/Write.vue'
import Profile from '../Page/Profile/Profile.vue'
import Notifications from '../Page/Notifications/Notifications.vue'

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
    },
    {
        path: '/',
        component: AppShell,
        children: [
            { path: 'feed', component: Feed },
            { path: 'explore', component: Explore },
            { path: 'library', component: Library },
            { path: 'write', component: Write },
            { path: 'profile', component: Profile },
            { path: 'notifications', component: Notifications },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
