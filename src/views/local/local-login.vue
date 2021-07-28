<template>
  <div class="layout-background" v-loading="loading">
    <div class="login-box">
      <div class="login-left">
        <div class="text-center">
          <div class="d-flex align-items-center  justify-content-center">
            <img src="../../assets/images/login/logo.png" class="icon-img" />
          </div>

          <div class="login-icon-span">
            海尔人专属赋能学习平台
          </div>
        </div>
      </div>
      <div class="login-right">
        <div class="login-title">营销学院管理端本地调试版</div>
        <div style="margin-top:40px;">
          <div style="position: relative;">
            <i class="el-icon-mobile-phone position-icon"></i>
            <input
              class="login-input"
              type="text"
              v-model="userId"
              placeholder="账号"
            />
          </div>
        </div>
        <div style="margin-top:20px;width:100%;" id="loginSlider">
          <div style="position: relative;margin-bottom:10px">
            <i class="el-icon-lock position-icon"></i>
            <input
              class="login-input"
              type="text"
              v-model="password"
              placeholder="密码"
            />
          </div>
        </div>
        <div class="login-button" @click="loginClick">登 录</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./local-login.ts"></script>
<style lang="scss">
.login-dialog {
  .el-dialog__body {
    padding: 0 20px;
  }
}
</style>
<style lang="scss" scoped>
.layout-background {
  background: url("../../assets/images/login/login-background.png") no-repeat;
  background-size: 100% 100%;
  width: 100%;
  min-height: calc(100vh);
  display: flex;
  justify-content: center;
  align-items: center;
  .login-box {
    width: 950px;
    height: 453px;
    border-radius: 10px;
    display: flex;
    justify-content: flex-start;
    .login-left {
      width: 500px;
      height: 453px;
      background: url("../../assets/images/login/login-logo.png") no-repeat;
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .icon-img {
        width: 174px;
        height: 45px;
      }
      .login-icon-span {
        font-size: 22px;
        margin-top: 13px;
        color: #ffffff;
        opacity: 0.6;
      }
    }
    .login-right {
      padding: 70px 50px;
      border-radius: 0px 10px 10px 0px;
      background: url("../../assets/images/login/login-checked.png") no-repeat
          101% bottom,
        #ffffff;
      background-size: 99px 147px;
      .login-title {
        font-size: 28px;
        color: #606266;
        font-weight: 600;
      }
      .login-input {
        width: 350px;
        height: 46px;
        font-size: 16px;
        background: #ffffff;
        border-radius: 28px;
        border: 1px solid #dcdfe6;
        text-indent: 60px;
      }
      ::-webkit-input-placeholder {
        /* WebKit browsers */
        color: #c8c9cc;
      }

      ::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #c8c9cc;
      }

      :-ms-input-placeholder {
        /* Internet Explorer 10+ */
        color: #c8c9cc;
      }
      .position-icon {
        position: absolute;
        top: 12px;
        left: 33px;
        font-size: 20px;
        color: #c8c9cc;
      }
    }
    .login-button {
      margin-top: 40px;
      width: 100%;
      height: 46px;
      line-height: 46px;
      background: #2281f6;
      border-radius: 28px;
      text-align: center;
      font-size: 18px;
      color: #ffffff;
      cursor: pointer;
    }
  }
}
</style>
