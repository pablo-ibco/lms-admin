<template>
    <div class="file-item">
        <img width="25" :src="require('../../assets/img/utils/ico-file-download.svg')" alt="">
        <div class="file-info">
            <span class="file-item-name">The Walt Disney Compan dc sdfçklds sdf sdf dsf dsf sdfds f</span>
            <div class="file-item-info">
                <span>pdf</span>
                <span>10mb</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.file-item {
  display: flex;
  align-items: center;
  background: #F2F2F2;
  width: 220px;
  height: 72px;
  padding: 16px;
  border-radius: 4px;
}

.file-item > img {
  height: 100%;
  width: 20%;
  padding-bottom: 15px;
  margin-right: 5px;
}

.file-item .file-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 75%;
  height: 100%;
}

.file-item .file-info .file-item-name {
  width: 100%;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
}

.file-item .file-item-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #5C5C64;
}
</style>