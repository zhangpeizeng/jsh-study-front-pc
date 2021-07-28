<template>
  <div class="brand-list">
    <div class="header-form">
      <el-form :inline="true" label-width="80px" size="mini">
        <el-form-item label="作业">
          <el-input
            style="width:240px"
            v-model="taskTheme"
            clearable
            placeholder="请输入作业主题"
            maxlength="20"
            @input="taskTheme = taskTheme.replace(/^ +| +$/g, '')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch" plain>查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="body">
      <div class="mb-15">
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-circle-plus-outline"
          @click="gotoadd"
          >新增作业</el-button
        >
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        header-cell-class-name="table-header-cell"
      >
        <el-table-column label="序号" min-width="100px">
          <template slot-scope="scope">
            <div class="table-index">
              <div>
                {{ scope.$index + 1 }}
              </div>
              <div class="table-icon">
                <i
                  class="el-icon-arrow-up cursor"
                  @click="tabUp(scope.row, scope.$index)"
                ></i>
                <i
                  class="el-icon-arrow-down cursor"
                  @click="tabDown(scope.row, scope.$index)"
                ></i>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="作业主题"
          min-width="250px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.taskTheme }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="合格分" min-width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.qualifiedScore }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="限制提交时间" min-width="250px">
          <template slot="header">
            <span style="margin-right: 6px">限制提交时间</span>
            <el-tooltip placement="top">
              <img
                src="@/assets/images/jsh-icon-question.png"
                style="margin-bottom: 3px"
                class="w-14px h-14px"
              />
              <span slot="content"
                >要求学员课程作业提交的起止时间，<br />提交开始时间前和提交结束时间后学员不可进行作业提交</span
              >
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.taskStartTime"
              >{{ scope.row.taskStartTime | date("yyyy-MM-dd hh:mm") }}至{{
                scope.row.taskEndTime | date("yyyy-MM-dd hh:mm")
              }}</span
            >
            <span v-if="!scope.row.taskStartTime">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="提交数" min-width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.submitCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="250px">
          <template slot-scope="scope">
            <el-button size="mini" @click="gotoDetail(scope.row)" plain>
              详情
            </el-button>
            <el-button size="mini" @click="gotoupdate(scope.row)" plain>
              修改
            </el-button>
            <el-button size="mini" @click="gotodelete(scope.row)" plain>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="onpageNumNumChange"
        @size-change="onpageNumSizeChange"
        :page-sizes="[10, 20, 50, 100]"
        :current-page="pageNum"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <div class="footer-bottom-container">
      <template>
        <el-button size="mini" @click="$router.go(-1)">返回</el-button>
      </template>
    </div>
    <el-drawer
      :title="drawerName"
      :visible.sync="drawerCor"
      direction="rtl"
      size="40%"
      :close-on-press-escape="false"
      :show-close="true"
      custom-class="public-drawer"
      :before-close="handleClose"
      :wrapperClosable="false"
    >
      <task-add
        v-if="drawerCor"
        :id="libraryId"
        :classId="classId"
        :saveType="saveType"
        @close="drawerCloseCor"
        @confirm="drawerConfirm"
      >
      </task-add>
    </el-drawer>
  </div>
</template>

<script lang="ts" src="./task-settings.ts"></script>

<style lang="scss" scoped>
.brand-list {
  padding: 24px 20px 20px 20px;

  .header-form {
    padding-bottom: 6px;
    border-bottom: 1px solid #dcdfe6;

    .el-button {
      padding-left: 20px;
      padding-right: 20px;
    }
  }

  .body {
    padding-top: 20px;
    position: relative;
    &::v-deep .table-header-cell .cell {
      color: #909399;
    }
    .el-pagination {
      margin-top: 20px;
      text-align: center;
    }
  }
}
.w-14px {
  width: 14px;
}
.h-14px {
  height: 14px;
}
.table-index {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .table-icon {
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .el-icon-arrow-up:hover {
    color: #0486fe;
  }
  .el-icon-arrow-down:hover {
    color: #0486fe;
  }
  .cursor {
    cursor: pointer;
  }
}
</style>
