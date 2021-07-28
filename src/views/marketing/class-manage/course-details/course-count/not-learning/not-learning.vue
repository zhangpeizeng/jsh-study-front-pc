<script src="course-statistics.ts"></script>
<template>
  <div style=" background-color: #ffffff">
    <div class="table-body">
      <el-form
        size="mini"
        ref="form"
        :inline="true"
        :model="form"
        style="overflow: hidden"
        label-width="84px"
        @submit.native.prevent
      >
        <div class="student-class clearfloat">
          <div style="float: left;">
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
            <el-form-item label="公司编码/名称" label-width="120px">
              <el-select
                v-model="form.orgNameOrCode"
                filterable
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
                  v-for="item in studentForm1"
                  :key="item.accountId"
                  :label="
                    item.accountName + '(' + phoneFilter(item.phone) + ')'
                  "
                  :value="item.accountId"
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
      <el-form size="mini" ref="form" :inline="true" label-width="84px">
        <el-form-item style="float: right">
          <el-button @click="exportList">导出</el-button>
        </el-form-item>
      </el-form>
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
        <el-table-column
          prop="gmName"
          align="left"
          label="中心"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="companyCode"
          align="left"
          label="公司编码"
          min-width="150"
        ></el-table-column>
        <el-table-column
          prop="departmentAbbreviation"
          align="left"
          min-width="150"
          label="公司/部门"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.companyAbbreviation != null">{{
              scope.row.companyAbbreviation
            }}</span>
            <span
              v-if="
                (scope.row.companyAbbreviation != null &&
                  scope.row.departmentAbbreviation != null) ||
                  (scope.row.companyAbbreviation == null &&
                    scope.row.departmentAbbreviation == null)
              "
            >
              -
            </span>
            <span v-if="scope.row.departmentAbbreviation != null">{{
              scope.row.departmentAbbreviation
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="accountName"
          align="left"
          label="学员名称"
          min-width="150"
        ></el-table-column>
        <el-table-column
          prop="accountCode"
          align="left"
          min-width="150"
          label="学号"
        ></el-table-column>
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
    <!--    作业要求弹框-->
    <el-dialog title="作业要求" :visible.sync="dialogFormVisible" width="40%">
      <div class="lai-active">
        <div v-html="requirement"></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small"
          >关闭</el-button
        >
      </div>
    </el-dialog>
    <!--    作业查看弹框-->
    <el-dialog
      title="作业查看"
      :visible.sync="jobLook"
      v-loading="bodyLoading"
      element-loading-text="下载中..."
    >
      <div class="detailed1">
        <div class="diamond"></div>
        <div>作业内容</div>
      </div>
      <div class="clearfloat">
        <div class="content-left">
          作业内容
        </div>
        <div class="content-right">
          <div class="img-content clearfloat">
            <div
              class="content-img "
              style="float: left"
              v-for="item in jobDetails.dates"
              :key="item.value"
            >
              <div>
                <el-image
                  v-if="item.type == 0"
                  :src="item.value"
                  class="job-img"
                  :preview-src-list="imgClick(item.value)"
                >
                </el-image>
                <div
                  class="content-down"
                  v-if="item.type == 0"
                  @click="down('1', item.value)"
                >
                  <i
                    style="font-size: 20px;cursor: pointer;"
                    class="el-icon-download"
                  ></i>
                </div>
              </div>
              <div style="float: left">
                <img
                  class="job-img"
                  v-if="item.type != 0"
                  src="@/assets/images/video.png"
                  alt=""
                />
                <div
                  class="content-down"
                  v-if="item.type != 0"
                  @click="down('mp4', item.value)"
                >
                  <i
                    style="font-size: 20px;cursor: pointer;"
                    class="el-icon-download"
                  ></i>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-10" v-if="jobDetails.dates !== null">
            <el-button size="mini" type="text" @click="downAll"
              ><i class="el-icon-download" type="text"></i>全部下载</el-button
            >
          </div>
          <div class="job-content">
            {{ jobDetails.desc }}
          </div>
        </div>
        <div v-if="jobDetails.status == 1">
          <div class="detailed1" style="margin-top: 15px;">
            <div class="diamond"></div>
            <div>作业评价</div>
          </div>
          <div class="clearfloat">
            <div class="content-left job-score">
              分值
            </div>
            <div class="content-right job-score">
              {{ jobDetails.score }}
              <span
                style="margin-left: 30px;color: #F56C6C;font-size: 12px;"
                class="job-score"
                ><i class="el-icon-warning-outline" type="text"></i>
                新增试卷后请重新查询 ~</span
              >
            </div>
          </div>
          <div class="clearfloat">
            <div v-if="jobDetails.remark !== ''" class="content-left job-score">
              评语
            </div>
            <div
              v-if="jobDetails.remark !== ''"
              class="content-right job-score"
            >
              {{ jobDetails.remark }}
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="jobLook = false" size="small">关闭</el-button>
      </div>
    </el-dialog>
    <!--    作业批改弹框-->
    <el-dialog
      title="作业批改"
      @close="closeWork"
      :visible.sync="jobCorrection"
      v-loading="bodyLoading"
      element-loading-text="下载中..."
    >
      <div class="detailed1">
        <div class="diamond"></div>
        <div>作业内容</div>
      </div>
      <div class="clearfloat">
        <div class="content-left">
          作业内容
        </div>
        <div class="content-right">
          <div class="img-content clearfloat">
            <div
              class="content-img "
              style="float: left"
              v-for="item in jobDetails.dates"
              :key="item.value"
            >
              <div>
                <el-image
                  v-if="item.type == 0"
                  :src="item.value"
                  class="job-img"
                  :preview-src-list="imgClick(item.value)"
                >
                </el-image>
                <div
                  class="content-down"
                  v-if="item.type == 0"
                  @click="down('1', item.value)"
                >
                  <i
                    style="font-size: 20px;cursor: pointer;"
                    class="el-icon-download"
                  ></i>
                </div>
              </div>
              <div style="float: left">
                <img
                  class="job-img"
                  v-if="item.type != 0"
                  src="@/assets/images/video.png"
                  alt=""
                />
                <div
                  class="content-down"
                  v-if="item.type != 0"
                  @click="down('mp4', item.value)"
                >
                  <i
                    style="font-size: 20px;cursor: pointer;"
                    class="el-icon-download"
                  ></i>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-10" v-if="jobDetails.dates !== null">
            <el-button size="mini" type="text" @click="downAll"
              ><i class="el-icon-download" type="text"></i>全部下载</el-button
            >
          </div>
          <div class="job-content">
            {{ jobDetails.desc }}
          </div>
        </div>
      </div>
      <div class="detailed1" style="margin-top: 15px;">
        <div class="diamond"></div>
        <div>作业批改</div>
      </div>
      <div class="clearfloat">
        <div class="content-left job-score">
          <span style="color: #FF0000;">*</span> 分值
        </div>
        <div class="content-right">
          <el-input
            size="mini"
            style="width: 50%"
            v-model="score"
            placeholder="请输入分值"
            pattern="[0-9]*"
            @input="proPortionTest()"
            onkeyup="this.value=this.value.replace(/\D/g,'')"
            onafterpaste="this.value=this.value.replace(/\D/g,'')"
          ></el-input>
        </div>
      </div>
      <div class="clearfloat" style="margin-top: 20px">
        <div class="content-left job-score">
          评语
        </div>
        <div class="content-right">
          <el-input
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 6 }"
            placeholder="请输入评语"
            v-model="remark"
            style="width: 50%"
          >
          </el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="jobCorrection = false" size="small">取消</el-button>
        <el-button
          @click="correctionClick"
          type="primary"
          size="small"
          :disabled="shake"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" src="./not-learning.ts"></script>

<style scoped>
/deep/.el-dialog__body {
  padding: 0 20px;
}
</style>

<style lang="scss">
.lai-active {
  width: 100%;
  .ql-align-center {
    text-align: center;
  }
  .ql-align-right {
    text-align: right;
  }
  img {
    width: 100%;
  }
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
.img-content {
  .content-img:hover .content-down {
    display: block;
  }
  .content-img {
    position: relative;
    width: 157px;
    height: 100px;
    display: inline-block;
    margin-right: 5px;
    margin-bottom: 5px;
    .job-img {
      width: 157px;
      height: 100px;
      margin-right: 5px;
      margin-bottom: 5px;
      cursor: pointer;
    }
    .content-down {
      display: none;
      position: absolute;
      right: 0;
      top: 0;
      width: 25px;
      height: 25px;
      z-index: 99;
      background-color: rgba(0, 0, 0, 0.6);
      text-align: center;
      line-height: 30px;
      color: #ffffff;
    }
  }
}
.content-top {
  margin: 15px 0;
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
.marleft {
  margin-left: 200px;
}
.student-class {
  display: inline-block;
  height: 28px;
  line-height: 28px;
  .student-item {
    float: left;
    overflow: hidden;
    position: relative;
    max-width: 500px;
    width: 280px;
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
.dialog-footer {
  text-align: center;
}
.job-content {
  color: #909399;
  font-size: 14px;
  padding-bottom: 16px;
}
.detailed {
  font-size: 16px;
  font-weight: 600;
  width: 150px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-self: center;
  background-color: rgba(242, 242, 242, 1);
  margin-bottom: 20px;
  margin-left: -24px;
  border-radius: 0 100px 100px 0;
}
.detailed1 {
  font-size: 16px;
  font-weight: 600;
  width: 150px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-self: center;
  background-color: rgba(242, 242, 242, 1);
  margin-bottom: 20px;
  margin-left: -20px;
  border-radius: 0 100px 100px 0;
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
.diamond {
  width: 13px;
  height: 13px;
  margin-left: 5px;
  background-color: #555555;
  margin-right: 15px;
  transform: rotate(45deg);
  -ms-transform: rotate(45deg); /* Internet Explorer */
  -moz-transform: rotate(45deg); /* Firefox */
  -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
  -o-transform: rotate(45deg); /* Opera */
}
.job-score {
  display: inline-block;
}
.page-contain {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 60px;
}
.content-left {
  float: left;
  width: 10%;
  text-align: right;
}
.content-right {
  float: right;
  width: 89%;
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
