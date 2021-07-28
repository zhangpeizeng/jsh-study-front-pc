<template>
  <div
    class="message-management"
    style="padding: 0 24px; background-color: #ffffff;min-height: 800px"
  >
    <div class="content-top">
      <span>课程名称：{{ courseName }}</span>
    </div>
    <div>
      <el-tabs v-model="studyTerminalCode" @tab-click="handleClick">
        <el-tab-pane v-if="tableFlag1" label="客户端" name="1"></el-tab-pane>
        <el-tab-pane v-if="tableFlag2" label="员工端" name="2"></el-tab-pane>
        <el-tab-pane v-if="tableFlag3" label="直销员端" name="3"></el-tab-pane>
        <el-tab-pane v-if="tableFlag4" label="售后端" name="4"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="mb-10 d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center">
        <div class="grade-span">{{ averageGrade }}分</div>
        <el-rate
          v-model="showGrade"
          disabled
          text-color="#ff9900"
          score-template="{value}"
        >
        </el-rate>
      </div>
      <div class="d-flex align-items-center">
        <i class="el-icon-warning-outline" style="color:#F56C6C"></i>
        <span style="font-size:12px;color:#FF0000;margin-left:5px"
          >可最多选择置顶5条评价，对应显示在学员端</span
        >
      </div>
    </div>
    <div class="table-body">
      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        size="small"
        header-cell-class-name="table-header-cell"
        style="width: 100%"
      >
        <el-table-column
          align="center"
          type="index"
          label="序号"
          min-width="100px"
        >
        </el-table-column>
        <el-table-column align="center" label="学员名称" min-width="130px">
          <template slot-scope="scope">
            <span> {{ scope.row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="公司/部门"
          min-width="180px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.companyAbbreviation">{{
              scope.row.companyAbbreviation
            }}</span>
            <span
              v-if="
                scope.row.companyAbbreviation &&
                  scope.row.departmentAbbreviation
              "
              >/</span
            >
            <span v-if="scope.row.departmentAbbreviation">{{
              scope.row.departmentAbbreviation
            }}</span>
            <span
              v-if="
                !scope.row.companyAbbreviation &&
                  !scope.row.departmentAbbreviation
              "
              >-</span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="userPhone"
          align="center"
          label="学员手机号"
          min-width="130px"
        ></el-table-column>
        <el-table-column
          prop="grade"
          align="center"
          label="评分"
          min-width="130px"
        ></el-table-column>
        <el-table-column
          prop="content"
          align="left"
          :show-overflow-tooltip="true"
          label="评论内容"
          min-width="130px"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="评价时间"
          min-width="100px"
        >
          <template slot-scope="scope">
            <div>{{ time(scope.row.createTime) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="likeNum"
          align="center"
          label="点赞数"
          min-width="130px"
        ></el-table-column>
        <el-table-column label="操作" min-width="200px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="operation(scope.row.reviewId, 2)"
              v-if="scope.row.isTop == 0"
            >
              置顶
            </el-button>
            <el-button
              size="mini"
              @click="operation(scope.row.reviewId, 1)"
              v-if="scope.row.isTop == 1"
            >
              取消置顶
            </el-button>
            <el-button
              size="mini"
              @click="operation(scope.row.reviewId, 3)"
              v-if="scope.row.status == 1"
            >
              屏蔽
            </el-button>
            <el-button
              size="mini"
              @click="operation(scope.row.reviewId, 4)"
              v-if="scope.row.status == 0"
            >
              公开
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-contain">
        <el-pagination
          @size-change="onPageSizeChange"
          @current-change="onCurrentPageChange"
          :current-page="pages"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="rows"
          layout="total,sizes, prev, pager, next,jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!--end导入部分-->
    <div style="position: absolute">
      <div class="footer-bottom-container">
        <template>
          <el-button size="mini" @click="btnColse()">关闭</el-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./evaluation-management.ts"></script>
<style lang="scss">
.message-management {
  .el-tabs__active-bar {
    min-width: 42px !important;
  }
}
</style>
<style lang="scss" scoped>
.grade-span {
  color: #f5a623;
  margin-right: 10px;
}
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

.lecturer {
  display: inline-block;
  color: #409eff;
  font-size: 12px;
  width: 37px;
  height: 20px;
  line-height: 20px;
  margin-left: 5px;
  text-align: center;
  background: rgba(236, 245, 255, 1);
  border: 1px solid rgba(64, 158, 255, 1);
}

.dialog-footer {
  text-align: center;
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
