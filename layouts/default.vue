<template>
  <div :class="['container-layout',{'reduced-menu': !expanded}]">
    <MenuNav />
    <section>
      <MenuHeader />
      <main>
        <Nuxt />
      </main>
    </section>
  </div>
</template>

<script>
export default {
  name: 'defaultLayout',
  computed: {
    expanded() {
      return this.$store.state.expanded;
    },
    user() {
      return this.$store.state.user;
    }
  },
  beforeMount() {
    let url = location.pathname;
    if(!this.$store.state.auth.loggedIn && url !== "/admin/login") {
      this.$router.push("/login");
    }
  }
}
</script>

<style scoped>
main {
  flex: 1;
  height: calc(100vh - 96px);
  overflow: auto;
}

main > div {
  overflow: auto;
}

.container-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container-layout.reduced-menu {
  grid-template-columns: 87px 1fr;
}

.container-layout {
  display: grid;
  grid-template-columns: 256px 1fr;
  grid-template-rows: 1fr auto;
}


@media (max-width: 768px) {
  main {
    padding: 20px 20px;
    height: 100vh;
  }
  .container-layout {
    display: block;
  }
  .container-layout nav,
  .container-layout header {
    display: none;
  }
}
</style>
