<template>
  <div class="course-learning-follow" style="padding: 24px 20px 20px 20px;">
    <el-tabs v-model="isStudy" type="card" @tab-click="handleClick">
      <el-tab-pane label="已学习" name="1" />
      <el-tab-pane label="未学习" name="2" />
    </el-tabs>
    <!--        查询-->
    <div
      class="header-form"
      style="padding-bottom: 10px;border-bottom: 1px solid rgba(220,223,230,1);"
    >
      <el-form :inline="true" label-width="110px" size="mini">
        <el-form-item label="所属学习终端">
          <el-select
            v-model="studyTerminals"
            @change="studyTerminalChange"
            placeholder="请选择"
            style="width:100%"
          >
            <el-option
              v-for="item in terminalsListData"
              :key="item.labelCode"
              :label="item.labelName"
              :value="item.labelCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程">
          <el-input
            v-model="courseName"
            clearable
            placeholder="请输入名称"
            maxlength="18"
            @input="courseName = courseName.replace(/^ +| +$/g, '')"
          />
        </el-form-item>
        <el-form-item v-if="studyTerminals === '1'" label="中心">
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
            />
            <el-option
              v-for="item in gmList.tagList"
              :key="item.tagCodeCollege"
              :label="item.tagName"
              :value="item.tagCodeCollege"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="studyTerminals !== '1'" label="公司">
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
            />
            <el-option
              v-for="item in gmList.tagList"
              :key="item.tagCodeCollege"
              :label="item.tagName"
              :value="item.tagCodeCollege"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="studyTerminals === '1'" label="公司编码/名称">
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
          >
            <el-option
              v-for="item in organizationForm"
              :key="item.orgCode"
              :label="item.orgName + '(' + item.orgCode + ')'"
              :value="item.orgCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="studyTerminals === '1' && isStudy === '1'"
          label="学员"
        >
          <el-select
            v-model="studentorname"
            filterable
            clearable
            remote
            reserve-keyword
            size="mini"
            placeholder="姓名/手机号"
            :remote-method="remoteMethodStu"
            :loading="studentLoading"
          >
            <el-option
              v-for="item in studentForm"
              :key="item.accountId"
              :label="item.accountName + '(' + phoneFilter(item.phone) + ')'"
              :value="item.accountId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            ((studyTerminals === '3' ||
              studyTerminals === '2' ||
              studyTerminals === '4') &&
              isStudy === '1') ||
              ((studyTerminals === '3' ||
                studyTerminals === '2' ||
                studyTerminals === '4') &&
                isStudy === '2')
          "
          label="学员"
        >
          <el-select
            v-model="studentorname"
            filterable
            clearable
            remote
            reserve-keyword
            size="mini"
            placeholder="请输入学员名称/学号"
            :remote-method="remoteMethodStuZxy"
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
        <el-form-item v-if="isStudy === '1'" label="学习进度">
          <el-input
            style="width: 80px"
            v-model="progressLeast"
            placeholder="请输入%"
            @blur="minJin"
            @input="progressLeast = progressLeast.replace(/[^\d]/g, '')"
          />
        </el-form-item>
        <span v-if="isStudy === '1'">-</span>
        <el-form-item v-if="isStudy === '1'" label="" style="margin-left: 10px">
          <el-input
            style="width: 80px"
            v-model="progressMost"
            placeholder="请输入%"
            @blur="maxJin"
            @input="progressMost = progressMost.replace(/[^\d]/g, '')"
          />
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" plain @click="query()">查询</el-button>
          <el-button @click="reset()" type="" plain style="margin-left: 10px;"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 吸顶表头左侧遮盖-->
    <div
      v-if="isShow"
      style="position: fixed;width: 20px;left: 180px;top: 70px;height: 40px;z-index: 12;background:#FFFFFF;padding-right: 20px;color: #FFFFFF;"
    >
      1
    </div>
    <!--吸顶表头-->
    <div
      v-show="isShow && isStudy === '1'"
      style="position: fixed;width: calc(100% - 200px);left: 180px;top: 70px;z-index: 9;background:#FFFFFF;padding-right: 20px;"
    >
      <div
        id="read"
        @scroll="scrollEvent"
        class="no-line-to"
        style="white-space: nowrap;-webkit-overflow-scrolling: touch;height: 40px;overflow-x: auto;overflow-y: hidden;line-height: 40px;text-align: left;color: #909399"
      >
        <div class="d-flex" style="width: 100%;">
          <div style="min-width: 70px;padding-left: 30px;">序号</div>
          <div style="min-width: 200px;padding-left: 8px;">课程名称</div>
          <div
            v-if="studyTerminals === '1'"
            style="min-width: 200px;padding-left: 8px;"
          >
            中心
          </div>
          <div
            v-if="studyTerminals !== '1'"
            style="min-width: 200px;padding-left: 8px;"
          >
            公司/部门
          </div>
          <div
            v-if="studyTerminals === '1'"
            style="min-width: 200px;padding-left: 8px;"
          >
            公司编码
          </div>
          <div
            v-if="studyTerminals === '1'"
            style="min-width: 200px;padding-left: 8px;"
          >
            公司/部门
          </div>
          <div style="min-width: 200px;padding-left: 8px;">学员名称</div>
          <div style="min-width: 200px;padding-left: 8px;">学号</div>
          <div style="min-width: 200px;padding-left: 8px;">
            累计学习时长（分钟）
          </div>
          <div style="min-width: 200px;padding-left: 8px;">
            学习进度
          </div>
          <div style="min-width: 200px;padding-left: 8px;">
            考试分数
          </div>
          <div style="min-width: 200px;padding-left: 8px;">
            是否提交作业
          </div>
          <div style="min-width: 200px;padding-left: 8px;">
            作业得分
          </div>
          <div style="min-width: 200px;padding-left: 8px;">
            是否参与PK
          </div>
        </div>
      </div>
    </div>
    <div
      v-show="isShow && isStudy === '2'"
      style="position: fixed;width: calc(100% - 200px);left: 180px;top: 70px;z-index: 9;background:#FFFFFF;padding-right: 20px;"
    >
      <div
        id="read2"
        class="no-line-to"
        style="white-space: nowrap;-webkit-overflow-scrolling: touch;height: 40px;overflow-x: auto;overflow-y: hidden;line-height: 40px;text-align: left;color: #909399"
      >
        <div class="d-flex" style="width: 100%;">
          <div style="min-width: 5.8%;padding-left: 30px;">序号</div>
          <div
            class="course-name"
            :class="{
              courseNameZxy: studyTerminals !== '1'
            }"
          >
            课程名称
          </div>
          <div
            v-if="studyTerminals === '1'"
            class="center"
            :class="{
              centerZxy: studyTerminals !== '1'
            }"
          >
            中心
          </div>
          <div
            v-if="studyTerminals !== '1'"
            class="center"
            :class="{
              centerZxy: studyTerminals !== '1'
            }"
          >
            公司/部门
          </div>
          <!--          <div-->
          <!--            v-if="studyTerminals !== '1'"-->
          <!--            class="center"-->
          <!--            :class="{-->
          <!--              centerZxy: studyTerminals !== '1'-->
          <!--            }"-->
          <!--          >-->
          <!--            产业-->
          <!--          </div>-->
          <div
            v-if="studyTerminals !== '1'"
            class="huihui-name"
            :class="{
              huihuiNameZxy: studyTerminals !== '1'
            }"
          >
            学员名称
          </div>
          <div
            v-if="studyTerminals !== '1'"
            class="huihui"
            :class="{
              huihuiZxy: studyTerminals !== '1'
            }"
          >
            学号
          </div>
          <div
            v-if="studyTerminals === '1'"
            style="min-width: 16.6%;padding-left: 8px;"
          >
            公司编码
          </div>
          <div
            v-if="studyTerminals === '1'"
            style="min-width: 16.6%;padding-left: 8px;"
          >
            公司/部门
          </div>
          <div
            v-if="studyTerminals === '1'"
            style="min-width: 15%;padding-left: 8px;"
          >
            学员数
          </div>
        </div>
      </div>
    </div>
    <!--        导出-->
    <div
      class="align-items-center d-flex justify-content-between mb-15"
      style="padding-top: 24px"
    >
      <div>
        <el-button @click="onExportReport()" type="primary" size="medium"
          >导出</el-button
        >
        <span v-if="isStudy === '1'" style="padding-left: 20px;color: #606266"
          >已学人数：{{ listCount }}人</span
        >
        <span v-if="isStudy === '2'" style="padding-left: 20px;color: #606266"
          >未学人数：{{ noStudyCount }}人</span
        >
      </div>

      <div style="color: #909399;font-size: 12px;margin-right: 10px">
        <img
          src="../../../assets/images/icon-help.png"
          style="width:14px;height:14px;margin-right:3px"
          alt=""
        />
        此报表数据统计截止至前一天
      </div>
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
      />
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
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确认导出</el-button>
      </span>
    </el-dialog>
    <!--        表格-->
    <div>
      <!--列表区域-->

      <!-- 已学习列表-->
      <el-table
        ref="table"
        v-if="isStudy === '1'"
        header-cell-class-name="table-header-cell"
        v-loading="loading"
        :data="tableData"
        class="table-lecturer"
        fit
      >
        <el-table-column type="index" label="序号" min-width="70px" />
        <el-table-column
          prop="courseName"
          min-width="200px"
          label="课程名称"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>
              {{ scope.row.courseName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="studyTerminals === '1'"
          prop="gameName"
          width="200px"
          label="中心"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>
              {{ scope.row.gmName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="studyTerminals !== '1'"
          width="200px"
          label="公司/部门"
        >
          <template slot-scope="scope">
            <span>
              {{ scope.row.gmName }}
              <span
                v-if="
                  (scope.row.gmName && scope.row.industryName) ||
                    (!scope.row.gmName && !scope.row.industryName)
                "
                >-</span
              >
              {{ scope.row.industryName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="studyTerminals === '1'"
          prop="orgCode"
          min-width="200px"
          label="公司编码"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.orgCode }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="studyTerminals === '1'"
          prop="orgName"
          min-width="200px"
          label="公司/部门"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.orgName != null">{{
              scope.row.orgName
            }}</span>
            <span
              v-if="
                (scope.row.orgName != null &&
                  scope.row.departmentName != null) ||
                  (scope.row.orgName == null &&
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
        <!--        <el-table-column-->
        <!--          v-if="studyTerminals !== '1'"-->
        <!--          prop="industryName"-->
        <!--          min-width="200px"-->
        <!--          label="产业"-->
        <!--        >-->
        <!--          <template slot-scope="scope">-->
        <!--            <div>-->
        <!--              {{ scope.row.industryName }}-->
        <!--            </div>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column prop="studentName" min-width="200px" label="学员名称">
          <template slot-scope="scope">
            <div>
              {{ scope.row.studentName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="huihuiNumber" min-width="200px" label="学号">
          <template slot-scope="scope">
            <div>
              {{ scope.row.huihuiNumber }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalStudyTime"
          min-width="200px"
          label="累计学习时长（分钟）"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.totalStudyTime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="progress" min-width="200px" label="学习进度">
          <template slot-scope="scope">
            <div>{{ scope.row.progress }}%</div>
          </template>
        </el-table-column>
        <el-table-column prop="examScore" min-width="200px" label="考试分数">
          <template slot-scope="scope">
            <span v-if="scope.row.testStatus === 1">
              <span v-if="scope.row.examScore || scope.row.examScore === '0'">
                {{ scope.row.examScore }}
              </span>
              <span v-else>-</span>
            </span>
            <span v-else>
              -
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="homeworkSubmitStatus"
          min-width="200px"
          label="是否提交作业"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.taskStatus === 1">
              <span v-if="scope.row.homeworkSubmitStatus === '0'">否</span>
              <span v-if="scope.row.homeworkSubmitStatus === '1'">是</span>
            </span>
            <span v-else>
              -
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="homeworkScore"
          min-width="200px"
          label="作业得分"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.taskStatus === 1">
              <span
                v-if="
                  scope.row.homeworkScore || scope.row.homeworkScore === '0'
                "
              >
                {{ scope.row.homeworkScore }}
              </span>
              <span v-else>-</span>
            </span>
            <span v-else>
              -
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="isPk" min-width="200px" label="是否参与PK">
          <template slot-scope="scope">
            <span v-if="scope.row.taskStatus === 1">
              <span v-if="scope.row.pkStatus">
                <span v-if="scope.row.isPk === '0'">否</span>
                <span v-if="scope.row.isPk === '1'">是</span>
              </span>
              <span v-else>-</span>
            </span>
            <span v-else>
              -
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!--            未学习列表-->
      <el-table
        ref="table"
        v-if="isStudy === '2'"
        header-cell-class-name="table-header-cell"
        v-loading="loading"
        :data="tableData"
        class="table-lecturer"
        fit
      >
        <el-table-column type="index" label="序号" min-width="10%" />
        <el-table-column
          prop="courseName"
          min-width="25%"
          label="课程名称"
          key="courseName"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>
              {{ scope.row.courseName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="studyTerminals === '1'"
          prop="gameName"
          min-width="15%"
          key="gameName"
          label="中心"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.gmName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="studyTerminals !== '1'"
          min-width="15%"
          key="gameName2"
          label="公司/部门"
        >
          <template slot-scope="scope">
            <span>
              {{ scope.row.gmName }}
              <span
                v-if="
                  (scope.row.gmName && scope.row.industryName) ||
                    (!scope.row.gmName && !scope.row.industryName)
                "
                >-</span
              >
              {{ scope.row.industryName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="studyTerminals === '1'"
          prop="orgCode"
          key="orgCode"
          min-width="15%"
          label="公司编码"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.orgCode }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="studyTerminals === '1'"
          prop="orgName"
          key="orgName"
          min-width="15%"
          label="公司/部门"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.orgName != null">{{
              scope.row.orgName
            }}</span>
            <span
              v-if="
                (scope.row.orgName != null &&
                  scope.row.departmentName != null) ||
                  (scope.row.orgName == null &&
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
        <!--        <el-table-column-->
        <!--          v-if="studyTerminals !== '1'"-->
        <!--          prop="industryName"-->
        <!--          min-width="15%"-->
        <!--          key="industryName"-->
        <!--          label="产业"-->
        <!--        >-->
        <!--          <template slot-scope="scope">-->
        <!--            <div>-->
        <!--              {{ scope.row.industryName }}-->
        <!--            </div>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column
          v-if="studyTerminals === '1'"
          prop="groupingName"
          key="groupingName"
          min-width="15%"
          label="学员数"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.studentNum }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="studyTerminals !== '1'"
          prop="studentName"
          min-width="20%"
          key="studentName"
          label="学员名称"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.studentName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="studyTerminals !== '1'"
          prop="huihuiNumber"
          min-width="15%"
          key="huihuiNumber"
          label="学号"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.huihuiNumber }}
            </div>
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

<script src="./course-learning-follow.ts"></script>
<style lang="scss">
.course-learning-follow {
  .el-tabs__item {
    width: 110px !important;
    text-align: center;
  }
}
</style>
<style scoped lang="scss">
.no-line-to {
  &::-webkit-scrollbar {
    display: none !important;
  }
}
.course-name {
  min-width: 27.9%;
  padding-left: 8px;
}
.courseNameZxy {
  min-width: 31.29%;
  padding-left: 8px;
}
.huihui-name {
  min-width: 20%;
  padding-left: 8px;
}
.huihuiNameZxy {
  min-width: 26%;
  padding-left: 8px;
}
.huihui {
  min-width: 15%;
  padding-left: 8px;
}
.huihuiZxy {
  min-width: 15.7%;
  padding-left: 8px;
}
.center {
  min-width: 16.6%;
  padding-left: 8px;
}
.centerZxy {
  min-width: 18.4%;
  padding-left: 8px;
}
.course-learning-follow {
  padding-top: 20px;
  position: relative;
  &::v-deep .table-header-cell .cell {
    color: #909399;
  }
}
/*.organizationstr {*/
/*    overflow: hidden;*/
/*    text-overflow: ellipsis;*/
/*    white-space: nowrap;*/
/*}*/
</style>
