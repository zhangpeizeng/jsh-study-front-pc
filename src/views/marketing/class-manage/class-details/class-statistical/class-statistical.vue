<!--
@desc：班级的统计数据
@date: 2021-04-06 14:01:34
-->
<template>
  <div class="statistical">
    <div
      class="statistical-item"
      v-for="(value, key, index) in statistical"
      :key="index"
    >
      <img :src="value.bgImg" />
      <div class="item-span">
        <div class="number">{{ value.desc }}</div>
        <div class="name">{{ value.title }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./class-statistical.ts"></script>

<style lang="scss" scoped>
.statistical {
  padding: 2px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  .statistical-item {
    position: relative;
    width: 135px;
    height: 120px;
    display: flex;
    margin-bottom: 10px;
    justify-content: center;
    align-items: center;
    img {
      width: 135px;
      height: 120px;
    }
    .item-span {
      position: absolute;
      text-align: center;
      .number {
        color: #000000;
        font-size: 28px;
      }
      .name {
        color: #606266;
        font-size: 16px;
      }
    }
  }
}
</style>
