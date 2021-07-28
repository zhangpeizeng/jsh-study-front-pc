<template>
  <div class="vh-100 bg-fff">
    <!--用户名：<input type="text" v-model="username" />-->
    <!--<br />-->
    <!--密码:-->
    <!--<input type="text" v-model="password" />-->
    <!--<br />-->
    <!--<button @click="login">登录</button>-->
    <div
      style="padding-top:calc( 40% - 170px);text-align: center;width: 100%;"
      v-loading="loading"
    >
      <!--<img-->
      <!--src="../../assets/images/nologin.png"-->
      <!--style="width: 220px;display: inline-block;vertical-align: middle;"-->
      <!--/>-->
    </div>
  </div>
</template>

<script lang="ts" src="./login.ts"></script>

<style lang="scss" scoped></style>
