<template>
  <div class="content">
    <h5>Boas vindas, {{ user.name.split(' ')[0] }}!</h5>
    <h2> Veja seus cursos</h2>

    <div class="filter-bar">
      <b-form-group class="search-input">
        <b-form-input class="input-border" v-model="search" type="text" debounce="750"
                      placeholder="Pesquise por curso, instrutor ou categoria"/>
      </b-form-group>

      <div class="group-btn-action">
        <span class="mr-2 grey-neutral">Ordenar por:</span>
        <div class="d-inline-block font-weight-normal mr-4" style="width: 204px">
          <b-form-select class="font-weight-bold input-border select-arrow" @change="getCourses" v-model="orderBy"
                         :options="ordinations"></b-form-select>
        </div>

        <b-button variant="none" class="d-inline-block btn-purple"
                  @click="$nuxt.$router.push('/content/cursos/adicionar')">
          Criar novo curso
        </b-button>
      </div>
    </div>
    <div class="d-flex flex-wrap" style="gap: 20px;">
      <div class="w-100">
        <div class="loading-content" v-if="loadingContent">
          <UtilsLoading color="dark" size="large"/>
        </div>
        <div v-else class="d-flex flex-wrap pt-5" style="gap: 40px;">
          <CourseCard v-for="(course, index) in courses" :key="index" :course="course"
          @open-delete="openDelete(course)"/>
        </div>
      </div>

    </div>
    <b-pagination v-if="courses.length > 0" class="paginate-style mt-4" pills align="right" @change="getByPage" v-model="currentPage"
      :total-rows="total" :per-page="perPage"/>

    <ModalConfirmation
      title="Exclusão de curso"
      :msg="'Deseja remover o curso '+ courseDelete.title+'?'"
      @confirmed="confirmed" />
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: "Cursos - Masters",
    }
  },
  computed: {
    user() {
      return this.$auth.$storage.getLocalStorage('user')
    }
  },
  data() {
    return {
      loadingContent: false,
      ordinations: [
        {
          value: "title",
          text: "Ordem alfabética",
        },
        {
          value: "categoryName",
          text: "Por categoria",
        },
        {
          value: "createdAt",
          text: "Mais recentes"
        }
      ],
      courses: [],
      currentPage: 1,
      total: 0,
      perPage: 10,
      orderBy: "createdAt",
      search: null,
      courseDelete: {title: ''}
    }
  },
  watch: {
    search() {
      this.getCourses();
    }
  },
  beforeMount() {
    this.selectedOrderBy = this.ordinations[0];
  },
  methods: {
    getCourses() {
      this.loadingContent = true;
      let params = `direction=ASC&page=${this.currentPage}&size=${this.perPage}&orderBy=${this.orderBy}`;

      if (this.search) {
        params = params + `&name=${this.search}`;
      }

      this.$axios.$get('course/all?' + params).then(response => {
        this.total = Math.ceil(response.total / this.perPage);
        this.courses = response.data;
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        this.loadingContent = false;
      }).finally(() => {

      })
    },
    getByPage(page) {
      this.currentPage = page;
      this.getCourses()
    },
    deleteCourse() {
      this.$axios.$delete('course/'+this.courseDelete.id).then(response => {
        this.getCourses();
      }).catch((e)=>{
        console.log(e)
      })
    },
    openDelete(course) {
      this.courseDelete = course;
      this.$bvModal.show('confirmation');
    },
    confirmed() {
      this.deleteCourse();
    }
  },
  mounted() {
    this.getCourses();
  }
}
</script>

<style scoped>

.filter-bar {
  display: inline-flex;
  width: 100%;
  padding: 24px 0 0;
  justify-content: space-between;
  margin-bottom: 40px;
}

.search-input {
  position: relative;
  width: 370px;
}

.group-btn-action label {
  font: 14px "Inter Regular";
  color: #A7A7AB;
}

.group-btn-action .order-by-select {
  font: 14px "Inter Regular";
  font-weight: 500;
  color: #373740;
}

.welcome-text {
  font: 24px "Poppins Regular";
}

@media (max-width: 768px) {
  .filter-bar {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .filter-bar {
    grid-template-columns: 1fr;
  }
}
</style>
