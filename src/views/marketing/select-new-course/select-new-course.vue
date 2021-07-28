<template>
  <div>
    <CourseIntroduction ref="courseType"></CourseIntroduction>
    <div class="select-new-course">
      <div class="page-content">
        <div class="tip" @click="openIntroduce()">
          <img src="../../../assets/images/icon-i.png" alt="" />
          了解详细课型请查看 课型介绍>>
        </div>
        <div class="progress">
          <div class="item" style="color: #303133">
            <span>1</span>
            课程类型
          </div>
          <div><i class="el-icon-arrow-right"></i></div>
          <div class="item">
            <span>2</span>
            课程信息
          </div>
          <div style="font-size: 30px"><i class="el-icon-arrow-right"></i></div>
          <div class="item">
            <span>3</span>
            创建完成
          </div>
        </div>
        <div class="course-list">
          <div
            @click="goNewlyBuild(item)"
            v-for="(item, index) in list"
            :key="index"
            class="item"
          >
            <div class="pic">
              <!--              <img-->
              <!--                src="../../../assets/images/designer-competition-no-dat.png"-->
              <!--                alt=""-->
              <!--              />-->
              <img :src="item.iconUrl" alt="" />
            </div>
            <div class="name">{{ item.labelName }}</div>
            <div class="des">{{ item.remarks }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./select-new-course.ts"></script>

<style lang="scss" scoped>
.select-new-course {
  min-height: 100%;
  .page-title {
    background-color: #f2f2f2;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    padding-bottom: 20px;
  }
  .page-content {
    padding: 20px 24px;
    background-color: white;
    min-height: 100%;
    .tip {
      width: 307px;
      padding-left: 16px;
      cursor: pointer;
      background: rgba(230, 241, 252, 1);
      border: 1px solid rgba(163, 208, 253, 1);
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(64, 158, 255, 1);
    }
    .progress {
      .item {
        margin: 0 70px;
      }
      padding: 5px 0px;
      background: rgba(245, 247, 250, 1);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(144, 147, 153, 1);
      margin-top: 20px;
      span {
        display: inline-block;
        width: 28px;
        height: 28px;
        line-height: 28px;
        border: 1px solid rgba(144, 147, 153, 1);
        border-radius: 50%;
        text-align: center;
      }
    }
    .course-list {
      margin-top: 27px;
      display: flex;
      justify-content: center;
      .item:hover {
        border: 1px solid #409eff;
      }
      .item {
        margin: 0px 20px;
        cursor: pointer;
        width: 270px;
        border-radius: 1px;
        border: 1px solid rgba(220, 223, 230, 1);
        img {
          width: 98%;
        }
        .name {
          text-align: center;
          padding-top: 25px;
          font-size: 20px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(48, 49, 51, 1);
        }
        .des {
          text-align: center;
          padding: 10px 20px 30px;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(144, 147, 153, 1);
        }
      }
    }
  }
}
</style>
