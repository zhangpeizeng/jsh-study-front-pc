<template>
  <div>
    <div class="table-body">
      <el-form
        size="mini"
        ref="form"
        :inline="true"
        v-model="homeworkCorrectionForm"
        label-width="84px"
        style="overflow: hidden"
        @submit.native.prevent
      >
        <div class="student-class clearfloat">
          <el-form-item v-if="terminal == '1'" label="中心" class="float-left">
            <el-select
              v-model="centerName"
              clearable
              multiple
              filterable
              collapse-tags
              size="mini"
              placeholder="请选择"
              style="width: 240px;"
              @change="centerChange"
            >
              <el-option label="全选" value="all"></el-option>
              <el-option
                v-for="item in gmList.tagList"
                :key="item.tagCodeCollege"
                :label="item.tagName"
                :value="item.tagCodeCollege"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-else label="公司" class="float-left">
            <el-select
              v-model="centerName"
              clearable
              multiple
              filterable
              collapse-tags
              size="mini"
              placeholder="请选择"
              style="width: 240px;"
              @change="centerChange"
            >
              <el-option label="全选" value="all"></el-option>
              <el-option
                v-for="item in gmList.tagList"
                :key="item.tagCodeCollege"
                :label="item.tagName"
                :value="item.tagCodeCollege"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item style="float: right">
          <el-button
            @click="getCorrections"
            type="primary"
            plain
            :disabled="isshow"
            >查询</el-button
          >
          <el-button @click="onExportSellerAlready">导出</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="homeworkCorrectionForm"
        v-loading="loading"
        stripe
        size="small"
        header-cell-class-name="table-header-cell"
        style="width: 100%"
      >
        <el-table-column
          align="left"
          type="index"
          label="序号"
          min-width="70px"
        >
        </el-table-column>
        <el-table-column
          prop="gmName"
          align="left"
          label="公司"
          min-width="150"
        ></el-table-column>
        <el-table-column
          prop="studyNum"
          align="left"
          label="学习学员数"
          min-width="250"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="submitNum"
          align="left"
          label="作业提交数"
          min-width="150"
        ></el-table-column>
        <el-table-column
          prop="submitRateUntreated"
          align="left"
          label="作业提交率"
          min-width="150"
        ></el-table-column>
        <el-table-column
          prop="correctNum"
          align="left"
          label="作业批改数"
          min-width="150"
        ></el-table-column>
        <el-table-column
          prop="correctRateUntreated"
          align="left"
          label="作业批改率"
          min-width="150"
        ></el-table-column>
      </el-table>
      <div class="page-contain">
        <el-pagination
          @size-change="onSellerNoStudyPageSizeChange"
          @current-change="onSellerNoStudyCurrentPageChange"
          :current-page="pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total,sizes, prev, pager, next,jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./correction.ts"></script>
<style lang="scss" scoped>
.page-contain {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 60px;
}
.table-body {
  td {
    color: #606266;
  }
  &::v-deep .table-header-cell .cell {
    color: #909399;
  }
}
</style>
