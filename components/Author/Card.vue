<template>
  <b-card>
    <div class="card-content">
      <b-dropdown class="menu-card position-absolute" right toggle-class="btn-menu btn-white squad">
        <template #button-content>
          <img src="../../assets/img/utils/three-points.svg" alt="author">
        </template>
        <b-dropdown-item @click="edit"><i class="share-ico mr-1"></i>Editar</b-dropdown-item>
        <b-dropdown-item @click="remove"><i class="trash-ico mr-1"></i>Remover</b-dropdown-item>
      </b-dropdown>
      <div class="author-image" v-if="image">
        <img class="mr-auto ml-auto" :src="image" alt="author">
      </div>

      <div class="author-info">
        <h6 class="pt-3 pb-3 text-center" v-text="author.name"></h6>
        <span class="resume mb-3" v-text="author.description"></span>
      </div>
    </div>
  </b-card>
</template>

<script>
export default {
  props: {
    author:{type: Object, default: null},
  },
  asyncComputed: {
    image() {
      return this.$getFileAWS(this.author.image);
    }
  },
  methods:{
    edit() {
      this.$emit('open-modal', this.author.id)
    },
    remove(){
      this.$emit('open-delete', this.author)
    }
  }
}
</script>

<style scoped>
.card {
  position: relative;
  width: 255px;
  height: 360px;
  border-radius: 32px;
  border: 2px solid #89238A;
  background-blend-mode: multiply;
  overflow: hidden;
  margin-bottom: 35px;
}

.menu-card {
  right: 20px;
}

.author-info .resume {
  display: block;
  text-align: justify;
  font: 14px "Poppins Regular";
  width: 100%;
  height: 140px;
  overflow-y: auto;
  color: #8A8C92;
}

.author-image {
  height: 100px;
  text-align: center;
  border-radius: 50%;
  margin: 0 auto;
}

.author-image img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
}


</style>
