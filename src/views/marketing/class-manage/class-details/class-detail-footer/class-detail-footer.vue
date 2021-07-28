<template>
  <div class="footer-bottom-container">
    <el-button
      plain
      class="class-detail-footer_btn btn_close"
      @click="closeCurrentPage"
      size="mini"
      >关闭</el-button
    >
    <el-button
      plain
      class="class-detail-footer_btn btn_del"
      @click="deleteCurrentclass"
      size="mini"
      v-show="
        [CLASS_STATE_TYPE.DRAFT, CLASS_STATE_TYPE.CLASS_INTERRUPT].includes(
          classStatus
        ) && !isAssistant
      "
      >删除</el-button
    >
    <el-button
      class="class-detail-footer_btn btn_start-class"
      type="primary"
      @click="openCurrentclass"
      size="mini"
      v-show="classStatus === CLASS_STATE_TYPE.CLASS_INTERRUPT && !isAssistant"
      >开班</el-button
    >
    <el-button
      class="class-detail-footer_btn btn_end-class"
      type="primary"
      @click="stopCurrentclass"
      size="mini"
      v-show="
        [
          CLASS_STATE_TYPE.CLASS_IN_PROGRESS,
          CLASS_STATE_TYPE.BEFORE_CLASS,
          CLASS_STATE_TYPE.END_OF_COURSE
        ].includes(classStatus) && !isAssistant
      "
      >停班</el-button
    >
    <el-button
      class="class-detail-footer_btn btn_end-class"
      type="primary"
      @click="closeCurrentClass"
      size="mini"
      v-show="classStatus === CLASS_STATE_TYPE.END_OF_COURSE && !isAssistant"
      >结班</el-button
    >
    <el-button
      plain
      class="class-detail-footer_btn btn_edit"
      @click="editClass"
      size="mini"
      v-show="!isAssistant"
      >修改</el-button
    >
  </div>
</template>

<script lang="ts" src="./class-detail-footer.ts"></script>

<style lang="scss" scoped></style>
