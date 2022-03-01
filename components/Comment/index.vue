<template>
  <div class="comment-item">
      <div class="avatar-user">
          <img height="48" width="48" src="../../assets/img/course-test/img-author.svg" alt="author">
      </div>
      <div class="info-user">
          <span class="name">Brooklyn Simmons</span>
          <span class="status">Recém chegado</span>
          <p>
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. 
              Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
              <span>
                  <hr/>
              </span>
          </p>
      </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.comment-item {
    display: flex;
}

.avatar-user img {
    border-radius: 50%;
    margin-right: 8px;
    border: 1px solid #FE6E4B;
}

.info-user {
    display: flex;
    flex-direction: column;
}

.info-user .name {
    font-family: "Inter Semibold";
    font-size: 14px;
    line-height: 20px;
    color: #373740;
}

.info-user .status {
    margin-top: 4px;
    font-size: 12px;
    line-height: 150%;
    color: #828287;
}

.info-user p {
    margin-top: 14px;
    font-size: 14px;
    line-height: 20px;
    color: #5C5C64;
    margin-bottom: 0;
}
</style>