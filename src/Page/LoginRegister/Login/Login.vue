<template>
  <div
    class="d-flex justify-content-center align-items-center min-vh-100 animated-background"
  >
    <div class="col-xl-6">
      <div class="card shadow-lg border-0 rounded-5 overflow-hidden">
        <div class="row g-0">
          <div class="col-md-6 position-relative d-none d-md-block">
            <img
              src="/public/LoginRegister/login-register.png"
              alt="Login"
              class="img-fluid w-100 h-100 object-fit-cover"
            />
            <div
              class="position-absolute top-0 start-0 w-100 h-100 sombra-image"
            ></div>
            <div
              class="position-absolute start-50 bottom-0 translate-middle-x pb-5 text-right text-white w-75"
            >
              <h2 class="fw-bold mb-3">
                "Um leitor vive mil vidas antes de morrer. O homem que nunca lê
                vive apenas uma."
              </h2>
              <p class="fs-5">— George R.R. Martin</p>
            </div>
          </div>

          <div class="col-md-6 p-5 d-flex flex-column justify-content-center">
            <span class="text-primary fw-bold mb-2">BiblioVerse</span>
            <h2 class="fw-bold mb-2">Bem-vindo de volta!</h2>
            <p class="text-secondary mb-4">
              Digite suas credenciais para acessar sua biblioteca.
            </p>

            <input
              type="email"
              class="form-control form-control-lg mb-3 bg-light"
              v-model="email"
              placeholder="Email"
            />
            <input
              type="password"
              class="form-control form-control-lg mb-4 bg-light"
              v-model="password"
              placeholder="Senha"
            />

            <button
              class="btn btn-primary btn-lg w-100 mb-3 rounded-pill fw-bold"
              @click="login"
            >
              Entrar
            </button>

            <div class="text-center text-secondary mb-3">Ou continue com</div>

            <button class="btn btn-outline-dark btn-lg w-100 mb-4 rounded-pill">
              <i class="bi bi-google"></i> Google
            </button>

            <span class="text-center text-secondary"
              >Não tem uma conta?
              <router-link
                to="/register"
                class="text-primary text-decoration-none fw-bold"
                >Cadastre-se gratuitamente</router-link
              >
            </span>
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
      this.$api
        .post("/api/v1/authentication/login", {
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          localStorage.setItem("user_token", response.data.token);
        })
        .catch((error) => {
          alert("Erro: " + error.response.data.error);
        });
    },
  },
};
</script>
