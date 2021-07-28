<template>
  <div class="examination-statistics-report">
    <!--        查询-->
    <div
      style="padding-bottom: 10px;border-bottom: 1px solid rgba(220,223,230,1);"
      class="header-form"
    >
      <el-form :inline="true" label-width="110px" size="mini">
        <el-form-item label="中心">
          <el-select
            v-model="centerName"
            clearable
            multiple
            filterable
            collapse-tags
            size="mini"
            placeholder="请选择"
            @change="centerChange"
          >
            <el-option
              v-if="gmList.tagList.length > 0"
              label="全选"
              value="all"
            ></el-option>
            <el-option
              v-for="item in gmList.tagList"
              :key="item.tagCodeCollege"
              :label="item.tagName"
              :value="item.tagCodeCollege"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产业">
          <el-select
            v-model="productName"
            clearable
            multiple
            filterable
            collapse-tags
            size="mini"
            placeholder="请选择"
            @change="productChange"
          >
            <el-option
              v-if="productList.tagList.length > 0"
              label="全选"
              value="all"
            ></el-option>
            <el-option
              v-for="item in productList.tagList"
              :key="item.tagCodeCollege"
              :label="item.tagName"
              :value="item.tagCodeCollege"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学员">
          <el-select
            v-model="studentorname"
            filterable
            remote
            clearable
            reserve-keyword
            size="mini"
            placeholder="请输入学员名称/手机号"
            :remote-method="remoteMethodStu"
            :loading="studentLoading"
          >
            <el-option
              v-for="item in studentForm"
              :key="item.accountId"
              :label="item.accountName + '(' + phoneFilter(item.phone) + ')'"
              :value="item.accountId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司编码/名称" label-width="120px">
          <el-select
            v-model="organName"
            filterable
            clearable
            remote
            reserve-keyword
            size="mini"
            placeholder="请输入公司编码/名称"
            :remote-method="remoteMethodOrg"
            :loading="organizationLoading"
            style="width: 180px;"
          >
            <el-option
              v-for="item in organizationForm"
              :key="item.orgCode"
              :label="item.orgName + '(' + item.orgCode + ')'"
              :value="item.orgCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" plain @click="query()">查询</el-button>
          <el-button @click="reset()" type="" plain style="margin-left: 10px;"
            >重置</el-button
          >
        </el-form-item>
        <div class="clearfix">
          <el-form-item style="float: right">
            <el-button @click="onExportReport()">导出</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!--        表格-->
    <div>
      <!-- 已考试列表-->
      <el-table
        ref="table"
        header-cell-class-name="table-header-cell"
        v-loading="loading"
        :data="tableData"
        class="table-lecturer"
        fit
      >
        <el-table-column
          type="index"
          label="序号"
          min-width="70px"
        ></el-table-column>
        <el-table-column
          align="left"
          prop="gmName"
          min-width="200px"
          label="中心"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.gmName }}
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          min-width="200px"
          label="公司/部门"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.companyAbbreviation }}
            <span
              v-if="
                (scope.row.companyAbbreviation &&
                  scope.row.departmentAbbreviation) ||
                  (!scope.row.companyAbbreviation &&
                    !scope.row.departmentAbbreviation)
              "
              >-</span
            >
            {{ scope.row.departmentAbbreviation }}
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="companyCode"
          min-width="200px"
          label="公司编码"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.companyCode }}
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="accountName"
          min-width="200px"
          label="学员名称"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.accountName }}
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="accountCode"
          min-width="200px"
          label="学号"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.accountCode }}
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          v-if="studyTerminals === '1'"
          prop="industryName"
          min-width="200px"
          label="产业"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.industryName }}
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="examScore"
          min-width="200px"
          label="考试分数"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.examScore }}
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="examTime"
          min-width="200px"
          label="考试时间"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.examTime | date("yyyy-MM-dd hh:mm") }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--页面分页-->
    <div style="padding-top: 15px;text-align: center;" class="block">
      <el-pagination
        :current-page="currentChange"
        :page-size="10"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next,jumper"
        :total="listCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script src="./exam-complete.ts"></script>
<style lang="scss">
.examination-statistics-report {
  .el-tabs__item {
    width: 110px !important;
    text-align: center;
  }
}
</style>
<style scoped lang="scss">
.course-name {
  min-width: 20.1%;
  padding-left: 8px;
}
.courseNameZxy {
  min-width: 31.29%;
  padding-left: 8px;
}
.huihui-name {
  min-width: 15.8%;
  padding-left: 8px;
}
.huihuiNameZxy {
  min-width: 25.5%;
  padding-left: 8px;
}
.huihui {
  min-width: 11.7%;
  padding-left: 8px;
}
.huihuiZxy {
  min-width: 15.7%;
  padding-left: 8px;
}
.center {
  min-width: 11.7%;
  padding-left: 8px;
}
.centerZxy {
  min-width: 18.9%;
  padding-left: 8px;
}
.no-line-to {
  &::-webkit-scrollbar {
    display: none !important;
  }
}
.examination-statistics-report {
  position: relative;
  &::v-deep .table-header-cell .cell {
    color: #909399;
  }
  padding-bottom: 50px;
}
/*.organizationstr {*/
/*    overflow: hidden;*/
/*    text-overflow: ellipsis;*/
/*    white-space: nowrap;*/
/*}*/
</style>
