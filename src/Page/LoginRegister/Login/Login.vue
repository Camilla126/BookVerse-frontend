<template>
	<div class="d-flex justify-content-center align-items-center min-vh-100">
		<div class="col-7">
			<div class="card rounded-5">
				<div class="row g-0">
					<div class="col-md-6 d-flex align-items-center justify-content-center">
						<img src="/public/LoginRegister/login-register.png" alt="Login"
							class="img-fluid rounded-start-5 w-100 h-100" />
					</div>
					<div class="col-md-6 p-4 d-flex flex-column justify-content-center">
						<span>BiblioVerse</span>
						<h1>Bem-vindo de volta!</h1>
						<p>Digite suas credenciais para acessar sua biblioteca.</p>
						<input type="email" v-model="email" placeholder="Email" />
						<input type="password" v-model="password" placeholder="Senha" />
						<button @click="login">Entrar</button>
						<p>Ou continue com</p>
						<button>Google</button>
						<span>Não tem uma conta?
							<router-link to="/register">Cradastre-se gratuitamente</router-link></span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Login",
	data() {
		return {
			email: "",
			password: "",
		};
	},
	methods: {
		login() {
			this.$api.post("/api/v1/authentication/login", {
				email: this.email,
				password: this.password,
			})
				.then(response => {
					localStorage.setItem("user_token", response.data.token);
				})
				.catch(error => {
					alert("Erro: " + error.response.data.error);
				});
		},
	},
};
</script>
