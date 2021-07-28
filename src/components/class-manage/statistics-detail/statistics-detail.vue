<script src="course-statistics.ts"></script>
<template>
  <div style="padding: 0 24px; background-color: #ffffff">
    <div class="content-top">
      <div class="course-time" style="margin-bottom: 15px;">
        <div class="course-name">
          <span>课程名称：{{ detail.courseName }}</span>
        </div>
        <div class="course-type">{{ detail.courseTypeName }}</div>
      </div>
      <div
        class="course-time"
        v-if="
          detail.courseType == 2 ||
            detail.courseType == 3 ||
            (detail.studyStartTime && detail.studyEndTime)
        "
      >
        <div
          class="time mr-45"
          v-if="detail.studyStartTime && detail.studyEndTime"
        >
          学习时间：{{ detail.studyStartTime | date("yyyy-MM-dd hh:mm") }}
          至
          {{ detail.studyEndTime | date("yyyy-MM-dd hh:mm") }}
        </div>
        <div
          class="time mr-45"
          v-if="detail.courseType == 2 || detail.courseType == 3"
        >
          直播时间：{{ detail.liveStartTime | date("yyyy-MM-dd hh:mm") }}
          至
          {{ detail.liveEndTime | date("yyyy-MM-dd hh:mm") }}
        </div>
        <div
          class="time"
          v-if="detail.courseType == 2 || detail.courseType == 3"
        >
          直播时长：{{ detail.liveTime }}分钟
        </div>
      </div>
    </div>
    <div
      style="position: absolute;top: 62px;right: 36px;color: #909399;font-size: 12px"
    >
      <img
        src="../../../assets/images/icon-help.png"
        style="width:14px;height:14px;margin-right:3px"
      />
      此统计为实时数据
    </div>
    <div>
      <el-tabs v-model="terminalCode" @tab-click="handleClick1">
        <el-tab-pane v-if="tableFlag1" label="客户端" name="1"></el-tab-pane>
        <el-tab-pane v-if="tableFlag2" label="员工端" name="2"></el-tab-pane>
        <el-tab-pane v-if="tableFlag3" label="直销员端" name="3"></el-tab-pane>
        <el-tab-pane v-if="tableFlag4" label="售后端" name="4"></el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="terminalCode === '1'">
      <course-statistical @instance="instanceStatistical"></course-statistical>
      <el-tabs v-model="customerActiveName" @tab-click="handleClick">
        <el-tab-pane label="已学习" name="already">
          <div class="table-body">
            <el-form
              size="mini"
              ref="form"
              :inline="true"
              :model="form"
              label-width="84px"
              style="overflow: hidden"
              @submit.native.prevent
            >
              <div class="student-class clearfloat">
                <div style="float: left;">
                  <el-form-item label="中心">
                    <el-input
                      style="width: 180px"
                      v-model="form.gmNameOrCode"
                      clearable
                      placeholder="请输入中心"
                      maxlength="10"
                      @input="
                        form.gmNameOrCode = form.gmNameOrCode.replace(
                          /^ +| +$/g,
                          ''
                        )
                      "
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="学员">
                    <el-select
                      v-model="form.accountId"
                      filterable
                      clearable
                      remote
                      reserve-keyword
                      size="mini"
                      placeholder="请输入学员名称/手机号"
                      :remote-method="remoteMethodStu"
                      :loading="studentLoading"
                      style="width: 180px;"
                    >
                      <el-option
                        v-for="item in studentForm"
                        :key="item.accountId"
                        :label="
                          item.accountName + '(' + phoneFilter(item.phone) + ')'
                        "
                        :value="item.accountId"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="公司编码/名称" label-width="120px">
                    <el-select
                      v-model="form.orgNameOrCode"
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
                </div>
              </div>
              <el-form-item style="float: right">
                <el-button type="primary" @click="query" plain :disabled="shake"
                  >查询</el-button
                >
                <el-button @click="cleanto">重置</el-button>
              </el-form-item>
            </el-form>
            <el-form
              size="mini"
              ref="form"
              :inline="true"
              :model="form"
              label-width="84px"
            >
              <div class="">
                <div style="float: left;">
                  <el-form-item label="学习进度">
                    <el-input
                      style="width: 77px"
                      v-model="form.progressLeast"
                      placeholder="请输入%"
                      @blur="minJin"
                      @input="
                        form.progressLeast = form.progressLeast.replace(
                          /[^\d]/g,
                          ''
                        )
                      "
                    ></el-input>
                  </el-form-item>
                  <span>-</span>
                  <el-form-item label="" style="margin-left: 10px">
                    <el-input
                      style="width: 77px"
                      v-model="form.progressMost"
                      placeholder="请输入%"
                      @blur="maxJin"
                      @input="
                        form.progressMost = form.progressMost.replace(
                          /[^\d]/g,
                          ''
                        )
                      "
                    ></el-input>
                  </el-form-item>
                </div>
                <el-form-item style="float: right">
                  <el-button @click="onExportCustomerAlready">导出</el-button>
                </el-form-item>
              </div>
            </el-form>
            <el-table
              :data="tableData"
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
                label="中心"
                min-width="150"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <div>{{ scope.row.gmName }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="orgCode"
                align="left"
                label="公司编码"
                min-width="150"
              >
                <template slot-scope="scope">
                  <div>{{ scope.row.orgCode }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="orgName"
                align="left"
                min-width="200"
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
              <el-table-column
                prop="accountName"
                align="left"
                label="学员名称"
                min-width="150"
              >
                <template slot-scope="scope">
                  <div>{{ scope.row.accountName }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="employeeId"
                align="left"
                label="学号"
                min-width="150"
              >
                <template slot-scope="scope">
                  <div>{{ scope.row.employeeId }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="cusStudyTime"
                align="left"
                label="累计学习时长(分钟)"
                min-width="150"
              >
                <template slot-scope="scope">
                  <div>{{ scope.row.cusStudyTime }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="cusStudyProgress"
                align="left"
                label="学习进度"
                min-width="150"
              >
                <template slot-scope="scope">
                  <div>{{ scope.row.cusStudyProgress }}%</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="examScore"
                align="left"
                min-width="150"
                label="考试分数"
                v-if="detail.testStatus == 1"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.examScore == null">-</div>
                  <div v-if="scope.row.examScore">
                    {{ scope.row.examScore }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="left"
                label="是否提交作业"
                min-width="150"
                v-if="detail.taskStatus == 1"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.isHomeworkSubmit === null">否</div>
                  <div v-if="scope.row.isHomeworkSubmit !== null">是</div>
                </template>
              </el-table-column>
              <el-table-column
                align="left"
                label="作业得分"
                min-width="150"
                v-if="detail.taskStatus == 1"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.homeworkScore">
                    {{ scope.row.homeworkScore }}
                  </div>
                  <div v-else-if="scope.row.homeworkScore === 0">
                    {{ scope.row.homeworkScore }}
                  </div>
                  <div v-else>-</div>
                </template>
              </el-table-column>
              <el-table-column
                align="left"
                label="是否参与pk"
                min-width="150"
                v-if="detail.pkStatus == 1"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.isPk === 1">是</div>
                  <div v-if="scope.row.isPk !== 1">否</div>
                </template>
              </el-table-column>
            </el-table>
            <div class="page-contain">
              <el-pagination
                @size-change="onPageSizeChange"
                @current-change="onCurrentPageChange"
                :current-page="form.pageNum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="form.pageSize"
                layout="total,sizes, prev, pager, next,jumper"
                :total="total"
              >
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="weixux" label="未学习" name="nostudy">
          <courseNostudy
            :detail="detail"
            :classid="classid"
            :courseType="courseType"
            ref="courseNostudy"
          >
          </courseNostudy>
        </el-tab-pane>
        <el-tab-pane
          label="作业批改情况"
          name="homeworkCorrection"
          v-if="detail.taskStatus == 1"
        >
          <div v-if="isHomework">
            <correction
              :classId="classid"
              :terminal="terminalCode"
            ></correction>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div
      v-if="
        terminalCode === '3' || terminalCode === '2' || terminalCode === '4'
      "
    >
      <course-statistical @instance="instanceStatistical"></course-statistical>
      <el-tabs v-model="sellerActiveName" @tab-click="handleClick">
        <el-tab-pane label="已学习" name="already">
          <div class="table-body">
            <el-form
              size="mini"
              ref="form"
              :inline="true"
              :model="sellerForm"
              label-width="84px"
              style="overflow: hidden"
              @submit.native.prevent
            >
              <div class="student-class clearfloat">
                <div style="float: left;">
                  <el-form-item label="公司">
                    <el-input
                      style="width: 180px"
                      v-model="sellerForm.gmNameOrCode"
                      clearable
                      placeholder="请输入公司"
                      maxlength="10"
                      @input="
                        sellerForm.gmNameOrCode = sellerForm.gmNameOrCode.replace(
                          /^ +| +$/g,
                          ''
                        )
                      "
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="学员">
                    <el-select
                      v-model="sellerForm.accountId"
                      filterable
                      clearable
                      remote
                      reserve-keyword
                      size="mini"
                      placeholder="请输入学员名称/学号"
                      :remote-method="remoteMethodStuByHui"
                      :loading="studentLoading"
                      style="width: 180px;"
                    >
                      <el-option
                        v-for="item in studentForm"
                        :key="item.accountId"
                        :label="
                          item.accountName + '(' + item.huiHuiNumber + ')'
                        "
                        :value="item.accountId"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="学习进度">
                    <el-input
                      style="width: 77px"
                      v-model="sellerForm.progressLeast"
                      placeholder="请输入%"
                      @blur="minJin"
                      @input="
                        sellerForm.progressLeast = sellerForm.progressLeast.replace(
                          /[^\d]/g,
                          ''
                        )
                      "
                    ></el-input>
                  </el-form-item>
                  <span>-</span>
                  <el-form-item label="" style="margin-left: 10px">
                    <el-input
                      style="width: 77px"
                      v-model="sellerForm.progressMost"
                      placeholder="请输入%"
                      @blur="maxJin"
                      @input="
                        sellerForm.progressMost = sellerForm.progressMost.replace(
                          /[^\d]/g,
                          ''
                        )
                      "
                    ></el-input>
                  </el-form-item>
                </div>
              </div>
              <el-form-item style="float: right">
                <el-button
                  type="primary"
                  @click="querySeller"
                  plain
                  :disabled="shake"
                  >查询</el-button
                >
                <el-button @click="cleanTo">重置</el-button>
              </el-form-item>
            </el-form>
            <el-form
              size="mini"
              ref="sellerForm"
              :inline="true"
              :model="sellerForm"
              label-width="120px"
            >
              <div class="">
                <el-form-item style="float: right">
                  <el-button @click="onExportSellerAlready">导出</el-button>
                </el-form-item>
              </div>
            </el-form>
            <el-table
              :data="sellerAlreadyTableData"
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
              <el-table-column align="left" label="公司/部门" min-width="150">
                <template slot-scope="scope">
                  <span
                    >{{ scope.row.gmName }}
                    <span v-if="scope.row.gmName && scope.row.cyName">-</span>
                    {{ scope.row.cyName }}</span
                  >
                </template>
              </el-table-column>
              <!--              <el-table-column-->
              <!--                prop="cyName"-->
              <!--                align="left"-->
              <!--                label="产业"-->
              <!--                min-width="250"-->
              <!--                :show-overflow-tooltip="true"-->
              <!--              >-->
              <!--                <template slot-scope="scope">-->
              <!--                  <div>{{ scope.row.cyName }}</div>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <el-table-column
                prop="accountName"
                align="left"
                label="学员名称"
                min-width="150"
              >
                <template slot-scope="scope">
                  <div>{{ scope.row.accountName }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="employeeId"
                align="left"
                label="学号"
                min-width="150"
              >
                <template slot-scope="scope">
                  <div>{{ scope.row.employeeId }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="cusStudyTime"
                align="left"
                label="累计学习时长(分钟)"
                min-width="150"
              >
                <template slot-scope="scope">
                  <div>{{ scope.row.cusStudyTime }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="cusStudyProgress"
                align="left"
                label="学习进度"
                min-width="150"
              >
                <template slot-scope="scope">
                  <div>{{ scope.row.cusStudyProgress }}%</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="examScore"
                align="left"
                min-width="150"
                label="考试分数"
                v-if="detail.testStatus == 1"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.examScore == null">-</div>
                  <div v-if="scope.row.examScore">
                    {{ scope.row.examScore }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                align="left"
                label="是否提交作业"
                min-width="150"
                v-if="detail.taskStatus == 1"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.isHomeworkSubmit === null">否</div>
                  <div v-if="scope.row.isHomeworkSubmit !== null">是</div>
                </template>
              </el-table-column>
              <el-table-column
                align="left"
                label="作业得分"
                min-width="150"
                v-if="detail.taskStatus == 1"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.homeworkScore">
                    {{ scope.row.homeworkScore }}
                  </div>
                  <div v-else-if="scope.row.homeworkScore === 0">
                    {{ scope.row.homeworkScore }}
                  </div>
                  <div v-else>-</div>
                </template>
              </el-table-column>
              <el-table-column
                align="left"
                label="是否参与pk"
                min-width="150"
                v-if="detail.pkStatus == 1"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.isPk == 1">是</div>
                  <div v-if="scope.row.isPk != 1">否</div>
                </template>
              </el-table-column>
            </el-table>
            <div class="page-contain">
              <el-pagination
                @size-change="onSellerPageSizeChange"
                @current-change="onSellerCurrentPageChange"
                :current-page="sellerForm.pageNum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="sellerForm.pageSize"
                layout="total,sizes, prev, pager, next,jumper"
                :total="sellerAlreadyTotal"
              >
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="weiXux" label="未学习" name="nostudy">
          <div class="table-body">
            <el-form
              size="mini"
              ref="form"
              :inline="true"
              :model="sellerNoStudyForm"
              label-width="84px"
              style="overflow: hidden"
              @submit.native.prevent
            >
              <div class="student-class clearfloat">
                <div style="float: left;">
                  <el-form-item label="公司">
                    <el-input
                      style="width: 180px"
                      v-model="sellerNoStudyForm.gmNameOrCode"
                      clearable
                      placeholder="请输入公司"
                      maxlength="10"
                      @input="
                        sellerNoStudyForm.gmNameOrCode = sellerNoStudyForm.gmNameOrCode.replace(
                          /^ +| +$/g,
                          ''
                        )
                      "
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="学员">
                    <el-select
                      v-model="sellerNoStudyForm.accountId"
                      filterable
                      remote
                      clearable
                      reserve-keyword
                      size="mini"
                      placeholder="请输入学员名称/学号"
                      :remote-method="remoteMethodStuByHui"
                      :loading="studentLoading"
                      style="width: 180px;"
                    >
                      <el-option
                        v-for="item in studentForm"
                        :key="item.accountId"
                        :label="
                          item.accountName + '(' + item.huiHuiNumber + ')'
                        "
                        :value="item.accountId"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <el-form-item style="float: right">
                <el-button
                  type="primary"
                  @click="queryNoStudySeller"
                  plain
                  :disabled="shake"
                  >查询</el-button
                >
                <el-button @click="cleanToSellerNoStudyForm">重置</el-button>
              </el-form-item>
            </el-form>
            <el-form
              size="mini"
              ref="sellerForm"
              :inline="true"
              :model="sellerNoStudyForm"
              label-width="84px"
            >
              <div class="">
                <el-form-item style="float: right">
                  <el-button @click="onExportSellerNoStudy">导出</el-button>
                </el-form-item>
              </div>
            </el-form>
            <el-table
              :data="sellerNoStudyTableData"
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
              <el-table-column align="left" label="公司/部门" min-width="150">
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.gmName }}
                    <span v-if="scope.row.gmName && scope.row.cyName">-</span
                    >{{ scope.row.cyName }}
                  </div>
                </template>
              </el-table-column>
              <!--              <el-table-column-->
              <!--                prop="cyName"-->
              <!--                align="left"-->
              <!--                label="产业"-->
              <!--                min-width="250"-->
              <!--                :show-overflow-tooltip="true"-->
              <!--              >-->
              <!--                <template slot-scope="scope">-->
              <!--                  <div>{{ scope.row.cyName }}</div>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <el-table-column
                prop="accountName"
                align="left"
                label="学员名称"
                min-width="150"
              >
                <template slot-scope="scope">
                  <div>{{ scope.row.accountName }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="employeeId"
                align="left"
                label="学号"
                min-width="150"
              >
                <template slot-scope="scope">
                  <div>{{ scope.row.employeeId }}</div>
                </template>
              </el-table-column>
            </el-table>
            <div class="page-contain">
              <el-pagination
                @size-change="onSellerNoStudyPageSizeChange"
                @current-change="onSellerNoStudyCurrentPageChange"
                :current-page="sellerNoStudyForm.pageNum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="sellerNoStudyForm.pageSize"
                layout="total,sizes, prev, pager, next,jumper"
                :total="sellerNoStudyTotal"
              >
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="作业批改情况"
          name="homeworkCorrection"
          v-if="detail.taskStatus == 1"
        >
          <div v-if="isHomework">
            <correction
              :classId="classid"
              :terminal="terminalCode"
            ></correction>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" src="./course-statistics.ts"></script>

<style scoped>
/deep/.el-dialog__body {
  padding: 0 20px;
}
/deep/.el-tabs__active-bar {
  min-width: 42px !important;
}
</style>
<style lang="scss" scoped>
.clearfloat:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}

.clearfloat {
  zoom: 1;
}
.content-top {
  color: #000000;
  font-size: 20px;
  font-weight: 600;
  .requirement {
    cursor: pointer;
    display: inline-block;
    color: #1989fa;
    font-size: 14px;
    margin-left: 10px;
    font-weight: 500;
  }
}
/*.marleft {*/
/*  margin-left: 200px;*/
/*}*/
.student-class {
  display: inline-block;
  height: 28px;
  line-height: 28px;
  .student-item {
    float: left;
    overflow: hidden;
    position: relative;
    max-width: 500px;
    width: 230px;
    display: inline-block;
    height: 28px;
    border-radius: 4px;
    border: 1px solid rgba(220, 223, 230, 1);
    line-height: 28px;
    padding: 0 15px;
    font-size: 12px;
    cursor: pointer;
    margin: 0 20px 0 10px;
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
      padding: 5px 14px;
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
  .time {
    color: #606266;
    font-size: 14px;
  }
  .mr-45 {
    margin-right: 45px;
  }
}
</style>
