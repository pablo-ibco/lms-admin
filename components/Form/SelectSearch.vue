<template>
  <div :class="['collect-items', {isOpened}]">
    <div class="selected-items" @click="isOpened = true">
      <span class="item" v-for="(item, index) in collection" :key="index" @click="selectItem(item)">
        <img v-if="type === 'authors'" :src="item.image" alt="">{{item.name}}
        <!-- {{item.name}} -->
      </span>
    </div>

    <div class="search-items" v-if="isOpened">
      <div class="d-flex align-items-center">
        <b-form-group class="position-relative d-inline-block w-100 mb-0 search-input">
          <b-form-input v-model="search" class="input-border search-input w-100" type="text" @keyup="filter"
                        placeholder="Pesquisar"/>
        </b-form-group>
        <button @click="openModal" class="btn btn-search ml-2">+</button>
      </div>

      <div class="list-data">
        <span v-for="(item, index) in items" :key="index" @click="selectItem(item)"
              :class="['item-list', {'selected': item.selected}]">
          <img v-if="type === 'authors'" class="mr-2" :src="item.image">{{item.name}}
          <!-- {{item.name}} -->
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    type: {type: String, required: true},
    items: {type: Array, default:[]}
  },
  data(){
    return {
      search: null,
      isOpened: false,
      collection: [],
      filtered: [],
    }
  },
  watch: {
    items() {
      if(this.collection.length === 0){
        this.items.forEach(item => {
          if(item.selected) {
            this.collection.push(item);
          }
        })
      }
      this.filtered = [...this.items];
    }
  },
  methods: {
    filter(){
      if(this.search){
        this.filtered = this.items.filter(item =>{
          if(item.name.includes(this.search)){

          }
          return item.name.includes(this.search);
        });
      }
      else {
        this.filtered = [...this.items];
      }
    },
    selectItem(item){
      let index = this.collection.indexOf(item);

      if(this.collection.length > 0 && index > -1) {
        this.collection.splice(index, 1);
        item.selected = false;
      }
      else {
        item.selected = true;
        this.collection.push(item);
      }

      this.isOpened = false;
      this.$emit('return-selection', {prop: this.type, collection: this.collection});
    },
    openModal() {
      if(this.type === 'categories') {
        this.$bvModal.show('modal-addCategoria');
      } else if(this.type === 'authors') {
        this.$bvModal.show('author');
      }
    }
  },
  mounted() {
    this.filtered = [...this.items];
  }
}
</script>

<style scoped>
.collect-items {
  position: relative;
  border: 1px solid #A7A7AB;
  border-radius: 8px;
  background: url("assets/img/utils/ico-arrow-dropdown-grey.svg") no-repeat 93% 19px;
  color: #373740;
  font-weight: 500;
  font-size: 14px;
}

.selected-items {
  height: 44px;
  padding: 7px 6px;
}

.item {
  position: relative;
  display: inline-flex;
  align-items: center;
  background: #F2F2F2;
  border-radius: 4px;
  font: 12px "Inter Regular";
  padding: 0px 8px;
  margin-right: 4px;
  color: #5C5C64;
  height: 32px;
  line-height: 12px;
}

.collect-items.isOpened {
  border: 1px solid #89238A;
  background: url("assets/img/utils/ico-arrow-dropdown-purple.svg") no-repeat 93% 19px;
}

.search-items {
  background: #FFFFFF;
  border: 1px solid #F2F2F2;
  box-shadow: 0px 12px 23px rgb(53 55 60 / 10%);
  border-radius: 8px;
  position: absolute;
  top: 48px;
  padding: 6px;
  width: 100%;
}

.list-data {
  position: relative;
  max-height: 180px;
  margin-top: 24px;
  overflow-y: auto;
}

.item-list {
  cursor: pointer;
  display: block;
  line-height: 20px;
  margin-bottom: 8px;
  padding: 8px;
  color: #373740;
}

.item-list.selected {
  background: #FBFBFB;
}

.item-list.selected:after {
  content: url("../../assets/img/utils/check-grey.svg");
  position: absolute;
  right: 9px;
}

.item img,
.item-list img {
  position: relative;
  margin-right: 8px;
  border-radius: 2px;
  width: 24px;
  height: 24px;
}
</style>
