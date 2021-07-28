<template>
  <div>
    <el-row type="flex" align="middle" :gutter="10" class="el-row">
      <el-col :span="2" class="text-right">
        <span class="text-title">讲师</span>
      </el-col>
      <el-col :span="6">
        <el-input
          v-model="lecturerName"
          placeholder="请输入讲师姓名"
          size="small"
          maxlength="20"
        ></el-input>
      </el-col>
      <el-col :span="4">
        <el-button size="small" type="primary" plain @click="tracherQry">
          查询
        </el-button>
      </el-col>
    </el-row>
    <div>
      <el-button size="small" type="primary" @click="addTeacher">
        新增讲师
      </el-button>
    </div>
    <!-- 表格 start -->
    <div class="mt-10">
      <el-table
        class="mb-10"
        :data="tableData"
        v-loading="loadingInTable"
        style="width: 100%"
        height="270"
      >
        <el-table-column
          label="讲师"
          min-width="150px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.lecturerName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="简介"
          min-width="150px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.lecturerDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人" min-width="100px">
          <template slot-scope="scope">
            <span
              >{{ scope.row.createName }}（{{
                scope.row.createhuiHuiNumber
              }}）</span
            >
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
          :current-page="pageNum"
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

<script lang="ts" src="./select-library-teacher.ts"></script>

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
</style>
