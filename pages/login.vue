<template xmlns="http://www.w3.org/1999/html">
  <div class="login-content">

    <div class="login-content-box logo-box">
        <span class="logo d-block" style="margin-bottom: 20px">
          <img height="63" src="../assets/img/utils/logo-text-white.svg" alt="masters-logo">
        </span>
      <span class="d-block" style="max-width: 500px">
          Conteúdo de qualidade criado de professor para professor.
        </span>
    </div>

    <div class="login-content-box align-self-center">
      <b-card align="left">
        <b-form id="login-form" @submit.prevent="enter">
          <h1 v-text="formText[formSelected].title"></h1>
          <small v-if="['login','recover'].includes(formSelected) && !isAdmin && !registeredSuccess">Ainda não tem
            cadastro?
            <a href="#" @click="formControl('new')">Crie sua conta agora</a>
          </small>

          <div class="box-form">
            <span v-if="!registeredSuccess">
              <FormInput class="mt-4 position-relative" @value-model="setValue" :isRequired="true"
                         labelText="Nome completo" nameInput="name" v-if="newRegister" :isNew="newRegister"/>

              <FormInput class="mt-4 position-relative" :isRequired="true" labelText="CPF"
                         nameInput="cpf" @value-model="setValue" v-if="newRegister" :isNew="newRegister"/>

              <FormInput class="mt-4 position-relative" typeInput="email" :isRequired="true" @value-model="setValue"
                         :labelText="formSelected === 'recover' ? 'Informe o e-mail cadastrado' : 'E-mail'"
                         :nameInput="newRegister || formSelected === 'recover' ? 'email' : 'username'"
                         :isNew="newRegister"/>

              <FormInput class="mt-4 position-relative" typeInput="password" :isRequired="true" labelText="Senha"
                         nameInput="password" v-if="formSelected !== 'recover'" @value-model="setValue"
                         :isNew="newRegister"/>
              <span class="error-login" v-if="notification" v-text="notification"></span>
            </span>
            <span v-else>
              <div class="svg-box">
                <UtilsAnimation src="/animations/save-success.json"/>
              </div>

              <span class="confirm-account-text">
                <span v-if="formSelected === 'new'">
                  <span class="green-text">Cadastro efetuado com sucesso!</span>
                  Agora você só precisa confirmar sua conta. Acesse o link enviado por e-mail para <strong>{{
                    formData.email
                  }}</strong>
                </span>
                <span v-else>
                  Enviamos um e-mail para <strong>{{ formData.email }}</strong> com as instruções para redefinir sua senha.
                </span>

              </span>

              <span class="resend-link">
                Se o link não chegar em até 30 segundos, <a href="#" @click="sendPass">tente reenviar</a>.
              </span>
            </span>
            <div class="text-center mt-5">
              <small v-if="formSelected === 'login'"><a href="#" @click="formControl('recover')">Esqueci minha senha</a></small>

              <b-button type="submit" :disabled="isLoading"
                        :class="['d-block w-100 mt-4 btn-purple lg', {'btn-grey': registeredSuccess}]">
                <UtilsLoading v-if="isLoading"/>
                <span v-else>{{ registeredSuccess ? "Voltar para o login" : formText[formSelected].buttonText }}</span>
              </b-button>
            </div>
          </div>
        </b-form>
      </b-card>
    </div>

  </div>
</template>

<script>

export default {
  auth: false,
  head() {
    return {
      title: "Login - Masters",
    }
  },
  layout: 'login',
  data() {
    return {
      isLoading: false,
      formData: {},
      formText: {
        new: {title: "Cadastrar", buttonText: "Fazer cadastro"},
        recover: {
          title: "Redefinir senha",
          buttonText: "Redefinir minha senha",
          student: "/auth/reset-password",
          admin: "/auth/reset-password"
        },
        login: {title: "Entrar", buttonText: "Acessar sua conta"}
      },
      formSelected: 'login',
      isAdmin: location.pathname.includes('admin'),
      newRegister: false,
      registeredSuccess: false,
      notification: null
    }
  },
  methods: {
    // Altera a exibição do formulário e dá reset variáveis
    formControl(type) {
      this.newRegister = type === 'new';
      this.formSelected = type;
      this.formData = {};
      this.notification = null;
      this.isLoading = false;

      setTimeout(() => {
        document.getElementById("login-form").reset();
      }, 20);
    },
    // Recupera os valores do input no componente e atribui ao objeto do formulário
    setValue(v) {
      this.formData[v.model] = v.value;
    },
    // Processa a autenticação do usuário
    async enter() {
      this.notification = null;
      this.isLoading = true;

      // Função para voltar à tela de login
      if (this.registeredSuccess) {
        this.registeredSuccess = false;
        this.formControl("login");
        return;
      }
      // Processa a inserção de um novo estudante
      if (this.newRegister) {
        if (this.newRegister) {
          this.form['image'] = null
        }
        this.$axios.$post("/student", this.formData).then(response => {
          this.registeredSuccess = true;
        }).finally(() => {
          this.isLoading = false;
        });
      }
      // Recuperação da senha
      else if (this.formSelected === 'recover') {
        this.sendPass()
      }
      // Processa o login
      else {
        try {
          let strategy = this.isAdmin ? 'admin' : 'student';
          await this.$auth.loginWith(strategy, {
            data: {...this.formData},
          }).then(response => {
            let token = response.data.accessToken;
            let user = {
              ...this.parseJwt(token)
            }

            this.$auth.$storage.setLocalStorage('user', user);
            this.$auth.setToken(strategy, 'Bearer ' + token);
            this.$auth.setRefreshToken(strategy, token);
            this.$auth.$storage.setLocalStorage('strategy', strategy);
            this.$axios.setHeader('Authorization', 'Bearer ' + token);
            this.$auth.ctx.app.$axios.setHeader('Authorization', 'Bearer ' + token);
            this.$auth.redirect('home');
          }).catch(e => {
              if (e.response.data.data.statusCode === 401) {
                this.notification = e.response.data.data.error[0];
                this.isLoading = false;
              } else {
                this.notification = "Email e/ou senha inválidas. Por favor, verifique os dados informados.";
              }
            })
            .finally(() => {
              this.isLoading = false;
            });
        } catch (e) {
          console.log(e)
        }
      }
    },
    // Recupera as informações do token JWT
    parseJwt(token) {
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    },
    // Envia/Reenvia a requisição de recuperação de senha
    sendPass() {
      this.$axios.$put(this.formText.recover[this.isAdmin ? 'admin' : 'student'], this.formData).then(response => {
        this.registeredSuccess = true;
      }).finally(() => {
        this.isLoading = false;
      });
    }
  },
  beforeMount() {
    if (this.$store.state.auth.loggedIn) {
      this.$auth.redirect('home');
    }
  }
}
</script>

<style scoped>
.login-content {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-content: center;
  background: white url("../assets/img/login/login_screen1.jpg") no-repeat;
  background-size: cover;
  height: 100vh;
  overflow-y: auto;
}

.login-content-box {
  display: flex;
  padding: 51px 51px 86px;
  flex-direction: column;
  height: 660px;
}

.logo-box {
  padding-left: 79px;
  color: #fff;
  font-size: 24px;
  width: 100%;
  justify-content: flex-end;
  align-self: center;
}

a {
  color: #89238A;
}

.card {
  padding: 48px;
  box-shadow: 0px 35px 33px rgba(9, 14, 17, 0.64);
  border-radius: 40px;
  width: 464px;
  height: 515px;
  overflow-y: auto;
}

.card .card-body {
  padding: 0px;
}

.input-tip {
  font-size: 12px;
  font-family: "Inter Regular";
  color: #8A8C92;
  height: 16px;
}


input.form-control {
  background: #F1F1F2;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  padding: 18px 23px;
  height: 56px;
  font-family: 'Inter Bold';
  border: none;
}

input.form-control:focus, input.form-control:active {
  box-shadow: 0px 0px 0 2px #89238A;
}

.box-form {
  overflow-x: hidden;
  overflow-y: auto;
  height: 342px;
  padding: 0px 5px 3px;
}

.confirm-account-text {
  display: block;
  font-family: "Inter Regular";
  font-size: 13px;
  line-height: 18px;
  color: #525359;
  text-align: center;
}

.confirm-account-text .green-text {
  display: block;
  font-family: "Poppins Regular";
  font-size: 18px;
  line-height: 24px;
  color: #7FBA7A;
}

.resend-link {
  display: block;
  margin-top: 46px;
  font-family: "Inter Regular";
  font-size: 12px;
  line-height: 16px;
  color: #8A8C92;
  text-align: center;
}

.resend-link a {
  color: #8A8C92;
  text-decoration: underline;
}

.svg-box {
  height: 158px;
  width: 158px;
  margin: 0 auto;
}

.error-login {
  display: block;
  margin-top: 10px;
  color: #F44545;
  font: 12px "Inter Regular";
  line-height: 16px;
}

@media (max-width: 920px) {
  .login-content {
    flex-direction: column;
    justify-content: start;
  }

  .login-content-box {
    padding: 25px 20px;
    align-items: center;
    height: auto;
  }

  .logo-box {
    text-align: center;
  }
}

@media (max-width: 640px) {
  .logo-box {
    font-size: 18px;
  }

  h2 {
    font-size: 30px;
  }

  .card {
    padding: 20px;
    border-radius: 20px;
    width: 310px;
    height: 420px;
  }

  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
