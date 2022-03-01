<template>
  <div class="menu-navigator w-100">
    <span v-for="(item, index) in items" :key="index" :class="['navigator-item', {'active': item.position === current}, {'disabled': item.position === 1}]"
          @click="$emit('change-position', item.position)" v-text="item.title" v-if="current >= item.position"></span>
    <h5 class="d-block mb-0 title-navigator" v-text="items[current-1].title"></h5>
  </div>
</template>

<script>
export default {
  props: {
    items: {type: Array},
    current: {type: Number}
  },
  watch:{
    current(){
      console.log(this.current)
    }
  }
}
</script>

<style scoped>
.menu-navigator .navigator-item {
  position: relative;
  font: 12px "Inter Regular";
  line-height: 18px;
  color: #A7A7AB;
  padding-right: 18px;
  cursor: pointer;
}

.menu-navigator .title-navigator {
  padding-top: 27px;
  font-family: "Poppins SemiBold";
}

.menu-navigator .navigator-item:not(:first-child) {
  padding-left:20px;
}

.menu-navigator .navigator-item:hover {
  color: #89238A;
}

.menu-navigator .navigator-item.active {
  font-weight: 700;
  color: #89238A;
  pointer-events: none;
}

.menu-navigator .navigator-item:not(:first-child):after {
  position: absolute;
  display: inline-block;
  width: 4px;
  height: 8px;
  content: url("../../assets/img/utils/ico-next-dropdown-grey.svg");
  left: 0px;
  pointer-events: none;
}

</style>
