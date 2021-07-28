<template>
  <div :class="theme">
    <!--顶部栏-->
    <header-component></header-component>
    <!--侧边栏-->
    <sidebar-component></sidebar-component>
    <!--logo-->
    <div class="logo d-flex justify-content-center align-items-center">
      <img src="../../../assets/images/logo.png" />
    </div>
    <!--主体-->
    <div class="container">
      <!--面包屑-->
      <div class="breadcrumb">
        <el-breadcrumb
          v-if="breadcrumbList.length > 0"
          separator-class="el-icon-arrow-right"
          class="pt-10 pb-10"
        >
          <el-breadcrumb-item
            v-for="breadcrumb of breadcrumbList"
            :key="breadcrumb.name"
            :to="breadcrumb.to"
            :replace="breadcrumb.replace"
          >
            {{ breadcrumb.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" />
      </div>
      <!--footer-->
      <div class="footer">
        <div class="footer-content">
          <span>
            Copyright ©青岛巨商汇网络科技有限公司 版权所有
            ICP备案证书号：鲁ICP备14033690号-6
          </span>
          <!--<div class="deviceNumber color-777 fs-12">-->
          <!--设备号：{{ deviceNumber }}-->
          <!--<span class="cursor-pointer color-888 ml-20" @click="copyDeviceNo">-->
          <!--复制-->
          <!--</span>-->
          <!--</div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./basic.ts"></script>

<style lang="scss" scoped>
.logo {
  position: fixed;
  top: 0;
  left: 0;
  width: 140px;
  height: 70px;
  text-align: center;
  background-color: #409eff;
  z-index: 101;
}

.container {
  padding: 70px 20px 50px 160px;
  background-color: #f2f2f2;
  min-width: 1136px;
  min-height: 100vh;
  position: relative;
  .breadcrumb {
    min-height: 20px;
  }
  .content {
    background-color: #fff;
    min-height: 300px;
  }

  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding-left: 160px;
    text-align: center;
    font-size: 12px;

    .footer-content {
      position: relative;
      width: 100%;
      height: 100%;

      .deviceNumber {
        position: absolute;
        top: 0;
        left: 20px;
      }
    }
  }
}
</style>
