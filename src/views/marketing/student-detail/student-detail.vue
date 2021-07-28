<template>
  <div>
    <div class="container-box">
      <!--基本信息-->
      <div class="content">
        <div style="width: 60%;">
          <div class="title">基本信息</div>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="text-title">所属学习终端：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span v-if="studentInfo.studyTerminal === '1'">客户端</span>
              <span v-else-if="studentInfo.studyTerminal === '2'">员工端</span>
              <span v-else-if="studentInfo.studyTerminal === '3'"
                >直销员端</span
              >
              <span v-else-if="studentInfo.studyTerminal === '4'">售后端</span>
              <span v-else> - </span>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="text-title">学员名称：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span v-if="studentInfo.accountName != null">{{
                studentInfo.accountName
              }}</span>
              <span v-if="studentInfo.accountName == null"> - </span>
              <span v-if="status === '1'" class="status">正常</span>
              <span v-if="status === '0'" class="status">冻结</span>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="text-title">学员类型：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span v-if="studentInfo.type == 1">社会化</span>
              <span v-if="studentInfo.type == 2">非社会化</span>
              <!--              <span v-if="studentInfo.huiHuiNumber == null"> - </span>-->
            </el-col>
          </el-row>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="text-title">学号：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span v-if="studentInfo.huiHuiNumber != null">{{
                studentInfo.huiHuiNumber
              }}</span>
              <span v-if="studentInfo.huiHuiNumber == null"> - </span>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="text-title">手机号：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span v-if="studentInfo.phone != ''">{{
                studentInfo.phone
              }}</span>
              <span v-if="studentInfo.phone == '' || studentInfo.phone == null">
                -
              </span>
            </el-col>
          </el-row>
          <el-row
            v-if="studentInfo.studyTerminal === '1'"
            type="flex"
            align="middle"
            :gutter="11"
            class="el-row"
          >
            <el-col :span="4" class="text-right">
              <span class="text-title">公司编码：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span v-if="studentInfo.orgCode != null">{{
                studentInfo.orgCode
              }}</span>
              <span v-if="studentInfo.orgCode == null"> - </span>
            </el-col>
          </el-row>
          <el-row
            v-if="studentInfo.studyTerminal === '1'"
            type="flex"
            align="middle"
            :gutter="11"
            class="el-row"
          >
            <el-col :span="4" class="text-right">
              <span class="text-title">公司/部门：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span v-if="studentInfo.orgName != null">{{
                studentInfo.orgName
              }}</span>
              <span
                v-if="
                  (studentInfo.departmentName != null &&
                    studentInfo.orgName != null) ||
                    (studentInfo.departmentName == null &&
                      studentInfo.orgName == null)
                "
              >
                -
              </span>
              <span v-if="studentInfo.departmentName != null">{{
                studentInfo.departmentName
              }}</span>
            </el-col>
          </el-row>
          <el-row
            v-if="studentInfo.studyTerminal !== '1'"
            type="flex"
            align="middle"
            :gutter="11"
            class="el-row"
          >
            <el-col :span="4" class="text-right">
              <!--              所属组织-->
              <span class="text-title">公司/部门：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span v-if="studentInfo.orgName != null">{{
                studentInfo.orgName
              }}</span>
              <span
                v-if="
                  (studentInfo.departmentName != null &&
                    studentInfo.orgName != null) ||
                    (studentInfo.departmentName == null &&
                      studentInfo.orgName == null)
                "
              >
                -
              </span>
              <span v-if="studentInfo.departmentName != null">{{
                studentInfo.departmentName
              }}</span>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="text-title">所属分组：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span v-if="studentInfo.groupingName != null">{{
                studentInfo.groupingName
              }}</span>
              <span v-if="studentInfo.groupingName == null"> - </span>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="text-title">激活时间：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span v-if="studentInfo.createTime != null">{{
                studentInfo.createTime
              }}</span>
              <span v-if="studentInfo.createTime == null"> - </span>
            </el-col>
          </el-row>
        </div>
        <div style="width: 60%;">
          <div class="title">学员标签</div>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="text-title">中心：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span v-if="studentLabel.gmName != null">{{
                studentLabel.gmName
              }}</span>
              <span v-if="studentLabel.gmName == null"> - </span>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="text-title">产业：</span>
            </el-col>
            <el-col :span="20" class="text-content">
              <span v-if="studentLabel.product != null">{{
                studentLabel.product
              }}</span>
              <span v-if="studentLabel.product == null"> - </span>
            </el-col>
          </el-row>
          <el-row
            v-if="studentInfo.studyTerminal === '3'"
            type="flex"
            align="middle"
            :gutter="11"
            class="el-row"
          >
            <el-col :span="4" class="text-right">
              <span class="text-title">等级：</span>
            </el-col>
            <el-col :span="20" class="text-content">
              <span v-if="studentLabel.levelName != null">{{
                studentLabel.levelName
              }}</span>
              <span v-if="studentLabel.levelName == null"> - </span>
            </el-col>
          </el-row>
          <el-row
            v-if="studentInfo.studyTerminal === '1'"
            type="flex"
            align="middle"
            :gutter="11"
            class="el-row"
          >
            <el-col :span="4" class="text-right">
              <span class="text-title">品牌类型：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span v-if="studentLabel.brand != null">{{
                studentLabel.brand
              }}</span>
              <span v-if="studentLabel.brand == null"> - </span>
            </el-col>
          </el-row>
          <el-row
            v-if="
              studentInfo.studyTerminal === '1' ||
                studentInfo.studyTerminal === '3'
            "
            type="flex"
            align="middle"
            :gutter="11"
            class="el-row"
          >
            <el-col :span="4" class="text-right">
              <span class="text-title">大渠道：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span v-if="studentLabel.channel != null">{{
                studentLabel.channel
              }}</span>
              <span v-if="studentLabel.channel == null"> - </span>
            </el-col>
          </el-row>
          <el-row
            v-if="studentInfo.studyTerminal === '1'"
            type="flex"
            align="middle"
            :gutter="11"
            class="el-row"
          >
            <el-col :span="4" class="text-right">
              <span class="text-title">客户类型：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span v-if="studentLabel.customerType != null">{{
                studentLabel.customerType
              }}</span>
              <span v-if="studentLabel.customerType == null"> - </span>
            </el-col>
          </el-row>
          <el-row
            v-if="
              studentInfo.studyTerminal === '1' ||
                studentInfo.studyTerminal === '2'
            "
            type="flex"
            align="middle"
            :gutter="11"
            class="el-row"
          >
            <el-col :span="4" class="text-right">
              <span class="text-title">角色：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span v-if="studentLabel.role != null">{{
                studentLabel.role
              }}</span>
              <span v-if="studentLabel.role == null"> - </span>
            </el-col>
          </el-row>
        </div>
      </div>
      <!--底部按钮区域-->
      <div class="footer-bottom-container">
        <template>
          <el-button
            v-if="studentInfo.type == 1"
            size="small"
            type="primary"
            @click="reviseStudent()"
            >修改</el-button
          >
          <el-button
            v-if="status === '0'"
            size="small"
            type="primary"
            plain
            @click="frozen"
            >解冻</el-button
          >
          <el-button
            v-if="status === '1'"
            size="small"
            type="primary"
            plain
            @click="frozen"
            >冻结</el-button
          >
          <el-button size="small" @click="close">关闭</el-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./student-detail.ts"></script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  padding-left: 160px;
  background-color: #fff;
  border-bottom: 1px #f2f2f2 solid;
  z-index: 100;
}
.logo {
  position: fixed;
  top: 0;
  left: 0;
  width: 160px;
  height: 70px;
  text-align: center;
  background-color: #409eff;
  z-index: 101;
}
.permissions {
  margin-top: 70px;
  padding: 14px 20px;
}
.apply-error {
  padding: 1px 16px;
  background: #fef0f0;
  border: 1px solid #f56c6c;
  color: #f56c6c;
  border-radius: 4px;
  margin-left: 24px;
  width: 25%;
}
.container-box {
  .status {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(64, 158, 255, 1);
    background: rgba(236, 245, 255, 1);
    border: 1px solid rgba(64, 158, 255, 1);
    padding: 1px 5px;
    margin-left: 10px;
  }
  .el-select {
    width: 100%;
  }
  background: #ffffff;
  .apply-step-box {
    padding: 24px 104px;
  }
  .content {
    padding: 24px 0 60px 0;
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
    .el-row {
      margin-bottom: 15px;
      .text-right {
        text-align: right;
        .text-title {
          color: #606266;
        }
      }
      .text-content {
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
        .button-check {
          width: 88px;
          background: #ffffff;
          color: #409eff;
          border: 1px solid #409eff;
          border-radius: 0px 4px 4px 0px;
        }
        .color-red {
          color: #f56c6c;
        }
        .font-12 {
          font-size: 12px;
        }
      }
      .word-break {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .require-icon {
        font-size: 14px;
        color: #ff0000;
      }
    }
  }
}
</style>
