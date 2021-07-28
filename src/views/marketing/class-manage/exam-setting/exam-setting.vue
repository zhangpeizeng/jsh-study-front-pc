<template>
  <div class="brand-list">
    <div class="header-form">
      <el-form :inline="true" label-width="80px" size="mini">
        <el-form-item label="考试">
          <el-input
            style="width:240px"
            v-model="examTheme"
            clearable
            placeholder="请输入考试主题"
            maxlength="20"
            @input="examTheme = examTheme.replace(/^ +| +$/g, '')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch()" plain>查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="body">
      <div class="mb-15">
        <el-button
          type="primary"
          @click="gotoadd()"
          size="medium"
          icon="el-icon-circle-plus-outline"
          >新建考试</el-button
        >
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        header-cell-class-name="table-header-cell"
      >
        <el-table-column label="序号" width="100px">
          <template slot-scope="scope">
            <div class="table-index">
              <div>
                {{ scope.$index + 1 }}
              </div>
              <div class="table-icon">
                <i
                  class="el-icon-arrow-up cursor"
                  @click="tabUp(scope.row, scope.$index)"
                ></i>
                <i
                  class="el-icon-arrow-down cursor"
                  @click="tabDown(scope.row, scope.$index)"
                ></i>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="考试主题"
          :show-overflow-tooltip="true"
          min-width="180px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.examTheme }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="考试时间" min-width="300px">
          <template slot-scope="scope">
            <span v-if="scope.row.testStartTime"
              >{{ scope.row.testStartTime | date("yyyy-MM-dd hh:mm") }}至{{
                scope.row.testEndTime | date("yyyy-MM-dd hh:mm")
              }}</span
            >
            <span v-if="!scope.row.testStartTime">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="允许补考" min-width="120px">
          <template slot-scope="scope">
            <span v-if="scope.row.fillTestStatus === 0">否</span>
            <span v-if="scope.row.fillTestStatus === 1">是</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="补考时间" min-width="300px">
          <template slot-scope="scope">
            <span v-if="scope.row.fillTestStartTime"
              >{{ scope.row.fillTestStartTime | date("yyyy-MM-dd hh:mm") }}至{{
                scope.row.fillTestEndTime | date("yyyy-MM-dd hh:mm")
              }}</span
            >
            <span v-if="!scope.row.fillTestStartTime">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="达标分" min-width="110px">
          <template slot-scope="scope">
            <span>{{ scope.row.totalvalueLimit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="250px">
          <template slot-scope="scope">
            <el-button size="mini" @click="gotoDetail(scope.row)" plain>
              详情
            </el-button>
            <el-button size="mini" @click="gotoupdate(scope.row)" plain>
              修改
            </el-button>
            <el-button size="mini" @click="gotodelete(scope.row)" plain>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="onpageNumNumChange"
        @size-change="onpageNumSizeChange"
        :page-sizes="[10, 20, 50, 100]"
        :current-page="pageNum"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <div class="footer-bottom-container">
      <template>
        <el-button size="mini" @click="$router.go(-1)">返回</el-button>
      </template>
    </div>
    <el-drawer
      :title="drawerName"
      :visible.sync="drawerCor"
      direction="rtl"
      size="50%"
      :close-on-press-escape="false"
      :show-close="true"
      custom-class="public-drawer"
      :before-close="handleClose"
      :wrapperClosable="false"
    >
      <new-examination
        v-if="drawerCor"
        :id="examId"
        :classId="classId"
        :studyTerminalCode="studyTerminalCode"
        @cancel="drawerCloseCor"
        @confirm="drawerConfirm"
      ></new-examination>
    </el-drawer>
  </div>
</template>

<script lang="ts" src="./exam-setting.ts"></script>

<style lang="scss" scoped>
.brand-list {
  padding: 24px 20px 20px 20px;

  .header-form {
    padding-bottom: 6px;
    border-bottom: 1px solid #dcdfe6;

    .el-button {
      padding-left: 20px;
      padding-right: 20px;
    }
  }

  .body {
    padding-top: 20px;
    position: relative;
    &::v-deep .table-header-cell .cell {
      color: #909399;
    }
    .el-pagination {
      margin-top: 20px;
      text-align: center;
    }
  }
}
.table-index {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .table-icon {
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .el-icon-arrow-up:hover {
    color: #0486fe;
  }
  .el-icon-arrow-down:hover {
    color: #0486fe;
  }
  .cursor {
    cursor: pointer;
  }
}
</style>
