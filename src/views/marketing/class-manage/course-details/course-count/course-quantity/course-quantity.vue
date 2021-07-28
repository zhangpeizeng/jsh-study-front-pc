<template>
  <div class="statistical">
    <div class="statistical-item" v-if="dataObj.signUpStatus == 1">
      <img src="@/assets/images/course-sign.png" />
      <div class="item-span">
        <div class="number">{{ signNum ? signNum : 0 }}</div>
        <div class="name">报名人数</div>
      </div>
    </div>
    <div class="statistical-item">
      <img src="@/assets/images/course-study.png" />
      <div class="item-span">
        <div class="number">{{ cusStudyCount ? cusStudyCount : 0 }}</div>
        <div class="name">学习人数</div>
      </div>
    </div>
    <div class="statistical-item">
      <img src="@/assets/images/course-progress.png" />
      <div class="item-span">
        <div class="number" v-if="cusStudyProgressAvg">
          {{ cusStudyProgressAvg ? cusStudyProgressAvg : 0 }}%
        </div>
        <div class="number" v-else>0%</div>
        <div class="name">平均学习进度</div>
      </div>
    </div>
    <div class="statistical-item">
      <img src="@/assets/images/course-time.png" />
      <div class="item-span">
        <div class="number">
          {{ cusStudyTimeAvg ? cusStudyTimeAvg : 0 }}分钟
        </div>
        <div class="name">平均学习时长</div>
      </div>
    </div>
    <div class="statistical-item" v-if="dataObj.testStatus == 1">
      <img src="@/assets/images/course-test.png" />
      <div class="item-span">
        <div class="number">{{ joinerCount ? joinerCount : 0 }}</div>
        <div class="name">考试人数</div>
      </div>
    </div>
    <div class="statistical-item" v-if="dataObj.testStatus == 1">
      <img src="@/assets/images/course-average.png" />
      <div class="item-span">
        <div class="number">{{ scoreAvg ? scoreAvg : 0 }}分</div>
        <div class="name">考试平均分</div>
      </div>
    </div>
    <div class="statistical-item" v-if="dataObj.taskStatus == 1">
      <img src="@/assets/images/course-task.png" />
      <div class="item-span">
        <div class="number">{{ taskNum ? taskNum : 0 }}</div>
        <div class="name">作业提交数</div>
      </div>
    </div>
    <div class="statistical-item" v-if="dataObj.pkStatus == 1">
      <img src="@/assets/images/course-pk.png" />
      <div class="item-span">
        <div class="number">{{ pkNum ? pkNum : 0 }}</div>
        <div class="name">参与PK数</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./course-quantity.ts"></script>

<style lang="scss" scoped>
.statistical {
  padding: 30px 0px 20px 0px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  .statistical-item {
    position: relative;
    margin-right: 17px;
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
