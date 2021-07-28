<template>
  <div class="continer-main">
    <div class="content-top">
      <div class="course-time">
        <div class="course-name">
          <span> 课程名称：{{ detail.courseName }} </span>
        </div>
        <div class="course-type">{{ detail.courseTypeName }}</div>
      </div>
    </div>
    <rangeScope v-show="tableFlag1" ref="rangeOne" activeName="1"></rangeScope>
    <rangeScope v-show="tableFlag2" ref="rangeTwo" activeName="2"></rangeScope>
    <rangeScope
      v-show="tableFlag3"
      ref="rangeThree"
      activeName="3"
    ></rangeScope>
    <rangeScope v-show="tableFlag4" ref="rangeFour" activeName="4"></rangeScope>
    <!--end导入部分-->
    <div style="position: absolute">
      <div class="footer-bottom-container">
        <template>
          <el-button size="mini" @click="btnColse()">关闭</el-button>
          <el-button
            type="primary"
            :disabled="btnEnable"
            size="mini"
            @click="btnSave"
            >保存
          </el-button>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./student-scope.ts"></script>
<style lang="scss">
.continer-main {
  .el-tabs__active-bar {
    min-width: 42px !important;
  }
  .el-select {
    width: 70%;
  }
}
</style>
<style lang="scss" scoped>
.continer-main {
  margin-bottom: 60px;
  .steps {
    margin-top: -25px;
    margin-bottom: 20px;
    padding: 8px 20%;
    background: #f5f7fa;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #5cb87a;
    .icon-right {
      font-size: 28px;
      color: #c0c4cc;
    }
    .two {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #000000;
    }
  }
  .export-continer {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #606266;
    img {
      margin: 0 8px;
    }
    .tip-info {
      padding-top: 10px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #909399;
    }
  }
  .new-title {
    margin-top: 20px;
    position: relative;
    display: inline-block;
    margin-bottom: 24px;
    padding: 7px 30px 7px 50px;
    color: #303133;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    font-size: 16px;
    background: #f2f2f2;
    border-radius: 0 100px 100px 0;

    &::before {
      content: "";
      position: absolute;
      top: 14px;
      left: 22px;
      width: 12px;
      height: 12px;
      background: #555555;
      transform: rotateZ(45deg);
    }
  }
  min-height: 900px;

  .el-checkbox {
    min-width: 90px;
    margin-right: 20px;
  }

  .content-top {
    margin-left: 24px;
    color: #000000;
    font-size: 20px;
    font-weight: 600;
  }
  .course-time {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .course-name {
      span {
        background: #f2f2f2;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #606266;
        padding: 4px 14px;
        display: inline-block;
      }
    }
    .course-type {
      padding: 2px 5px;
      background: #ecf5ff;
      border: 1px solid #409eff;
      font-size: 12px;
      color: #409eff;
      text-align: center;
      margin-left: 15px;
    }
  }

  .range-settings {
    position: relative;
    display: inline-block;
    margin-bottom: 24px;
    padding: 7px 30px 7px 45px;
    color: #303133;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    font-size: 16px;
    background: #f2f2f2;
    border-radius: 0 100px 100px 0;

    &::before {
      content: "";
      position: absolute;
      top: 14px;
      left: 22px;
      width: 12px;
      height: 12px;
      background: #555555;
      transform: rotate(45deg);
      -ms-transform: rotate(45deg); /* Internet Explorer */
      -moz-transform: rotate(45deg); /* Firefox */
      -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
      -o-transform: rotate(45deg); /* Opera */
    }
  }
  .student-group-main {
    width: 400px;
    margin: 0 auto 20px;
    position: relative;
    margin-left: 3%;
    margin-top: 20px;
  }

  .student-group-main .popup {
    width: 780px;
    background: #fff;
    padding: 10px 20px;
    color: #333;
    border-radius: 4px;
    /*position: absolute;*/
    top: 30px;
    left: 30px;
    border: 1px solid #e4e7ed;

    .area-sign {
      border-bottom: 1px solid #e4e7ed;
      padding-bottom: 15px;
      padding-top: 10px;
    }

    .noBorder {
      border-bottom: 1px solid #ffffff;
    }
  }

  .student-group-main .popup::before {
    content: "";
    width: 0px;
    height: 0px;
    border-width: 0 10px 10px;
    border-style: solid;
    border-color: transparent transparent #e4e7ed;
    left: 33%;
    top: -10px;
    position: absolute;
    margin-left: -10px;
  }

  .student-group-main .popup::after {
    content: "";
    width: 0px;
    height: 0px;
    border-width: 0 10px 10px;
    border-style: solid;
    border-color: transparent transparent #fff;
    left: 33%;
    top: -9px;
    position: absolute;
    margin-left: -10px;
  }
  .student-group-main2 {
    width: 400px;
    margin: 0 auto 20px;
    position: relative;
    margin-left: 3%;
    margin-top: 20px;
  }

  .student-group-main2 .popup {
    width: 780px;
    background: #fff;
    padding: 10px 20px 10px 0px;
    color: #333;
    border-radius: 4px;
    /*position: absolute;*/
    top: 30px;
    left: 30px;
    border: 1px solid #e4e7ed;

    .area-sign {
      padding-top: 3px;
    }

    .noBorder {
      border-bottom: 1px solid #ffffff;
    }
    .newTag {
      padding-top: 10px;
      padding-left: 100px;
      span {
        margin: 0 10px 10px 0;
        display: inline-block;
        background: #f0f2f5;
        border-radius: 3px;
        border: 1px solid #dcdfe6;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #5a5e66;
        padding: 3px 10px;
      }
    }
  }

  .student-group-main2 .popup::before {
    content: "";
    width: 0px;
    height: 0px;
    border-width: 0 10px 10px;
    border-style: solid;
    border-color: transparent transparent #e4e7ed;
    left: 64%;
    top: -10px;
    position: absolute;
    margin-left: -10px;
  }

  .student-group-main2 .popup::after {
    content: "";
    width: 0px;
    height: 0px;
    border-width: 0 10px 10px;
    border-style: solid;
    border-color: transparent transparent #fff;
    left: 64%;
    top: -9px;
    position: absolute;
    margin-left: -10px;
  }

  .student-group-label-main {
    width: 450px;
    margin: 0 auto 20px;
    position: relative;
    margin-left: 3%;
  }

  .student-group-label-main .popup {
    width: 450px;
    background: #fff;
    padding: 10px 20px;
    color: #333;
    border-radius: 4px;
    margin-top: 15px;
    /*position: absolute;*/
    top: 30px;
    left: 30px;
    border: 1px solid #e4e7ed;
  }

  .student-group-label-main .popup::before {
    content: "";
    width: 0px;
    height: 0px;
    border-width: 0 10px 10px;
    border-style: solid;
    border-color: transparent transparent #e4e7ed;
    left: 57%;
    top: -10px;
    position: absolute;
    margin-left: -10px;
  }

  .student-group-label-main .popup::after {
    content: "";
    width: 0px;
    height: 0px;
    border-width: 0 10px 10px;
    border-style: solid;
    border-color: transparent transparent #fff;
    left: 57%;
    top: -9px;
    position: absolute;
    margin-left: -10px;
  }

  .export-continer {
    margin-top: 10px;

    .aImp {
      color: #606266;
      font-size: 14px;
    }

    .tip-info {
      font-size: 12px;
      color: #909399;
    }
  }

  .page-contain {
    text-align: center;
    padding: 20px 0px;
  }

  .c-red {
    color: #ff0000;
  }

  .m-l-20 {
    margin-left: 20px;
  }
}
</style>
