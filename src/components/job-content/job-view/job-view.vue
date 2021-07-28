<template>
  <div style="padding: 0 20px;  position: relative;">
    <div class="clearfloat job-m">
      <div class="content-left" style="width:11%;">
        要求:
      </div>
      <div class="content-right" style="width:87%;">
        <div class="lai-active">
          <div v-html="jobDetails.homeworkDesc"></div>
        </div>
      </div>
    </div>
    <div class="clearfloat" style="padding:18px 0 8px 0">
      <div style="float:left;color: #303133;font-weight: 500;">作业内容</div>
      <div
        class=" ml-20"
        v-if="jobDetails.dates !== null"
        style="float: left;margin-top:-2px"
      >
        <el-button size="mini" type="text" @click="downAll"
          ><i class="el-icon-download" type="text"></i>全部下载</el-button
        >
      </div>
    </div>
    <div>
      <div class="clearfloat" v-if="videoCollection.length > 0">
        <div class="content-left">
          视频
        </div>
        <div class="content-right">
          <div class="img-content clearfloat">
            <div
              class="content-img "
              style="float: left"
              v-for="item in videoCollection"
              :key="item.value"
            >
              <div>
                <div class="content-down" @click="down('1', item.value)">
                  <i
                    style="font-size: 20px;cursor: pointer;"
                    class="el-icon-download"
                  ></i>
                </div>
              </div>
              <div style="float: left">
                <img
                  class="job-img"
                  @click="viewVideo(item)"
                  src="@/assets/images/video.png"
                  alt=""
                />
                <div
                  class="content-down"
                  v-if="item.type != 0"
                  @click="down('mp4', item.value)"
                >
                  <i
                    style="font-size: 20px;cursor: pointer;"
                    class="el-icon-download"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="clearfloat mt-10" v-if="pictureCollection.length > 0">
        <div class="content-left">
          图片
        </div>
        <div class="content-right">
          <div class="img-content clearfloat">
            <div
              class="content-img "
              style="float: left"
              v-for="item in pictureCollection"
              :key="item.value"
            >
              <div>
                <el-image
                  :src="item.value"
                  class="job-img"
                  :preview-src-list="imgClick(item.value)"
                >
                </el-image>
                <div class="content-down" @click="down('1', item.value)">
                  <i
                    style="font-size: 20px;cursor: pointer;"
                    class="el-icon-download"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="clearfloat mt-10" v-if="audioCollection.length > 0">
        <div class="content-left">
          音频
        </div>
        <div class="content-right">
          <div class="img-content clearfloat">
            <div
              class="content-img "
              style="float: left"
              v-for="item in audioCollection"
              :key="item.value"
            >
              <div style="float: left">
                <img
                  class="job-img"
                  @click="viewVideo(item)"
                  src="@/assets/images/music.png"
                  alt=""
                />
                <div class="content-down" @click="down('mp3', item.value)">
                  <i
                    style="font-size: 20px;cursor: pointer;"
                    class="el-icon-download"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="clearfloat mt-10" v-if="documentCollection.length > 0">
        <div class="content-left">
          文档
        </div>
        <div class="content-right">
          <div class="img-content clearfloat">
            <div
              class="content-img "
              style="float: left"
              v-for="item in documentCollection"
              :key="item.value"
            >
              <div style="float: left">
                <div
                  class="job-img"
                  style="text-align: center;background-color: #F2F3F5;line-height: 100px;border-radius: 5px"
                >
                  <img
                    @click="viewDocument(item)"
                    src="@/assets/images/file.png"
                    alt=""
                  />
                </div>
                <div class="content-down" @click="downtext(item.value)">
                  <i
                    style="font-size: 20px;cursor: pointer;"
                    class="el-icon-download"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="clearfloat" v-if="jobDetails.desc">
        <div class="content-left">
          描述
        </div>
        <div class="content-right">
          <div class="job-content">
            {{ jobDetails.desc }}
          </div>
        </div>
      </div>
    </div>
    <div class="job-evaluation-box" v-if="jobDetails.status == 1">
      <div class="job-top">
        <div style="color:#606266;font-weight: 600;">作业评价</div>
        <div
          style="color:#409EFF;font-size:18px;margin: 0 15px 0 20px;font-weight: 600;"
        >
          {{ jobDetails.score }}分
        </div>
        <div class="job-status" v-if="jobDetails.isQualified === 1">合格</div>
        <div class="job-status red" v-else>不合格</div>
      </div>
      <div
        class="clearfloat"
        style="padding-bottom:10px"
        v-if="jobDetails.remark !== ''"
      >
        <div style="float: left;text-align:left;width:15%;color: #606266;">
          评语:
        </div>
        <div class="content-right" style="width:85%;color: #606266;">
          {{ jobDetails.remark }}
        </div>
      </div>
      <div class="clearfloat" style="color:#909399">
        <div style="float: left;text-align:left;width:15%">
          批改人:
        </div>
        <div class="content-right" style="width:85%">
          {{ jobDetails.correctUserName }}({{ jobDetails.correctUserId }})
        </div>
      </div>
    </div>
    <div style="height:110px"></div>
    <div class="footer-btn-container">
      <template>
        <el-button size="medium" @click="btnColse">关闭</el-button>
      </template>
    </div>
  </div>
</template>
<script lang="ts" src="./job-view.ts"></script>
<style lang="scss">
.lai-active {
  width: 100%;
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
.clearfloat:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
.clearfloat {
  zoom: 1;
}
.job-evaluation-box {
  border-radius: 4px;
  border: 1px solid #dfe1e8;
  padding: 15px 20px;
  margin-bottom: 55px;
  .job-top {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #dfe1e8;
    margin-bottom: 10px;
    .job-status {
      margin-top: -2px;
      padding: 0 2px;
      height: 20px;
      line-height: 18px;
      background: #ecf5ff;
      border: 1px solid #409eff;
      color: #409eff;
      font-size: 12px;
      text-align: center;
    }
    .red {
      background: #fef0f0;
      border: 1px solid #f56c6c;
      color: #f56c6c;
    }
  }
}
.job-m {
  width: 100%;
  padding: 10px 20px 10px 0;
  background: #f5f7fa;
  border-radius: 4px;
}
.job-content {
  color: #909399;
  font-size: 14px;
  padding-bottom: 24px;
}
.job-score {
  display: inline-block;
}
.content-left {
  float: left;
  width: 22%;
  text-align: right;
  color: #606266;
}
.content-right {
  float: right;
  width: 76%;
}
.img-content {
  .content-img:hover .content-down {
    display: block;
  }
  .content-img {
    position: relative;
    width: 157px;
    height: 100px;
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 20px;
    .job-img {
      width: 157px;
      height: 100px;
      margin-right: 5px;
      margin-bottom: 5px;
      cursor: pointer;
    }
    .content-down {
      display: none;
      position: absolute;
      right: 0;
      top: 0;
      width: 25px;
      height: 25px;
      z-index: 99;
      background-color: rgba(0, 0, 0, 0.6);
      text-align: center;
      line-height: 30px;
      color: #ffffff;
    }
  }
}
.footer-btn-container {
  height: 70px;
  line-height: 70px;
  text-align: center;
  bottom: 0px;
  margin-top: 30px;
  position: fixed;
  z-index: 999;
  background-color: #ffffff;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  left: 65%;
  width: 35%;
}
</style>
