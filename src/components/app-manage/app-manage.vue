<template>
  <div
    class="modal-warp"
    :style="{ display: visible ? 'block' : 'none' }"
  ></div>
</template>

<script lang="ts" src="./app-manage.ts"></script>

<style lang="scss" scoped>
.modal-warp {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;

  .cover {
    width: 100%;
    height: 100%;
    background-color: #333;
    opacity: 0.3;
  }
  .modal {
    position: absolute;
    top: 0;
    right: 0;
    width: 1000px;
    height: 500px;
    background-color: #fff;

    .modal-content {
      position: relative;
      width: 100%;
      height: 100%;
      .modal-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
      }
    }
  }
}

.tab-warp {
  border: 1px #f2f2f2 solid;
  padding: 40px 50px 25px 50px;
  li {
    position: relative;
    width: 80px;

    .tab {
      color: #333;
      text-align: center;
      cursor: pointer;
    }
    .line {
      display: none;
      position: absolute;
      bottom: -25px;
      left: 5px;
      height: 2px;
      background-color: #0bb0f6;
      width: 70px;
    }
    &.active {
      .tab {
        color: #0bb0f6;
      }
      .line {
        display: block;
      }
    }
  }
}

.content {
  display: none;
  padding: 40px 50px;
  .sub {
    width: 200px;
    .title {
      color: #333;
      opacity: 0.5;
      margin-bottom: 18px;
    }

    .third {
      li {
        color: #333;
        margin-bottom: 18px;
        label {
          img {
            margin-bottom: -4px;
          }
          .un-select {
            display: none;
          }
          span {
            display: none;
          }
        }

        &:hover {
          label span {
            display: inline;
          }
          .un-select {
            display: inline;
          }
        }
      }
    }
  }
  &.active {
    display: block;
  }
}
</style>
