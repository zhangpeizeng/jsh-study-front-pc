<template>
  <div class="container-box">
    <div class="content" style="padding-bottom:15px;">
      <div class="title">基本信息</div>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="require-icon">*</span>
          <span class="text-title">课程名称</span>
        </el-col>
        <el-col :span="8">
          <el-input
            type="text"
            v-model="courseName"
            placeholder="请输入"
            maxlength="40"
            @input="courseName = courseName.replace(/^ +| +$/g, '')"
            show-word-limit
          ></el-input>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span>课程类型</span>
        </el-col>
        <el-col :span="8" class="text-content">
          <span class="content-span">录播/文档课</span>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        align="top"
        :gutter="10"
        class="el-row"
        style="margin-bottom:0px"
      >
        <el-col :span="2" class="text-right">
          <span class="require-icon">*</span>
          <span>学习终端</span>
        </el-col>
        <el-col :span="10" class="text-content">
          <div class="classify-content">
            <div class="classify-checkbox">
              <div class="classify-content-item" v-show="keShow">
                <el-checkbox
                  v-model="keChecked"
                  style="margin-right:15px"
                  @change="checkboxChange('1')"
                  ><span>客户端</span></el-checkbox
                >
                <div
                  style="margin-left:33px;width:75px;margin-right:10px"
                  v-show="keChecked"
                >
                  <span class="require-icon">*</span>
                  分类
                </div>
                <course-classify
                  v-show="keChecked"
                  :parentList="keList"
                  style="margin-top:-4px"
                  @instanceClass="instanceKe"
                  @change="keChange"
                ></course-classify>
              </div>
              <div class="classify-content-item" v-show="zhiShow">
                <el-checkbox
                  v-model="zhiChecked"
                  style="margin-right:15px"
                  @change="checkboxChange('3')"
                  ><span>直销员端</span></el-checkbox
                >
                <div
                  style="margin-left:19px;width:75px;margin-right:10px"
                  v-show="zhiChecked"
                >
                  <span class="require-icon">*</span>
                  分类
                </div>
                <course-classify
                  v-show="zhiChecked"
                  :parentList="zhiList"
                  style="margin-top:-4px"
                  @change="zhiChange"
                  @instanceClass="instanceZhi"
                ></course-classify>
              </div>
              <div class="classify-content-item" v-show="yuanShow">
                <el-checkbox
                  v-model="yuanChecked"
                  style="margin-right:15px"
                  @change="checkboxChange('2')"
                  ><span>员工端</span></el-checkbox
                >
                <div
                  style="margin-left:33px;width:75px;margin-right:10px"
                  v-show="yuanChecked"
                >
                  <span class="require-icon">*</span>
                  分类
                </div>
                <course-classify
                  v-show="yuanChecked"
                  :parentList="yuanList"
                  style="margin-top:-4px"
                  @change="yuanChange"
                  @instanceClass="instanceYuan"
                ></course-classify>
              </div>
              <div class="classify-content-item" v-show="shouShow">
                <el-checkbox
                  v-model="shouChecked"
                  style="margin-right:15px"
                  @change="checkboxChange('4')"
                  ><span>售后端</span></el-checkbox
                >
                <div
                  style="margin-left:33px;width:75px;margin-right:10px"
                  v-show="shouChecked"
                >
                  <span class="require-icon">*</span>
                  分类
                </div>
                <course-classify
                  v-show="shouChecked"
                  :parentList="shouList"
                  style="margin-top:-4px"
                  @change="shouChange"
                  @instanceClass="instanceShou"
                ></course-classify>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="require-icon">*</span>
          <span>授课讲师</span>
        </el-col>
        <el-col :span="8" class="text-content">
          <div class="d-flex align-items-center">
            <div class="lecturer-div">
              <div>{{ lecturerLibraryName }}</div>
              <i
                v-show="lecturerLibraryId"
                class="el-icon-error"
                style="color:#C0C4CC;margin-left:8px"
                @click="delLecturer(lecturerLibraryId)"
              ></i>
            </div>
            <div class="lecturer-button" @click="selectTeacher">选择</div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span>关联商品</span>
        </el-col>
        <el-col :span="8" class="text-content">
          <el-input placeholder="请输入商品编号/型号" v-model="productCode">
            <el-button
              slot="append"
              class="button-check"
              @click="checkGood(productCode)"
              >检查
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="7" class="text-content word-break">
          <img src="../../../assets/images/icon-help.png" class="icon-tip" />
          <el-tooltip placement="top-start">
            <div slot="content">
              <div class="prompt">
                请输入商品编码后点击检查按钮，检查此商品是否存在，
              </div>
              <div class="prompt">
                维护关联商品后，会在易理货此商品对应显示课程
              </div>
            </div>
            <span class="prompt">
              请输入商品编码后点击检查按钮，检查此商品是否存在，维护关联商品
            </span>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        align="middle"
        :gutter="10"
        class="el-row"
        v-if="selectCodeList.length > 0"
      >
        <el-col :span="2" class="text-right">
          <span></span>
        </el-col>
        <el-col :span="19" class="text-content">
          <div class="code-list">
            <div
              class="code-item"
              v-for="(item, index) in selectCodeList"
              :key="index"
            >
              <div>{{ item.itemName }}-{{ item.itemModel }}</div>
              <i
                class="el-icon-error"
                style="color:#C0C4CC;margin-left:8px"
                @click="delGoodModel(index)"
              ></i>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" align="top" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="require-icon">*</span>
          <span>课程封面</span>
        </el-col>
        <el-col :span="15" class="text-content">
          <upload-img
            :limitNumber="1"
            @fileSuccess="fileSuccess"
            @instance="instanceImg"
          ></upload-img>
        </el-col>
      </el-row>
      <el-row type="flex" align="top" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="require-icon">*</span>
          <span>课程简介</span>
        </el-col>
        <el-col :span="11" class="text-content">
          <u-editor
            :content.sync="courseDescription"
            :savePicture="savePicture"
            :uploadImg="uploadImg"
            :height="'150'"
            :toolbars="toolbars"
          ></u-editor>
        </el-col>
        <el-col :span="2" class="text-left mt-preview">
          <span
            style="color:#1989FA;cursor: pointer;"
            @click="previewClick(courseDescription)"
          >
            预览
          </span>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="require-icon">*</span>
          <span>需要报名</span>
        </el-col>
        <el-col :span="4" class="text-content">
          <el-radio-group
            v-model="signUpStatus"
            @change="radioChange('signUpStatus')"
          >
            <el-radio :disabled="disabledSignUp" :label="0">否</el-radio>
            <el-radio :disabled="disabledSignUp" :label="1">是</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="7.5" class="text-content" v-show="signUpStatus === 1">
          <el-date-picker
            v-model="signUpStartTime"
            type="datetime"
            placeholder="报名开始时间"
            size="small"
            value-format="timestamp"
            format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
            prefix-icon="el-icon-date"
            :disabled="disabledSignUp"
          >
          </el-date-picker>
          <span style="margin: 0 10px;">至</span>
          <el-date-picker
            v-model="signUpEndTime"
            type="datetime"
            placeholder="报名结束时间"
            size="small"
            value-format="timestamp"
            format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
            prefix-icon="el-icon-date"
          >
          </el-date-picker>
        </el-col>
        <el-col
          :span="5"
          class="text-content word-break"
          v-show="signUpStatus === 1"
        >
          <img src="../../../assets/images/icon-help.png" class="icon-tip" />
          <el-tooltip placement="top-start">
            <div slot="content">
              <div class="prompt">
                要求学员报名本课程的起止时间，报名开始时间前和报名
              </div>
              <div class="prompt">
                结束时间后学员不可进行报名，报名后学员才可学习课程
              </div>
            </div>
            <span class="prompt">
              要求学员报名本课程的起止时间，报名开始时间前和报名结束
            </span>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="require-icon">*</span>
          <span>学习时间</span>
        </el-col>
        <el-col :span="4" class="text-content">
          <el-radio-group
            v-model="studyTimeStatus"
            @change="radioChange('studyTimeStatus')"
          >
            <el-radio :label="0" :disabled="disabledStudy">不限制</el-radio>
            <el-radio :label="1" :disabled="disabledStudy">限制</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="7.5" class="text-content" v-show="studyTimeStatus === 1">
          <el-date-picker
            v-model="studyStartTime"
            type="datetime"
            placeholder="学习开始时间"
            size="small"
            value-format="timestamp"
            format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
            prefix-icon="el-icon-date"
            :disabled="disabledStudy"
          >
          </el-date-picker>
          <span style="margin: 0 10px;">至</span>
          <el-date-picker
            v-model="studyEndTime"
            type="datetime"
            placeholder="学习结束时间"
            size="small"
            value-format="timestamp"
            format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
            prefix-icon="el-icon-date"
          >
          </el-date-picker>
        </el-col>
        <el-col
          :span="5"
          class="text-content word-break"
          v-show="studyTimeStatus === 1"
        >
          <img src="../../../assets/images/icon-help.png" class="icon-tip" />
          <el-tooltip placement="top-start">
            <div slot="content">
              <div class="prompt">
                要求学员学习本课程的起止时间，学习开始
              </div>
              <div class="prompt">
                时间前和学习结束时间后学员不可进行学习
              </div>
            </div>
            <span class="prompt">
              要求学员学习本课程的起止时间，学习开始时间前和学习结束
            </span>
          </el-tooltip>
        </el-col>
      </el-row>
    </div>
    <div class="content pt-content">
      <div class="d-flex align-items-center mb-25">
        <div class="title" style="margin-bottom: 0px">课程内容</div>
        <div class="pl-15" style="color:#F56C6C">
          <i class="el-icon-warning-outline color-red"></i>
          <span class="color-red font-12">
            请选择视频、音频、文档、内容，至少一种形式；上传文件后，请修改名称，否则默认为源文件名，影响学员学习
          </span>
        </div>
      </div>
      <el-row
        type="flex"
        align="top"
        :gutter="10"
        class="el-row"
        v-if="videoUpdateFlag"
      >
        <el-col :span="2" class="text-right">
          <span>视频</span>
        </el-col>
        <el-col :span="20" class="text-content">
          <!--          <img src="../../../assets/images/upload.png" class="upload-img" />-->
          <Uploader
            ref="video"
            @vid="getVideo"
            liveType="1"
            sourceType="1"
            :currentVideoListInDialog="videoList"
            :disabledCourse="disabledCourse"
          ></Uploader>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        align="top"
        :gutter="10"
        class="el-row"
        v-if="voiceUpdateFlag"
      >
        <el-col :span="2" class="text-right">
          <span>音频</span>
        </el-col>
        <el-col :span="20" class="text-content">
          <!--          <img src="../../../assets/images/upload.png" class="upload-img" />-->
          <Uploader
            ref="voice"
            @vod="getVoice"
            liveType="2"
            sourceType="1"
            :currentVideoListInDialog="voiceList"
            :disabledCourse="disabledCourse"
          ></Uploader>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        align="top"
        :gutter="10"
        class="el-row"
        v-if="docUpdateFlag"
      >
        <el-col :span="2" class="text-right">
          <span>文档</span>
        </el-col>
        <el-col :span="20" class="text-content">
          <uploadFile
            ref="file"
            @file="getFile"
            liveType="3"
            sourceType="1"
            :disabledCourse="disabledCourse"
            :docList="docList"
          ></uploadFile>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        align="top"
        :gutter="10"
        class="el-row"
        v-if="contentUpdateFlag"
      >
        <el-col :span="2" class="text-right">
          <span>内容</span>
        </el-col>
        <el-col :span="11" class="text-content">
          <u-editor
            :content.sync="content"
            :savePicture="savePicture"
            :uploadImg="uploadImg"
            :disabled="disabledCourse && contentFlag"
            :height="'150'"
            :toolbars="toolbars"
          ></u-editor>
        </el-col>
        <el-col :span="2" class="text-left mt-preview">
          <span
            style="color:#1989FA;cursor: pointer;"
            @click="previewClick(content)"
          >
            预览
          </span>
        </el-col>
      </el-row>
    </div>
    <div class="content pt-content">
      <div class="title">证书/勋章/考试</div>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span>发放勋章</span>
        </el-col>
        <el-col :span="3" class="text-content">
          <el-radio-group
            v-model="medalStatus"
            @change="radioChange('medalStatus')"
          >
            <el-radio :label="0" :disabled="detailObj.medalIsGrant == 1"
              >否</el-radio
            >
            <el-radio :label="1" :disabled="detailObj.medalIsGrant == 1"
              >是</el-radio
            >
          </el-radio-group>
        </el-col>
      </el-row>
      <div :class="{ tierBorder: medalStatus === 1 }">
        <el-row
          type="flex"
          align="middle"
          :gutter="10"
          class="el-row"
          v-show="medalStatus === 1 && !detailObj.medalIsGrant"
        >
          <el-col :span="2" class="text-right">
            <span>选择勋章</span>
          </el-col>
          <el-col :span="5" class="text-content">
            <div class="button-block" @click="selectMedal">选择勋章</div>
            <!--    选择勋章-->
            <SelectMedal ref="medal" @func="getMedalData"></SelectMedal>
          </el-col>
        </el-row>
        <el-row
          type="flex"
          align="middle"
          :gutter="10"
          class="el-row"
          v-show="
            medalStatus === 1 &&
              collegeMarketingMedalRaleList.length > 0 &&
              collegeMarketingMedalRaleList[0].medalName !== ''
          "
        >
          <el-col :span="2" class="text-right">
            <div class="medal-name-box">
              <div class="medal-name mt-80">名称</div>
              <div class="medal-name mt-26">发放比例</div>
            </div>
          </el-col>
          <el-col :span="12" class="text-content">
            <div class="medal-list">
              <div
                class="medal-list"
                v-for="(item, index) in collegeMarketingMedalRaleList"
                :key="index"
              >
                <div class="medal-content-box">
                  <div class="medal-icon">
                    <img :src="item.medalTypeUrl" />
                  </div>
                  <div class="medal-content">
                    <el-input
                      v-model="item.medalTypeName"
                      placeholder="请输入"
                      size="mini"
                      :disabled="detailObj.medalIsGrant == 1"
                    ></el-input>
                  </div>
                  <div class="medal-content">
                    <el-input
                      v-model="item.distributionRatio"
                      placeholder="请输入"
                      size="mini"
                      @input="inputCheck(item)"
                      @blur="inputBlur(item, collegeMarketingMedalRaleList)"
                      :disabled="detailObj.medalIsGrant == 1"
                    ></el-input>
                  </div>
                </div>
                <div class="medal-icon-box">%</div>
                <div
                  class="medal-colon-box"
                  v-if="index + 1 != collegeMarketingMedalRaleList.length"
                >
                  <div>:</div>
                  <div style="margin: 24px 0 5px 0">
                    <span>:</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span>考试</span>
        </el-col>
        <el-col :span="2.8" class="text-content">
          <el-radio-group
            v-model="testStatus"
            @change="radioChange('testStatus')"
          >
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <div :class="{ tierBorder: testStatus === 1 }">
        <el-row
          v-show="testStatus === 1"
          type="flex"
          align="middle"
          :gutter="10"
          class="el-row"
        >
          <el-col :span="2" class="text-right">
            <span>考试时间</span>
          </el-col>
          <el-col :span="7.5" class="text-content">
            <el-date-picker
              v-model="testStartTime"
              type="datetime"
              placeholder="考试开始时间"
              size="small"
              value-format="timestamp"
              format="yyyy-MM-dd HH:mm"
              :picker-options="pickerOptions"
              prefix-icon="el-icon-date"
              :disabled="disabledTest"
            >
            </el-date-picker>
            <span style="margin: 0 10px;">至</span>
            <el-date-picker
              v-model="testEndTime"
              type="datetime"
              placeholder="考试结束时间"
              size="small"
              value-format="timestamp"
              format="yyyy-MM-dd HH:mm"
              :picker-options="pickerOptions"
              prefix-icon="el-icon-date"
            >
            </el-date-picker>
          </el-col>
          <el-col :span="3" class="text-content word-break">
            <img src="../../../assets/images/icon-help.png" class="icon-tip" />
            <el-tooltip placement="top-start" :offset="10">
              <div slot="content">
                <div class="prompt">
                  要求学员进行课程考试的起止时间，考试开始时间
                </div>
                <div class="prompt">
                  前和考试结束时间后学员不可进行考试
                </div>
              </div>
              <span class="prompt">
                要求学员进行课程考试的起止
              </span>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row
          style="border-bottom: 1px solid #EBEEF5;padding-bottom: 15px"
          type="flex"
          align="middle"
          :gutter="10"
          class="el-row"
          v-show="testStatus === 1"
        >
          <el-col :span="2" class="text-right">
            <span></span>
          </el-col>
          <el-col :span="4" class="text-content">
            <span>考试推送</span>
            <el-switch
              v-model="testJpushFlag"
              :active-value="1"
              :inactive-value="0"
              style="margin-right:40px;margin-left:10px"
            >
            </el-switch>
          </el-col>
          <el-col :span="3" class="text-content word-break">
            <img src="../../../assets/images/icon-help.png" class="icon-tip" />
            <el-tooltip placement="top-start" :offset="10">
              <div slot="content">
                <div class="prompt">
                  课程创建时间距考试开始时间大于10分钟
                </div>
                <div class="prompt">
                  推送才能生效，目前仅支持客户端、直销员端
                </div>
              </div>
              <span class="prompt">
                课程创建时间距考试开始时间大于10分钟
              </span>
            </el-tooltip>
          </el-col>
        </el-row>
        <div
          v-if="testStatus === 1"
          style="border-bottom: 1px solid #EBEEF5;margin-bottom: 15px"
        >
          <el-row
            type="flex"
            align="middle"
            :gutter="10"
            class="el-row"
            v-if="testStatus === 1"
          >
            <el-col :span="2" class="text-right">
              <span>允许补考</span>
            </el-col>
            <el-col :span="2.8" class="text-content">
              <el-radio-group
                v-model="fillTestStatus"
                @change="radioChange('fillTestStatus')"
              >
                <el-radio :label="0" :disabled="disabledFillTest">否</el-radio>
                <el-radio :label="1" :disabled="disabledFillTest">是</el-radio>
              </el-radio-group>
            </el-col>
            <el-col
              :span="7.5"
              class="text-content"
              v-show="fillTestStatus === 1"
            >
              <el-date-picker
                v-model="fillTestStartTime"
                type="datetime"
                placeholder="补考开始时间"
                size="small"
                value-format="timestamp"
                format="yyyy-MM-dd HH:mm"
                :picker-options="pickerOptions"
                prefix-icon="el-icon-date"
                :disabled="disabledFillTest"
              >
              </el-date-picker>
              <span style="margin: 0 10px;">至</span>
              <el-date-picker
                v-model="fillTestEndTime"
                type="datetime"
                placeholder="补考结束时间"
                size="small"
                value-format="timestamp"
                format="yyyy-MM-dd HH:mm"
                :picker-options="pickerOptions"
                prefix-icon="el-icon-date"
              >
              </el-date-picker>
            </el-col>
            <el-col
              :span="3"
              class="text-content word-break"
              v-show="fillTestStatus === 1"
            >
              <img
                src="../../../assets/images/icon-help.png"
                class="icon-tip"
              />
              <el-tooltip placement="top-start" :offset="10">
                <div slot="content">
                  <div class="prompt">
                    要求学员进行课程补考的起止时间，补考开始时间前
                  </div>
                  <div class="prompt">
                    和补考结束时间后学员不可进行补考
                  </div>
                </div>
                <span class="prompt">
                  要求学员进行课程补考的起止
                </span>
              </el-tooltip>
            </el-col>
          </el-row>
          <el-row
            type="flex"
            align="middle"
            :gutter="10"
            class="el-row"
            v-show="fillTestStatus === 1"
          >
            <el-col :span="2" class="text-right">
              <span></span>
            </el-col>
            <el-col :span="4" class="text-content">
              <span>补考推送</span>
              <el-switch
                v-model="fillTestJpushFlag"
                :active-value="1"
                :inactive-value="0"
                style="margin-right:40px;margin-left:10px"
              >
              </el-switch>
            </el-col>
            <el-col :span="3" class="text-content word-break">
              <img
                src="../../../assets/images/icon-help.png"
                class="icon-tip"
              />
              <el-tooltip placement="top-start" :offset="10">
                <div slot="content">
                  <div class="prompt">
                    课程创建时间距补考开始时间大于10分钟
                  </div>
                  <div class="prompt">
                    推送才能生效，目前仅支持客户端、直销员端
                  </div>
                </div>
                <span class="prompt">
                  课程创建时间距补考开始时间大于10分钟
                </span>
              </el-tooltip>
            </el-col>
          </el-row>
        </div>
        <div
          v-if="testStatus === 1"
          style="border-bottom: 1px solid #EBEEF5;margin-bottom: 15px"
        >
          <el-row
            type="flex"
            align="middle"
            :gutter="10"
            class="el-row"
            v-show="testStatus === 1 && !disabledTest"
          >
            <el-col :span="2" class="text-right">
              <span>试卷</span>
            </el-col>
            <el-col :span="5" class="text-content">
              <div class="button-block" @click="selectTest">选择试卷</div>
              <SelectTestPaper
                ref="paper"
                @pap="getPaperData"
              ></SelectTestPaper>
            </el-col>
          </el-row>
          <el-row
            type="flex"
            align="middle"
            :gutter="10"
            class="el-row"
            v-show="testStatus === 1 && testObj.qid"
          >
            <el-col :span="2" class="text-right">
              <span></span>
            </el-col>
            <el-col :span="7" class="text-content">
              <div
                @click="goToPaperPreview()"
                class="word-break"
                style="width: 318px;background-color: #F5F7FA;height: 25px;line-height: 25px;display: inline-block;vertical-align: middle;padding: 0 5px;"
              >
                <i class="el-icon-document" style="margin-right: 15px;"></i>
                <span
                  class="text-title"
                  style="color: #409EFF;font-size: 12px;cursor: pointer;"
                  >{{ testObj.name }}</span
                >
              </div>
            </el-col>
          </el-row>
        </div>
        <el-row
          style="border-bottom: 1px solid #EBEEF5;padding-bottom: 15px"
          type="flex"
          align="middle"
          :gutter="10"
          class="el-row"
          v-show="testStatus === 1"
        >
          <el-col :span="2" class="text-right">
            <span>考试达标分</span>
          </el-col>
          <el-col :span="2" class="text-content">
            <el-input
              v-model="totalvalueLimit"
              placeholder="请输入"
              :disabled="disabledTest"
              @input="totalvalueLimit = totalvalueLimit.replace(/[^\d]/g, '')"
            ></el-input>
          </el-col>
          <el-col :span="15" class="text-content">
            <i class="el-icon-warning-outline color-red"></i>
            <span class="color-red font-12">
              考试提交后，当评分大于等于此分数，系统自动判定为达标，小于则判定为不达标
            </span>
          </el-col>
        </el-row>
        <el-row
          type="flex"
          align="middle"
          :gutter="10"
          class="el-row"
          v-if="testStatus === 1"
        >
          <el-col :span="2" class="text-right">
            <span>颁发证书</span>
          </el-col>
          <el-col :span="3" class="text-content">
            <el-radio-group
              v-model="certificateStatus"
              @change="radioChange('certificateStatus')"
            >
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row
          type="flex"
          align="middle"
          :gutter="10"
          class="el-row"
          v-show="certificateStatus === 1 && testStatus === 1"
        >
          <el-col :span="2" class="text-right">
            <span>证书</span>
          </el-col>
          <el-col :span="2.5" class="text-content">
            <div class="button-block" @click="selectCertificate">编辑证书</div>
            <SelectCertificate
              ref="certificate"
              :codeNum="codeNum"
              @cert="getCertificateData"
              @changeCert="changeCertificateData"
            ></SelectCertificate>
          </el-col>
          <el-col :span="6" class="text-content">
            <i class="el-icon-warning-outline color-red"></i>
            <span class="color-red font-12">
              学员考试达标则可获得证书
            </span>
          </el-col>
        </el-row>
        <el-row
          type="flex"
          align="middle"
          :gutter="10"
          class="el-row"
          v-show="
            certificateStatus === 1 &&
              certificateObj.certificateCompany &&
              testStatus === 1
          "
        >
          <el-col :span="2" class="text-right">
            <span></span>
          </el-col>
          <el-col :span="22" class="text-content">
            <div class="certificate-box">
              <img
                v-if="!certificateObj"
                src="../../../assets/images/layout-course1.png"
              />
              <img v-if="certificateObj" :src="certificateObj.certificateUrl" />
              <div style="width:100%">
                <el-row type="flex" align="top" class="el-row">
                  <el-col :span="3" class="certificate-left">
                    <span>证书名称：</span>
                  </el-col>
                  <el-col :span="8" class="certificate-right">
                    {{ certificateObj.certificateName }}
                  </el-col>
                </el-row>
                <el-row type="flex" align="top" class="el-row">
                  <el-col :span="3" class="certificate-left">
                    <span>证书内容：</span>
                  </el-col>
                  <el-col :span="8" class="certificate-right">
                    {{ certificateObj.certificateDesc }}
                  </el-col>
                </el-row>
                <el-row
                  v-if="optionsNews[0] === '4'"
                  type="flex"
                  align="top"
                  class="el-row"
                >
                  <el-col :span="3" class="certificate-left">
                    <span>等级：</span>
                  </el-col>
                  <el-col :span="8" class="certificate-right">
                    <span v-if="gradeStr">{{ gradeStr }}</span>
                    <span v-if="!gradeStr">-</span>
                  </el-col>
                </el-row>
                <el-row
                  v-if="optionsNews[0] === '4'"
                  type="flex"
                  align="top"
                  class="el-row"
                >
                  <el-col :span="3" class="certificate-left">
                    <span>类型：</span>
                  </el-col>
                  <el-col :span="8" class="certificate-right">
                    <span v-if="typeStr">{{ typeStr }}</span>
                    <span v-if="!typeStr">-</span>
                  </el-col>
                </el-row>
                <el-row
                  v-if="optionsNews[0] === '4'"
                  type="flex"
                  align="top"
                  class="el-row"
                >
                  <el-col :span="3" class="certificate-left">
                    <span>性质：</span>
                  </el-col>
                  <el-col :span="8" class="certificate-right">
                    <span v-if="natureStr">{{ natureStr }}</span>
                    <span v-if="!natureStr">-</span>
                  </el-col>
                </el-row>
                <el-row type="flex" align="top" class="el-row">
                  <el-col :span="3" class="certificate-left">
                    <span>发证单位：</span>
                  </el-col>
                  <el-col :span="8" class="certificate-right">
                    {{ certificateObj.certificateCompany }}
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="content pt-content">
      <div class="title">课后作业</div>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span>布置作业</span>
        </el-col>
        <el-col :span="3" class="text-content">
          <el-radio-group
            v-model="taskStatus"
            @change="radioChange('taskStatus')"
          >
            <el-radio :label="0" :disabled="disabledTask">否</el-radio>
            <el-radio :label="1" :disabled="disabledTask">是</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <div :class="{ tierBorder: taskStatus === 1 }">
        <el-row
          style="border-bottom: 1px solid #EBEEF5;padding-bottom: 15px"
          type="flex"
          align="middle"
          :gutter="10"
          class="el-row"
          v-show="taskStatus === 1"
        >
          <el-col :span="2" class="text-right">
            <span>提交时间</span>
          </el-col>
          <el-col :span="7.5" class="text-content" v-show="taskStatus === 1">
            <el-date-picker
              v-model="taskStartTime"
              type="datetime"
              placeholder="提交开始时间"
              size="small"
              value-format="timestamp"
              format="yyyy-MM-dd HH:mm"
              :picker-options="pickerOptions"
              prefix-icon="el-icon-date"
              :disabled="disabledTask"
            >
            </el-date-picker>
            <span style="margin: 0 10px;">至</span>
            <el-date-picker
              v-model="taskEndTime"
              type="datetime"
              placeholder="提交结束时间"
              size="small"
              value-format="timestamp"
              format="yyyy-MM-dd HH:mm"
              :picker-options="pickerOptions"
              prefix-icon="el-icon-date"
            >
            </el-date-picker>
          </el-col>
          <el-col
            :span="3"
            class="text-content word-break"
            v-show="taskStatus === 1"
          >
            <img src="../../../assets/images/icon-help.png" class="icon-tip" />
            <el-tooltip placement="top-start" :offset="10">
              <div slot="content">
                <div class="prompt">
                  要求学员课程作业提交的起止时间，提交开始时间前和提交
                </div>
                <div class="prompt">
                  结束时间后学员不可进行作业提交
                </div>
              </div>
              <span class="prompt">
                要求学员课程作业提交的起止
              </span>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row
          type="flex"
          align="middle"
          :gutter="10"
          class="el-row"
          style="border-bottom: 1px solid #EBEEF5;padding-bottom: 15px"
          v-show="taskStatus === 1"
        >
          <el-col :span="2" class="text-right">
            <span class="require-icon">*</span>
            <span>作业合格分</span>
          </el-col>
          <el-col :span="2" class="text-content">
            <el-input
              v-model="qualifiedScore"
              placeholder="请输入"
              :disabled="disabledTask"
              @input="qualifiedScore = qualifiedScore.replace(/[^\d]/g, '')"
              maxlength="3"
            ></el-input>
          </el-col>
          <el-col :span="16" class="text-content">
            <i class="el-icon-warning-outline color-red"></i>
            <span class="color-red font-12">
              100分制，作业批改后，当评分大于等于此分数，系统自动判定为合格，小于则判定为不合格
            </span>
          </el-col>
        </el-row>
        <div
          v-show="taskStatus === 1"
          style="border-bottom: 1px solid #EBEEF5;margin-bottom: 15px"
        >
          <el-row
            type="flex"
            align="middle"
            :gutter="10"
            class="el-row"
            v-show="taskStatus === 1"
          >
            <el-col :span="2" class="text-right">
              <span>开启PK墙</span>
            </el-col>
            <el-col :span="3" class="text-content">
              <el-radio-group
                v-model="pkStatus"
                @change="radioChange('pkStatus')"
              >
                <el-radio :label="0" :disabled="disabledPK">否</el-radio>
                <el-radio :label="1" :disabled="disabledPK">是</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row
            type="flex"
            align="top"
            :gutter="10"
            class="el-row"
            v-show="pkStatus === 1"
          >
            <el-col :span="2" class="text-right">
              <span>Pk时间</span>
            </el-col>
            <el-col :span="7.5" class="text-content" v-show="pkStatus === 1">
              <el-date-picker
                v-model="pkStartTime"
                type="datetime"
                placeholder="PK开始时间"
                size="small"
                value-format="timestamp"
                format="yyyy-MM-dd HH:mm"
                :picker-options="pickerOptions"
                prefix-icon="el-icon-date"
                :disabled="disabledPK"
              >
              </el-date-picker>
              <span style="margin: 0 10px;">至</span>
              <el-date-picker
                v-model="pkEndTime"
                type="datetime"
                placeholder="PK结束时间"
                size="small"
                value-format="timestamp"
                format="yyyy-MM-dd HH:mm"
                :picker-options="pickerOptions"
                prefix-icon="el-icon-date"
              >
              </el-date-picker>
            </el-col>
            <el-col
              :span="3"
              class="text-content word-break"
              v-show="pkStatus === 1"
            >
              <img
                src="../../../assets/images/icon-help.png"
                class="icon-tip"
              />
              <el-tooltip placement="top-start" :offset="10">
                <div slot="content">
                  <div class="prompt">
                    要求学员作业参与PK的起止时间，PK开始时间前和PK
                  </div>
                  <div class="prompt">
                    结束时间后学员不可参与作业PK
                  </div>
                </div>
                <span class="prompt">
                  要求学员作业参与PK的起止时
                </span>
              </el-tooltip>
            </el-col>
          </el-row>
        </div>
        <el-row
          type="flex"
          align="top"
          :gutter="10"
          class="el-row"
          v-show="taskStatus === 1"
        >
          <el-col :span="2" class="text-right">
            <span class="require-icon">*</span>
            <span>作业要求</span>
          </el-col>
          <el-col :span="11" class="text-content">
            <u-editor
              :content.sync="taskDescription"
              :savePicture="savePicture"
              :uploadImg="uploadImg"
              :disabled="disabledTask"
              :height="'150'"
              :toolbars="toolbars"
            ></u-editor>
          </el-col>
          <el-col :span="2" class="text-left mt-preview">
            <span
              style="color:#1989FA;cursor: pointer;"
              @click="previewClick(taskDescription)"
            >
              预览
            </span>
          </el-col>
        </el-row>
        <el-row
          type="flex"
          align="top"
          :gutter="10"
          class="el-row"
          v-show="taskStatus === 1"
        >
          <el-col :span="2" class="text-right">
            <span class="require-icon">*</span>
            <span>提交形式</span>
          </el-col>
          <el-col :span="11" class="text-content">
            <div
              class="d-flex align-items-center"
              style="margin-bottom:20px"
              v-for="(item, index) in homeWorkList"
              :key="index"
            >
              <div style="width:80px;text-align: right">
                {{ item.submitName }}
              </div>
              <el-switch
                v-model="item.switchStatus"
                :disabled="disabledTask"
                style="margin-right:40px;margin-left:10px"
              >
              </el-switch>
              <el-radio-group
                v-if="item.switchStatus"
                v-model="item.requiredStatus"
              >
                <el-radio :label="1" :disabled="disabledTask">必填</el-radio>
                <el-radio :label="0" :disabled="disabledTask">非必填</el-radio>
              </el-radio-group>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
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
        <el-button
          type="primary"
          size="mini"
          plain
          @click="staging"
          :disabled="submitDisable"
        >
          暂存草稿
        </el-button>
        <span style="font-size: 12px;color: #909399;margin-left:10px">
          <img
            src="../../../assets/images/icon-help.png"
            style="width: 14px;height: 14px;"
          />
          发布后学员端<span style="color:#ff0000">10分钟</span>左右可查看此课程
        </span>
      </template>
    </div>
    <div
      class="footer-bottom-container"
      v-if="saveType == 1 && (detailObj.status == 2 || detailObj.status == 3)"
    >
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
    <div
      class="footer-bottom-container"
      v-if="saveType == 1 && detailObj.status == 1"
    >
      <template>
        <el-button size="mini" @click="$router.go(-1)">返回</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="save"
          :disabled="submitDisable"
        >
          发布
        </el-button>
        <el-button
          type="primary"
          size="mini"
          plain
          @click="staging"
          :disabled="submitDisable"
        >
          暂存
        </el-button>
      </template>
    </div>
    <!-- 底部按钮 end -->
    <advert-preview
      v-show="previewDialog"
      @instance="instancePreview"
      @closeMask="closeMask"
    ></advert-preview>
    <el-dialog
      title="选择外聘讲师"
      width="836px"
      custom-class="public-dialog"
      :close-on-click-modal="false"
      :visible.sync="selectTeacherDialog"
    >
      <select-library-teacher
        v-if="selectTeacherDialog"
        :id="lecturerLibraryId"
        :lecturerLibraryName="lecturerLibraryName"
        @confirm="confirmTeacherPopup"
        @cancel="selectTeacherDialog = false"
        @add="addTeacherPopup"
      >
      </select-library-teacher>
    </el-dialog>
    <el-drawer
      title="新增资料"
      :visible.sync="drawerCor"
      direction="rtl"
      size="40%"
      :close-on-press-escape="false"
      :show-close="true"
      custom-class="public-drawer"
      :before-close="handleClose"
    >
      <library-add
        v-if="drawerCor"
        saveType="add"
        @close="drawerCloseCor"
        @confirm="drawerConfirm"
      >
      </library-add>
    </el-drawer>
  </div>
</template>

<script lang="ts" src="./add-recorded-course.ts"></script>

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
          color: #606266;
        }
      }
      .text-content {
        .classify-content {
          display: flex;
          justify-content: flex-start;
          .classify-checkbox {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            .classify-content-item {
              height: 45px;
              display: flex;
              justify-content: flex-start;
            }
          }
        }
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
        .upload-img {
          width: 100px;
          height: 100px;
          cursor: pointer;
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
    }
  }
  .pt-content {
    padding-top: 0;
    padding-bottom: 15px;
  }
  .tierBorder {
    border: 1px dashed #409eff;
    padding: 15px 20px 20px 15px;
    margin: 15px 100px 20px 100px;
  }

  .description {
    padding: 0 0 20px 0;
    overflow: visible;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    &::v-deep .van-field__error-message {
      padding-left: 32px;
    }
    .quillWrapper {
      display: flex;
      flex-direction: column;

      &::v-deep .ql-snow {
        position: relative;
        border: 0;
        background: #f2f2f2;
      }

      &::v-deep .ql-toolbar {
        padding-top: 4px;
        padding-bottom: 0px;
      }

      &::v-deep .ql-formats {
        display: flex;
        justify-content: space-between;
        margin-right: 0 !important;
      }

      &::v-deep .ql-editor {
        min-height: 125px;
        background: #ffffff;
        &.ql-blank::before {
          color: #888;
          font-family: "PingFang SC";
          font-size: 14px;
          font-style: normal;
        }
        em {
          font-style: italic;
        }
      }
      &::v-deep .ql-picker-options {
        transform: translateY(calc(-100% - 60px));
        outline: none;
      }
    }
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
.code-list {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  .code-item {
    padding: 6px 10px;
    margin-bottom: 10px;
    margin-right: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;
    color: #5a5e66;
    background: #f0f2f5;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
  }
}
.lecturer-button {
  margin-left: 10px;
  padding: 3px 20px;
  color: #409eff;
  border-radius: 4px;
  border: 1px solid #409eff;
  text-align: center;
  cursor: pointer;
}
.lecturer-div {
  padding: 6px 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 12px;
  color: #606266;
  background: #f0f2f5;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
}
</style>
