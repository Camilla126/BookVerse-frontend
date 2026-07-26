<template>
    <div>
        <div>
            <span>BiblioVerse</span>
            <h1>
                Crie sua conta
            </h1>
            <p>
                Junte-se à maior comunidade de leitores do mundo.
            </p>
            <div v-if="errorMessage" class="alert alert-danger py-2" role="alert">
                {{ errorMessage }}
            </div>
            <input type="text" v-model="username" placeholder="Nome de usuário">
            <input type="text" v-model="email" placeholder="Email">
            <input type="password" v-model="password" placeholder="Senha">

            <button @click="register">Criar conta</button>
            <span>Já tem uma conta? <router-link to="/login">Faça login</router-link></span>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '../../../stores/auth.js'

export default {
    name: 'Register',
    data() {
        return {
            username: '',
            email: '',
            password: '',
            errorMessage: ''
        };
    },
    computed: {
        authStore() {
            return useAuthStore()
        }
    },
    methods: {
        async register() {
            this.errorMessage = ''

            try {
                await this.authStore.register({
                    name: this.username,
                    email: this.email,
                    password: this.password
                })
                this.$router.push('/feed')
            } catch (error) {
                this.errorMessage = error.response?.data?.errors?.join(', ') || 'Erro ao cadastrar. Tente novamente.'
            }
        }
    }
}
</script>