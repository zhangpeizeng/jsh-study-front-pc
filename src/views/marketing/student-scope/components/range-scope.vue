<template>
  <div class="continer-main222">
    <div class="d-flex align-items-center">
      <div class="new-title">
        <span v-if="activeName === '1'">客户端</span>
        <span v-if="activeName === '2'">员工端</span>
        <span v-if="activeName === '3'">直销员端</span>
        <span v-if="activeName === '4'">售后端</span>
      </div>
      <div class="new-tag">
        <span v-if="groupType !== 'A'" class="fixed">定投</span>
        <span v-else class="open">公开</span>
      </div>
    </div>
    <div class="student-scope-continer m-l-20">
      <div>
        <span style="margin-right: 10px;"
          ><label class="c-red">*</label>学员范围:</span
        >
        <el-radio-group v-model="groupType" @change="getValue()">
          <el-radio label="A">公开</el-radio>
          <el-radio label="B">按学员分组</el-radio>
          <el-radio label="C">按学员标签</el-radio>
          <el-radio label="D">指定学员</el-radio>
        </el-radio-group>
        <!--      按学员分组-->
        <div class="student-group-main" v-show="groupType == 'B'">
          <div class="popup">
            <div
              v-if="studentCheckList.length === 0"
              style="color: #cccccf;text-align: center"
            >
              暂无相关内容
            </div>
            <el-checkbox-group v-model="studentCheckList2">
              <el-checkbox
                :label="item.id"
                v-for="item in studentCheckList"
                v-bind:key="item.id"
                >{{ item.groupingName }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <!---按学员标签分组-->
        <div class="student-group-main2" v-show="groupType == 'C'">
          <div class="popup" v-if="studyLableArray.length > 0">
            <div style="color: rgb(245, 108, 108);padding: 0 0 10px 30px">
              <i class="el-icon-warning-outline"></i>
              标签内不勾选即表示投放全部，当勾选部分时，则只投放所勾选的标签
            </div>
            <div
              class="area-sign"
              :class="{ noBorder: index === studyLableArray.length - 1 }"
              v-for="(item, index) in studyLableArray"
              :key="index"
            >
              <div style="width: 100%">
                <el-row type="flex" align="middle" :gutter="20" class="el-row">
                  <el-col :span="3" class="text-right">
                    <span class="text-title">{{ item.tagName }}</span>
                  </el-col>
                  <el-col :span="18">
                    <el-select
                      v-model="newLableArray[item.id]"
                      multiple
                      placeholder="请选择"
                      @change="
                        industryChange(newLableArray[item.id], item.id, index)
                      "
                      collapse-tags
                      filterable
                      clearable
                    >
                      <el-option label="全部" value="all"></el-option>
                      <el-option
                        v-for="item1 in item.tagValueList"
                        :key="item1.tagValueCode"
                        :label="item1.tagValueName"
                        :value="item1.tagValueCode"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <div class="newTag">
                  <span
                    v-for="(item2, index2) in newLableArray2[item.id]"
                    :key="index2"
                    >{{ item2.name
                    }}<i
                      @click="
                        deleteRole(newLableArray[item.id], item.id, index2)
                      "
                      style="padding-left: 6px;color: #C0C4CC"
                      class="el-icon-error"
                    ></i
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top: 20px;" v-show="groupType != 'A'">
          <span style="margin-right: 10px;"
            ><label class="c-red">*</label>是否必修:</span
          >
          <el-radio-group v-model="isTrue">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </div>
        <!---指定学员--->
        <div style="margin-top: 20px;" class="mb-15" v-show="groupType == 'D'">
          <template>
            <div class="mb-15">
              <el-dropdown
                v-show="false"
                trigger="click"
                placement="bottom-start"
              >
                <span class="el-dropdown-link">
                  导入学员<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="dialogFormVisible = true"
                    >按公司导入</el-dropdown-item
                  >
                  <el-dropdown-item @click.native="dialogFormVisible = true"
                    >按公司部门导入</el-dropdown-item
                  >
                  <el-dropdown-item @click.native="dialogFormVisible = true"
                    >按人员导入</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown trigger="click" placement="bottom-start">
                <span class="el-dropdown-link">
                  导入学员<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="openDialogFormVisible('1')"
                    >按公司导入</el-dropdown-item
                  >
                  <el-dropdown-item @click.native="openDialogFormVisible('2')"
                    >按公司部门导入</el-dropdown-item
                  >
                  <el-dropdown-item @click.native="openDialogFormVisible('3')"
                    >按人员导入</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
              <el-button type="primary" size="mini" @click="exportList"
                >导出
              </el-button>
            </div>
          </template>
          <el-table
            v-loading="loading"
            v-if="isType2 == '1' || isType2 == '2'"
            :data="arrayList"
            max-height="300px"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              label="序号"
              width="200"
            ></el-table-column>
            <el-table-column prop="orgCode" label="公司编码" width="200">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.orgCode }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="orgName"
              v-if="isType2 == '1'"
              label="公司名称"
            >
              <template slot-scope="scope">
                <span>
                  {{ scope.row.orgName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column v-if="isType2 == '2'" label="公司/部门">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.orgName }}
                </span>
                <span v-if="scope.row.orgName && scope.row.departmentName"
                  >-</span
                >
                <span>
                  {{ scope.row.departmentName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="count" width="200" label="学员数量">
              <template slot-scope="scope">
                <span>{{ scope.row.count }}</span>
              </template>
            </el-table-column>
            <el-table-column width="200" label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="btnDel(scope.$index, scope.row)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            v-loading="loading"
            max-height="300px"
            v-if="isType2 == '3'"
            :data="arrayList"
            style="width: 100%"
          >
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="accountName" label="学员名称">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.accountName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="huihuiNumber" width="200" label="学号">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.huihuiNumber }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="phone" width="200" label="学员手机号">
              <template slot-scope="scope">
                <span>{{ scope.row.phone }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" width="200" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status == null">
                  未激活
                </span>
                <span v-if="scope.row.status == '1'">
                  正常
                </span>
                <span v-if="scope.row.status == '0' || scope.row.status == '2'">
                  冻结
                </span>
                <span v-if="scope.row.status == '3'">
                  已注销
                </span>
              </template>
            </el-table-column>
            <el-table-column width="200" label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="btnDel(scope.$index, scope.row)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div
            v-if="isType2"
            style="padding-top: 15px;text-align: center;"
            class="block"
          >
            <el-pagination
              :current-page="currentChange"
              :page-size="10"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next,jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </div>
    <!--start导入部分-->
    <el-dialog
      title="确认导入"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      width="834px"
    >
      <!--      <div style="margin-top: -30px;">-->
      <!--        <el-steps :active="1" simple>-->
      <!--          <el-step title="上传导入文件" icon="el-icon-edit"></el-step>-->
      <!--          <el-step title="确认导入" icon="el-icon-upload"></el-step>-->
      <!--        </el-steps>-->
      <!--      </div>-->
      <div class="steps d-flex justify-content-between align-items-center">
        <div class="one">
          <img
            style="width:24px;height: 24px;padding-right: 15px"
            src="@/assets/images/step-one.png"
            alt=""
          />上传导入文件
        </div>
        <div class="icon-right"><i class="el-icon-arrow-right"></i></div>
        <div class="two">
          <img
            style="width:24px;height: 24px;padding-right: 15px"
            src="@/assets/images/step-two.png"
            alt=""
          />确认导入
        </div>
      </div>
      <div v-loading="fileLoading" class="export-continer">
        <!-- 文件名称 @click="downTmp"-->
        <!-- 文件名称 @click="downTmp"-->
        <p @click="downTmp">
          1、下载导入摸板<a
            href="javascript:;"
            class="aImp"
            download="指定学员导入模板.xlsx"
          >
            <img src="@/assets/images/downloadIcon.png" /><span
              style="color: #1989FA"
              >下载导入模板</span
            >
          </a>
        </p>
        <p class="tip-info">
          <i class="el-icon-warning-outline"></i>
          提示：请按照导入模板的格式导入数据，
          模板的表头名称不可更改，列表头行不能删除。
        </p>
        <p
          style="margin-top: 10px;display: inline-flex;"
          class="d-flex align-items-center"
        >
          2、上传导入文件
          <el-upload
            action=""
            accept=".xls,.xlsx"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <el-button style="margin-left: 8px" size="small" type="primary"
              >选择文件</el-button
            >
          </el-upload>
        </p>
        <p class="tip-info" style="padding-bottom: 10px">
          <i class="el-icon-warning-outline"></i>
          提示：如果重新导入，将会<span style="color: red">覆盖</span
          >之前的导入记录，请确认
        </p>
        <div v-loading="upFileLoading" style="height: 250px;">
          <div class="importList" v-show="isFlag">
            <p style="color: #909399; font-size:14px;margin: 5px 0px 0px 0px">
              <span
                >请再次确认所需导入的客户数据：(确认后只保存验证通过的数据)
                ；本次共上传<span>{{ totalNumber }}</span
                >条：成功{{ validCount }}条,
                <span style="color: red">失败{{ invalidCount }}条。</span>
                <a
                  style="margin-left: 5px; color: #1989FA;"
                  v-if="invalidCount > 0"
                  :href="problemInfo"
                  download="问题反馈"
                  >下载问题反馈</a
                >
              </span>
            </p>
            <div style="height: 230px;">
              <el-table
                v-if="isType === '1' || isType === '2'"
                :data="exportDataList"
                height="250"
                style="width: 100%"
              >
                <el-table-column
                  type="index"
                  label="序号"
                  width="50"
                ></el-table-column>
                <el-table-column prop="orgCode" label="公司编码" width="100">
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.orgCode }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="orgName" label="公司">
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.orgName }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column v-if="isType === '2'" label="部门">
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.departmentName }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="学员数量">
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.count }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="校验结果">
                  <template slot-scope="scope">
                    <span
                      style="color: #F56C6C; text-align: center;"
                      v-if="scope.row.right == false"
                    >
                      {{ scope.row.reason }}
                    </span>
                    <span style="text-align: center;" v-if="scope.row.right">
                      {{ scope.row.reason }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" min-width="50">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="btnDelRows(scope.$index, scope.row)"
                      >删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-table
                v-if="isType === '3'"
                :data="exportDataList"
                height="250"
                style="width: 100%"
              >
                <el-table-column
                  type="index"
                  label="序号"
                  width="50"
                ></el-table-column>
                <el-table-column
                  prop="accountName"
                  label="学员名称"
                  width="100"
                >
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.accountName }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="huihuiNumber" label="学号">
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.huihuiNumber }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="校验结果">
                  <template slot-scope="scope">
                    <span
                      style="color: #F56C6C; text-align: center;"
                      v-if="scope.row.right == false"
                    >
                      {{ scope.row.reason }}
                    </span>
                    <span style="text-align: center;" v-if="scope.row.right">
                      {{ scope.row.reason }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" min-width="50">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="btnDelRows(scope.$index, scope.row)"
                      >删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="text-center">
        <el-button @click="dialogFormVisible = false" size="small"
          >取消
        </el-button>
        <el-button type="primary" @click="btnSubmit" size="small"
          >确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" src="./range-scope.ts"></script>
<style lang="scss">
.continer-main222 {
  .el-dropdown {
    margin-right: 20px;
    margin-left: 10px;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .el-tabs__active-bar {
    min-width: 42px !important;
  }
  .el-select {
    width: 70%;
  }
}
</style>
<style lang="scss" scoped>
.continer-main222 {
  margin-bottom: 10px;
  .steps {
    margin-top: -25px;
    margin-bottom: 20px;
    padding: 8px 20%;
    background: #f5f7fa;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #5cb87a;
    .icon-right {
      font-size: 28px;
      color: #c0c4cc;
    }
    .two {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #000000;
    }
  }
  .export-continer {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #606266;
    img {
      margin: 0 8px;
    }
    .tip-info {
      padding-top: 10px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #909399;
    }
  }
  .new-title {
    margin-top: 20px;
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
  .new-tag {
    margin-left: 20px;
    .fixed {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #409eff;
      display: inline-block;
      padding: 0px 4px;
      background: #ecf5ff;
      border: 1px solid #409eff;
    }
    .open {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #e6a23c;
      display: inline-block;
      padding: 1px 4px;
      background: #fdf6ec;
      border: 1px solid #e6a23c;
    }
  }
  .el-checkbox {
    min-width: 90px;
    margin-right: 20px;
  }

  .course-name {
    span {
      margin-left: 24px;
      background: #f2f2f2;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #606266;
      padding: 3px 14px;
      display: inline-block;
    }
  }

  .range-settings {
    position: relative;
    display: inline-block;
    margin-bottom: 24px;
    padding: 7px 30px 7px 45px;
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
      transform: rotate(45deg);
      -ms-transform: rotate(45deg); /* Internet Explorer */
      -moz-transform: rotate(45deg); /* Firefox */
      -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
      -o-transform: rotate(45deg); /* Opera */
    }
  }
  .student-group-main {
    width: 400px;
    margin: 0 auto 20px;
    position: relative;
    margin-left: 3%;
    margin-top: 20px;
  }

  .student-group-main .popup {
    width: 780px;
    background: #fff;
    padding: 10px 20px;
    color: #333;
    border-radius: 4px;
    /*position: absolute;*/
    top: 30px;
    left: 30px;
    border: 1px solid #e4e7ed;

    .area-sign {
      border-bottom: 1px solid #e4e7ed;
      padding-bottom: 15px;
      padding-top: 10px;
    }

    .noBorder {
      border-bottom: 1px solid #ffffff;
    }
  }

  .student-group-main .popup::before {
    content: "";
    width: 0px;
    height: 0px;
    border-width: 0 10px 10px;
    border-style: solid;
    border-color: transparent transparent #e4e7ed;
    left: 33%;
    top: -10px;
    position: absolute;
    margin-left: -10px;
  }

  .student-group-main .popup::after {
    content: "";
    width: 0px;
    height: 0px;
    border-width: 0 10px 10px;
    border-style: solid;
    border-color: transparent transparent #fff;
    left: 33%;
    top: -9px;
    position: absolute;
    margin-left: -10px;
  }
  .student-group-main2 {
    width: 400px;
    margin: 0 auto 20px;
    position: relative;
    margin-left: 3%;
    margin-top: 20px;
  }

  .student-group-main2 .popup {
    width: 780px;
    background: #fff;
    padding: 10px 20px 10px 0px;
    color: #333;
    border-radius: 4px;
    /*position: absolute;*/
    top: 30px;
    left: 30px;
    border: 1px solid #e4e7ed;

    .area-sign {
      padding-top: 3px;
    }

    .noBorder {
      border-bottom: 1px solid #ffffff;
    }
    .newTag {
      padding-top: 10px;
      padding-left: 100px;
      span {
        margin: 0 10px 10px 0;
        display: inline-block;
        background: #f0f2f5;
        border-radius: 3px;
        border: 1px solid #dcdfe6;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #5a5e66;
        padding: 3px 10px;
      }
    }
  }

  .student-group-main2 .popup::before {
    content: "";
    width: 0px;
    height: 0px;
    border-width: 0 10px 10px;
    border-style: solid;
    border-color: transparent transparent #e4e7ed;
    left: 64%;
    top: -10px;
    position: absolute;
    margin-left: -10px;
  }

  .student-group-main2 .popup::after {
    content: "";
    width: 0px;
    height: 0px;
    border-width: 0 10px 10px;
    border-style: solid;
    border-color: transparent transparent #fff;
    left: 64%;
    top: -9px;
    position: absolute;
    margin-left: -10px;
  }

  .student-group-label-main {
    width: 450px;
    margin: 0 auto 20px;
    position: relative;
    margin-left: 3%;
  }

  .student-group-label-main .popup {
    width: 450px;
    background: #fff;
    padding: 10px 20px;
    color: #333;
    border-radius: 4px;
    margin-top: 15px;
    /*position: absolute;*/
    top: 30px;
    left: 30px;
    border: 1px solid #e4e7ed;
  }

  .student-group-label-main .popup::before {
    content: "";
    width: 0px;
    height: 0px;
    border-width: 0 10px 10px;
    border-style: solid;
    border-color: transparent transparent #e4e7ed;
    left: 57%;
    top: -10px;
    position: absolute;
    margin-left: -10px;
  }

  .student-group-label-main .popup::after {
    content: "";
    width: 0px;
    height: 0px;
    border-width: 0 10px 10px;
    border-style: solid;
    border-color: transparent transparent #fff;
    left: 57%;
    top: -9px;
    position: absolute;
    margin-left: -10px;
  }

  .export-continer {
    margin-top: 10px;

    .aImp {
      color: #606266;
      font-size: 14px;
    }

    .tip-info {
      font-size: 12px;
      color: #909399;
    }
  }

  .page-contain {
    text-align: center;
    padding: 20px 0px;
  }

  .c-red {
    color: #ff0000;
  }

  .m-l-20 {
    margin-left: 20px;
  }
}
</style>
