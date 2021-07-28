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
      <el-form :inline="true" label-width="100px" size="mini">
        <el-form-item v-if="studyTerminalCode === '1'" label="中心">
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
        <el-form-item v-if="studyTerminalCode === '1'" label="产业">
          <el-select
            v-model="cyCodeList"
            clearable
            multiple
            filterable
            collapse-tags
            size="mini"
            placeholder="请选择"
            style="width: 240px;"
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
        <el-form-item v-if="studyTerminalCode !== '1'" label="部门">
          <el-select
            v-model="cyCodeList"
            clearable
            multiple
            filterable
            collapse-tags
            size="mini"
            placeholder="请选择"
            style="width: 240px;"
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
        <el-form-item style="float: right;">
          <el-button type="primary" @click="onSearch" plain>查询</el-button>
          <el-button type="" @click="clear" plain style="margin-left: 10px;"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-form :inline="true" label-width="100px" size="mini">
        <el-form-item label="公司" v-if="studyTerminalCode == '1'">
          <el-select
            v-model="orgCode"
            clearable
            filterable
            remote
            reserve-keyword
            size="mini"
            placeholder="请输入组织名称/编码"
            :remote-method="remoteMethodOrg"
            style="width:240px"
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
            style="width: 240px;"
            @input="courseName = courseName.replace(/^ +| +$/g, '')"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <!--吸顶表头-->
    <div
      v-show="isShow"
      style="position: fixed;width: calc(100% - 200px);left: 180px;top: 70px;z-index: 9;background:#FFFFFF;padding-right: 20px;"
    >
      <div
        id="read"
        @scroll="scrollEvent"
        class="no-line-to"
        style="white-space: nowrap;-webkit-overflow-scrolling: touch;height: 40px;overflow-x: auto;overflow-y: hidden;line-height: 40px;text-align: left;color: #909399"
      >
        <div
          class="d-flex"
          style="width: 100%;"
          v-if="studyTerminalCode == '1'"
        >
          <div style="min-width: 70px;padding-left: 30px;">序号</div>
          <div style="min-width: 200px;padding-left: 8px;">课程名称</div>
          <div style="min-width: 150px;padding-left: 8px;">中心</div>
          <div style="min-width: 150px;padding-left: 8px;">
            公司编码
          </div>
          <div style="min-width: 200px;padding-left: 8px;">
            公司/部门
          </div>
          <div style="min-width: 150px;padding-left: 8px;">学员名称</div>
          <div style="min-width: 150px;padding-left: 8px;">学号</div>
          <div style="min-width: 200px;padding-left: 8px;">
            产业
          </div>
          <div style="min-width: 250px;padding-left: 8px;">报名时间</div>
        </div>
        <div
          class="d-flex"
          style="width: 100%;"
          v-if="studyTerminalCode !== '1'"
        >
          <div style="width: 5.4%;padding-left: 30px;">序号</div>
          <div style="width: 21.3%;padding-left: 8px;">课程名称</div>
          <div style="width: 31.4%;padding-left: 8px;">公司/部门</div>
          <!--          <div style="width: 21.1%;padding-left: 8px;">-->
          <!--            产业-->
          <!--          </div>-->
          <div style="width: 10.5%;padding-left: 8px;">学员名称</div>
          <div style="width: 10.4%;padding-left: 8px;">学号</div>
          <div style="width: 20%;padding-left: 8px;">报名时间</div>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="d-flex align-items-center justify-content-between mb-15">
        <div class="d-flex align-items-center">
          <!--导出按钮区域-->
          <el-button
            type="primary"
            size="medium"
            plain
            @click="onExportReport()"
            >导出</el-button
          >
          <div style="color:#606266;margin-left:20px">
            报名人数：{{ total }}人
          </div>
        </div>
        <div class="d-flex align-items-center">
          <div style="color: #909399;font-size: 12px;margin-right: 10px">
            <img
              src="../../../assets/images/icon-help.png"
              style="width:14px;height:14px;margin-right:3px"
            />
            此统计为实时数据
          </div>
        </div>
      </div>

      <!--课程统计报表表格区域-->
      <el-table
        v-loading="loading"
        :data="tableData"
        ref="table"
        v-if="studyTerminalCode == '1'"
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
          :show-overflow-tooltip="true"
          align="left"
          prop="gmName"
          label="中心"
          min-width="150px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.gmName !== null">{{ scope.row.gmName }}</span>
            <span v-if="scope.row.gmName === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="organizationCode"
          label="公司编码"
          min-width="150px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.organizationCode }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="organizationName"
          label="公司/部门"
          min-width="200px"
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
          align="left"
          prop="accountName"
          label="学员名称"
          min-width="150px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.accountName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="学号" min-width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.huihuiNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="industryName"
          label="产业"
          min-width="200px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.industryName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="signUpTime"
          label="报名时间"
          min-width="250px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.signUpTime !== null">{{
              scope.row.signUpTime
            }}</span>
            <span v-if="scope.row.signUpTime === null"> - </span>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-loading="loading"
        :data="tableData"
        ref="table"
        v-if="studyTerminalCode !== '1'"
        header-cell-class-name="table-header-cell"
      >
        <el-table-column
          align="left"
          type="index"
          label="序号"
          min-width="10%"
        ></el-table-column>
        <el-table-column
          align="left"
          prop="courseName"
          label="课程名称"
          min-width="20%"
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
          align="left"
          label="公司/部门"
          min-width="30%"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span
              >{{ scope.row.gmName }}
              <span
                v-if="
                  (scope.row.gmName && scope.row.industryName) ||
                    (!scope.row.gmName && !scope.row.industryName)
                "
              >
                -
              </span>
              {{ scope.row.industryName }}</span
            >
          </template>
        </el-table-column>
        <!--        <el-table-column-->
        <!--          align="left"-->
        <!--          prop="industryName"-->
        <!--          label="产业"-->
        <!--          min-width="20%"-->
        <!--          :show-overflow-tooltip="true"-->
        <!--        >-->
        <!--        </el-table-column>-->
        <el-table-column
          align="left"
          prop="accountName"
          label="学员名称"
          min-width="10%"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.accountName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="huihuiNumber"
          label="学号"
          min-width="10%"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.huihuiNumber !== null">{{
              scope.row.huihuiNumber
            }}</span>
            <span v-if="scope.row.huihuiNumber === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="signUpTime"
          label="报名时间"
          min-width="20%"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.signUpTime !== null">{{
              scope.row.signUpTime
            }}</span>
            <span v-if="scope.row.signUpTime === null"> - </span>
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
    <!--导出至邮箱对话框-->
    <el-dialog
      width="510px"
      title="导出"
      class="emailDialog"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :visible.sync="emailFlag"
    >
      <el-alert
        title="提示：导出内容将以附件形式发送至输入的邮箱，请于10分钟后查看"
        type="info"
        :closable="false"
        show-icon
        style="width: 458px;margin-bottom: 20px;"
      ></el-alert>
      <el-form
        :inline="true"
        label-width="55px"
        size="mini"
        :model="emailForm"
        :rules="emailRules"
        ref="emailFormRef"
      >
        <el-form-item prop="emailAddress" label="邮箱">
          <el-input
            v-model="emailForm.emailAddress"
            clearable
            placeholder="请输入您的邮箱"
            style="width: 403px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确认导出</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts" src="./sign-up-list.ts"></script>

<style lang="scss">
.classify-tab {
  .el-tabs__item {
    width: 110px;
    text-align: center;
  }
}
.emailDialog {
  .el-alert--info.is-light {
    background-color: #ecf5ff !important;
    color: #409eff !important;
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
