<template>
  <div class="toggle">
    <img :width="!expanded ? '14px' : '24px'"
        :src="require('../../assets/img/theme-icons/'+(themeDark ? 'sun-icon-gray.svg' : 'sun-icon-purple.svg'))"
        alt="masters-logo">

    <label :class="[!expanded && 'smallToggle', 'switch']" @change="themeDark = !themeDark">
      <input type="checkbox">
      <span class="slider"></span>
    </label>

    <img :width="!expanded ? '14px' : '24px'"
        :src="require('../../assets/img/theme-icons/'+(!themeDark ? 'moon-icon-gray.svg' : 'moon-icon-purple.svg'))"
        alt="masters-logo">
  </div>
</template>

<script>
export default {
  data() {
    return {
      themeDark: false
    }
  },

  computed: {
    expanded() {
      return this.$store.state.expanded;
    },
  },
}
</script>

<style scoped>
.toggle {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.switch {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 20px;
  margin: 0 6px;
}

.switch.smallToggle {
  width: 40px;
  height: 12px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #F1F1F2;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 15px;
  width: 15px;
  left: 3px;
  bottom: 2.6px;
  background-color: #89238A;
  border: 3px solid white;
  box-sizing: border-box;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 50%;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.24);
}

.switch.smallToggle .slider:before {
  height: 9px;
  width: 9px;
  bottom: 1.6px;
  border: 2px solid white;
}

input:checked + .slider {
  background-color: #89238A;
}

input:focus + .slider {
  box-shadow: 0 0 1px ;
}

.switch input:checked + .slider:before {
  -webkit-transform: translateX(58px);
  -ms-transform: translateX(58px);
  transform: translateX(58px);
}

.switch.smallToggle input:checked + .slider:before {
  -webkit-transform: translateX(20px);
  -ms-transform: translateX(20px);
  transform: translateX(20px);
}

@media (max-width: 768px) {
  .switch.smallToggle input:checked + .slider:before {
    -webkit-transform: translateX(25px);
    -ms-transform: translateX(25px);
    transform: translateX(25px);
  }
}
</style>
