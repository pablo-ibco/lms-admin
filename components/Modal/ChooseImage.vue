<template>
  <div>
    <b-modal id="choose-image" title="Nova imagem" modal-class="screen-background-modal" centered no-close-on-esc
             no-close-on-backdrop size="lg" header-class="border-0" hide-footer>
      <input style="display: none" ref="fileInput" type="file" @change="getImg" enctype="multipart/form-data">
      <b-button @click="$refs.fileInput.click()" class="btn-rounded-purple">Escolher imagem</b-button>

      <div class="crop-image mt-3">
        <cropper ref="cropper" class="cropper" :src="url"/>
      </div>

      <div class="mt-4 d-flex justify-content-center">
        <b-button class="w-25 btn-grey lg" @click="$bvModal.hide('author')">
          Cancelar
        </b-button>
        <b-button type="submit" :disabled="isLoading" class="w-25 btn-purple lg ml-2">
          <UtilsLoading v-if="isLoading"/>
          <span v-else>Salvar Dados</span>
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import {Cropper} from 'vue-advanced-cropper'

export default {
  components: {
    Cropper
  },
  data() {
    return {
      isLoading: false,
      file: null,
      url: null
    }
  },
  methods: {
    getImg(e) {
      this.file = e.target.files[0];
      this.url = window.URL.createObjectURL(this.file);
    },
    change({coordinates, canvas}) {
      console.log(coordinates, canvas)
    }
  }
}
</script>

<style>
.crop-image {
  position: relative;
  display: block;
  width: 100%;
  max-height: 500px;
  background-color: #89238A;
}

</style>
