<template>
  <b-modal id="modal-addCategoria" hide-footer centered no-close-on-esc no-close-on-backdrop title="Adicionar categoria">
      <template #default="{ hide }">
        <FormInput class="position-relative" @value-model="setValue" placeholder="Nome da categoria" :isRequired="true" nameInput="addCategoryName" size="lg" />
        <div class="footer-modalCategory">
          <b-button @click="hide()">Cancelar</b-button>
          <b-button size="sm" class="d-block btn-purple squad ml-3" :disabled="isLoading"
            @click="addCategoty()">
            <UtilsLoading v-if="isLoading"/>
            <span style="margin-left: 10px">Adicionar categoria</span>
          </b-button>
        </div>
      </template>
    </b-modal>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      userEdit: {},
    }
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
    async addCategoty(){
      this.isLoading = true;
      const data = {
        name: this.userEdit.addCategoryName
      }

      await this.$axios.$post(`/category`, data).then(response => {
        // console.log(response);
      }).catch( err => {
        console.log(err);
      }).finally(() => {
        this.isLoading = false;
        this.$emit('refresh-categories');
        this.$bvModal.hide('modal-addCategoria');
      });
    }
  }
}
</script>

<style scoped>
.footer-modalCategory {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
