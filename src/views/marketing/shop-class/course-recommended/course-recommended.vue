<template>
  <div style="padding: 0 24px; background-color: #ffffff">
    <div class="content-top">
      <div class="course-time" style="margin-bottom: 15px;">
        <div class="course-name">
          <span> 课程名称：{{ detail.courseName }} </span>
        </div>
        <div class="course-type">{{ detail.courseTypeName }}</div>
      </div>
    </div>
    <div class="recommended">
      <el-tabs v-model="studyTerminalCode" @tab-click="handleClick">
        <el-tab-pane v-if="tableFlag1" label="客户端" name="1"></el-tab-pane>
        <el-tab-pane v-if="tableFlag2" label="员工端" name="2"></el-tab-pane>
        <el-tab-pane v-if="tableFlag3" label="直销员端" name="3"></el-tab-pane>
        <el-tab-pane v-if="tableFlag4" label="售后端" name="4"></el-tab-pane>
      </el-tabs>
    </div>
    <div style="padding:6px 0;">
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="1" class="text-right">
          <span class="text-title">课程</span>
        </el-col>
        <el-col :span="5">
          <el-input
            v-model="courseName"
            clearable
            placeholder="请输入课程名称"
            maxlength="40"
            size="mini"
            @input="courseName = courseName.replace(/^ +| +$/g, '')"
          ></el-input>
        </el-col>
        <el-col :span="2" class="text-right">
          <span class="text-title">状态</span>
        </el-col>
        <el-col :span="5" class="text-content">
          <el-select
            v-model="status"
            placeholder="请选择"
            size="mini"
            filterable
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="已上架" value="2"></el-option>
            <el-option label="已下架" value="3"></el-option>
          </el-select>
        </el-col>
        <el-col :span="5" class="text-content"> </el-col>
        <el-col :span="7" class="text-right">
          <el-button type="primary" plain size="mini" @click="recQry"
            >查询</el-button
          >
          <el-button
            plain
            style="margin-left: 10px;"
            size="mini"
            @click="recReset"
            >重置</el-button
          >
        </el-col>
      </el-row>
    </div>
    <div class="body">
      <div class="d-flex align-items-center mb-15">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-circle-plus-outline"
          @click="addCourse"
          >添加课程</el-button
        >
        <div class="d-flex align-items-center" style="margin-left:15px;">
          <img
            src="../../../../assets/images/icon-help.png"
            style="width:14px;height:14px;margin-right:10px"
          />
          <el-tooltip placement="top-start">
            <div slot="content">
              <div class="prompt">
                课程推荐说明：添加课程后则2门课程相关关联；系统根据
              </div>
              <div class="prompt">
                关联的所有课程，取学习人数排名前五的课程展示在学员端。
              </div>
            </div>
            <span class="prompt" style="font-size:12px;color:#909399">
              课程推荐说明：添加课程后则2门课程...
            </span>
          </el-tooltip>
        </div>
      </div>

      <el-table
        :data="tableData"
        v-loading="loading"
        header-cell-class-name="table-header-cell"
      >
        <el-table-column label="序号" align="left" min-width="50px">
          <template slot-scope="scope">
            <span>
              {{ scope.$index + 1 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="课程名称"
          align="left"
          min-width="230px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.courseName }}
          </template>
        </el-table-column>
        <el-table-column label="讲师" align="left" min-width="150px">
          <template slot-scope="scope">
            <span
              >{{ scope.row.lecturerName }} ({{ scope.row.huiHuiNumber }})</span
            >
          </template>
        </el-table-column>
        <el-table-column
          label="所属组织"
          align="left"
          min-width="150px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.organization">{{
              scope.row.organization
            }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          label="课程分类"
          align="left"
          min-width="120px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.classifyName">{{
              scope.row.classifyName
            }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column min-width="70px" align="center" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 2">已上架</span>
            <span v-if="scope.row.status == 3">已下架</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="70px">
          <template slot-scope="scope">
            <el-button size="mini" @click="delItem(scope.row)" plain>
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[10, 20, 50, 100]"
        :current-page="pages"
        :page-size="rows"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <div style="height:60px"></div>
    <div style="position: absolute">
      <div class="footer-bottom-container">
        <template>
          <el-button size="mini" @click="btnColse()">关闭</el-button>
        </template>
      </div>
    </div>
    <el-dialog
      title="添加课程"
      width="836px"
      custom-class="addStudent-dialog"
      :close-on-click-modal="false"
      :visible.sync="selectCourseDialog"
    >
      <addRecommendedCourse
        v-if="selectCourseDialog"
        :id="detail.id"
        :studyTerminal="studyTerminalCode"
        @confirm="confirmCoursePopup"
        @cancel="selectCourseDialog = false"
      >
      </addRecommendedCourse>
    </el-dialog>
  </div>
</template>
<script lang="ts" src="./course-recommended.ts"></script>
<style lang="scss">
.recommended {
  .el-tabs__active-bar {
    min-width: 42px !important;
  }
}
</style>
<style lang="scss" scoped>
.content-top {
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
      padding: 5px 14px;
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
.el-row {
  margin-bottom: 15px;
  .text-right {
    text-align: right;
    .text-title {
      color: #606266;
    }
  }
  .text-content {
    .content-span {
      color: #909399;
    }
    .prompt {
      font-size: 12px;
      color: #909399;
    }
    .icon-tip {
      width: 14px;
      height: 14px;
    }
    .button-check {
      width: 88px;
      background: #ffffff;
      color: #409eff;
      border: 1px solid #409eff;
      border-radius: 0px 4px 4px 0px;
    }
    .color-red {
      color: #f56c6c;
    }
    .font-12 {
      font-size: 12px;
    }
    .el-select {
      width: 100%;
    }
  }
  .word-break {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .require-icon {
    font-size: 14px;
    color: #ff0000;
  }
}
.body {
  padding-top: 20px;
  position: relative;
  &::v-deep .table-header-cell .cell {
    color: #909399;
  }

  .brand-logo {
    width: 100px;
    height: 56px;
    object-position: center;
    border-radius: 2px;
    object-fit: cover;
  }
  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
