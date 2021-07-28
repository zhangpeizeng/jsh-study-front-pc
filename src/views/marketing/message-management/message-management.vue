<template>
  <div
    class="message-management"
    style="padding: 0 24px; background-color: #ffffff;min-height: 800px"
  >
    <div class="content-top">课程名称：{{ courseName }}</div>
    <div>
      <el-tabs v-model="studyTerminalCode" @tab-click="handleClick">
        <el-tab-pane v-if="tableFlag1" label="客户端" name="1"></el-tab-pane>
        <el-tab-pane v-if="tableFlag2" label="员工端" name="2"></el-tab-pane>
        <el-tab-pane v-if="tableFlag3" label="直销员端" name="3"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="mb-10">
      <el-button @click="dialogFormVisible = true" type="primary"
        >我要留言
      </el-button>
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
        <el-table-column align="center" type="index" label="序号" width="100">
        </el-table-column>
        <el-table-column align="center" label="学员/讲师名称">
          <template slot-scope="scope">
            <span
              v-if="scope.row.contentUserType == 1"
              style="margin-left: 10px"
              >{{ scope.row.contentUserName }}({{
                scope.row.contentEmployeeId
              }})
              <span class="lecturer">讲师</span>
            </span>
            <span
              v-if="scope.row.contentUserType != 1"
              style="margin-left: 10px"
            >
              {{ scope.row.contentUserName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="contentUserTelephone"
          align="center"
          label="学员/讲师手机号"
        ></el-table-column>
        <el-table-column
          prop="content"
          align="left"
          :show-overflow-tooltip="true"
          label="留言内容"
        ></el-table-column>
        <el-table-column prop="createTime" align="center" label="留言时间">
          <template slot-scope="scope">
            <div>{{ time(scope.row.createTime) }}</div>
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
    <!--    留言弹框-->
    <el-dialog title="我要留言" :visible.sync="dialogFormVisible">
      <el-input
        type="textarea"
        :autosize="{ minRows: 10, maxRows: 10 }"
        placeholder="最多输入120字"
        v-model="leavingMsg"
        maxlength="120"
        show-word-limit
      >
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel" size="small">取 消</el-button>
        <el-button
          type="primary"
          @click="submission"
          size="small"
          :disabled="shake"
          >提 交
        </el-button>
      </div>
    </el-dialog>
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

<script lang="ts" src="./message-management.ts"></script>
<style lang="scss">
.message-management {
  .el-tabs__active-bar {
    min-width: 42px !important;
  }
}
</style>
<style lang="scss" scoped>
.content-top {
  margin: 15px 0;
  color: #000000;
  font-size: 20px;
  font-weight: 600;
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
