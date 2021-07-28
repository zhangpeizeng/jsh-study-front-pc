<template>
  <div style="padding: 0 24px; background-color: #ffffff;min-height: 800px;">
    <div class="content-top">
      <span>课程名称：{{ courseName }}</span>
    </div>
    <div class="application">
      <el-tabs v-model="studyTerminalCode" @tab-click="handleClick">
        <el-tab-pane v-if="tableFlag1" label="客户端" name="1"></el-tab-pane>
        <el-tab-pane v-if="tableFlag2" label="员工端" name="2"></el-tab-pane>
        <el-tab-pane v-if="tableFlag3" label="直销员端" name="3"></el-tab-pane>
        <el-tab-pane v-if="tableFlag4" label="售后端" name="4"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="mb-10">
      <el-button type="primary" @click="onExportCustomer">导出</el-button>
    </div>
    <div class="table-body">
      <el-table
        :data="customerTableData"
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
          v-if="studyTerminalCode == '1'"
          prop="gmName"
          align="left"
          label="中心"
        />
        <el-table-column
          align="left"
          label="公司/部门"
          v-if="studyTerminalCode !== '1'"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.gmName }}</span>
            <span v-if="scope.row.gmName && scope.row.cyName">-</span>
            <span>{{ scope.row.cyName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="organizationCode"
          align="left"
          label="公司编码"
          v-if="studyTerminalCode == '1'"
        ></el-table-column>
        <el-table-column
          prop="organizationName"
          align="left"
          label="公司/部门"
          min-width="150px"
          v-if="studyTerminalCode == '1'"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.organizationName != null">{{
              scope.row.organizationName
            }}</span>
            <span
              v-if="
                (scope.row.organizationName != null &&
                  scope.row.departmentName != null) ||
                  (scope.row.organizationName == null &&
                    scope.row.departmentName == null)
              "
            >
              -
            </span>
            <span v-if="scope.row.departmentName != null">{{
              scope.row.departmentName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="学员名称"
          :render-header="tableAction"
          align="left"
        >
          <!--scope 即为 userList  scope.row即为当前行数据 -->
          <template slot-scope="scope">
            <div>{{ scope.row.accountName }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="employeeId"
          align="left"
          label="学号"
        ></el-table-column>
        <el-table-column
          prop="signUpTime"
          align="left"
          label="报名时间"
        ></el-table-column>
      </el-table>
      <div class="page-contain">
        <el-pagination
          @size-change="onCustomerTablePageSizeChange"
          @current-change="onCustomerTableCurrentPageChange"
          :current-page="customerPages"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="customerRows"
          layout="total,sizes, prev, pager, next,jumper"
          :total="customerTotal"
        >
        </el-pagination>
      </div>
    </div>
    <!--end导入部分-->
    <div class="footer-bottom-container">
      <template>
        <el-button size="mini" @click="btnClose()">关闭</el-button>
      </template>
    </div>
  </div>
</template>

<script lang="ts" src="./application-list.ts"></script>

<style lang="scss">
.application {
  .el-tabs__active-bar {
    min-width: 42px !important;
  }
}
</style>
<style lang="scss" scoped>
.content-top {
  span {
    background: #f2f2f2;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #606266;
    padding: 3px 14px;
    display: inline-block;
  }
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
      padding: 4px 14px;
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
.title {
  position: relative;
  display: inline-block;
  margin-bottom: 24px;
  padding: 7px 30px 7px 50px;
  color: #303133;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: bold;
  font-size: 16px;
  background: #f2f2f2;
  border-radius: 0 100px 100px 0;

  &::before {
    content: "";
    position: absolute;
    top: 14px;
    left: 22px;
    width: 12px;
    height: 12px;
    background: #555555;
    transform: rotateZ(45deg);
  }
}
</style>
