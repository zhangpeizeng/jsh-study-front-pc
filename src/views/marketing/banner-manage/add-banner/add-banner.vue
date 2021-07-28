<template>
  <div class="container-box">
    <div class="content" style="padding-bottom: 0px">
      <div class="title">基本信息</div>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">所属学习终端：</span>
        </el-col>
        <el-col :span="3" class="text-content">
          <span class="organ">
            <img
              style="width: 18px; height: 18px"
              src="../../../../assets/images/organ1.png"
              alt=""
            />
            <span v-if="labelCode === '1'"> 客户端</span>
            <span v-if="labelCode === '2'"> 员工端</span>
            <span v-if="labelCode === '3'"> 直销员端</span>
            <span v-if="labelCode === '4'"> 售后端</span>
          </span>
        </el-col>
        <el-col :span="2" class="text-right">
          <span class="text-title">所属机构：</span>
        </el-col>
        <el-col :span="5" class="text-content">
          <span class="organ">
            <img
              style="width: 18px; height: 18px"
              src="../../../../assets/images/organ2.png"
              alt=""
            />
            {{ organName }}
          </span>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="require-icon">*</span>
          <span class="text-title">标题</span>
        </el-col>
        <el-col :span="8">
          <el-input
            v-model="advertName"
            placeholder="请输入"
            maxlength="30"
            @input="advertName = advertName.replace(/^ +| +$/g, '')"
          ></el-input>
        </el-col>
      </el-row>
      <el-row type="flex" align="top" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="require-icon">*</span>
          <span>广告图</span>
        </el-col>
        <el-col :span="15" class="text-content content-upload">
          <upload-img
            :limitNumber="1"
            :note="noteImg"
            @fileSuccess="fileSuccess"
            @instance="instanceImg"
          ></upload-img>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="require-icon">*</span>
          <span>有效期</span>
        </el-col>
        <el-col :span="7.5" class="text-content">
          <el-date-picker
            style="width: 165px"
            v-model="startDate"
            type="datetime"
            placeholder="有效期开始时间"
            size="small"
            value-format="timestamp"
            format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
            prefix-icon="el-icon-date"
          >
          </el-date-picker>
          <span style="margin: 0 10px">至</span>
          <el-date-picker
            style="width: 165px"
            v-model="endDate"
            type="datetime"
            placeholder="有效期结束时间"
            size="small"
            value-format="timestamp"
            format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
            prefix-icon="el-icon-date"
          >
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="require-icon">*</span>
          <span>广告链接内容</span>
        </el-col>
        <el-col :span="10" class="text-content">
          <el-radio-group
            v-model="advertJumpType"
            @change="radioChange('advertJumpType')"
          >
            <el-radio :label="4">自定义内容</el-radio>
            <el-radio :label="2">课程</el-radio>
            <el-radio :label="3">运营主题</el-radio>
            <el-radio :label="1">无</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        align="bottom"
        :gutter="10"
        class="el-row"
        v-if="advertJumpType === 4"
      >
        <el-col :span="2" class="text-right">
          <span></span>
        </el-col>
        <el-col :span="11" class="text-content">
          <u-editor
            :content.sync="advertDescription"
            :savePicture="savePicture"
            :uploadImg="uploadImg"
            :height="'150'"
            :toolbars="toolbars"
          ></u-editor>
        </el-col>
        <el-col :span="2" class="text-left">
          <span style="color: #1989fa; cursor: pointer" @click="previewClick">
            预览
          </span>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        align="middle"
        :gutter="10"
        class="el-row"
        v-if="advertJumpType === 2"
      >
        <el-col :span="3" class="text-right">
          <span>链接至课程</span>
        </el-col>
        <el-col :span="2.5" class="text-content">
          <div class="button-block" @click="selectCourse">选择课程</div>
        </el-col>
        <el-col :span="10" class="text-content" v-if="selectObj.courseName">
          <div
            style="
              background-color: #f5f7fa;
              height: 25px;
              line-height: 25px;
              display: inline-block;
              vertical-align: middle;
              padding: 0 5px;
            "
          >
            <i class="el-icon-document" style="margin-right: 15px"></i>
            <span
              class="text-title"
              style="color: #409eff; font-size: 12px; cursor: pointer"
              >{{ selectObj.courseName }}</span
            >
          </div>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        align="middle"
        :gutter="10"
        class="el-row"
        v-if="advertJumpType === 3"
      >
        <el-col :span="3" class="text-right">
          <span>链接至运营主题</span>
        </el-col>
        <el-col :span="2.5" class="text-content">
          <div class="button-block" @click="selectTheme">选择主题</div>
        </el-col>
        <el-col :span="10" class="text-content" v-if="selectThemeObj.themeName">
          <div
            style="
              background-color: #f5f7fa;
              height: 25px;
              line-height: 25px;
              display: inline-block;
              vertical-align: middle;
              padding: 0 5px;
            "
          >
            <i class="el-icon-document" style="margin-right: 15px"></i>
            <span
              class="text-title"
              style="color: #409eff; font-size: 12px; cursor: pointer"
              >{{ selectThemeObj.themeName }}</span
            >
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="content" style="padding-bottom: 40px">
      <div class="title">范围设置</div>
      <div class="student-scope-continer">
        <div>
          <el-radio-group v-model="throwType" style="margin-left: 60px">
            <el-radio label="A">公开</el-radio>
            <el-radio label="C">按学员标签</el-radio>
            <el-radio label="D">指定学员</el-radio>
          </el-radio-group>
          <!---按学员标签分组-->
          <div class="student-group-main" v-show="throwType == 'C'">
            <div class="popup" v-if="studyLableArray.length > 0">
              <div style="color: rgb(245, 108, 108)">
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
                  <el-row
                    type="flex"
                    align="middle"
                    :gutter="20"
                    class="el-row"
                  >
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
                        style="padding-left: 6px; color: #c0c4cc"
                        class="el-icon-error"
                      ></i
                    ></span>
                  </div>
                </div>
              </div>
              <!--              <div-->
              <!--                class="area-sign"-->
              <!--                :class="{ noBorder: index === studyLableArray.length - 1 }"-->
              <!--                v-for="(item, index) in studyLableArray"-->
              <!--                :key="index"-->
              <!--              >-->
              <!--                <div class="" style="float:left;">{{ item.tagName }}:</div>-->
              <!--                <div style="margin-left: 35px;">-->
              <!--                  <el-checkbox-group v-model="newLableArray[item.countnum]">-->
              <!--                    <el-checkbox-->
              <!--                      :label="item1.tagValueCode"-->
              <!--                      v-for="item1 in item.tagValueList"-->
              <!--                      v-bind:key="item1.tagValueCode"-->
              <!--                      >{{ item1.tagValueName }}-->
              <!--                    </el-checkbox>-->
              <!--                  </el-checkbox-group>-->
              <!--                </div>-->
              <!--              </div>-->
            </div>
          </div>
          <!---指定学员--->
          <div
            style="margin-top: 20px; position: relative"
            v-show="throwType == 'D'"
          >
            <template>
              <div class="d-flex justify-content-between align-items-center">
                <!--                <el-button-->
                <!--                  type="primary"-->
                <!--                  size="mini"-->
                <!--                  @click="dialogFormVisible = true"-->
                <!--                  >导入学员</el-button-->
                <!--                >-->
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
                <div
                  style="color: #909399; font-size: 12px; margin-right: 24px"
                ></div>
              </div>
            </template>
            <el-table
              v-if="isType2 == '1' || isType2 == '2'"
              :data="arrayPageList"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                label="序号"
                min-width="100px"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="orgCode"
                label="公司编码"
                min-width="200px"
                align="center"
              >
                <template slot-scope="scope">
                  <span>
                    {{ scope.row.orgCode }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="orgName"
                min-width="300px"
                v-if="isType2 == '1'"
                label="公司名称"
                align="center"
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
              <el-table-column
                align="center"
                prop="count"
                min-width="100px"
                label="学员数量"
              >
                <template slot-scope="scope">
                  <span>
                    {{ scope.row.count }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column min-width="100px" label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="btnDel(scope.$index, scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-table
              v-loading="loading"
              v-if="isType2 == '3'"
              :data="arrayPageList"
              style="width: 100%"
            >
              <el-table-column
                align="center"
                type="index"
                label="序号"
              ></el-table-column>
              <el-table-column
                prop="accountName"
                label="学员名称"
                align="center"
              >
                <template slot-scope="scope">
                  <span>
                    {{ scope.row.accountName }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="huihuiNumber" label="学号">
                <template slot-scope="scope">
                  <span>
                    {{ scope.row.huihuiNumber }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="phone" label="学员手机号">
                <template slot-scope="scope">
                  <span>{{ scope.row.phone }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="status" label="状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.status == '1'"> 启用 </span>
                  <span
                    v-if="scope.row.status == '2' || scope.row.status == '0'"
                  >
                    停用
                  </span>
                  <span v-if="scope.row.status == '3'"> 已注销 </span>
                </template>
              </el-table-column>
              <el-table-column width="200" label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="btnDel(scope.$index, scope.row)"
                    >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div
              v-if="isType2"
              style="padding-top: 15px; text-align: center"
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
    </div>
    <!--start导入部分-->
    <el-dialog
      title="确认导入"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      width="834px"
    >
      <div class="steps d-flex justify-content-between align-items-center">
        <div class="one">
          <img
            style="width: 24px; height: 24px; padding-right: 15px"
            src="@/assets/images/step-one.png"
            alt=""
          />上传导入文件
        </div>
        <div class="icon-right"><i class="el-icon-arrow-right"></i></div>
        <div class="two">
          <img
            style="width: 24px; height: 24px; padding-right: 15px"
            src="@/assets/images/step-two.png"
            alt=""
          />确认导入
        </div>
      </div>
      <div class="export-continer">
        <!-- 文件名称 @click="downTmp"-->
        <p @click="downTmp">
          1、下载导入摸板<a
            href="javascript:;"
            class="aImp"
            download="指定学员导入模板.xlsx"
          >
            <img src="../../../../assets/images/downloadIcon.png" /><span
              style="color: #1989fa"
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
          style="margin-top: 10px; display: inline-flex"
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
        <div v-loading="upFileLoading" style="height: 250px">
          <div class="importList" v-show="isFlag">
            <p style="color: #909399; font-size: 14px; margin: 5px 0px 0px 0px">
              <span
                >请再次确认所需导入的客户数据：(确认后只保存验证通过的数据)
                ；本次共上传<span>{{ totalNumber }}</span
                >条：成功{{ validCount }}条,
                <span style="color: red">失败{{ invalidCount }}条。</span>
                <a
                  style="margin-left: 5px; color: #1989fa"
                  v-if="invalidCount > 0"
                  :href="problemInfo"
                  download="问题反馈"
                  >下载问题反馈</a
                >
              </span>
            </p>
            <div style="height: 230px">
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
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="orgCode"
                  label="公司编码"
                  align="center"
                  width="100"
                >
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.orgCode }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="orgName" align="center" label="公司">
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
                <el-table-column align="center" label="校验结果">
                  <template slot-scope="scope">
                    <span
                      style="color: #f56c6c; text-align: center"
                      v-if="scope.row.right == false"
                    >
                      {{ scope.row.reason }}
                    </span>
                    <span style="text-align: center" v-if="scope.row.right">
                      {{ scope.row.reason }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" min-width="50">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="btnDelRows(scope.$index, scope.row)"
                      >删除</el-button
                    >
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
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="accountName"
                  label="学员名称"
                  width="100"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.accountName }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="huihuiNumber"
                  label="学号"
                >
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.huihuiNumber }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="校验结果">
                  <template slot-scope="scope">
                    <span
                      style="color: #f56c6c; text-align: center"
                      v-if="scope.row.right == false"
                    >
                      {{ scope.row.reason }}
                    </span>
                    <span style="text-align: center" v-if="scope.row.right">
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
          >取消</el-button
        >
        <el-button type="primary" @click="btnSubmit" size="small"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <!--end导入部分-->
    <!-- 底部按钮 start -->
    <div class="footer-bottom-container" v-if="saveType != 1">
      <template>
        <el-button size="mini" @click="back">返回</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="save"
          :disabled="submitDisable"
        >
          立即发布
        </el-button>
      </template>
    </div>
    <div class="footer-bottom-container" v-if="saveType == 1">
      <template>
        <el-button size="mini" @click="$router.go(-1)">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="save"
          :disabled="submitDisable"
        >
          确定
        </el-button>
      </template>
    </div>
    <!-- 底部按钮 end -->
    <el-dialog
      title="选择课程"
      width="836px"
      custom-class="addReply-dialog"
      :close-on-click-modal="false"
      :visible.sync="selectCourseDialog"
    >
      <select-course
        :selectObj="selectObj"
        :studyTerminalList="labelCode"
        v-if="selectCourseDialog"
        @confirm="confirmPopup"
        @cancel="selectCourseDialog = false"
      >
      </select-course>
    </el-dialog>
    <el-dialog
      title="选择主题"
      width="836px"
      custom-class="addReply-dialog"
      :close-on-click-modal="false"
      :visible.sync="selectThemeDialog"
    >
      <select-theme
        :selectObj="selectThemeObj"
        :studyTerminalList="labelCode"
        :classClassifyId="classClassifyId"
        v-if="selectThemeDialog"
        @confirm="confirmThemePopup"
        @cancel="selectThemeDialog = false"
      >
      </select-theme>
    </el-dialog>
    <advert-preview
      v-show="previewDialog"
      @instance="instancePreview"
      @closeMask="closeMask"
    ></advert-preview>
  </div>
</template>

<script lang="ts" src="./add-banner.ts"></script>

<style lang="scss">
.container-box {
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
  .ql-align-center {
    text-align: center;
  }
  .ql-align-right {
    text-align: right;
  }
}
</style>

<style lang="scss" scoped>
.container-box {
  .steps {
    margin-top: -25px;
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
  .organ {
    padding: 6px 12px;
    border-radius: 20px;
    background: rgba(238, 244, 252, 1);
  }
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
    .el-select {
      width: 80%;
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
.el-checkbox {
  min-width: 90px;
  margin-right: 20px;
}
.student-scope-continer {
  padding-left: 24px;
}
// 范围样式
.student-group-main {
  width: 400px;
  margin: 0 auto 20px;
  position: relative;
  margin-left: 3%;
  margin-top: 20px;
  .el-row {
    padding-top: 0px;
    padding-bottom: 0px;
    margin-bottom: 0px !important;
  }
  .area-sign {
    padding-bottom: 5px !important;
  }
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
    padding-bottom: 15px;
    padding-top: 10px;
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
</style>
