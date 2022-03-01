<template>
  <div class="content">
    <h3>Autores</h3>

    <div class="filter-bar lg">
      <b-form-input class="w-50" v-model="nameSearch" placeholder="Pesquisar por nome" debounce="750"/>

      <b-button @click="openModalAuthor" class="d-block btn-purple" v-b-tooltip="'Adicionar autor'">
        Cadastrar autor
      </b-button>
    </div>

    <div>
      <div class="loading-content" v-if="loadingContent">
        <UtilsLoading color="dark" size="large"/>
      </div>
      <div v-else class="d-flex flex-wrap pt-5" style="gap: 40px;">
        <AuthorCard v-for="(author, index) in authors" :key="index" :author="author" @open-modal="openModalAuthor"
                    @open-delete="openDelete(author)"/>
      </div>
    </div>
    <b-pagination v-if="authors.length > 0" class="paginate-style mt-4" pills align="right" @change="getByPage"
                  v-model="currentPage"
                  :total-rows="total" :per-page="perPage"/>

    <ModalAuthor @refresh-authors="getAuthors"/>
    <ModalConfirmation
      title="Exclusão de autor"
      :msg="'Deseja remover o autor '+ authorDelete.name+'?'"
      @confirmed="confirmed"/>
  </div>
</template>

<script>

export default {
  head() {
    return {
      title: "Autores - Masters",
    }
  },
  data() {
    return {
      loadingContent: false,
      authorEdit: {
        name: '',
        description: '',
        image: ''
      },
      authorDelete: {name: ''},
      nameSearch: null,
      authors: [],
      currentPage: 1,
      total: 0,
      perPage: 10,
      image: "../../assets/img/course-test/img-author.svg",
    }
  },
  watch: {
    nameSearch() {
      this.getAuthors();
    }
  },
  methods: {
    openModalAuthor(id) {
      if (typeof id === "string") {
        this.$axios.get('/author', {params: {id: id}}).then(response => {
          this.$root.$emit('getAuthorData', {...response.data.data});
        })
      }
      this.$bvModal.show('author');
    },
    getAuthors() {
      this.loadingContent = true;
      let params = `direction=ASC&page=${this.currentPage}&size=${this.perPage}&orderBy=name`;

      if (this.nameSearch) {
        params = params + `&name=${this.nameSearch}`;
      }

      this.$axios.$get('author/all?' + params).then(response => {
        this.total = Math.ceil(response.total / this.perPage);
        this.authors = response.data;
      })
        .catch(e => {
          console.log(e)
        }).finally(() => {
        this.loadingContent = false;
      })
    },
    getByPage(page) {
      this.currentPage = page;
    },
    deleteAuthor() {
      this.$axios.$delete('author/' + this.authorDelete.id).then(response => {
        this.getAuthors();
      }).catch((e) => {
        console.log(e)
      })
    },
    openDelete(author) {
      this.authorDelete = author;
      this.$bvModal.show('confirmation');
    },
    confirmed() {
      this.deleteAuthor();
    }
  },
  mounted() {
    this.getAuthors();

    this.$root.$on('refresh-authors', () => {
      this.getAuthors();
    })
  }
}
</script>

<style scoped>
.filter-bar {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 24px 0;
}
</style>
