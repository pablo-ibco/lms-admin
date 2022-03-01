<template>
  <header>
    <!-- <div class="student-info" v-if="isStudent">
      <div class="info-item">
        <img height="40" width="40" src="../../assets/img/utils/ico-coins.svg" alt="coins">
        <span>1000</span>
      </div>
      <div class="info-item">
        <img height="40" width="40" src="../../assets/img/utils/ico-diamond.svg" alt="diamonds">
        <span class="n-diamond">20</span>
      </div>
    </div> -->

    <b-dropdown class="bag-box" right toggle-class="bag-btn btn-transparent" v-if="isStudent">
      <template #button-content>
        <img height="40" width="40" src="../../assets/img/utils/ico-bag-gray.svg" alt="author">
      </template>
      <b-dropdown-item>content</b-dropdown-item>
    </b-dropdown>

    <b-dropdown class="message-box" right toggle-class="message-btn btn-transparent" v-if="!isStudent">
      <template #button-content>
        <img height="40" width="40" src="../../assets/img/utils/ico-message.svg" alt="author">
      </template>
      <b-dropdown-item>content</b-dropdown-item>
    </b-dropdown>

    <b-dropdown class="notification-box" right toggle-class="notification-btn btn-transparent">
      <template #button-content>
        <img height="40" width="40" src="../../assets/img/utils/ico-bell.svg" alt="author">
      </template>
      <b-dropdown-item>Content</b-dropdown-item>
    </b-dropdown>

    <b-dropdown class="profile-box" right toggle-class="profile-btn btn-white">
      <template #button-content>
        <!-- <img height="40" width="40" :src="user.image" alt="author"> -->
        <span class="ml-3 text-left">
          <span class="d-block username">{{user.name}}</span>
          <span class="d-block user-mail">{{user.username}}</span>
        </span>
      </template>
      <b-dropdown-item>
        <router-link to="/content/profile"><span class="profile-ico"></span>Meu perfil</router-link>
      </b-dropdown-item>
      <b-dropdown-item><span class="settings-ico"></span>Configurações</b-dropdown-item>
      <b-dropdown-item @click="logout"><span class="logoff-ico"></span>Sair</b-dropdown-item>
    </b-dropdown>
  </header>
</template>

<script>
export default {
  data() {
    return {
      isStudent: true,
    }
  },
  computed: {
    user(){
      return this.$auth.$storage.getLocalStorage('user')
    }
  },
  methods:{
    async logout() {
      await this.$auth.logout();
      let strategy = this.$auth.$storage.setLocalStorage('strategy');
      this.$auth.$storage.setLocalStorage('user', null);
      this.$auth.setToken(strategy, null);
      this.$auth.setRefreshToken(strategy, null);
    },
  }
}
</script>

<style scoped>
header {
  height: 96px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #fff;
  padding: 12px;
  box-shadow: 0 1px 1px 0 rgba(0,0,0,.05);
}

.student-info {
  display: flex;
  margin: 0 12px;
}

.student-info .info-item {
  padding: 0 12px;
  margin-top: 5px;
}

.student-info .info-item span {
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  color: #373740;
}

.student-info .info-item span.n-diamond {
  color: #89238A;
}

.profile-box {
  margin-left: 40px;
}

.notification-box {
  margin-left: 16px;
}

.profile-box li {
  width: 100%;
}

.profile-ico {
  content: url("../../assets/img/utils/ico-profile.svg");
}

.settings-ico {
  content: url("../../assets/img/utils/ico-settings.svg");
}

.logoff-ico {
  content: url("../../assets/img/utils/ico-arrow-left.svg");
}
</style>
