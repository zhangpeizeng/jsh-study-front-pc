<template>
  <div>
    <div class="container-box">
      <div class="content">
        <div>
          <div class="title">基本信息</div>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="2" class="text-right">
              <span class="text-title">所属终端：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span>{{ detailData.studyTerminalName }}</span>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="2" class="text-right">
              <span class="text-title">所属机构：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span>{{ detailData.firstClassifyName }}</span>
            </el-col>
          </el-row>
          <el-row type="flex" align="top" :gutter="11" class="el-row">
            <el-col :span="2" class="text-right">
              <span class="text-title">主题名称：</span>
            </el-col>
            <el-col :span="10" class="text-content">
              <span>{{ detailData.classifyName }}</span>
              <span
                v-if="detailData.themeStatus == 0"
                style="background:rgba(247,249,253,1);border:1px solid rgba(235,238,245,1);color:rgba(190,196,209,1);padding: 3px 7px;margin-left: 7px"
                >已下架</span
              >
              <span
                v-if="detailData.themeStatus == 1"
                style="border:1px solid rgba(64,158,255,1);background:rgba(236,245,255,1);color:rgba(64,158,255,1);padding: 3px 7px;margin-left: 7px"
                >已上架</span
              >
            </el-col>
          </el-row>
        </div>
        <div>
          <div class="title">课程信息</div>
          <!--                    <div style="padding-left: 20px">-->
          <!--                        <el-button type="primary" @click="exportList()">导出</el-button>-->
          <!--                    </div>-->
          <div style="padding: 20px">
            <el-table
              fit
              v-loading="lecturerLoading"
              :data="themeTableData"
              header-cell-class-name="table-header-cell"
            >
              <el-table-column
                type="index"
                label="课程排序"
                width="80px"
              ></el-table-column>
              <el-table-column label="课程名称" :show-overflow-tooltip="true">
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
              <el-table-column prop="statusStr" label="课程状态">
              </el-table-column>
              <el-table-column label="学习时间" min-width="110px">
                <template slot-scope="scope">
                  <div class="brand-text">
                    <span v-if="scope.row.studyTime">
                      <span
                        >{{
                          scope.row.studyStartTime | date("yyyy-MM-dd hh:mm")
                        }}至{{
                          scope.row.studyEndTime | date("yyyy-MM-dd hh:mm")
                        }}</span
                      >
                    </span>
                    <span v-else> - </span>
                  </div>
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
          <el-button @click="editStudent" size="small" type="primary">
            修改
          </el-button>
          <el-button
            plain
            type="primary"
            size="small"
            @click="userOrStop('ENABLE')"
            v-if="detailData.themeStatus == '0'"
          >
            上架
          </el-button>
          <el-button
            v-if="detailData.themeStatus == '1'"
            @click="userOrStop('STOP')"
            plain
            type="primary"
            size="small"
          >
            下架
          </el-button>
          <el-button
            @click="deleteGroup()"
            plain
            size="small"
            v-if="detailData.themeStatus == '0'"
          >
            删除
          </el-button>
          <el-button size="small" @click="close">关闭</el-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./organ-theme-detail.ts"></script>

<style lang="scss" scoped>
.container-box {
  color: #909399;
  &::v-deep .table-header-cell .cell {
    color: #909399;
  }
}
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
          color: #909399;
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
