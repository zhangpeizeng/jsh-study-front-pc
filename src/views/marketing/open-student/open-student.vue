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
            <el-col :span="14" class="text-content">
              <span>直销员端</span>
              <!--                            <el-select-->
              <!--                                    v-model="studyTerminals"-->
              <!--                                    placeholder="请选择终端"-->
              <!--                            >-->
              <!--                                <el-option-->
              <!--                                        v-for="item in terminalsListData"-->
              <!--                                        :key="item.terminalCode"-->
              <!--                                        :label="item.terminalName"-->
              <!--                                        :value="item.terminalCode"-->
              <!--                                >-->
              <!--                                </el-option>-->
              <!--                            </el-select>-->
            </el-col>
          </el-row>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="text-title"
                ><span style="color: #FF0000">*</span>学员名称：</span
              >
            </el-col>
            <el-col :span="14" class="text-content">
              <el-input
                v-model="customerName"
                maxlength="12"
                placeholder="请输入"
              ></el-input>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="text-title"
                ><span style="color: #FF0000">*</span>手机号：</span
              >
            </el-col>
            <el-col :span="14" class="text-content">
              <el-input
                v-model="phone"
                maxlength="11"
                placeholder="请输入"
                onkeyup="this.value = this.value.replace(/\D/g,'');"
              ></el-input>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="text-title"
                ><span style="color: #FF0000">*</span>组织：</span
              >
            </el-col>
            <el-col :span="14" class="text-content">
              <!--                            <div style="width: 98px;height: 36px;line-height: 36px;text-align: center;color: #409EFF;border: 1px solid #409EFF;cursor: pointer">-->
              <!--                                选择组织-->
              <!--                            </div>-->
              <organization-tree
                :label-code="labelCode"
                @check="courseGroupCodes = $event"
                @instance="instanceTree"
              ></organization-tree>
            </el-col>
          </el-row>
        </div>
        <div style="width: 60%">
          <div class="title">学员标签</div>
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="text-title">中心</span>
            </el-col>
            <el-col :span="14">
              <el-select
                v-model="center"
                placeholder="请选择"
                collapse-tags
                filterable
                clearable
              >
                <!--                                <el-option label="全部" value="all"></el-option>-->
                <el-option
                  v-for="item in centerList"
                  :key="item.tagCodeCollege"
                  :label="item.tagName"
                  :value="item.tagCodeCollege"
                >
                </el-option>
              </el-select>
            </el-col>
            <!--                        <el-col :span="5" class="text-right"> </el-col>-->
          </el-row>
          <!--                    <el-row type="flex" align="middle" :gutter="11" class="el-row">-->
          <!--                        <el-col :span="4" class="text-right">-->
          <!--                            <span class="text-title">品牌类型</span>-->
          <!--                        </el-col>-->
          <!--                        <el-col :span="14">-->
          <!--                            <el-select-->
          <!--                                    v-model="brandType"-->
          <!--                                    multiple-->
          <!--                                    placeholder="请选择品牌类型"-->
          <!--                                    @change="brandTypeChange"-->
          <!--                                    collapse-tags-->
          <!--                                    filterable-->
          <!--                                    clearable-->
          <!--                            >-->
          <!--                                <el-option label="全部" value="all"></el-option>-->
          <!--                                <el-option-->
          <!--                                        v-for="item in brandTypeList"-->
          <!--                                        :key="item.tagCodeCollege"-->
          <!--                                        :label="item.tagName"-->
          <!--                                        :value="item.tagCodeCollege"-->
          <!--                                >-->
          <!--                                </el-option>-->
          <!--                            </el-select>-->
          <!--                        </el-col>-->
          <!--                    </el-row>-->
          <el-row type="flex" align="middle" :gutter="11" class="el-row">
            <el-col :span="4" class="text-right">
              <span class="text-title">产业</span>
            </el-col>
            <el-col :span="14">
              <el-select
                v-model="industry"
                multiple
                placeholder="请选择"
                @change="industryChange"
                collapse-tags
                filterable
                clearable
              >
                <el-option label="全部" value="all"></el-option>
                <el-option
                  v-for="item in industryList"
                  :key="item.tagCodeCollege"
                  :label="item.tagName"
                  :value="item.tagCodeCollege"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <!--                    <el-row type="flex" align="middle" :gutter="11" class="el-row">-->
          <!--                        <el-col :span="4" class="text-right">-->
          <!--                            <span class="text-title">客户类型</span>-->
          <!--                        </el-col>-->
          <!--                        <el-col :span="14">-->
          <!--                            <el-select-->
          <!--                                    v-model="customer"-->
          <!--                                    placeholder="请选择客户类型"-->
          <!--                                    collapse-tags-->
          <!--                                    filterable-->
          <!--                                    clearable-->
          <!--                            >-->
          <!--&lt;!&ndash;                                <el-option label="全部" value="all"></el-option>&ndash;&gt;-->
          <!--                                <el-option-->
          <!--                                        v-for="item in customerList"-->
          <!--                                        :key="item.tagCodeCollege"-->
          <!--                                        :label="item.tagName"-->
          <!--                                        :value="item.tagCodeCollege"-->
          <!--                                >-->
          <!--                                </el-option>-->
          <!--                            </el-select>-->
          <!--                        </el-col>-->
          <!--                    </el-row>-->
          <!--                    <el-row-->
          <!--                            type="flex"-->
          <!--                            align="middle"-->
          <!--                            :gutter="11"-->
          <!--                            class="el-row"-->
          <!--                    >-->
          <!--                        <el-col :span="4" class="text-right">-->
          <!--                            <span class="text-title">大渠道</span>-->
          <!--                        </el-col>-->
          <!--                        <el-col :span="14">-->
          <!--                            <el-select-->
          <!--                                    v-model="bigChannel"-->
          <!--                                    multiple-->
          <!--                                    placeholder="请选择渠道"-->
          <!--                                    @change="bigChannelChange"-->
          <!--                                    collapse-tags-->
          <!--                                    filterable-->
          <!--                                    clearable-->
          <!--                            >-->
          <!--                                <el-option label="全部" value="all"></el-option>-->
          <!--                                <el-option-->
          <!--                                        v-for="item in bigChannelList"-->
          <!--                                        :key="item.tagCodeCollege"-->
          <!--                                        :label="item.tagName"-->
          <!--                                        :value="item.tagCodeCollege"-->
          <!--                                >-->
          <!--                                </el-option>-->
          <!--                            </el-select>-->
          <!--                        </el-col>-->
          <!--                    </el-row>-->
        </div>
      </div>
      <div class="footer-bottom-container">
        <template>
          <el-button size="small" @click="close">取消</el-button>
          <el-button
            v-if="saveType == '1'"
            size="small"
            @click="saveRevise()"
            type="primary"
            >确定</el-button
          >
          <el-button v-else size="small" @click="save()" type="primary"
            >确定</el-button
          >
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./open-student.ts"></script>

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
