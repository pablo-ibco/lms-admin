<template>
  <div>
    <h2>Meu Perfil</h2>
    <div>
      <b-form id="login-form" class="d-flex mt-3 w-75" @submit.prevent="saveChanges">
        <div class="box-image pt-5 pl-3 pr-5">
          <div class="image-circle cursor-pointer position-relative" @click="openModalImage">
            <img class="img-profile" :src="require('/assets/img/login/login_screen1.jpg')" alt="">
          </div>
        </div>
        <div class="box-form-inputs">
          <h6 class="mt-2">Informações básicas</h6>

          <FormInput class="mt-4 position-relative" @value-model="setValue" :isRequired="true" :value="user.name"
                     labelText="Nome completo" nameInput="name" size="lg" :isNew="newRegister"/>

          <FormInput class="mt-4 position-relative" typeInput="email" :isRequired="true" @value-model="setValue"
                     labelText="E-mail" :value="user.email" nameInput="'username'" size="lg" :readOnly="true"
                     :isNew="newRegister"/>

          <h6 class="mt-5">Trocar senha</h6>
          <FormInput class="mt-4 position-relative pass-field" typeInput="password" :isRequired="true" labelText="Senha"
                     nameInput="password" size="lg" @value-model="setValue" :isNew="newRegister"/>

          <FormInput class="mt-4 position-relative pass-field" typeInput="password" :isRequired="true" labelText="Nova Senha"
                     nameInput="password" size="lg" @value-model="setValue" :isNew="newRegister"/>

          <div class="text-center mt-4">
            <b-button type="submit" :disabled="isLoading" :class="['mt-4 btn-purple lg']">
              <UtilsLoading v-if="isLoading"/>
              <span v-else>Salvar alterações</span>
            </b-button>
          </div>
        </div>
      </b-form>
    </div>

    <ModalChooseImage/>
  </div>
</template>

<script>

export default {
  head() {
    return {
      title: "Meu Perfil - Masters",
    }
  },
  data() {
    return {
      isLoading: false,
      newRegister: false,
      user: {},
      userEdit: {}
    }
  },
  beforeCreate() {
    let id = this.$auth.$storage.getLocalStorage('user').id;

    this.$axios.get('/user?id='+id).then(response => {
      this.user = {...response.data.data}
      console.log(this.user)
    })
  },
  methods: {
    setValue(v) {
      if(v.value) {
        this.userEdit[v.model] = v.value;
      }
      else {
        delete this.userEdit[v.model];
      }
    },
    openModalImage(){
      this.$bvModal.show('choose-image')
    },
    saveChanges(){
      console.log(this.userEdit)
    }
  }
}
</script>

<style>
.box-form-inputs {
  width: 400px;
}

.image-circle .img-profile {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  z-index: 1;
}

.image-circle:after {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font: 20px "Inter Bold";
  content: 'Trocar foto';
  color: #fff;
  background-color: #ffffff50;
  opacity: 0;
  z-index: 10;
  transition: .3s all;
}

.image-circle:hover:after {
  opacity: 1;
}
</style>
