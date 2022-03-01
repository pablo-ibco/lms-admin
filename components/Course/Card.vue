<template>
  <b-card overlay :img-src="coverImage">
    <b-card-body class="p-3">
      <span class="course-status">{{course.publishCourse ? 'Publicado' : 'Rascunho'}}</span>

      <b-dropdown class="menu-card" right toggle-class="btn-menu btn-white squad">
        <template #button-content>
          <img width="16" :src="require('@/assets/img/utils/three-points.svg')" alt="três pontos">
        </template>
        <b-dropdown-item @click="share"><i class="share-ico mr-1"></i>Compartilhar</b-dropdown-item>
        <b-dropdown-item @click="remove"><i class="trash-ico mr-1"></i>Deletar</b-dropdown-item>
        <b-dropdown-item @click="favorite"><i :class="['star-ico', {'star-full-ico': isFavorite}, 'mr-1']"></i>
          {{isFavorite ? 'Remover dos favoritos' : 'Salvar como favorito'}}</b-dropdown-item>
      </b-dropdown>

      <div class="card-content">
        <div class="tags-group">
          <span class="tag" v-for="(t, index) in course.categories" :key="index" v-text="t.name"></span>
        </div>

        <div class="title">
          {{course.title}}
        </div>

        <span v-for="(a, index) in authors" :key="index" class="author mb-3">
          <img class="mr-2" :src="a.image" alt="author">{{a.name}}
        </span>

        <b-button @click="edit(course.id)" href="#" class="d-block btn-purple lg mt-3">
          Editar Curso
        </b-button>
      </div>

    </b-card-body>
  </b-card>
</template>

<script>
export default {
  props: {
    course: {type: Object},
    tags: {type: Array},
    isPublished: {type: Boolean},
  },
  asyncComputed: {
    coverImage() {
      return this.$getFileAWS(this.course.coverImage);
    }
  },
  data(){
    return {
      isFavorite: false,
      imageAuthor: false,
      authors: []
    }
  },
  methods: {
    share(){

    },
    async getAuthorsImage(authorsList){
      for(const author of authorsList) {
        let author_copy = {...author};
        author_copy.image = await this.$getFileAWS(author.image);
        this.authors.push(author_copy);
      }
    },
    remove(){
      this.$emit('open-delete', this.course)
    },
    favorite(){
      this.$axios.$put(`course/${this.course.id}/${this.isFavorite ? 'remove-favorite' : 'add-favorite'}`).then(response => {
        this.isFavorite = !this.isFavorite;
      }).catch((e)=>{
        console.log(e)
      })
    },
    edit(id){
      $nuxt.$router.push('/content/cursos/editar/'+id)
    }
  },
  mounted() {
    this.getAuthorsImage(this.course.authors);
  }
}
</script>

<style scoped>
.card {
  position: relative;
  width: 241px;
  height: 400px;
  border-radius: 16px;
  border: 4px solid transparent;
  background-blend-mode: multiply;
  overflow: hidden;
  margin-bottom: 23px;
  transition: .3s all;
}

.card > div {
  position: unset !important;
}

.card-img-overlay {
  background: linear-gradient(180deg, rgba(58, 62, 69, 0.0001) 0%, #212527 61.13%);
  height: 101%;
  padding: 0;
}

.card:hover {
  border-color: #89238A;
}

.card .card-img {
  transition: .3s all;
  object-fit: cover;
}

.card:hover .card-img {
  filter: blur(.75px);
  transform: scale(1.025);
}

.menu-card {
  float: right;
}

.dropdown-toggle::after {
  display: none;
}

.card-content {
  display: block;
  position: absolute;
  bottom: 16px;
  color: white;
  width: calc(100% - 32px);
}

.tags-group {
  display: flex;
  flex-wrap: wrap;
}

.course-status,
.tags-group .tag {
  display: inline-block;
  padding: 7px 8px;
  margin: 0 10px 5px 0px;
  background: white;
  font: 12px "Inter Regular";
  line-height: 16px;
  color: #5C5C64;
  border-radius: 4px;
}

.course-status {
  color: #588450;
}

.card .title {
  padding: 0px 0px 12px;
  font: 20px "Poppins Regular";
  font-weight: 600;
}

.card .author {
  display: inline-flex;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px;
  width: 100%;
  font: 12px "Inter Regular";
  border-radius: 4px;
  align-items: center;
  width: auto;
}

.card .author img {
  width: 24px;
  height: 24px;
  border-radius: 2px;
}

</style>
