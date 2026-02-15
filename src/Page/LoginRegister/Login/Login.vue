<template>
    <div>
    <div>
    <span>BiblioVerse</span>
    <h1>Bem-vindo de volta!</h1>
    <p>Digite suas credenciais para acessar sua biblioteca.</p>
    <input type="email" v-model="email" placeholder="Email">
    <input type="password" v-model="password" placeholder="Senha">
    <button>Entrar</button>
    <p>Ou continue com</p>
    <button>Google</button>
    <span>Não tem uma conta?  <router-link to="/register">Cradastre-se gratuitamente</router-link></span>
    </div>
    </div>
    
</template>

<script>

export default {
    name: 'Login',
}


</script>