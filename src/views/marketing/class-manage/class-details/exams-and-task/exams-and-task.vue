<template>
  <div class="exams-and-task">
    <el-tabs class="exams-and-task_tabs" v-model="currentTab">
      <el-tab-pane label="考试" name="exams"> </el-tab-pane>
      <el-tab-pane label="作业" name="task"> </el-tab-pane>
      <exams-and-task-list
        class="exams-and-task_list"
        :classId="classId"
        :currentTab="currentTab"
        :studyTerminalCode="studyTerminalCode"
        :tableData="tableData"
        :tableLoading="tableLoading"
        ref="examsAndTaskList"
      ></exams-and-task-list>
    </el-tabs>
    <div class="exams-and-task_btn-box">
      <el-button
        class="btn-edit"
        type="primary"
        plain
        @click="handleEdit"
        size="mini"
        >编辑</el-button
      >
      <el-button class="btn-add" type="primary" @click="handleAdd" size="mini"
        >新增</el-button
      >
    </div>
    <div class="el-pagination_box mt-15">
      <el-pagination
        @current-change="onpageNumNumChange"
        @size-change="onpageNumSizeChange"
        :page-sizes="[10, 20, 50, 100]"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <el-drawer
      title="新建考试"
      :visible.sync="examsDrawerCor"
      direction="rtl"
      size="50%"
      :close-on-press-escape="false"
      :show-close="true"
      custom-class="public-drawer"
      :before-close="handleClose"
      :wrapperClosable="false"
    >
      <new-examination
        v-if="examsDrawerCor"
        :classId="classId"
        :studyTerminalCode="studyTerminalCode"
        @cancel="drawerCloseCor"
        @confirm="drawerConfirm"
      ></new-examination>
    </el-drawer>
    <el-drawer
      title="新建作业"
      :visible.sync="taskDrawerCor"
      direction="rtl"
      size="40%"
      :close-on-press-escape="false"
      :show-close="true"
      custom-class="public-drawer"
      :wrapperClosable="false"
    >
      <task-add
        v-if="taskDrawerCor"
        :classId="classId"
        @close="drawerCloseCor"
        @confirm="drawerConfirm"
      >
      </task-add>
    </el-drawer>
  </div>
</template>

<script lang="ts" src="./exams-and-task.ts"></script>

<style lang="scss" scoped>
.exams-and-task {
  width: 100%;
  padding: 16px 20px 38px;
  background-color: #fff;
  position: relative;
  .exams-and-task_tabs {
    .el-tabs__item {
      font-size: 14px;
      font-weight: 500;
      color: #606266;
      line-height: 14px;
      &.is_active {
        color: #1989fa;
      }
    }
    .el-tabs__nav-wrap::after {
      background: #e4e7ed;
    }
  }
  .exams-and-task_btn-box {
    position: absolute;
    top: 10px;
    right: 20px;
  }

  .el-pagination_box {
    text-align: center;
    width: 100%;
  }
}
</style>
