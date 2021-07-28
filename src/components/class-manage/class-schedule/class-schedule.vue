<template>
  <div style="padding: 0 20px;">
    <el-row type="flex" align="top" :gutter="10" class="el-row">
      <el-col :span="3" class="text-right">
        <span class="require-icon">*</span>
        <span>课程内容</span>
      </el-col>
      <el-col :span="21" class="text-content">
        <el-radio-group
          v-model="courseType"
          @change="typeChange"
          :disabled="disabledContent"
        >
          <el-radio :label="1">上传资料</el-radio>
          <el-radio :label="2">选择已有课程</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row type="flex" align="middle" :gutter="10" class="el-row">
      <el-col :span="3" class="text-right">
        <span class="require-icon">*</span>
        <span class="text-title">课程名称</span>
      </el-col>
      <el-col :span="10">
        <el-input
          v-model="courseName"
          placeholder="请输入"
          size="small"
          maxlength="40"
          @input="courseName = courseName.replace(/^ +| +$/g, '')"
          show-word-limit
        ></el-input>
      </el-col>
    </el-row>
    <el-row
      type="flex"
      align="middle"
      :gutter="10"
      class="el-row"
      v-show="courseType == 1"
    >
      <el-col :span="3" class="text-right">
        <span>上课时间</span>
      </el-col>
      <el-col :span="21" class="text-content">
        <el-date-picker
          v-model="studyStartTime1"
          type="datetime"
          placeholder="上课开始时间"
          size="small"
          value-format="timestamp"
          format="yyyy-MM-dd HH:mm"
          :picker-options="pickerOptions"
          prefix-icon="el-icon-date"
          :disabled="timeDisabled"
        >
        </el-date-picker>
        <span style="margin: 0 10px;">至</span>
        <el-date-picker
          v-model="studyEndTime1"
          type="datetime"
          placeholder="上课结束时间"
          size="small"
          value-format="timestamp"
          format="yyyy-MM-dd HH:mm"
          :picker-options="pickerOptions"
          prefix-icon="el-icon-date"
        >
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row
      type="flex"
      align="middle"
      :gutter="10"
      class="el-row"
      v-show="courseType == 2"
    >
      <el-col :span="3" class="text-right">
        <span class="text-title">上课时间</span>
      </el-col>
      <el-col :span="21" class="text-content">
        <el-date-picker
          v-model="studyStartTime0"
          type="datetime"
          placeholder="上课开始时间"
          size="small"
          value-format="timestamp"
          format="yyyy-MM-dd HH:mm"
          :picker-options="pickerOptions"
          prefix-icon="el-icon-date"
          disabled
        >
        </el-date-picker>
        <span style="margin: 0 10px;">至</span>
        <el-date-picker
          v-model="studyEndTime0"
          type="datetime"
          placeholder="上课结束时间"
          size="small"
          value-format="timestamp"
          format="yyyy-MM-dd HH:mm"
          :picker-options="pickerOptions"
          prefix-icon="el-icon-date"
          disabled
        >
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row
      type="flex"
      align="middle"
      :gutter="10"
      class="el-row"
      v-show="courseType == 1"
    >
      <el-col :span="3" class="text-right">
        <span class="text-title">授课讲师</span>
      </el-col>
      <el-col :span="10">
        <div class="d-flex align-items-center">
          <div class="lecturer-div">
            <div>{{ lecturerName }}</div>
            <i
              v-show="lecturerLibraryId"
              class="el-icon-error"
              style="color:#C0C4CC;margin-left:8px"
              @click="delLecturer(lecturerLibraryId)"
            ></i>
          </div>
          <div class="lecturer-button" @click="selectTeacher">选择</div>
        </div>
      </el-col>
    </el-row>
    <el-row
      type="flex"
      align="top"
      :gutter="10"
      class="el-row"
      v-show="courseType == 1 && videoUpdateFlag"
    >
      <el-col :span="3" class="text-right">
        <span>视频</span>
      </el-col>
      <el-col :span="18" class="text-content">
        <Uploader
          ref="video"
          @vid="getVideo"
          liveType="1"
          sourceType="2"
          :currentVideoListInDialog="videoList"
          :disabledCourse="disabledCourse"
        ></Uploader>
      </el-col>
    </el-row>
    <el-row
      type="flex"
      align="top"
      :gutter="10"
      class="el-row"
      v-show="courseType == 1 && voiceUpdateFlag"
    >
      <el-col :span="3" class="text-right">
        <span>音频</span>
      </el-col>
      <el-col :span="18" class="text-content">
        <Uploader
          ref="voice"
          @vod="getVoice"
          liveType="2"
          sourceType="2"
          :currentVideoListInDialog="voiceList"
          :disabledCourse="disabledCourse"
        ></Uploader>
      </el-col>
    </el-row>
    <el-row
      type="flex"
      align="top"
      :gutter="10"
      class="el-row"
      v-show="courseType == 1 && docUpdateFlag"
    >
      <el-col :span="3" class="text-right">
        <span>文档</span>
      </el-col>
      <el-col :span="18" class="text-content">
        <uploadFile
          ref="file"
          @file="getFile"
          liveType="3"
          sourceType="2"
          :docList="docList"
          :disabledCourse="disabledCourse"
        ></uploadFile>
      </el-col>
    </el-row>
    <!-- 筛选条件 -->
    <el-row
      type="flex"
      align="middle"
      :gutter="10"
      class="el-row"
      v-show="courseType == 2"
    >
      <el-col :span="3" class="text-right">
        <span class="text-title">课程名称</span>
      </el-col>
      <el-col :span="10">
        <el-input
          v-model="courseNameQry"
          placeholder="请输入"
          size="small"
        ></el-input>
      </el-col>
      <el-col :span="4">
        <el-button size="small" type="primary" plain @click="courseQry">
          查询
        </el-button>
      </el-col>
    </el-row>
    <!-- 表格 start -->
    <div class="mt-10" v-show="courseType == 2">
      <el-table
        :data="tableData"
        v-loading="loadingInTable"
        style="width: 100%"
        height="320"
        id="tableCourse"
      >
        <el-table-column label="序号" min-width="50px">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="课程名称" min-width="150px">
          <template slot-scope="scope">
            <span
              style="display: inline-block;width: 350px;vertical-align: middle"
              class="text-truncate ml-5"
              :title="scope.row.courseName"
            >
              {{ scope.row.courseName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="授课讲师" min-width="80px">
          <template slot-scope="scope">
            {{ scope.row.lecturerName }}
          </template>
        </el-table-column>
        <el-table-column label="学习终端" min-width="80px">
          <template slot-scope="scope">
            {{ scope.row.studyTerminal }}
          </template>
        </el-table-column>
        <el-table-column label="课程状态" min-width="60px">
          <template slot-scope="scope">
            <span v-if="scope.row.deleteFlg === 1">已删除</span>
            <span v-else-if="scope.row.status === 1">草稿</span>
            <span v-else-if="scope.row.status === 2">已上架</span>
            <span v-else-if="scope.row.status === 3">已下架</span>
          </template>
        </el-table-column>
        <el-table-column label="学习时间" min-width="80px">
          <template slot-scope="scope">
            {{ scope.row.studyStartTime | date("yyyy-MM-dd hh:mm") }}
            <span>
              -
            </span>
            {{ scope.row.studyEndTime | date("yyyy-MM-dd hh:mm") }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleAdd(scope.row)"
              v-if="!existedFilter(scope.row)"
            >
              选择
            </el-button>
            <el-button size="mini" v-if="existedFilter(scope.row)">
              已选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 表格 end -->
    <div style="height:70px"></div>
    <div class="footer-btn-container">
      <el-button size="mini" @click="$emit('close')">取消</el-button>
      <el-button
        size="mini"
        type="primary"
        @click="save"
        :disabled="submitDisable"
        >确定</el-button
      >
    </div>
    <el-dialog
      title="选择外聘讲师"
      width="836px"
      custom-class="public-dialog"
      :close-on-click-modal="false"
      :append-to-body="true"
      :visible.sync="selectTeacherDialog"
    >
      <select-library-teacher
        v-if="selectTeacherDialog"
        :id="lecturerLibraryId"
        :lecturerLibraryName="lecturerLibraryName"
        @confirm="confirmTeacherPopup"
        @cancel="selectTeacherDialog = false"
        @add="addTeacherPopup"
      >
      </select-library-teacher>
    </el-dialog>
    <el-drawer
      title="新增资料"
      :visible.sync="drawerCor"
      direction="rtl"
      size="40%"
      :close-on-press-escape="false"
      :show-close="true"
      :append-to-body="true"
      custom-class="public-drawer"
      :before-close="handleClose"
    >
      <library-add
        v-if="drawerCor"
        saveType="add"
        @close="drawerCloseCor"
        @confirm="drawerConfirm"
      >
      </library-add>
    </el-drawer>
  </div>
</template>

<script lang="ts" src="./class-schedule.ts"></script>

<style lang="scss" scoped>
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
  }
  .time-content {
    .el-input__inner {
      width: 160px !important;
    }
    .el-date-editor.el-input {
      width: 160px !important;
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
.pagination-container {
  text-align: center;
}
.lecturer-button {
  margin-left: 10px;
  padding: 3px 20px;
  color: #409eff;
  border-radius: 4px;
  border: 1px solid #409eff;
  text-align: center;
  cursor: pointer;
}
.lecturer-div {
  padding: 6px 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 12px;
  color: #606266;
  background: #f0f2f5;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
}
.footer-btn-container {
  height: 70px;
  line-height: 70px;
  text-align: center;
  bottom: 0px;
  margin-top: 30px;
  position: fixed;
  z-index: 999;
  background-color: #ffffff;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  left: 55%;
  width: 45%;
}
</style>
