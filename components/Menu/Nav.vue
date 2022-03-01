<template>
  <nav>
    <div class="header-nav">
      <img width="136" src="../../assets/img/utils/logo-text-black.svg" alt="masters-logo">
      <a href="#" @click="retract"><img width="32" src="../../assets/img/utils/burger-icon-gray.svg" alt="burger-icon"></a>
    </div>
    <div class="itens">
      <MenuNavItems />
      <div :class="['toggle-menu-student', !expanded && 'toggle-menu-student-small']" @click="retract">
        <img :src="require('../../assets/img/utils/small-right-purple.svg')" alt="arrow icon">
      </div>
    </div>
    <!-- <div :class="['footer-nav', !expanded && 'footer-small']">
      <MenuToggleTheme />
    </div> -->
  </nav>
</template>

<script>

export default {
  computed: {
    expanded() {
      return this.$store.state.expanded;
    },
  },
  methods: {
    retract() {
      this.$store.commit('setExpanded', !this.$store.state.expanded)
    }
  }
}
</script>

<style scoped>
nav {
  position: relative;
  background-color: #FBFBFC;
  box-shadow: 0 0 0 1px rgba(0,0,0,.05);
  max-height: 100vh;
}

.header-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 40px 40px 20px 40px;
}

.itens {
  height: calc(100vh - 172px);
  overflow: auto;
}

.toggle-menu-student {
  position: absolute;
  margin-top: 98px;
  height: calc(100% - 98px);
  background: #F2F2F2;
  right: 0;
  top: 0;
  padding: 0 3px;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-right: 2px solid #89238A;
}

.toggle-menu-student img {
  transform: rotate(90deg);
}

.toggle-menu-student.toggle-menu-student-small img {
  transform: rotate(270deg);
}

.footer-nav {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 72px;
  border-top: 1px solid #F1F1F2;
  padding: 0 40px;
}

.footer-nav.footer-small {
  justify-content: center;
  padding: 0 6px;
}

/* Reduced Menu Settings */
.reduced-menu .header-nav {
  justify-content: center;
}

.reduced-menu .header-nav > img {
  display: none;
}
</style>
