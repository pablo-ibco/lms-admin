export default ({ app }) => {
  app.router.beforeEach((to, from, next) => {
    if(!app.$auth.$storage.state.loggedIn && !to.path.includes("/admin/login")) {
      next("/admin/login");
    }
    else {
      next();
    }
  })
}
