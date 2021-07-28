<template>
  <div>
    <div class="container-box">
      <div class="content">
        <div style="width:60%">
          <div class="title">基本信息</div>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="text-title">所属学习终端：</span>
            </el-col>
            <el-col :span="4" class="text-content">
              <span class="organ">
                <img
                  style="width: 18px;height: 18px"
                  src="../../../../assets/images/organ1.png"
                  alt=""
                />
                <span v-if="labelCode === '1'"> 客户端</span>
                <span v-if="labelCode === '2'"> 员工端</span>
                <span v-if="labelCode === '3'"> 直销员端</span>
                <span v-if="labelCode === '4'"> 售后端</span>
              </span>
            </el-col>
            <el-col :span="4" class="text-right">
              <span class="text-title">所属机构：</span>
            </el-col>
            <el-col :span="5" class="text-content">
              <span class="organ">
                <img
                  style="width: 18px;height: 18px"
                  src="../../../../assets/images/organ2.png"
                  alt=""
                />
                {{ organName }}
              </span>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="text-title"
                ><span style="color: #FF0000">*</span>主题名称：</span
              >
            </el-col>
            <el-col :span="14" class="text-content">
              <el-input
                v-model="themeTitle"
                maxlength="18"
                placeholder="请输入"
              ></el-input>
            </el-col>
          </el-row>
        </div>
        <div>
          <div style="margin-top: 9px" class="title">课程信息</div>
          <div style="padding-left: 20px">
            <el-button
              @click="openAddCourse()"
              icon="el-icon-circle-plus-outline"
              type="primary"
            >
              添加课程
            </el-button>
          </div>
          <el-dialog
            title="选择课程"
            width="836px"
            custom-class="addStudent-dialog"
            :close-on-click-modal="false"
            :visible.sync="selectCourseDialog"
          >
            <add-course
              :id="id"
              :choosedCourse="studentTableData"
              :studyTerminal="labelCode"
              v-if="selectCourseDialog"
              @confirm="confirmCoursePopup"
              @cancel="selectCourseDialog = false"
            >
            </add-course>
          </el-dialog>
          <div style="padding: 20px">
            <el-table
              fit
              v-loading="lecturerLoading"
              :data="themeTableData"
              header-cell-class-name="table-header-cell"
            >
              <el-table-column label="序号" min-width="70px">
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
              <el-table-column label="课程名称">
                <template slot-scope="scope">
                  <div class="brand-text">
                    <span>{{ scope.row.courseName }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="讲师">
                <template slot-scope="scope">
                  <div class="brand-text">
                    <span>{{ scope.row.lecturerName }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="statusStr" label="课程状态" align="center">
              </el-table-column>
              <el-table-column label="学习时间">
                <template slot-scope="scope">
                  <div class="brand-text">
                    <span v-if="scope.row.studyStartTime"
                      >{{
                        scope.row.studyStartTime | date("yyyy-MM-dd hh:mm")
                      }}至{{
                        scope.row.studyEndTime | date("yyyy-MM-dd hh:mm")
                      }}</span
                    >
                    <span v-else>-</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="操作" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.status === 1">正常</span>
                  <el-button size="small" @click="deletList(scope.$index)">
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
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
      </div>
      <div class="footer-bottom-container">
        <template>
          <el-button size="small" @click="close">返回</el-button>
          <el-button size="small" @click="save()" type="primary"
            >立即发布</el-button
          >
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./add-organ-theme.ts"></script>

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
  .cursor {
    cursor: pointer;
  }
}

.organ {
  padding: 6px 12px;
  border-radius: 20px;
  background: rgba(238, 244, 252, 1);
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
    margin-left: 20px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(64, 158, 255, 1);
    background: rgba(236, 245, 255, 1);
    border: 1px solid rgba(64, 158, 255, 1);
    padding: 1px 5px;
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
