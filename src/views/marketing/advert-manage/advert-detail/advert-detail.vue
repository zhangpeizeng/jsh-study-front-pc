<template>
  <div class="container-box">
    <div class="content" style="padding-bottom:0px;">
      <div class="title">基本信息</div>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">广告类型：</span>
        </el-col>
        <el-col :span="5" class="text-content">
          <span class="content-span" v-if="detailObj.advertType == 1">
            弹窗广告
          </span>
          <span class="content-span" v-if="detailObj.advertType == 2">
            轮播广告
          </span>
        </el-col>
      </el-row>
      <el-row type="flex" align="top" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">广告图：</span>
        </el-col>
        <el-col :span="15" class="text-content">
          <img :src="detailObj.advertUrl" style="width:178px;height:100px" />
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">标题：</span>
        </el-col>
        <el-col :span="15" class="text-content">
          <span class="content-span">{{ detailObj.advertName }}</span>
          <span class="content-status" v-if="detailObj.status == 1">
            已生效
          </span>
          <span class="content-status" v-if="detailObj.status == 2">
            待生效
          </span>
          <span class="content-status" v-if="detailObj.status == 3">
            已结束
          </span>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">所属学习终端：</span>
        </el-col>
        <el-col :span="8" class="text-content">
          <span v-for="(item, index) in throwIncludeList" :key="index">
            <span
              style="margin-right: 10px"
              v-show="item.throwTerminal === '1'"
              class="content-span"
            >
              客户端
            </span>
            <span
              style="margin-right: 10px"
              v-show="item.throwTerminal === '2'"
              class="content-span"
            >
              员工端
            </span>
            <span
              style="margin-right: 10px"
              v-show="item.throwTerminal === '3'"
              class="content-span"
            >
              直销员端
            </span>
            <span
              style="margin-right: 10px"
              v-show="item.throwTerminal === '4'"
              class="content-span"
            >
              售后端
            </span>
          </span>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">有效期：</span>
        </el-col>
        <el-col :span="7.5" class="text-content">
          <span class="content-span">
            {{ detailObj.startDate | date("yyyy-MM-dd hh:mm") }}-
            {{ detailObj.endDate | date("yyyy-MM-dd hh:mm") }}
          </span>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">广告链接内容：</span>
        </el-col>
        <el-col :span="10" class="text-content">
          <span
            class="content-span"
            v-if="throwIncludeList[0].advertJumpType == 1"
          >
            无
          </span>
          <span
            class="content-span"
            v-if="throwIncludeList[0].advertJumpType == 2"
          >
            课程
          </span>
          <span
            class="content-span"
            v-if="throwIncludeList[0].advertJumpType == 3"
          >
            运营主题
          </span>
          <span
            class="content-span"
            v-if="throwIncludeList[0].advertJumpType == 4"
          >
            自定义内容
          </span>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        align="bottom"
        :gutter="10"
        class="el-row"
        v-show="detailObj.throwIncludeList[0].advertJumpType == 4"
      >
        <el-col :span="2" class="text-right">
          <span></span>
        </el-col>
        <el-col :span="8" class="text-content">
          <div class="course-description">
            <div class="description-view">
              <u-editor-box :content="detailObj.content"></u-editor-box>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        align="middle"
        :gutter="10"
        class="el-row"
        v-show="throwIncludeList[0].advertJumpType === 2"
      >
        <el-col :span="2" class="text-right">
          <span></span>
        </el-col>
        <el-col :span="10" class="text-content">
          <div class="d-flex align-items-center">
            <div v-for="(item, index) in throwIncludeList" :key="index">
              <span style="color:#909399" v-show="item.throwTerminal === '1'">
                客户端：
              </span>
              <span style="color:#909399" v-show="item.throwTerminal === '2'">
                员工端：
              </span>
              <span style="color:#909399" v-show="item.throwTerminal === '3'">
                直销员端：
              </span>
              <span style="color:#909399" v-show="item.throwTerminal === '4'">
                售后端：
              </span>
              <span
                style="background-color: #F5F7FA;height: 25px;line-height: 25px;display: inline-block;vertical-align: middle;padding: 0 5px;margin-right: 10px"
              >
                <i class="el-icon-document" style="margin-right: 15px;"></i>
                <span
                  class="text-title"
                  style="color: #409EFF;font-size: 12px;"
                >
                  {{ item.courseName }}
                </span>
              </span>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        align="middle"
        :gutter="10"
        class="el-row"
        v-show="throwIncludeList[0].advertJumpType === 3"
      >
        <el-col :span="2" class="text-right">
          <span></span>
        </el-col>
        <el-col :span="10" class="text-content">
          <div class="d-flex align-items-center">
            <div v-for="(item, index) in throwIncludeList" :key="index">
              <span style="color:#909399" v-show="item.throwTerminal === '1'">
                客户端：
              </span>
              <span style="color:#909399" v-show="item.throwTerminal === '2'">
                员工端：
              </span>
              <span style="color:#909399" v-show="item.throwTerminal === '3'">
                直销员端：
              </span>
              <span style="color:#909399" v-show="item.throwTerminal === '4'">
                售后端：
              </span>
              <span
                style="background-color: #F5F7FA;height: 25px;line-height: 25px;display: inline-block;vertical-align: middle;padding: 0 5px;margin-right: 10px"
              >
                <i class="el-icon-document" style="margin-right: 15px;"></i>
                <span
                  class="text-title"
                  style="color: #409EFF;font-size: 12px;"
                >
                  {{ item.themeName }}
                </span>
              </span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="content" style="padding-bottom:40px;">
      <div class="title" style="background: white">学员范围</div>
      <!--      <el-row type="flex" align="middle" :gutter="10" class="el-row">-->
      <!--        <el-col :span="2" class="text-right">-->
      <!--          <span class="text-title">投放范围：</span>-->
      <!--        </el-col>-->
      <!--        <el-col :span="5" class="text-content">-->
      <!--          <span class="content-span" v-if="detailObj.throwType == 'A'">-->
      <!--            全部-->
      <!--          </span>-->
      <!--          <span class="content-span" v-if="detailObj.throwType == 'C'">-->
      <!--            按学员标签-->
      <!--          </span>-->
      <!--          <span class="content-span" v-if="detailObj.throwType == 'D'">-->
      <!--            指定学员-->
      <!--          </span>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <!--      <el-row-->
      <!--        type="flex"-->
      <!--        align="middle"-->
      <!--        :gutter="10"-->
      <!--        class="el-row"-->
      <!--        v-if="detailObj.throwType == 'C'"-->
      <!--      >-->
      <!--        <el-col :span="2" class="text-right">-->
      <!--          <span class="text-title"></span>-->
      <!--        </el-col>-->
      <!--        <el-col :span="5" class="text-content">-->
      <!--          <span class="content-span">{{ detailObj.tagString }}</span>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <!--      <div class="student-scope-continer" v-if="detailObj.throwType == 'D'">-->
      <!--        <div>-->
      <!--          &lt;!&ndash;-指定学员-&ndash;&gt;-->
      <!--          <div style="margin-top: 20px;">-->
      <!--            <template>-->
      <!--              <div class="d-flex align-items-center justify-content-between">-->
      <!--                <el-button-->
      <!--                  type="primary"-->
      <!--                  size="mini"-->
      <!--                  @click="exportData"-->
      <!--                  style="width:82px"-->
      <!--                  >导出</el-button-->
      <!--                >-->
      <!--                <div style="color: #909399;font-size: 12px;margin-right: 24px">-->
      <!--                  <img-->
      <!--                    src="../../../../assets/images/icon-help.png"-->
      <!--                    style="width:14px;height:14px;margin-right:3px"-->
      <!--                  />-->
      <!--                  仅展示当前已激活学员数据-->
      <!--                </div>-->
      <!--              </div>-->
      <!--            </template>-->
      <!--            <el-table-->
      <!--              v-if="detailObj.type != 3"-->
      <!--              :data="detailObj.orgValueList"-->
      <!--              style="width: 100%"-->
      <!--            >-->
      <!--              <el-table-column-->
      <!--                type="index"-->
      <!--                label="序号"-->
      <!--                min-width="100px"-->
      <!--              ></el-table-column>-->
      <!--              <el-table-column-->
      <!--                prop="orgCode"-->
      <!--                label="公司编码"-->
      <!--                min-width="300px"-->
      <!--              ></el-table-column>-->
      <!--              <el-table-column-->
      <!--                v-if="detailObj.type == 1"-->
      <!--                prop="orgName"-->
      <!--                min-width="300px"-->
      <!--                label="公司名称"-->
      <!--              >-->
      <!--              </el-table-column>-->
      <!--              <el-table-column-->
      <!--                min-width="100px"-->
      <!--                label="公司/部门"-->
      <!--                v-if="detailObj.type == 2"-->
      <!--              >-->
      <!--                <template slot-scope="scope">-->
      <!--                  <span>-->
      <!--                    {{ scope.row.orgName }}-->
      <!--                  </span>-->
      <!--                  <span v-if="scope.row.orgName && scope.row.departmentName"-->
      <!--                    >-</span-->
      <!--                  >-->
      <!--                  <span>-->
      <!--                    {{ scope.row.departmentName }}-->
      <!--                  </span>-->
      <!--                </template>-->
      <!--              </el-table-column>-->
      <!--              <el-table-column prop="count" min-width="200px" label="学员数量">-->
      <!--              </el-table-column>-->
      <!--            </el-table>-->
      <!--            <el-table-->
      <!--              v-if="detailObj.type == 3"-->
      <!--              :data="detailObj.orgValueList"-->
      <!--              style="width: 100%"-->
      <!--            >-->
      <!--              <el-table-column-->
      <!--                align="center"-->
      <!--                type="index"-->
      <!--                label="序号"-->
      <!--              ></el-table-column>-->
      <!--              <el-table-column-->
      <!--                prop="accountName"-->
      <!--                label="学员名称"-->
      <!--                align="center"-->
      <!--              ></el-table-column>-->
      <!--              <el-table-column align="center" prop="huihuiNumber" label="学号">-->
      <!--              </el-table-column>-->
      <!--              <el-table-column align="center" prop="phone" label="学员手机号">-->
      <!--                <template slot-scope="scope">-->
      <!--                  <span>{{ scope.row.phone }}</span>-->
      <!--                </template>-->
      <!--              </el-table-column>-->
      <!--              <el-table-column align="center" prop="status" label="状态">-->
      <!--                <template slot-scope="scope">-->
      <!--                  <span v-if="scope.row.status == null">-->
      <!--                    未激活-->
      <!--                  </span>-->
      <!--                  <span v-if="scope.row.status == '1'">-->
      <!--                    正常-->
      <!--                  </span>-->
      <!--                  <span-->
      <!--                    v-if="scope.row.status == '2' || scope.row.status == '0'"-->
      <!--                  >-->
      <!--                    冻结-->
      <!--                  </span>-->
      <!--                  <span v-if="scope.row.status == '3'">-->
      <!--                    已注销-->
      <!--                  </span>-->
      <!--                </template>-->
      <!--              </el-table-column>-->
      <!--            </el-table>-->
      <!--            <div style="padding-top: 15px;text-align: center;" class="block">-->
      <!--              <el-pagination-->
      <!--                :current-page="currentChange"-->
      <!--                :page-size="10"-->
      <!--                :page-sizes="[10, 20, 50, 100]"-->
      <!--                layout="total, sizes, prev, pager, next,jumper"-->
      <!--                :total="total"-->
      <!--                @size-change="handleSizeChange"-->
      <!--                @current-change="handleCurrentChange"-->
      <!--              />-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <advertScopeDetail v-show="tableFlag1" labelCode="1" />
      <advertScopeDetail v-show="tableFlag2" labelCode="2" />
      <advertScopeDetail v-show="tableFlag3" labelCode="3" />
      <advertScopeDetail v-show="tableFlag4" labelCode="4" />
    </div>
    <!-- 底部按钮 start -->
    <div class="footer-bottom-container">
      <template>
        <el-button size="mini" @click="close">关闭</el-button>
        <el-button size="mini" @click="advertDel">
          删除
        </el-button>
        <el-button type="primary" size="mini" @click="update">
          修改
        </el-button>
      </template>
    </div>
    <!-- 底部按钮 end -->
  </div>
</template>

<script lang="ts" src="./advert-detail.ts"></script>

<style lang="scss">
.course-description {
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
.container-box {
  .header-form {
    color: #999999;
    font-size: 12px;
    padding-bottom: 6px;
    border-bottom: 1px solid #dcdfe6;
    span {
      color: #666666;
    }
  }
  .content {
    padding: 24px 0;
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
      .content-status {
        margin-left: 7px;
        padding: 4px 7px;
        line-height: 20px;
        background: #ecf5ff;
        color: #409eff;
        font-size: 12px;
        border: 1px solid #409eff;
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
      .certificate-box {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        .certificate-left {
          text-align: right;
          font-size: 14px;
          color: #909399;
        }
        .certificate-right {
          font-size: 14px;
          color: #909399;
        }
        img {
          width: 216px;
          height: 147px;
        }
      }
      .text-img-content {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .layout-box {
          margin-right: 15px;
          img {
            width: 172px;
            height: 100px;
          }
        }
      }
    }
  }
  .pt-content {
    padding-top: 0;
    padding-bottom: 15px;
  }
  .medal-name-box {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
    .medal-name {
      color: #606266;
    }
    .mt-80 {
      margin-top: 80px;
    }
    .mt-26 {
      margin-top: 26px;
    }
  }
  .medal-list {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    .medal-content-box {
      width: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .medal-icon {
        width: 60px;
        height: 60px;
        border-radius: 50px;
        background: #dcdfe6;
        img {
          width: 60px;
          height: 60px;
        }
      }
      .medal-content {
        margin-top: 18px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .medal-icon-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
    }
    .medal-colon-box {
      width: 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
  .button-block {
    width: 98px;
    height: 36px;
    line-height: 36px;
    border-radius: 4px;
    text-align: center;
    background: #ffffff;
    border: 1px solid #409eff;
    color: #409eff;
    font-size: 14px;
    cursor: pointer;
  }
}
.student-scope-continer {
  padding-left: 24px;
}
</style>
