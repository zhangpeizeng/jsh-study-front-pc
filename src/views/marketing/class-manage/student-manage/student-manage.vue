<template>
  <div class="student-manage">
    <el-dialog
      title=""
      :visible.sync="dialogView"
      width="65%"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-image style="width: 100%" :src="classViewImg"> </el-image>
      <div slot="footer" class="text-center">
        <el-button @click="dialogView = false">关闭</el-button>
      </div>
    </el-dialog>
    <div class="header-form">
      <el-form :inline="true" label-width="84px" size="mini">
        <el-form-item label="状态">
          <el-select
            @change="selectAllDepartment"
            clearable
            multiple
            collapse-tags
            v-model="status"
            placeholder="请选择"
          >
            <el-option label="全选" value="all" />
            <el-option
              v-for="item in statusList"
              :key="item.labelCode"
              :label="item.labelName"
              :value="item.labelCode"
            >
            </el-option>
          </el-select>
          <span class="pl-10">
            <img
              @click="dialogView = true"
              src="../../../../assets/images/icon-help.png"
              style="
                width: 14px;
                height: 14px;
                margin-right: 3px;
                cursor: pointer;
              "
            />
          </span>
        </el-form-item>
        <el-form-item label="学员">
          <el-select
            v-model="studentName"
            filterable
            remote
            reserve-keyword
            size="mini"
            placeholder="请输入学员姓名/学号"
            :remote-method="remoteMethodLec"
            :loading="studentLoading"
          >
            <el-option
              v-for="item in studentForm"
              :key="item.accountId"
              :label="item.accountName + '(' + item.huiHuiNumber + ')'"
              :value="item.accountId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="来源">
          <el-select v-model="source" clearable placeholder="请选择">
            <el-option
              v-for="item in sourceList"
              :key="item.labelCode"
              :label="item.labelName"
              :value="item.labelCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="onSearch" plain>查询</el-button>
          <el-button type="" @click="cleanto" plain style="margin-left: 10px"
            >重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="btn-list">
      <el-button
        type="primary"
        @click="
          operationHandle(
            1,
            [CLASS_STUDENT_STATUS.REFISTRATION_TO_BE_APPROVED],
            0
          )
        "
      >
        批量审核
      </el-button>
      <el-button type="primary" @click="openAddStudent">增加学员</el-button>
      <el-button
        type="primary"
        @click="
          operationHandle(
            1,
            [
              CLASS_STUDENT_STATUS.JOINED,
              CLASS_STUDENT_STATUS.REFISTRATION_APPROVED
            ],
            1
          )
        "
        >批量移除</el-button
      >
      <el-button
        type="primary"
        @click="
          operationHandle(
            1,
            [CLASS_STUDENT_STATUS.TO_BE_EVALUATED_BY_TEACHER],
            2
          )
        "
        >批量评定</el-button
      >
      <el-button type="primary" @click="onExport">导出</el-button>
      <span class="pl-20">报名限制：{{ enrollNum }}人</span>
    </div>
    <div class="body">
      <el-table
        :data="tableData"
        v-loading="tableLoading"
        @selection-change="handleSelectionChange"
        header-cell-class-name="table-header-cell"
      >
        <el-table-column align="center" type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" label="序号" width="50px">
        </el-table-column>
        <el-table-column label="中心" width="90px">
          <template slot-scope="scope">
            <span>{{ scope.row.gmName || "-" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="产业"
          width="90px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.productName || "-" }}</span>
          </template>
        </el-table-column>
        <!-- 其中仅客户端展示此栏位，其他学习终端无此栏位 -->
        <el-table-column
          label="公司编码"
          width="120px"
          v-if="studyTerminalCode === TERMINAL_TYPE.CLIENT"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.orgCode }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="公司/部门"
          width="120px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.orgName }}</span>
            <span>-</span>
            <span>{{ scope.row.departmentName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学员名称" width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.accountName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学号" width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.huiHuiNumber }}</span>
          </template>
        </el-table-column>
        <!-- 班级状态“进行中、已结课、已结班、已停班”展示此栏位 -->
        <el-table-column label="学习时长" width="120px" v-if="showFlag">
          <template slot-scope="scope">
            <span>{{ scope.row.studyTime || "-" }}</span>
          </template>
          <!-- 班级状态“进行中、已结课、已结班、已停班”展示此栏位 -->
        </el-table-column>
        <el-table-column label="学习课程数" width="120px" v-if="showFlag">
          <template slot-scope="scope">
            <span>{{ scope.row.coursesNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="来源" width="120px">
          <template slot-scope="scope">
            <span>{{
              ["", "自主报名", "邀请加入"][scope.row.sourceType]
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报名/确认时间" width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.signUpConfirmTime || "-" }}</span>
          </template>
        </el-table-column>
        <!-- 班级需要报名审核展示此栏位，不需要则不展示 -->
        <el-table-column label="审核时间" width="120px" v-if="auditStatus">
          <template slot-scope="scope">
            <span>{{ scope.row.auditTime || "-" }}</span>
          </template>
        </el-table-column>
        <!-- 班级状态“已结课、已结班、已停班”展示此栏位 -->
        <el-table-column
          label="学习结果"
          width="120px"
          v-if="isShowLearningOutcomes"
        >
          <template slot-scope="scope">
            <span>{{
              ASSESSMENT_STATUS_CN_NAME[scope.row.studyStatus] || "-"
            }}</span>
            <i
              class="el-icon-document"
              v-if="
                Number(scope.row.studyStatus) === ASSESSMENT_STATUS.QUALIFIED
              "
              @click="
                showCertificateDialog(scope.index, {
                  certificateBasePicUrl: scope.row.certificateBasePicUrl,
                  certificateName: scope.row.certificateName,
                  certificateDesc: scope.row.certificateDesc,
                  certificateCompany: scope.row.certificateCompany
                })
              "
            ></i>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="状态" width="120px">
          <template slot-scope="scope">
            <el-tooltip placement="top" :disabled="!scope.row.auditContent">
              <div slot="content">
                <div>{{ scope.row.auditContent }}</div>
              </div>
              <span
                :style="
                  scope.row.status ===
                  CLASS_STUDENT_STATUS.REFISTRATION_REVIEW_REJECTED
                    ? { color: ' #ea3425' }
                    : {}
                "
              >
                {{ CLASS_STUDENT_STATUS_CN_NAME[scope.row.status] }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>

        <!-- 邀请加入需要审核 -->
        邀请加入
        <el-table-column
          fixed="right"
          label="操作"
          width="200px"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="
                operationHandle(
                  0,
                  [CLASS_STUDENT_STATUS.REFISTRATION_TO_BE_APPROVED],
                  0,
                  scope.row
                )
              "
              plain
              v-if="
                scope.row.status ===
                  CLASS_STUDENT_STATUS.REFISTRATION_TO_BE_APPROVED
              "
            >
              审核
            </el-button>
            <el-button
              size="mini"
              @click="
                operationHandle(
                  0,
                  [
                    CLASS_STUDENT_STATUS.JOINED,
                    CLASS_STUDENT_STATUS.REFISTRATION_APPROVED
                  ],
                  1,
                  scope.row
                )
              "
              plain
              v-if="
                scope.row.status === CLASS_STUDENT_STATUS.JOINED ||
                  scope.row.status ===
                    CLASS_STUDENT_STATUS.REFISTRATION_APPROVED
              "
            >
              移除
            </el-button>
            <el-button
              size="mini"
              @click="
                operationHandle(
                  0,
                  [CLASS_STUDENT_STATUS.TO_BE_EVALUATED_BY_TEACHER],
                  2,
                  scope.row
                )
              "
              plain
              v-if="
                Number(scope.row.status) ===
                  CLASS_STUDENT_STATUS.TO_BE_EVALUATED_BY_TEACHER
              "
            >
              评定
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
      <el-button
        class="class-detail-footer_btn btn_start-class"
        type="primary"
        @click="goBack"
        size="mini"
        >返回</el-button
      >
    </div>
    <el-dialog
      title="移除学员"
      width="500px"
      custom-class="public-dialog"
      :close-on-click-modal="false"
      :visible.sync="moveStudentDialog"
    >
      <deleteStudent
        ref="delete"
        v-if="moveStudentDialog"
        @cancel="moveStudentDialog = false"
        :studentList="studentList"
        :classId="classId"
        @move="moveMethod"
      >
      </deleteStudent>
    </el-dialog>
    <el-dialog
      title="审核"
      width="500px"
      custom-class="public-dialog"
      :close-on-click-modal="false"
      :visible.sync="examineDialog"
    >
      <examine
        ref="examine"
        v-if="examineDialog"
        :studentList="studentList"
        :classId="classId"
        @cancel="examineDialog = false"
        @verify="verifyMethod()"
      >
      </examine>
    </el-dialog>
    <el-dialog
      title="增加学员"
      width="800px"
      custom-class="public-dialog"
      :close-on-click-modal="false"
      :visible.sync="addStudentDialog"
    >
      <addStudent
        ref="addStudent"
        :studyTerminal="studyTerminalCode + ''"
        :classId="classId"
        v-if="addStudentDialog"
        @cancel="addStudentDialog = false"
        @confirm="addStudentDialog = false"
      >
      </addStudent>
    </el-dialog>

    <el-dialog
      title="证书"
      width="600px"
      custom-class="public-dialog"
      :close-on-click-modal="false"
      :visible.sync="certificateDialog"
    >
      <certificate-dialog
        :certificateData="certificateData"
        v-if="certificateDialog"
        @cancel="addStudentDialog = false"
      >
      </certificate-dialog>
    </el-dialog>

    <studyEvaluate
      ref="certificate"
      :classId="classId"
      :studyTerminalCode="studyTerminalCode"
      @cancel="evaluateDialog = false"
      @evaluate="evaluateMethod"
    >
    </studyEvaluate>
  </div>
</template>

<script lang="ts" src="./student-manage.ts"></script>

<style lang="scss" scoped>
.editLive {
  color: #1989fa;
}

.student-manage {
  padding: 24px 20px 20px 20px;

  .header-form {
    padding-bottom: 6px;
    border-bottom: 1px solid #dcdfe6;

    .el-button {
      margin-left: 40px;
      padding-left: 20px;
      padding-right: 20px;
    }
  }
  .btn-list {
    padding-top: 20px;
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
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .class-img {
      width: 68px;
      height: 16px;
      line-height: 16px;
      background-image: linear-gradient(90deg, #74cdff, #409eff);
      border-radius: 2px 0px 2px 0px;
      position: absolute;
      top: 12px;
      left: 10px;
      color: white;
      font-size: 10px;
      text-align: center;
    }

    .class-text {
      width: 100px;
      height: 16px;
      line-height: 16px;
      background-color: white;
      border-radius: 0px 2px 0px 2px;
      position: absolute;
      top: 52px;
      left: 10px;
      color: #f56c6c;
      font-size: 10px;
      opacity: 0.6;
      object-position: center;
      object-fit: cover;
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
</style>
