<template>
  <div>
    <b-modal id="preview-question" title="Pré-visualização de atividade" centered no-close-on-backdrop hide-footer
             header-class="border-0" ref="modalPreviewQuestion">
        <TaskMultipleChoice :preview="preview"/>
    </b-modal>
  </div>
</template>

<script>
export default {
  props:{
    task: {type: Object, default:{}}
  },
  computed:{
    preview(){
      return this.task
    }
  }
}
</script>
