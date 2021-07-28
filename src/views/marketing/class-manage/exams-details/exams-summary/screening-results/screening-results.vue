<template>
  <div>
    <div class="btn_export-box">
      <el-button
        class="summary-screen_btn btn_export"
        size="mini"
        type="primary"
        @click="exportExamSummary"
        >导出</el-button
      >
    </div>
    <div class="screen-results">
      <el-table
        class="screen-results-table"
        :data="tableData"
        v-loading="tableLoading"
        style="width: 100%"
      >
        <template slot="empty">
          <div class="screen-results_empty">
            <img
              class="screen-results_empty-pic"
              src="@/assets/images/table_default.png"
              alt=""
            />
            <span class="screen-results_empty-text">暂无数据</span>
          </div>
        </template>
        <el-table-column type="index" label="序号" width="50px">
        </el-table-column>
        <el-table-column
          prop="gmName"
          label="中心"
          :show-overflow-tooltip="true"
          :width="isExam ? 108 : 175"
        >
        </el-table-column>
        <el-table-column
          prop="companyCode"
          label="公司编码"
          :width="isExam ? 171 : 261"
        >
        </el-table-column>
        <el-table-column
          prop="companyName"
          label="公司/部门"
          :show-overflow-tooltip="true"
          :width="isExam ? 180 : 260"
          v-if="studyTerminalCode == TERMINAL_TYPE.CLIENT"
        >
        </el-table-column>
        <el-table-column
          prop="studentName"
          label="学员名称"
          :width="isExam ? 133 : 163"
        >
        </el-table-column>
        <el-table-column
          prop="huiHuiNumber"
          label="学号"
          :width="isExam ? 156 : 196"
        >
        </el-table-column>
        <el-table-column
          prop="cyName"
          label="产业"
          :show-overflow-tooltip="true"
          :width="
            isExam
              ? studyTerminalCode == TERMINAL_TYPE.CLIENT
                ? 130
                : 310
              : studyTerminalCode == TERMINAL_TYPE.CLIENT
              ? 53
              : 313
          "
        >
        </el-table-column>
        <el-table-column
          prop="score"
          label="考试分数"
          width="106"
          v-if="isExam"
        >
        </el-table-column>
        <el-table-column label="考试时间" width="146" v-if="isExam">
          <template slot-scope="scope">
            {{ scope.row.examTime | date("yyyy-MM-dd") }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页器 -->

    <div class="el-pagination_box">
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
  </div>
</template>

<script lang="ts" src="./screening-results.ts"></script>

<style lang="scss" scoped>
.btn_export-box {
  .btn_export {
    border-radius: 4px;
  }
}
.screen-results {
  margin-top: 15px;
  .screen-results_empty {
    .screen-results_empty-pic {
      width: 40px;
    }
    .screen-results_empty-text {
      margin-left: 10px;
      font-size: 14px;
      color: #969799;
      line-height: 20px;
    }
  }
}
.el-pagination_box {
  text-align: center;
  width: 100%;
  margin-top: 20px;
  bottom: 39px;
}
</style>
