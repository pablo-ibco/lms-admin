<template>
  <div>
    <b-modal id="author" :title="formText[formType].title" centered no-close-on-esc no-close-on-backdrop hide-footer
             header-class="border-0" dialog-class="modal-author" ref="modalAuthor">
      <b-form id="login-form" @submit.prevent="executeForm">

        <div class="box-form">
            <span v-if="!isSuccess">
            <input style="display: none" ref="fileInput" type="file" @change="setImage" enctype="multipart/form-data">

            <div class="drop-image d-flex cursor-pointer" @click="$refs.fileInput.click()" v-cloak
                 @drop.prevent="setImage" @dragover.prevent>
              <span class="selected-image">
                <img width="128" height="128" :src="imgBase64 ? imgBase64 : imgDefault"
                     alt="author-image">
              </span>
              <span class="instructions">
                <span class="top-text mb-1">
                  Arraste ou <span>selecione</span> uma foto de perfil
                </span>
                <span class="sub-text">
                  Imagens com 200x200 pixels ou mais ficam com qualidade melhor.
                </span>
              </span>
            </div>

            <FormInput class="mt-4 position-relative" @value-model="setValue" :isRequired="true" labelText="Nome"
                       nameInput="name" size="lg" :isNew="true" placeholder="Digite nome e sobrenome"
                       :value="author.name"/>

            <FormInput class="mt-4 position-relative" @value-model="setValue" :isRequired="true" labelText="Descrição"
                       nameInput="description" size="lg" :isNew="true" :value="author.description"
                       placeholder="Faça uma pequena descrição para essa pessoa"/>

            <span class="error-login" v-if="notification" v-text="notification"></span>
              </span>
          <span v-else-if="isSuccess">
          <UtilsAnimation src="/animations/save-success.json" :cssGroup="{'transform': 'scale(1.5)'}"/>
          <span class="green-text text-center d-block">{{ formText[formType].sucessMsg }}</span>
        </span>

          <div class="mt-5 mb-2 d-flex justify-content-around">
            <b-button class="btn-grey lg" :disabled="isLoading" @click="close">
              {{ isSuccess ? 'Fechar' : 'Cancelar' }}
            </b-button>
            <b-button variant="none" type="submit" :disabled="isLoading" class="btn-purple lg ml-2">
              <UtilsLoading v-if="isLoading"/>
              <span v-else>{{ isSuccess ? "Novo Cadastro" : formText[formType].btnTitle }}</span>
            </b-button>
          </div>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
// import aws from "/plugins/aws.js";

export default {
  data() {
    return {
      formText: {
        new: {title: "Cadastrar", sucessMsg: "Cadastro realizado com sucesso!", btnTitle: "Cadastrar autor"},
        edit: {title: "Editar", sucessMsg: "Dados editados com sucesso!", btnTitle: "Salvar alterações"}
      },
      formType: 'new',
      author: {
        name: '',
        description: '',
        image: null,
      },
      imgFile: null,
      imgDefault: require('../../assets/img/utils/photo-drop.svg'),
      imgBase64: null,
      isLoading: false,
      isSuccess: false,
      notification: null
    }
  },
  methods: {
    getAuthor(author) {
      if (author) {
        this.formType = 'edit',
          this.author.id = author.id;
        this.author.name = author.name;
        this.author.image = author.image;
        this.author.description = author.description;

        if (author.image) {
          this.getImage(author.image)
        }
      }
    },
    async getImage(key) {
      this.$getFileAWS(key).then(resp => {
        this.imgBase64 = resp;
      });
    },
    setValue(v) {
      this.author[v.model] = v.value;
    },
    async setImage(e) {
      this.imgFile = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
      await this.toBase64(this.imgFile);
    },
    executeForm() {
      if (this.isSuccess) {
        this.isSuccess = false;
        return;
      }

      this.isLoading = true;

      if (this.imgFile) {
        const fileDir = `autores/${this.$randomString()}.type.${this.imgFile.type.replace('/', '-')}`;
        this.$postFileAWS(fileDir, this.imgFile).then(resp => {
          this.author.image = fileDir;
          this.saveAuthor();
        }).catch(err => {
          console.log(err)
          this.isLoading = true;
        });
      } else {
        this.saveAuthor();
      }
    },
    saveAuthor() {
      const promise = this.author.id ? this.$axios.$put('/author/' + this.author.id, this.author) : this.$axios.$post('/author', this.author);
      promise.then(response => {
        console.log(response)
        this.isSuccess = true;
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        this.resetData();
        this.$emit('refresh-authors');
        this.isLoading = false;
      })
    }
    ,
    toBase64(file) {
      let image;
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      }).then(response => {
        image = response;
      }).finally(() => {
        this.imgBase64 = image;
      })
    }
    ,
    close() {
      this.isSuccess = false;
      this.$bvModal.hide('author');
    }
    ,
    resetData() {
      this.author = {
        name: '',
        description: '',
        image: null
      }
      this.imgFile = null;
      this.imgBase64 = null
    }
  }
  ,
  mounted() {
    this.$root.$on('getAuthorData', (author) => {
      this.getAuthor(author)
    });
  }
}
</script>

<style scoped>

.selected-image img {
  border-radius: 50%;
  object-fit: cover;
}

.instructions {
  margin-left: 16px;
}

.instructions .top-text {
  font: 16px "Inter Bold";
  display: block;
  line-height: 24px;
  color: #5C5C64;
}

.instructions .top-text > span {
  text-decoration: underline;
  color: #89238A;
}

.instructions .sub-text {
  display: block;
  font: 13px "Inter Regular";
  color: #A7A7AB;
  ine-height: 18px;
}
</style>
