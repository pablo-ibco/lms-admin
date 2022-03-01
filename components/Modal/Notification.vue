<template>
  <div>
    <b-modal size="sm" id="notification" centered no-close-on-backdrop hide-footer hide-header
             header-class="border-0" ref="notification">
      <div class="d-block text-center">
        <div class="d-flex justify-content-center ">
          <UtilsAnimation :cssGroup="styleProps[typeNotification]" :w="70" :h="70" :src="animations[typeNotification]"/>
        </div>
        <h6 v-html="messageText"></h6>
      </div>
      <div class="text-center mt-3">
        <b-button class="pl-4 pr-4" size="sm" @click="$bvModal.hide('notification')">Ok</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props:{
    message: {type: String},
    type: {type: String},
  },
  computed:{
    messageText(){
      return this.message
    },
    typeNotification(){
      return this.type
    }
  },
  data(){
    return {
      animations: {
        error: "/animations/error.json",
        alert: "/animations/alert.json"
      },
      styleProps: {
        error: {'transform': 'scale(1)'},
        alert: {'transform': 'scale(1.5)'}
      }
    }
  }
}
</script>
