<template>
  <div class="header">
    <div class="clearfix bg-fff pr-20">
      <div class="float-left">
        <label class="d-flex align-items-center pl-10" style="height: 69px;">
          <span
            class="fs-22 color-222 ml-10 mr-10 fw-bold"
            style="line-height:22px;"
          >
            营销学院管理端
          </span>
        </label>
      </div>
      <div class="float-right">
        <div class="clearfix">
          <!--&lt;!&ndash;电话&ndash;&gt;-->
          <!--<div class="float-left phone mr-15">-->
          <!--<img src="../../assets/images/service.png" class="mr-10" />-->
          <!--<span class="color-777">400-833-6666</span>-->
          <!--</div>-->
          <!--&lt;!&ndash;帮助中心&ndash;&gt;-->
          <!--<div-->
          <!--class="float-left help mr-10"-->
          <!--v-if="helpCenterLink"-->
          <!--@click="openHelpCenter"-->
          <!--&gt;-->
          <!--<img src="../../assets/images/help.png" alt="" />-->
          <!--</div>-->
          <!--&lt;!&ndash;消息&ndash;&gt;-->
          <!--<div-->
          <!--class="float-left message mr-30"-->
          <!--@click="openPage('/portal/#!/settings/messageBox/system/')"-->
          <!--&gt;-->
          <!--<img src="../../assets/images/message.png" alt="" />-->
          <!--<span class="avatar" v-if="unreadNumber > 0">{{-->
          <!--unreadNumber-->
          <!--}}</span>-->
          <!--</div>-->
          <!--用户-->
          <!-- <div
            @click="toDetail()"
            class="float-left user ml-10"
            style="  cursor: pointer;"
          >
            <img
              v-if="!accountUrl"
              class="avatar mr-10"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
            <img v-if="accountUrl" class="avatar mr-10" :src="accountUrl" />
            <span class="fs-14" style="color:#409EFF;">{{ userName }}</span>
            <img class="fold" src="../../assets/images/arrow-down.png" />
            <div class="user-handle">
              <div class="user-handle-item">
                个人信息
              </div>
              <div class="user-handle-item" @click="logout">退出</div>
            </div>
          </div> -->
          <div class="float-left user ml-10">
            <img
              v-if="!accountUrl"
              class="avatar mr-10"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
            <img v-if="accountUrl" class="avatar mr-10" :src="accountUrl" />
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="info">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout"
                  ><img
                    src="../../assets/images/logout.png"
                    style="width:12px;height:12px;margin-right:6px"
                  />退出</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./header.ts"></script>

<style lang="scss" scoped>
@import "../../assets/style/theme.scss";

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  padding-left: 140px;
  background-color: #fff;
  border-bottom: 1px #f2f2f2 solid;
  z-index: 100;
}

.phone,
.help,
.message,
.user {
  height: 69px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.phone {
  width: 140px;
}

.help {
  width: 40px;
  cursor: pointer;
}

.message {
  width: 40px;
  cursor: pointer;
  position: relative;
  .avatar {
    position: absolute;
    top: 20px;
    left: 20px;
    height: 16px;
    min-width: 16px;
    color: #fff;
    background-color: #ff7b7b;
    font-size: 12px;
    border-radius: 8px;
    text-align: center;
    line-height: 16px;
    display: block;
    padding: 0 4px;
    box-sizing: border-box;
  }
}

.user {
  max-width: 200px;
  position: relative;
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .fold {
    margin-left: 6px;
  }
  .user-handle {
    display: none;
    position: absolute;
    top: 60px;
    right: 0;
    padding: 11px 0;
    margin: 8px 0;
    box-shadow: -1px 4px 6px 0px rgba(0, 0, 0, 0.1);
    border: 1px solid #ebeef5;
    background-color: #ffffff;
    .user-handle-item {
      color: #909399;
      width: 84px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      font-size: 14px;
      cursor: pointer;
    }
  }
  &:hover {
    .user-handle {
      display: block;
      .user-handle-item:hover {
        @include themify($themes) {
          background-color: #ecf5ff !important;
          color: #409eff;
        }
      }
    }
  }
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
