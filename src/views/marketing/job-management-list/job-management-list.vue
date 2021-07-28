<template>
  <div class="brand-list">
    <el-tabs
      v-model="studyTerminalCode"
      type="card"
      @tab-click="handleClick"
      class="classify-tab"
    >
      <el-tab-pane
        v-for="(item, index) in terminalList"
        :key="index"
        :label="item.labelName"
        :name="item.labelCode"
      ></el-tab-pane>
    </el-tabs>
    <div class="header-form">
      <el-form :inline="true" label-width="70px" size="mini">
        <el-form-item v-if="studyTerminalCode === '1'" label="中心">
          <el-select
            v-model="centerName"
            clearable
            multiple
            filterable
            collapse-tags
            size="mini"
            placeholder="请选择"
            style="width: 200px;"
            @change="centerChange"
          >
            <el-option
              label="全选"
              value="all"
              v-if="gmList.tagList.length > 0"
            ></el-option>
            <el-option
              v-for="item in gmList.tagList"
              :key="item.tagCodeCollege"
              :label="item.tagName"
              :value="item.tagCodeCollege"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="studyTerminalCode === '1'" label="产业">
          <el-select
            v-model="cyCodeList"
            clearable
            multiple
            filterable
            collapse-tags
            size="mini"
            placeholder="请选择"
            style="width: 200px;"
            @change="cyChange"
          >
            <el-option
              label="全选"
              value="all"
              v-if="cyList.tagList.length > 0"
            ></el-option>
            <el-option
              v-for="item in cyList.tagList"
              :key="item.tagCodeCollege"
              :label="item.tagName"
              :value="item.tagCodeCollege"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="studyTerminalCode !== '1'" label="公司">
          <el-select
            v-model="centerName"
            clearable
            multiple
            filterable
            collapse-tags
            size="mini"
            placeholder="请选择"
            style="width: 200px;"
            @change="centerChange"
          >
            <el-option
              label="全选"
              value="all"
              v-if="gmList.tagList.length > 0"
            ></el-option>
            <el-option
              v-for="item in gmList.tagList"
              :key="item.tagCodeCollege"
              :label="item.tagName"
              :value="item.tagCodeCollege"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="studyTerminalCode !== '1'" label="部门">
          <el-select
            v-model="cyCodeList"
            clearable
            multiple
            filterable
            collapse-tags
            size="mini"
            placeholder="请选择"
            style="width: 200px;"
            @change="cyChange"
          >
            <el-option
              label="全选"
              value="all"
              v-if="cyList.tagList.length > 0"
            ></el-option>
            <el-option
              v-for="item in cyList.tagList"
              :key="item.tagCodeCollege"
              :label="item.tagName"
              :value="item.tagCodeCollege"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学员">
          <el-select
            v-if="studyTerminalCode == '1'"
            v-model="accountId"
            filterable
            remote
            reserve-keyword
            clearable
            size="mini"
            placeholder="请输入学员名称/手机号"
            :remote-method="remoteMethod"
            :loading="loading"
            style="width:200px"
          >
            <el-option
              v-for="item in options"
              :key="item.accountId"
              :label="item.accountName + '(' + phoneFilter(item.phone) + ')'"
              :value="item.accountId"
            >
            </el-option>
          </el-select>
          <el-select
            v-if="studyTerminalCode !== '1'"
            v-model="accountId"
            filterable
            remote
            reserve-keyword
            clearable
            size="mini"
            placeholder="请输入学员名称/学号"
            :remote-method="remoteMethod"
            :loading="loading"
            style="width:200px"
          >
            <el-option
              v-for="item in options"
              :key="item.accountId"
              :label="item.accountName + '(' + item.huiHuiNumber + ')'"
              :value="item.accountId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form :inline="true" label-width="70px" size="mini">
        <el-form-item label="状态">
          <el-select
            v-model="status"
            placeholder="请选择"
            style="width:200px"
            filterable
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="待批改" value="0"></el-option>
            <el-option label="已批改" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司" v-if="studyTerminalCode == '1'">
          <el-select
            v-model="orgCode"
            clearable
            filterable
            remote
            reserve-keyword
            size="mini"
            placeholder="请输入公司名称/编码"
            :remote-method="remoteMethodOrg"
            style="width:200px"
          >
            <el-option
              v-for="item in orgCodeList"
              :key="item.orgCode"
              :label="item.orgName + '(' + item.orgCode + ')'"
              :value="item.orgCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程">
          <el-input
            v-model="courseName"
            clearable
            placeholder="请输入课程名称"
            maxlength="30"
            style="width: 200px;"
            @input="courseName = courseName.replace(/^ +| +$/g, '')"
          ></el-input>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" @click="onSearch" plain>查询</el-button>
          <el-button type="" @click="clear" plain style="margin-left: 10px;"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="body">
      <!--统计区域-->
      <el-row :gutter="20" style="margin-bottom: 20px;">
        <el-col :span="12">
          <div
            style="width: 100%;height: 80px;border-radius: 4px;border: 1px solid #DCDFE6;text-align: center"
          >
            <div
              style="width: 100%;height: 20px;font-size: 20px;font-family: PingFangSC-Regular, 'PingFang SC';font-weight: 500;color: #303133;line-height: 50px;"
            >
              {{ submitNum }}
            </div>
            <span
              style="width: 100%;height: 16px;font-size: 16px;font-weight: 400;font-family: PingFangSC-Regular, 'PingFang SC';color: #606266;line-height: 65px;"
            >
              已提交作业数
              <el-tooltip
                effect="dark"
                placement="top-start"
                :enterable="false"
                :offset="10"
                content="当前学习终端，布置的作业中已提交的数量"
              >
                <img
                  src="../../../assets/images/icon-help.png"
                  style="width: 14px;height: 14px;margin-top: -1px;"
                />
              </el-tooltip>
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div
            style="width: 100%;height: 80px;border-radius: 4px;border: 1px solid #DCDFE6;text-align:center;"
          >
            <div
              style="width: 100%;height: 20px;font-size: 20px;font-family: PingFangSC-Regular, 'PingFang SC';font-weight: 500;color: #303133;line-height: 50px;"
            >
              {{ unCorrectNum }}
            </div>
            <span
              style="width: 100%;height: 16px;font-size: 16px;font-weight: 400;font-family: PingFangSC-Regular, 'PingFang SC';color: #606266;line-height: 65px;"
            >
              未批改作业数
              <el-tooltip
                effect="dark"
                placement="top-start"
                :enterable="false"
                :offset="10"
                content="当前学习终端，布置的作业中已提交未批改的数量"
              >
                <img
                  src="../../../assets/images/icon-help.png"
                  style="width: 14px;height: 14px;margin-top: -1px;"
                />
              </el-tooltip>
            </span>
          </div>
        </el-col>
      </el-row>
      <!--导出按钮区域-->
      <el-button
        class="mb-15"
        type="primary"
        size="medium"
        plain
        @click="onExportReport('statistics')"
        >导出</el-button
      >
      <!--课程统计报表表格区域-->
      <el-table
        v-loading="loadingTable"
        :data="tableData"
        ref="table"
        header-cell-class-name="table-header-cell"
      >
        <el-table-column
          align="left"
          type="index"
          label="序号"
          min-width="70px"
        ></el-table-column>
        <el-table-column
          align="left"
          prop="courseName"
          label="课程名称"
          min-width="200px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.courseName !== null">{{
              scope.row.courseName
            }}</span>
            <span v-if="scope.row.courseName === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="studyTerminalCode == '1'"
          align="left"
          prop="gmName"
          label="中心"
          min-width="150px"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          align="left"
          prop="organizationCode"
          label="公司编码"
          min-width="120px"
          v-if="studyTerminalCode == '1'"
        >
        </el-table-column>
        <el-table-column
          align="left"
          :show-overflow-tooltip="true"
          prop="organizationName"
          label="公司/部门"
          width="200px"
          v-if="studyTerminalCode == '1'"
        >
          <template slot-scope="scope">
            <span
              >{{ scope.row.organizationName }}
              <span
                v-if="
                  (scope.row.organizationName && scope.row.departmentName) ||
                    (!scope.row.organizationName && !scope.row.departmentName)
                "
                >-</span
              >
              {{ scope.row.departmentName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          v-if="studyTerminalCode == '1'"
          align="left"
          prop="cyName"
          label="产业"
          min-width="160px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.cyName }} </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="studyTerminalCode !== '1'"
          align="left"
          label="公司/部门"
          min-width="160px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span
              >{{ scope.row.gmName }}
              <span v-if="scope.row.gmName && scope.row.cyName">-</span>
              {{ scope.row.cyName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="accountName"
          label="学员名称"
          min-width="160px"
        >
        </el-table-column>
        <el-table-column
          align="left"
          prop="huiHuiNumber"
          label="学号"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          align="left"
          prop="telephone"
          label="学员手机号"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column align="left" label="作业提交时间" min-width="200px">
          <template slot-scope="scope">
            <span v-if="scope.row.submitTime !== null"
              >{{ scope.row.submitTime }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="isPk"
          label="是否参与PK"
          min-width="100px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.isPk == 0">否</span>
            <span v-if="scope.row.isPk == 1">是</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="correctTime"
          label="作业批改时间"
          min-width="200px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.correctTime !== null"
              >{{ scope.row.correctTime }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="批改人" min-width="180px">
          <template slot-scope="scope">
            <span v-if="scope.row.correctUser && scope.row.correctUserId"
              >{{ scope.row.correctUser }}({{ scope.row.correctUserId }})</span
            >
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="completionRate"
          label="批改结果"
          min-width="100px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.isQualified == 1">合格</span>
            <span v-if="scope.row.isQualified == 0">不合格</span>
            <span v-if="!scope.row.isQualified && scope.row.isQualified !== 0"
              >-</span
            >
          </template>
        </el-table-column>
        <el-table-column align="left" label="分值" min-width="120px">
          <template slot-scope="scope">
            <span v-if="scope.row.score || scope.row.score === 0">{{
              scope.row.score
            }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="remark"
          label="评语"
          min-width="200px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.remark">{{ scope.row.remark }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="状态" min-width="120px">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">待批改</span>
            <span v-if="scope.row.status === 1">已批改</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          align="left"
          prop="homeworkSubmitNum"
          label="操作"
          min-width="150px"
        >
          <template slot-scope="scope">
            <el-button size="mini" @click="look(scope.row)">查看</el-button>
            <el-button
              size="mini"
              v-if="scope.row.status != 1"
              @click="correction(scope.row)"
              >批改</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="onPageSizeChange"
        @current-change="onCurrentPageChange"
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="rows"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <el-drawer
      title="作业查看"
      :visible.sync="drawer"
      direction="rtl"
      size="35%"
      :close-on-press-escape="false"
      :show-close="false"
      custom-class="public-drawer"
      :before-close="handleClose1"
    >
      <job-view
        v-if="drawer"
        :id="jobId"
        :accountName="jobAccountName"
        @close="drawerClose"
      >
      </job-view>
    </el-drawer>
    <el-drawer
      title="作业批改"
      :visible.sync="drawerCor"
      direction="rtl"
      size="35%"
      :close-on-press-escape="false"
      :show-close="true"
      custom-class="public-drawer"
      :before-close="handleClose"
    >
      <job-correcting
        v-if="drawerCor"
        :id="jobId"
        :accountName="jobAccountName"
        @close="drawerCloseCor"
      >
      </job-correcting>
    </el-drawer>
  </div>
</template>
<script lang="ts" src="./job-management-list.ts"></script>

<style lang="scss">
.classify-tab {
  .el-tabs__item {
    width: 110px;
    text-align: center;
  }
}
</style>

<style lang="scss" scoped>
.no-line-to {
  &::-webkit-scrollbar {
    display: none !important;
  }
}
.brand-list {
  padding: 24px 20px 20px 20px;
  .classify-tab {
    padding-bottom: 5px;
  }
  .header-form {
    padding-bottom: 6px;
    border-bottom: 1px solid #dcdfe6;

    .el-button {
      margin-left: 40px;
      padding-left: 20px;
      padding-right: 20px;
    }
  }
  .no-data-box {
    margin-top: 60px;
    padding-bottom: 100px;
    text-align: center;
    img {
      width: 220px;
      height: 220px;
    }
  }
  .body {
    padding-top: 20px;
    position: relative;
    &::v-deep .table-header-cell .cell {
      color: #909399;
    }

    .brand-logo {
      width: 100px;
      height: 56px;
      object-position: center;
      border-radius: 2px;
      object-fit: cover;
    }
    .brand-text {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .el-pagination {
      margin-top: 20px;
      text-align: center;
    }
  }
  .date-item {
    .el-input__inner {
      width: 130px !important;
    }
    .el-date-editor.el-input {
      width: 130px !important;
    }
  }
}
</style>
