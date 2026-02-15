<template>
    <div >
    <div>
    <span>BiblioVerse</span>
    <h1>
    Crie sua conta
    </h1>
    <p>
    Junte-se à maior comunidade de leitores do mundo.
    </p>
    <input type="text" v-model="username" placeholder="Nome de usuário">
<input type="text" v-model="email" placeholder="Email">
<input type="password" v-model="password" placeholder="Senha">

<button>Criar conta</button>
    <span>Já tem uma conta? <router-link to="/login">Faça login</router-link></span>
    </div>
    </div>
</template>

<script>
export default {
    name: 'Register',
    data() {
        return {
            username: '',
            email: '',
            password: ''
        };
    },          
}
</script>