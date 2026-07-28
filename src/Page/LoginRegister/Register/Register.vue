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
              alt="Cadastro"
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
            <h2 class="fw-bold mb-2">Crie sua conta</h2>
            <p class="text-secondary mb-4">
              Junte-se à maior comunidade de leitores do mundo.
            </p>

            <div v-if="errorMessage" class="alert alert-danger py-2" role="alert">
              {{ errorMessage }}
            </div>

            <input
              type="text"
              class="form-control form-control-lg mb-3 bg-light"
              v-model="username"
              placeholder="Nome de usuário"
            />
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
              @click="register"
            >
              Criar conta
            </button>

            <span class="text-center text-secondary"
              >Já tem uma conta?
              <router-link
                to="/login"
                class="text-primary text-decoration-none fw-bold"
                >Faça login</router-link
              >
            </span>
          </div>
        </div>
      </div>
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
