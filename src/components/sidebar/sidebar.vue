<template>
  <div class="sidebar">
    <!-- 此段代码可忽略，为了监视store的变化 -->
    <div v-show="false">{{ getMenuPath }}</div>
    <div style="padding-top: 70px;padding-bottom: 56px">
      <div id="i-scroll-js" style="height: calc(100vh - 238px)">
        <div>
          <!--循环一级菜单-->
          <div
            class="menu js-hover-menu"
            v-for="(menu, index) of menuList"
            :key="index"
          >
            <a
              class="menu-title d-block clearfix"
              :class="{ active: menu.id === activeMenuId }"
              :href="'javascript:;'"
            >
              <div class="menu-title-icon float-left">
                <img
                  :src="menu.iconUrl"
                  v-if="menu.id !== activeMenuId"
                  alt=""
                />
                <img :src="menu.glUrl" v-if="menu.id === activeMenuId" alt="" />
              </div>
              <!--一级标题-->
              <div class="menu-title-text text-truncate float-left">
                {{ menu.name }}
              </div>
            </a>
            <ul
              class="sub-menu-warp clearfix"
              :style="{ width: `130px` }"
              style="height: calc(100vh)"
            >
              <!--循环二级菜单-->
              <li
                class="sub-menu"
                v-for="(subMenu, subIndex) of menu.children"
                :key="subIndex"
                @click="toPage(menu, subMenu)"
              >
                <div
                  class="sub-menu-title"
                  style="max-width: 130px"
                  :title="subMenu.name"
                >
                  {{ subMenu.name }}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./sidebar.ts"></script>

<style lang="scss" scoped>
@import "../../assets/style/theme.scss";

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 140px;
  height: 100vh;
  background-color: #ffffff;
  z-index: 20;
  color: #333333;

  .menu {
    width: 100%;
    position: relative;

    .menu-title {
      height: 56px;
      line-height: 56px;
      cursor: pointer;

      .menu-title-icon {
        width: 50px;
        text-align: center;

        img {
          margin-top: -3px;
          width: 16px;
          height: 16px;
        }
      }

      .menu-title-text {
        color: #303133;
        font-size: 14px;
        font-weight: 400;
        width: 70px;
      }

      &.active {
        @include themify($themes) {
          background-color: themed("master-color") !important;
        }

        .menu-title-icon {
          opacity: 1 !important;
        }

        .menu-title-text {
          color: #1890ff;
          opacity: 1;
        }
      }
    }

    .sub-menu-warp {
      display: none;
      position: absolute;
      top: 0;
      left: 140px;
      background-color: #ffffff;
      border: 1px solid #ebeef5;
      transition: all 2s ease-in-out;
      box-shadow: 6px 3px 6px 0px rgba(0, 0, 0, 0.05);

      .sub-menu {
        padding: 20px 0px 0px 20px;
        .sub-menu-title {
          color: #606266;
          font-size: 14px;
          word-break: keep-all;
          cursor: pointer;
          &:hover {
            color: #409eff;
          }
        }
      }
    }
    &:hover {
      .menu-title {
        background-color: rgb(64, 158, 255, 0.1);
      }
    }
  }
}
</style>
