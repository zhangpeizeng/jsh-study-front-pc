<template>
  <div class="link-course">
    <div v-if="advertJumpType === '2'" class="item">
      <div></div>
      <div class="text-content">
        <div class="button-block" @click="selectCourse">
          选择课程
          <span v-if="studyTerminal === '1'">(客户端)</span>
          <span v-if="studyTerminal === '2'">(员工端)</span>
          <span v-if="studyTerminal === '3'">(直销员端)</span>
          <span v-if="studyTerminal === '4'">(售后端)</span>
        </div>
      </div>
      <div class="text-content" v-if="selectObj.courseName">
        <div
          style="background-color: #F5F7FA;height: 25px;line-height: 25px;display: inline-block;vertical-align: middle;padding: 0 5px;margin-top: 10px"
        >
          <i class="el-icon-document" style="margin-right: 15px;"></i>
          <span
            class="text-title"
            style="color: #409EFF;font-size: 12px;cursor: pointer;"
            >{{ selectObj.courseName }}</span
          >
        </div>
      </div>
    </div>
    <div v-if="advertJumpType === '3'" class="item">
      <div></div>
      <div class="text-content">
        <div class="button-block" @click="selectTheme">
          选择主题
          <span v-if="studyTerminal === '1'">(客户端)</span>
          <span v-if="studyTerminal === '2'">(员工端)</span>
          <span v-if="studyTerminal === '3'">(直销员端)</span>
          <span v-if="studyTerminal === '4'">(售后端)</span>
        </div>
      </div>
      <div class="text-content" v-if="selectThemeObj.themeName">
        <div
          style="margin-top: 10px;background-color: #F5F7FA;height: 25px;line-height: 25px;display: inline-block;vertical-align: middle;padding: 0 5px;"
        >
          <i class="el-icon-document" style="margin-right: 15px;"></i>
          <span
            class="text-title"
            style="color: #409EFF;font-size: 12px;cursor: pointer;"
            >{{ selectThemeObj.themeName }}</span
          >
        </div>
      </div>
    </div>
    <el-dialog
      title="选择课程"
      width="836px"
      custom-class="addReply-dialog"
      :close-on-click-modal="false"
      :visible.sync="selectCourseDialog"
    >
      <select-course
        :selectObj="selectObj"
        :studyTerminalList="studyTerminal"
        v-if="selectCourseDialog"
        @confirm="confirmPopup"
        @cancel="selectCourseDialog = false"
      >
      </select-course>
    </el-dialog>
    <el-dialog
      title="选择主题"
      width="836px"
      custom-class="addReply-dialog"
      :close-on-click-modal="false"
      :visible.sync="selectThemeDialog"
    >
      <select-theme
        :selectObj="selectThemeObj"
        :studyTerminalList="studyTerminal"
        v-if="selectThemeDialog"
        @confirm="confirmThemePopup"
        @cancel="selectThemeDialog = false"
      >
      </select-theme>
    </el-dialog>
  </div>
</template>

<script src="./link-course.ts"></script>

<style scoped lang="scss">
.link-course {
  margin-right: 20px;
}
.item {
  flex-wrap: wrap;
}
.button-block {
  padding: 0 15px;
  height: 36px;
  line-height: 36px;
  border-radius: 4px;
  text-align: center;
  background: #ffffff;
  border: 1px solid #409eff;
  color: #409eff;
  font-size: 14px;
  cursor: pointer;
}
.new-title {
  position: relative;
  display: inline-block;
  padding: 7px 0 7px 0px;
  margin-right: 10px;
  color: #303133;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: bold;
  /*font-size: 16px;*/
}
</style>
