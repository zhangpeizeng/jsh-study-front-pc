<template>
  <div class="container-box" v-loading="loading">
    <div class="content">
      <div class="title">基本信息</div>
      <!--课程名称-->
      <el-row type="flex" align="top" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">课程名称:</span>
        </el-col>
        <el-col :span="4">
          <span class="text-title">{{ detail.courseName }}</span>
          <el-tag size="mini" v-if="statusany === 2" style="margin-left: 10px;"
            >已上架</el-tag
          >
          <el-tag size="mini" v-if="statusany === 3" style="margin-left: 10px;"
            >已下架</el-tag
          >
          <el-tag size="mini" v-if="statusany === 1" style="margin-left: 10px;"
            >草稿</el-tag
          >
        </el-col>
        <el-col :span="2" class="text-right">
          <span class="text-title">课型:</span>
        </el-col>
        <el-col :span="8">
          <span class="text-title">{{ detail.courseTypeName }}</span>
        </el-col>
      </el-row>
      <!--课程名称-->
      <el-row type="flex" align="top" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">学习终端:</span>
        </el-col>
        <el-col :span="4">
          <!--1-客户端；2-员工端；3-直销员端-->
          <span class="text-title" v-if="detail.studyTerminal === '1'"
            >客户端</span
          >
          <span class="text-title" v-if="detail.studyTerminal === '2'"
            >员工端</span
          >
          <span class="text-title" v-if="detail.studyTerminal === '3'"
            >直销员端</span
          >
          <span v-for="(item, index) in optionsNewsnext" :key="index">
            {{ item }}
          </span>
        </el-col>
        <el-col :span="2" class="text-right">
          <span class="text-title">讲师:</span>
        </el-col>
        <el-col :span="8">
          <span class="text-title">{{ detail.lecturerName }}</span>
        </el-col>
      </el-row>
      <el-row type="flex" align="top" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right" align="top">
          <span class="text-title">课程分类:</span>
        </el-col>
        <el-col :span="8" v-if="courseType === '1'">
          <span
            class="text-title"
            v-for="(item, index) of detail.classClassifyNames"
            :key="index"
            style="margin-right: 10px;"
            >{{ item }}</span
          >
        </el-col>
        <el-col :span="16" v-if="courseType !== '1'">
          <span
            class="text-title"
            v-for="(item, index) of detail.classClassifyNames"
            :key="index"
            style="margin-right: 10px;"
            >{{ item }}</span
          >
        </el-col>
        <el-col :span="2" class="text-right" v-if="courseType === '1'">
          <span class="text-title">关联商品:</span>
        </el-col>
        <el-col :span="8" v-if="courseType === '1'">
          <span class="text-title" v-if="goods && goods.productCode"
            >{{ goods.productCode }} / {{ goods.itemName }} /
            {{ goods.itemModel }}</span
          >
        </el-col>
      </el-row>
      <el-row type="flex" align="top" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">课程封面:</span>
        </el-col>
        <el-col :span="8" class="text-left">
          <img
            class="text-img"
            :src="detail.courseImg"
            v-if="detail && detail.courseImg && detail.courseImg !== ''"
          />
          <img
            class="text-img"
            src="../../../../assets/images/backlogo.png"
            v-if="(detail && !detail.courseImg) || detail.courseImg === ''"
          />
        </el-col>
      </el-row>
      <el-row type="flex" align="top" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">课程简介:</span>
        </el-col>
        <el-col :span="8" class="course-description">
          <div v-html="detail.courseDescription"></div>
        </el-col>
      </el-row>
      <el-row type="flex" align="top" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">是否需要报名:</span>
        </el-col>
        <el-col :span="4">
          <span v-if="detail.signUpStatus" class="text-title">是</span>
          <span v-if="!detail.signUpStatus" class="text-title">否</span>
        </el-col>
        <el-col :span="2" class="text-right">
          <span class="text-title">报名时间:</span>
        </el-col>
        <el-col :span="14">
          <span class="text-title">
            {{ detail.signUpStartTime | date("yyyy-MM-dd hh:mm:ss") }} -
            {{ detail.signUpEndTime | date("yyyy-MM-dd hh:mm:ss") }}</span
          >
          <i class="el-icon-warning-outline" style="margin-left: 20px;"></i>
          <el-tooltip
            class="item "
            effect="light"
            content="要求学员报名本课程的起止时间，报名开始时间前和报名结束时间后学员不可进行报名，报名后学员才可学习课程"
            placement="top"
          >
            <div class="text-title-line">
              要求学员报名本课程的起止时间，报名开始时间前和报名结束时间后学员不可进行报名，报名后学员才可学习课程
            </div>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row type="flex" align="top" :gutter="10" class="el-row">
        <el-col
          :span="2"
          class="text-right"
          v-if="detail.courseType === '2' || detail.courseType === '3'"
        >
          <span class="text-title">直播时间:</span>
        </el-col>
        <el-col
          :span="4"
          v-if="detail.courseType === '2' || detail.courseType === '3'"
        >
          <span class="text-title">
            {{ detail.liveStartTime | date("yyyy-MM-dd hh:mm:ss") }} -
            {{ detail.liveEndTime | date("yyyy-MM-dd hh:mm:ss") }}</span
          >
        </el-col>
        <el-col :span="2" class="text-right">
          <span class="text-title">学习时间:</span>
        </el-col>
        <el-col :span="5">
          <span class="text-title">
            {{ detail.studyStartTime | date("yyyy-MM-dd hh:mm:ss") }} -
            {{ detail.studyEndTime | date("yyyy-MM-dd hh:mm:ss") }}</span
          >
        </el-col>
      </el-row>
      <el-row
        type="flex"
        align="top"
        :gutter="10"
        class="el-row"
        v-if="courseType === '2'"
      >
        <el-col :span="2" class="text-right">
          <span class="text-title">直播布局:</span>
        </el-col>
        <el-col :span="4">
          <div>
            <img
              v-if="detail.layout === '1'"
              :src="LayoutDefaultImg1"
              style="width: 172px;height: 100px;"
            />
            <img
              v-if="detail.layout !== '1'"
              :src="LayoutDefaultImg2"
              style="width: 172px;height: 100px;"
            />
          </div>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        align="top"
        :gutter="10"
        class="el-row"
        v-if="courseType === '2'"
      >
        <el-col :span="2" class="text-right"> </el-col>
        <el-col :span="6">
          <i class="el-icon-warning-outline" style="color: #F56C6C;"></i>
          <span class="text-title" style="color: #F56C6C;"
            >课堂创建成功，不得修改直播布局</span
          >
        </el-col>
      </el-row>
    </div>

    <div class="content" v-if="courseType === '1'">
      <div class="title">课程内容</div>
      <div
        v-for="(item, index) of detail.collegeMarketingLiveList"
        :key="index"
      >
        <el-row
          type="flex"
          align="top"
          :gutter="10"
          class="el-row"
          v-if="item.liveType === '1'"
        >
          <el-col :span="2" class="text-right">
            <span class="text-title">视频:</span>
          </el-col>
          <el-col :span="8" class="text-left">
            <!--<img class="text-img" src="@/assets/images/video.png" />-->
            <!--<div style="width: 100%;height: 20px;line-height: 20px;color: white;border-radius: 0 0 2px 2px;overflow: hidden;white-space: nowrap;text-overflow:ellipsis;">-->
            <!--{{item.liveName}}-->
            <!--</div>-->
            <div class="text-img">
              <div style="width: 100%;" @click="down(item.liveId)">
                <img src="@/assets/images/video.png" style="width: 100%;" />
              </div>
              <div
                style="width: 100%;position: absolute;top: 0;left:0;text-align: right;padding-right: 3px;"
              >
                <img
                  src="@/assets/images/downimg.png"
                  style="width: 16px;display: inline-block;"
                />
              </div>

              <div
                style="width: 100%;height: 20px;line-height: 20px;color: white;border-radius: 0 0 2px 2px;overflow: hidden;white-space: nowrap;text-overflow:ellipsis;position: absolute;bottom: 0;left: 0;"
              >
                {{ item.liveName }}
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row
          type="flex"
          align="top"
          :gutter="10"
          class="el-row"
          v-if="item.liveType === '2'"
        >
          <el-col :span="2" class="text-right">
            <span class="text-title">音频:</span>
          </el-col>
          <el-col :span="8" class="text-left">
            <div class="text-img" style="background-color: #F2F3F5!important;">
              <div style="width: 100%;" @click="down(item.liveId)">
                <img src="@/assets/images/music.png" style="width: 100%;" />
              </div>
              <div
                style="width: 100%;position: absolute;top: 0;left:0;text-align: right;padding-right: 3px;"
              >
                <img
                  src="@/assets/images/downimg.png"
                  style="width: 16px;display: inline-block;"
                />
              </div>
              <div
                style="width: 100%;height: 20px;line-height: 20px;color: white;border-radius: 0 0 2px 2px;overflow: hidden;white-space: nowrap;text-overflow:ellipsis;position: absolute;bottom: 0;left: 0;"
              >
                {{ item.liveName }}
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row
          type="flex"
          align="top"
          :gutter="10"
          class="el-row"
          v-if="item.liveType === '3'"
        >
          <el-col :span="2" class="text-right">
            <span class="text-title">文档:</span>
          </el-col>
          <el-col :span="8" class="text-left">
            <div class="text-img" @click="downtext(item.liveId)">
              <div style="width: 100%;text-align: center;padding-top: 18px;">
                <img src="@/assets/images/file.png" style="width: 60px;" />
              </div>
              <div
                style="width: 100%;height: 20px;line-height: 20px;color: white;background-color: #999;border-radius: 0 0 2px 2px;overflow: hidden;white-space: nowrap;text-overflow:ellipsis;"
              >
                {{ item.liveName }}
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-row type="flex" align="top" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">课程详情:</span>
        </el-col>
        <el-col :span="16" class="container">
          <div v-html="detail.content" class="bannerImg"></div>
        </el-col>
      </el-row>
    </div>

    <div class="content">
      <div class="title">证书/勋章/考试</div>
      <el-row type="flex" align="top" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">是否发放勋章:</span>
        </el-col>
        <el-col :span="4">
          <span v-if="detail.medalStatus" class="text-title">是</span>
          <span v-if="!detail.medalStatus" class="text-title">否</span>
          <el-button
            type="primary"
            size="mini"
            style="margin-left: 20px;"
            plain
            v-if="detail.medalStatus && putbuttonshow"
            @click="gotodetail"
            >发放勋章</el-button
          >
        </el-col>
      </el-row>
      <el-row
        type="flex"
        align="top"
        :gutter="10"
        class="el-row"
        v-if="detail && detail.collegeMarketingMedalRaleList"
      >
        <el-col :span="2" class="text-right"> </el-col>
        <el-col :span="16">
          <div
            style="width: 145px;display: inline-block;vertical-align: middle;"
            v-for="(item, index) of detail.collegeMarketingMedalRaleList"
            :key="index"
          >
            <div style="width: 100%;">
              <img
                style="width: 60px;height: 60px;border-radius: 30px;"
                :src="item.medalTypeUrl"
              />
            </div>
            <div style="width: 100%;padding-top: 15px;">
              <div style="width: 60px;text-align: center;">
                {{ item.medalTypeName }}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        align="top"
        :gutter="10"
        class="el-row"
        v-if="detail && detail.collegeMarketingMedalRaleList"
      >
        <el-col :span="2" class="text-right">
          <span class="text-title">发放比例:</span>
        </el-col>
        <el-col :span="16">
          <div
            style="width: 145px;display: inline-block;vertical-align: middle;"
            v-for="(item, index) of detail.collegeMarketingMedalRaleList"
            :key="index"
          >
            <div style="width: 100%;">
              <div
                style="width: 60px;text-align: center;"
                v-if="item.distributionRatio"
              >
                {{ item.distributionRatio }}%
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" align="top" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">是否考试:</span>
        </el-col>
        <el-col :span="4" class="min-width-200">
          <span v-if="detail.testStatus" class="text-title">是</span>
          <span v-if="!detail.testStatus" class="text-title">否</span>
          <div
            style="width: 160px;background-color: #F5F7FA;height: 25px;line-height: 25px;display: inline-block;vertical-align: middle;margin-left: 15px;padding: 0 5px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
            v-if="detail.testStatus"
            @click="goToPaperPreview()"
          >
            <i class="el-icon-document" style="margin-right: 15px;"></i>
            <span class="text-title" style="color: #409EFF;font-size: 12px;">{{
              detail.examName
            }}</span>
          </div>
        </el-col>
        <el-col :span="2" class="text-right">
          <span class="text-title">考试时间:</span>
        </el-col>
        <el-col :span="14">
          <span class="text-title">
            {{ detail.testStartTime | date("yyyy-MM-dd hh:mm:ss") }} -
            {{ detail.testEndTime | date("yyyy-MM-dd hh:mm:ss") }}</span
          >
          <i class="el-icon-warning-outline" style="margin-left: 20px;"></i>
          <el-tooltip
            class="item "
            effect="light"
            content="要求学员进行课程考试的起止时间，考试开始时间前和考试结束时间后学员不可进行考试"
            placement="top"
          >
            <div class="text-title-line">
              要求学员进行课程考试的起止时间，考试开始时间前和考试结束时间后学员不可进行考试
            </div>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row type="flex" align="top" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">是否补考:</span>
        </el-col>
        <el-col :span="4" class="min-width-200">
          <span v-if="detail.fillTestStatus" class="text-title">是</span>
          <span v-if="!detail.fillTestStatus" class="text-title">否</span>
        </el-col>
        <el-col :span="2" class="text-right" v-if="detail.fillTestStatus">
          <span class="text-title">补考时间:</span>
        </el-col>
        <el-col :span="14" v-if="detail.fillTestStatus">
          <span class="text-title">
            {{ detail.fillTestStartTime | date("yyyy-MM-dd hh:mm") }} -
            {{ detail.fillTestEndTime | date("yyyy-MM-dd hh:mm") }}</span
          >
          <i class="el-icon-warning-outline" style="margin-left: 20px;"></i>
          <el-tooltip
            class="item "
            content="要求学员进行课程补考的起止时间，补考开始时间前和补考结束时间后学员不可进行补考"
            placement="top"
          >
            <div class="text-title-line">
              要求学员进行课程补考的起止时间，补考开始时间前和补考结束时间后学员不可进行补考
            </div>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row type="flex" align="top" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">是否发放证书:</span>
        </el-col>
        <el-col :span="4">
          <span v-if="detail.certificateStatus" class="text-title">是</span>
          <span v-if="!detail.certificateStatus" class="text-title">否</span>
        </el-col>
      </el-row>
      <el-row type="flex" align="top" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">考试达标分:</span>
        </el-col>
        <el-col :span="4">
          <span class="text-title" v-if="detail.totalvalueLimit"
            >{{ detail.totalvalueLimit }}分</span
          >
          <span class="text-title" v-if="!detail.totalvalueLimit">-</span>
        </el-col>
      </el-row>
      <div v-for="(item, index) of detail.certificateRelaList" :key="index">
        <el-row type="flex" align="top" :gutter="10" class="el-row">
          <el-col :span="2" class="text-right"> </el-col>
          <el-col :span="14">
            <div
              style="width: 240px;display: inline-block;vertical-align: middle;"
            >
              <!--<img style="width: 216px;" :src="item.certificateUrl" />-->
              <el-image
                style="width: 216px;"
                :src="item.certificateUrl"
                :preview-src-list="imgurllist"
              >
              </el-image>
            </div>
            <div
              style="width: 400px;display: inline-block;vertical-align: top;"
            >
              <div style="width: 100%;">
                <span>证书名称:</span>
                <span style="padding-left: 10px;">{{
                  item.certificateName
                }}</span>
              </div>
              <div style="width: 100%;">
                <span>证书内容:</span>
                <span style="padding-left: 10px;">{{
                  item.certificateDesc
                }}</span>
              </div>
              <div style="width: 100%;">
                <span>发证单位:</span>
                <span style="padding-left: 10px;">{{
                  item.certificateCompany
                }}</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="content pb-20">
      <div class="title">课后作业</div>
      <el-row type="flex" align="top" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">是否布置作业:</span>
        </el-col>
        <el-col :span="4">
          <span v-if="detail.taskStatus" class="text-title">是</span>
          <span v-if="!detail.taskStatus" class="text-title">否</span>
        </el-col>
        <el-col :span="2" class="text-right" v-if="detail.taskStatus">
          <span class="text-title">提交时间:</span>
        </el-col>
        <el-col :span="14" v-if="detail.taskStatus">
          <span class="text-title">
            {{ detail.taskStartTime | date("yyyy-MM-dd hh:mm:ss") }} -
            {{ detail.taskEndTime | date("yyyy-MM-dd hh:mm:ss") }}</span
          >
          <i class="el-icon-warning-outline" style="margin-left: 20px;"></i>
          <el-tooltip
            class="item "
            effect="light"
            content="要求学员课程作业提交的起止时间，提交开始时间前和提交结束时间后学员不可进行作业提交"
            placement="top"
          >
            <div class="text-title-line">
              要求学员课程作业提交的起止时间，提交开始时间前和提交结束时间后学员不可进行作业提交
            </div>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        align="top"
        :gutter="10"
        class="el-row"
        v-if="detail.taskStatus"
      >
        <el-col :span="2" class="text-right">
          <span class="text-title">作业合格分:</span>
        </el-col>
        <el-col :span="4">
          <span class="text-title" v-if="detail.qualifiedScore"
            >{{ detail.qualifiedScore }}分</span
          >
          <span class="text-title" v-if="!detail.qualifiedScore">-</span>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        align="top"
        :gutter="10"
        class="el-row"
        v-if="detail.taskStatus"
      >
        <el-col :span="2" class="text-right">
          <span class="text-title">是否开启PK墙:</span>
        </el-col>
        <el-col :span="4">
          <span v-if="detail.pkStatus" class="text-title">是</span>
          <span v-if="!detail.pkStatus" class="text-title">否</span>
        </el-col>
        <el-col :span="2" class="text-right">
          <span class="text-title">PK时间:</span>
        </el-col>
        <el-col :span="14">
          <span class="text-title">
            {{ detail.pkStartTime | date("yyyy-MM-dd hh:mm:ss") }} -
            {{ detail.pkEndTime | date("yyyy-MM-dd hh:mm:ss") }}</span
          >
          <i class="el-icon-warning-outline" style="margin-left: 20px;"></i>
          <el-tooltip
            class="item "
            effect="light"
            content="要求学员作业参与PK的起止时间，PK开始时间前和PK结束时间后学员不可参与作业PK"
            placement="top"
          >
            <div class="text-title-line">
              要求学员作业参与PK的起止时间，PK开始时间前和PK结束时间后学员不可参与作业PK
            </div>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        align="top"
        :gutter="10"
        class="el-row"
        v-if="detail.taskStatus"
      >
        <el-col :span="2" class="text-right">
          <span class="text-title">作业要求:</span>
        </el-col>
        <el-col :span="14">
          <!--<span class="text-title">{{ detail.taskDescription }}</span>-->
          <div
            v-html="detail.taskDescription"
            v-if="detail.taskDescription"
          ></div>
          <div v-if="!detail.taskDescription">-</div>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        align="top"
        :gutter="10"
        class="el-row"
        v-if="detail.taskStatus"
      >
        <el-col :span="2" class="text-right">
          <span class="text-title">提交形式:</span>
        </el-col>
        <el-col :span="14">
          <div
            class="d-flex align-items-center"
            style="margin-bottom:10px"
            v-for="(item, index) in detail.submitTypeDtos"
            :key="index"
          >
            <div
              style="width:60px;text-align:right"
              v-if="item.submitType == 0"
            >
              图片
            </div>
            <div
              style="width:60px;text-align:right"
              v-if="item.submitType == 1"
            >
              视频
            </div>
            <div
              style="width:60px;text-align:right"
              v-if="item.submitType == 2"
            >
              音频
            </div>
            <div
              style="width:60px;text-align:right"
              v-if="item.submitType == 3"
            >
              文档
            </div>
            <div
              style="width:60px;text-align:right"
              v-if="item.submitType == 4"
            >
              内容描述
            </div>
            <div v-if="item.requiredStatus == 0">（非必填）</div>
            <div v-if="item.requiredStatus == 1">（必填）</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 底部按钮 start -->
    <div class="footer-bottom-container">
      <template>
        <el-button size="mini" @click="closeto()">关闭</el-button>
      </template>
    </div>
    <!-- 底部按钮 end -->
  </div>
</template>

<script lang="ts" src="./shop-class-detail.ts"></script>
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
    color: #909399;
    .title {
      position: relative;
      display: inline-block;
      margin-bottom: 24px;
      margin-top: 10px;
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
        min-width: 104px !important;
        .text-title {
          color: #909399;
        }
        .text-img {
          width: 178px;
          height: 100px;
          border-radius: 2px;
        }
      }
      .text-left {
        text-align: right;
        position: relative;
        .text-title {
          color: #909399;
          width: 192px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .text-img {
          width: 178px;
          height: 100px;
          border-radius: 2px;
          background-color: #f2f3f5;
          position: relative;
        }
        .text-img-line {
          width: 178px;
          height: 100px;
          border-radius: 2px;
          display: inline-block;
          margin-right: 20px;
          vertical-align: middle;
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
  .text-title-line {
    color: #909399;
    width: 192px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
    vertical-align: middle;
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
}
.min-width-200 {
  min-width: 200px !important;
}
.container {
  .bannerImg {
    max-width: 100%;
    img {
      width: 178px !important;
      border-radius: 4px !important;
    }
  }
}
</style>
