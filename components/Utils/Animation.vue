<template>
  <div class="content-animation d-flex justify-content-center w-100" :style="cssGroup">
    <lottie-player :src="src" background="transparent" speed="1" :style="{width: w+'px', height: h+'px'}" loop
                   autoplay></lottie-player>
  </div>
</template>

<script>
export default {
  props: {
    src: {type: String},
    w: {type: Number, default: 128},
    h: {type: Number, default: 128},
    cssGroup: {type: Object}
  },
  methods: {
    setCSS(style) {
      if (style) {
        Object.entries(style).forEach(([key, value]) => {
          document.getElementsByClassName('content-animation')[0].style[key] = value;
        })
      }
    },
  }
}
</script>
