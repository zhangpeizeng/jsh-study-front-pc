<template>
  <div>
    <el-row type="flex" align="middle" :gutter="10" class="el-row">
      <el-col :span="2" class="text-right">
        <span class="text-title">课程名称</span>
      </el-col>
      <el-col :span="6">
        <el-input
          v-model="courseNameQry"
          placeholder="请输入"
          size="small"
          maxlength="40"
        ></el-input>
      </el-col>
      <el-col :span="4">
        <el-button size="small" type="primary" plain @click="courseQry">
          查询
        </el-button>
      </el-col>
    </el-row>
    <!-- 表格 start -->
    <div class="mt-10">
      <el-table
        :data="tableData"
        v-loading="loadingInTable"
        style="width: 100%"
        height="200"
        id="tableCourse"
      >
        <el-table-column label="序号" width="60px">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="课程名称" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>
              {{ scope.row.courseName }}【{{ scope.row.courseType }}】
            </span>
          </template>
        </el-table-column>
        <el-table-column label="讲师" width="70px">
          <template slot-scope="scope">
            {{ scope.row.lecturerName }}
          </template>
        </el-table-column>
        <el-table-column label="课程状态" width="90px">
          <template slot-scope="scope">
            {{ scope.row.statusStr }}
          </template>
        </el-table-column>
        <el-table-column label="学习时间" width="190px">
          <template slot-scope="scope">
            <span v-if="scope.row.studyStartTime">
              {{ scope.row.studyStartTime | date("yyyy-MM-dd hh:mm") }}至{{
                scope.row.studyEndTime | date("yyyy-MM-dd hh:mm")
              }}
            </span>
            <span v-else>
              -
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
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

    <div slot="footer" class="text-center mt-30">
      <el-button size="mini" @click="$emit('cancel')">取消</el-button>
      <el-button size="mini" type="primary" @click="save">确定</el-button>
    </div>
  </div>
</template>

<script lang="ts" src="./add-course.ts"></script>

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
  padding-top: 15px;
  text-align: center;
}
</style>
