<template>
  <div>
    <h6 v-text="cpPreview.title"></h6>
    <b-form-group class="checkbox-style w-100" style="width: 500px">
      <b-form-radio-group v-model="selected" :options="cpPreview.options"></b-form-radio-group>
    </b-form-group>

    <div class="w-100 mt-3" v-if="selected !== null">
      {{ `A resposta está ${selected == cpPreview.rightAnswer ? 'certa' : 'incorreta'}!`}}
      <p>{{ selected+ " - " + cpPreview.rightAnswer}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    preview: {type: Object},
  },
  computed:{
    cpPreview(){
      return this.preview
    }
  },
  data() {
    return {
      selected: null
    }
  },
  watch:{
    selected(newVal){
      this.selected = newVal.toString();
    }
  }
}
</script>
