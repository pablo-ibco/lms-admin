<template>
  <div class="menu-items">
    <div v-for="item in menuItems" :key="item.id"
      :class="[activeItem === item.id && 'active', 'item-menu']">

      <div class="item" @click="item.submenu ? dropSubmenu(item) : openLink(item)">
        <div class="item-icon">
          <img :src="require('../../assets/img/dashbord/'+item.icon+(activeItem === item.id
            ? '-purple.svg' : '-gray.svg'))" :alt="item.icon">
        </div>
        <span>{{item.text}}</span>
        <div v-if="item.submenu"
          :id="'arro-icon-'+item.id"
          :class="[activeItem === item.id && 'arrowIconOpened', 'arrow-icon']">
          <img :src="require('../../assets/img/utils/small-right-'+(activeItem === item.id ? 'purple.svg' : 'gray.svg'))"
            alt="arrow icon" v-if="expanded">
        </div>
      </div>

      <div v-if="item.submenu"
        :id="'submenu'+item.id"
        :class="[(activeItem === item.id && expanded) && 'dropdownItem', 'submenu']">
        <div v-for="subMenuItem in item.submenu" :key="subMenuItem.id"
          :class="activeSubItem === subMenuItem.id && 'subActive'"
          @click="activeSubMenuRoute(item, subMenuItem)">
          {{subMenuItem.text}}
        </div>
      </div>

    </div>
  </div>
</template>

<script>

const items = [
  {id: 1, text: 'Dashboard', icon: 'prototype', route: '/content/dashboard/admin'},
  {id: 2, text: 'Conteúdo', icon: 'folder', submenu: [
    {id: 21, text: 'Cursos', route: '/content/cursos'},
    {id: 22, text: 'Autores', route: '/content/autores'},
    {id: 23, text: 'Categorias', route: '/content/categorias'},
  ]},
  {id: 3, text: 'Alunos', icon: 'profile', route: '/content/alunos'},
  {id: 4, text: 'Marketing', icon: 'live', submenu: [{id: 31, text: 'Em breve', route: '/content/marketing'}]},
  {id: 5, text: 'Comunicação', icon: 'chat', submenu: [{id: 41, text: 'Em breve', route: '/content/comunicacao'}]},
]

export default {
  data() {
    return {
      menuItems: items,
      activeItem: null,
      activeSubItem: null,
    }
  },

  mounted() {
    this.activeMenuRoute();
  },

  computed: {
    expanded() {
      this.menuItems.forEach(item => {
        const submenu = document.getElementById("submenu"+item.id);
        const arroicon = document.getElementById("arro-icon-"+item.id);
        if(submenu) {
          submenu.classList.remove("dropdownItem");
          submenu.classList.remove("notExpanded")
        }
        arroicon && arroicon.classList.remove("arrowIconOpened");
      })
      return this.$store.state.expanded;
    },
  },

  methods: {
    activeMenuRoute() {
      //veridica se a rota é referente a algum menu
      const route = $nuxt.$router.history.current.fullPath;
      const itemMenuActive = this.menuItems.find(item => item.route === route || route.includes(item.route));
      this.activeItem = itemMenuActive ? itemMenuActive.id : null;

      //caso não seja verifica se a rota é referente a algum submenu
      if(!itemMenuActive) {
        const menu = this.menuItems.filter(item => item.submenu);
        menu.map(item => {
          const submenu = item.submenu.find(sub => sub.route === route || route.includes(sub.route));
          if(submenu) {
            this.activeItem = item.id
            this.activeSubItem = submenu.id
          }
        })
      }
    },
    activeSubMenuRoute(item, subMenuItem){
      this.activeItem = item.id;
      this.activeSubItem = subMenuItem.id;
      $nuxt.$router.push(subMenuItem.route);
      !this.expanded && document.getElementById("submenu"+item.id).classList.toggle("notExpanded");
    },
    dropSubmenu(item) {
      if(this.expanded) {
        document.getElementById("submenu"+item.id).classList.toggle("dropdownItem");
        document.getElementById("arro-icon-"+item.id).classList.toggle("arrowIconOpened");
      } else {
        this.menuItems.forEach(itensSub => {
          if(itensSub.submenu){
            if(itensSub.id === item.id){
              document.getElementById("submenu"+itensSub.id).classList.toggle("notExpanded");
            }else {
              document.getElementById("submenu"+itensSub.id).classList.remove("notExpanded");
            }
          }
        })
      }
    },
    openLink(item) {
      this.activeItem = item.id;
      this.activeSubItem = null;
      $nuxt.$router.push(item.route);
      this.menuItems.forEach(itensSub => {
        if(itensSub.submenu){
          document.getElementById("submenu"+itensSub.id).classList.remove("notExpanded");
        }
      })
    },
  }
}
</script>

<style scoped>
.menu-items {
  padding: 0 40px;
}

.item-menu {
  border-bottom: 1px solid #F1F1F2;
}

.item {
  display: flex;
  position: relative;
  align-items: center;
  min-height: 56px;
  padding: 15px 0;
  color: #525359;
  cursor: pointer;
}

.item:hover span,
.item:hover .item-icon,
.item:hover .arrow-icon {
  filter: brightness(1);
}

.item span {
  font-size: 14px;
  font-family: "Inter Bold";
  line-height: 20px;
  padding-top: 5px;
  filter: brightness(1.5);
  transition: 0.2s;
}

.item-icon {
  width: 24px;
  height: 24px;
  margin-right: 18px;
  filter: brightness(1.5);
  transition: 0.2s;
}

.arrow-icon {
  right: 0;
  position: absolute;
  filter: brightness(1.5);
  transition: 0.4s;
}

/* submenu */
.submenu {
  display: none;
  width: 100%;
  margin-bottom: 18px;
  padding-left: 42px;
  color: #525359;
}

.submenu div {
  font-size: 14px;
  font-family: "Inter Bold";
  line-height: 20px;
  padding: 12px 0;
  filter: brightness(1.5);
  transition: 0.2s;
  cursor: pointer;
}

.submenu div:hover {
  filter: brightness(1);
}

/* active */
.active .submenu div.subActive,
.active .item {
  color: #89238A;
}

.dropdownItem.submenu {
  display: block;
}

.notExpanded.submenu {
  display: block;
  position: absolute;
  margin: -43px 63px;
  background: #fff;
  padding: 0 15px;
  border-radius: 8px;
  min-width: 150px;
  z-index: 1;
  border: 1px solid #F1F1F2;
  box-shadow: 0px 12px 23px rgb(53 55 60 / 10%);
}

.active .submenu div.subActive,
.active .item span,
.active .item-icon,
.active .arrow-icon {
  filter: brightness(1);
}

.arrowIconOpened.arrow-icon {
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}

/* Reduced Menu Settings */
.reduced-menu .menu-items {
  padding: 0 30px;
}

.reduced-menu .item span {
  display: none;
}
</style>
