<template>
  <div class="warp vh-100">
    <!--<a href="/pc/" class="link">点击此处返回首页</a>-->
  </div>
</template>

<script lang="ts" src="./404.ts"></script>

<style lang="scss" scoped>
.warp {
  position: relative;
  background: url("../../assets/images/404.png") no-repeat center center;
  background-size: contain;
}

.link {
  position: relative;
  left: 40.5%;
  top: 66%;
  color: #fff;
  font-size: 24px;
  text-decoration: underline;
}

@media (min-width: 1300px) {
  .link {
    position: relative;
    left: 43%;
    top: 66%;
  }
}
</style>
