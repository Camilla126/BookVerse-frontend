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

<button @click="register">Criar conta</button>
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
// Register.vue - Script corrigido
methods: {
    async register() {
    try {
        // Observe o /api/ antes de /users
        const response = await this.$api.post('/api/v1/authentication/register', {
            user: { // O Rails espera os dados dentro da chave 'user'
                name: this.username,
                email: this.email,
                password: this.password
            }
        });
        
        localStorage.setItem('user_token', response.data.token);
        alert('Conta criada com sucesso!'); // Para onde você quiser mandar o usuário
    } catch (error) {
        console.error(error.response);
        alert('Erro ao cadastrar. Verifique o console!');
    }
}
}
}
</script>