<template>
  <div v-loading="loading" element-loading-text="下载中...">
    <el-row type="flex" align="middle" :gutter="10" class="el-row">
      <el-col :span="3" class="text-right">
        <span class="text-title">课时名称：</span>
      </el-col>
      <el-col :span="21" class="text-content">
        <span class="content-span">{{ detailObj.name }}</span>
      </el-col>
    </el-row>
    <el-row type="flex" align="middle" :gutter="10" class="el-row">
      <el-col :span="3" class="text-right">
        <span class="text-title">课时内容：</span>
      </el-col>
      <el-col :span="21" class="text-content">
        <span class="content-span" v-show="detailObj.type == 1">
          上传资料
        </span>
        <span class="content-span" v-show="detailObj.type == 2">
          选择已有课程
        </span>
      </el-col>
    </el-row>
    <el-row type="flex" align="middle" :gutter="10" class="el-row">
      <el-col :span="3" class="text-right">
        <span class="text-title">学习时间：</span>
      </el-col>
      <el-col :span="21" class="text-content">
        <span
          class="content-span"
          v-show="detailObj.studyStartTime && detailObj.studyEndTime"
        >
          {{ detailObj.studyStartTime | date("yyyy-MM-dd hh:mm") }}
          至
          {{ detailObj.studyEndTime | date("yyyy-MM-dd hh:mm") }}
        </span>
        <span v-show="!detailObj.studyStartTime && !detailObj.studyEndTime">
          -
        </span>
      </el-col>
    </el-row>
    <el-row
      type="flex"
      align="middle"
      :gutter="10"
      class="el-row"
      v-show="detailObj.type == 2"
    >
      <el-col :span="3" class="text-right">
        <span class="text-title">课程名称：</span>
      </el-col>
      <el-col :span="21" class="text-content">
        <span class="content-span">{{ detailObj.courseName }}</span>
      </el-col>
    </el-row>
    <el-row
      type="flex"
      align="middle"
      :gutter="10"
      class="el-row"
      v-show="detailObj.type == 2"
    >
      <el-col :span="3" class="text-right">
        <span class="text-title">讲师：</span>
      </el-col>
      <el-col :span="21" class="text-content">
        <span class="content-span">{{ detailObj.lecturerName }}</span>
      </el-col>
    </el-row>
    <el-row
      type="flex"
      align="top"
      :gutter="10"
      class="el-row"
      v-show="detailObj.type == 1 && videoList.length > 0"
    >
      <el-col :span="3" class="text-right">
        <span class="text-title">视频：</span>
      </el-col>
      <el-col :span="21" class="text-content">
        <div class="media" v-for="(item, index) in videoList" :key="index">
          <img src="../../../assets/images/video.png" class="media-img" />
          <div class="media-name">{{ item.liveName }}</div>
          <div class="content-down" @click="down(item.liveId)">
            <i
              style="font-size: 20px;cursor: pointer;margin-top: 40px"
              class="el-icon-download"
            ></i>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row
      type="flex"
      align="top"
      :gutter="10"
      class="el-row"
      v-show="detailObj.type == 1 && voiceList.length > 0"
    >
      <el-col :span="3" class="text-right">
        <span class="text-title">音频：</span>
      </el-col>
      <el-col :span="21" class="text-content">
        <div class="media" v-for="(item, index) in voiceList" :key="index">
          <img src="../../../assets/images/music.png" class="media-img" />
          <div class="media-name">{{ item.liveName }}</div>
          <div class="content-down" @click="down(item.liveId)">
            <i
              style="font-size: 20px;cursor: pointer;margin-top: 40px"
              class="el-icon-download"
            ></i>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row
      type="flex"
      align="top"
      :gutter="10"
      class="el-row"
      v-show="detailObj.type == 1 && docList.length > 0"
    >
      <el-col :span="3" class="text-right">
        <span class="text-title">文档：</span>
      </el-col>
      <el-col :span="21" class="text-content">
        <div class="media" v-for="(item, index) in docList" :key="index">
          <div class="file">
            <img src="../../../assets/images/file.png" class="file-img" />
          </div>
          <div class="media-name">{{ item.liveName }}</div>
          <div class="content-down" @click="downtext(item.liveId)">
            <i
              style="font-size: 20px;cursor: pointer;margin-top: 40px"
              class="el-icon-download"
            ></i>
          </div>
        </div>
      </el-col>
    </el-row>
    <div slot="footer" class="text-center mt-30">
      <el-button size="mini" @click="deleteCourse">删除</el-button>
      <el-button size="mini" type="primary" @click="update" v-show="!editFlag">
        修改
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" src="./course-detail-popup.ts"></script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 15px;
  .text-right {
    text-align: right;
    .text-title {
      color: #909399;
    }
  }
  .text-content {
    display: flex;
    justify-content: flex-start;
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
    .media:hover .content-down {
      display: block;
    }
    .media {
      width: 178px;
      height: 100px;
      margin-bottom: 10px;
      margin-right: 10px;
      position: relative;
      .file {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fcfdff;
        width: 100%;
        height: 100%;
        border: 1px solid rgb(220, 223, 230);
        .file-img {
          width: 60px;
          height: 60px;
        }
      }
      .media-name {
        position: absolute;

        white-space: nowrap;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;

        bottom: 0;
        width: 177px;
        padding: 4px 10px;
        font-size: 12px;
        color: #ffffff;
        background: #000000;
        opacity: 0.52;
      }
      .content-down {
        display: none;
        position: absolute;
        right: 0;
        left: 0;
        top: 0;
        bottom: 0;
        z-index: 99;
        background-color: rgba(0, 0, 0, 0.5);
        text-align: center;
        line-height: 30px;
        color: #ffffff;
      }
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
</style>
