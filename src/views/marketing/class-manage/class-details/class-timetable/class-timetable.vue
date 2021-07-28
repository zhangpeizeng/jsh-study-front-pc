<template>
  <div class="class-timetable">
    <div class="class-timetable_title-box">
      <span class="class-timetable_title">课表</span>
      <!-- 课程总数 -->
      <span class="class-timetable_sum">{{ `共${total}个课程` }}</span>
      <!-- 按钮 -->
      <div class="class-timetable_btn-box">
        <el-button
          class="btn-edit"
          type="primary"
          plain
          @click="timetableSetting"
          >编辑</el-button
        >
        <el-button class="btn-add" type="primary" @click="drawerOpenCor">
          新增
        </el-button>
      </div>
    </div>
    <div :class="['class-timetable_list', { overflowAuto: toMoreFlag }]">
      <!-- 课表item -->
      <div
        class="class-timetable_list-item"
        v-for="(item, index) in classTimetable"
        :key="item.id"
        @click="viewTimetable(item.id)"
      >
        <div class="list-item_title-lint">
          <!-- 序号 -->
          <span class="list-item_index">
            {{ index | getSerialNumber }}
          </span>
          <!-- 直播课icon -->
          <img
            v-if="item.courseType * 1 === COURSE_TYPE.DIRECT_SEEDING"
            class="list-item_out-rect"
            src="@/assets/images/icon-live.png"
            alt=""
          />
          <!-- 系列课icon -->
          <img
            v-if="item.courseType * 1 === COURSE_TYPE.SERIES"
            class="list-item_out-rect"
            src="@/assets/images/icon-series.png"
            alt=""
          />
          <!-- 研讨课icon -->
          <img
            v-if="item.courseType * 1 === COURSE_TYPE.DISCUSS"
            class="list-item_out-rect"
            src="@/assets/images/icon-discuss.png"
            alt=""
          />
          <img
            v-if="item.courseType * 1 === COURSE_TYPE.RECORD_BROADCAT_DOC"
            class="list-item_out-rect"
            src="@/assets/images/icon-doc.png"
            alt=""
          />
          <!-- title -->
          <el-tooltip
            class="item list-item_title"
            effect="dark"
            :content="item.courseName"
            placement="top-start"
            :show-overflow-tooltip="true"
          >
            <div>{{ item.courseName }}</div>
          </el-tooltip>
        </div>
        <div class="list-item_detail-box">
          <!-- 课程时间 -->
          <img
            v-if="item.startTime"
            class="list-item_date-icon"
            src="@/assets/images/todo.png"
            alt=""
          />
          <span v-if="item.startTime && item.endTime" class="list-item_date">
            {{ item.startTime | date("yyyy-MM-dd") }}至
            {{ item.endTime | date("yyyy-MM-dd") }}
          </span>
          <!-- 学习人数 -->
          <img
            class="list-item_studnts-icon"
            src="@/assets/images/student_icon.png"
            alt=""
          />
          <span class="list-item_students-num">{{
            `${item.studyCount || 0}人已学`
          }}</span>
        </div>
        <!-- 授课老师 -->
        <div class="list-item_teacher-box" v-if="item.lecturerName">
          <span class="list-item_teacher-name">
            {{ item.lecturerName }}
          </span>
          <img
            class="list-item_teacher-icon"
            src="@/assets/images/default_avatar.png"
            alt=""
          />
        </div>
      </div>
    </div>
    <!-- 查看更多btn -->
    <div class="btn-to-more_box" v-if="total > pageSize">
      <div class="btn-to-more" @click="changeToMoreFlag">
        <span class="btn-to-more_word">
          {{ !toMoreFlag ? `查看更多` : "收起" }}
        </span>
        <img
          :class="['btn-to-more_icon', { overflowAuto: toMoreFlag }]"
          src="@/assets/images/drop_down.png"
          alt=""
        />
      </div>
    </div>
    <!-- 新建课表抽屉 -->
    <el-drawer
      title="新建课表"
      :visible.sync="timetableDrawerCor"
      direction="rtl"
      size="45%"
      :close-on-press-escape="false"
      :show-close="true"
      :wrapperClosable="false"
      custom-class="public-drawer"
      :before-close="handleClose"
    >
      <class-schedule
        v-if="timetableDrawerCor"
        :classStartTime="classStartTime"
        :classEndTime="classEndTime"
        :classId="classId"
        @close="drawerCloseCor"
        @confirm="drawerConfirm"
      >
      </class-schedule>
    </el-drawer>
  </div>
</template>

<script lang="ts" src="./class-timetable.ts"></script>

<style lang="scss" scoped>
.class-timetable {
  padding: 16px 20px;
  .el-tooltip__popper {
    width: 470px !important;
  }
  .class-timetable_title-box {
    position: relative;
    width: 100%;
    .class-timetable_title {
      line-height: 28px;
      font-size: 14px;
      font-weight: 400;
      color: #000000;
    }
    .class-timetable_sum {
      font-size: 12px;
      font-weight: 400;
      color: #646566;
      margin-left: 8px;
    }
    .class-timetable_btn-box {
      position: absolute;
      top: 0;
      right: 0;
      .btn-edit,
      .btn-add {
        width: 68px;
        height: 28px;
        line-height: 28px;
        padding: 0;
      }
    }
  }
  .class-timetable_list {
    margin-top: 6px;
    height: 530px;
    overflow: hidden;
    .class-timetable_list-item {
      margin-top: 10px;
      width: 100%;
      height: 78px;
      border: 1px solid #dcdfe6;
      padding: 15px 10px;
      position: relative;
      .list-item_title-lint {
        width: 100%;
        font-size: 0;
        display: flex;
        .list-item_index {
          font-size: 14px;
          font-weight: 400;
          color: #323233;
          line-height: 1;
          vertical-align: top;
        }
        .list-item_live-icon {
          vertical-align: super;
          height: 14px;
        }
        .list-item_out-rect {
          height: 14px;
          margin: 0px 2px 0;
          vertical-align: super;
        }
        .list-item_title {
          flex: 1;
          // display: inline-block;
          // width: 450px;
          font-size: 14px;
          font-weight: 400;
          color: #323233;
          line-height: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-left: 2px;
          &.no_classify {
            width: 478px;
          }
        }
      }
      .list-item_detail-box {
        margin-top: 10px;
        .list-item_date-icon,
        .list-item_studnts-icon {
          height: 14px;
          margin-right: 3px;
          vertical-align: top;
        }
        .list-item_date,
        .list-item_students-num {
          font-size: 12px;
          font-weight: 400;
          color: #909399;
          line-height: 14px;
          vertical-align: middle;
          margin-right: 20px;
          vertical-align: top;
        }
      }
      .list-item_teacher-box {
        position: absolute;
        bottom: 12px;
        right: 10px;
        .list-item_teacher-name {
          max-width: 50px;
          font-size: 12px;
          font-weight: 400;
          color: #646566;
          line-height: 28px;
        }
        .list-item_teacher-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          overflow: hidden;
        }
      }
    }
    &.overflowAuto {
      overflow: auto;
    }
  }
  .btn-to-more_box {
    margin-top: 20px;
    text-align: center;
    .btn-to-more {
      cursor: pointer;
      display: inline-block;
      .btn-to-more_word {
        font-weight: 400;
        color: #606266;
        line-height: 14px;
      }
      .btn-to-more_icon {
        height: 14px;
        &.overflowAuto {
          transform: rotate(180deg);
        }
      }
    }
  }
}
</style>
