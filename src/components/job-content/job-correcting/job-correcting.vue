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
      <div style="border-bottom: 1px solid #DCDFE6;"></div>
    </div>
    <div class="detailed1" style="margin-top: 15px;">
      <div class="diamond"></div>
      <div style="color:#303133">作业批改</div>
    </div>
    <div class="clearfloat">
      <div class="content-left job-score" style="margin-top: 3px;width:10%">
        <span style="color: #FF0000;">*</span> 分值
      </div>
      <div class="content-right" style="padding-left:12px;width:89%">
        <el-input
          size="mini"
          style="width: 40%"
          v-model="score"
          placeholder="请输入，最高100分"
          pattern="[0-9]*"
          @input="proPortionTest()"
          onkeyup="this.value=this.value.replace(/\D/g,'')"
          onafterpaste="this.value=this.value.replace(/\D/g,'')"
        ></el-input>
        <span
          style="margin-left: 15px;color: #F56C6C;font-size: 12px;"
          class="job-score"
          ><i class="el-icon-warning-outline" type="text"></i>
          作业分值为100分制</span
        >
      </div>
    </div>
    <div class="clearfloat" style="margin-top: 15px">
      <div class="content-left job-score" style="width:10%">
        评语
      </div>
      <div class="content-right" style="padding-left:12px;width:89%">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 3 }"
          placeholder="请输入评语"
          v-model="remark"
          style="width: 80%"
        >
        </el-input>
      </div>
    </div>
    <div style="height:110px"></div>
    <div class="footer-btn-container">
      <template>
        <el-button size="medium" @click="btnColse">取消</el-button>
        <el-button type="primary" size="medium" @click="correctionClick"
          >确定</el-button
        >
      </template>
    </div>
  </div>
</template>
<script lang="ts" src="./job-correcting.ts"></script>
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
.detailed1 {
  font-size: 14px;
  font-weight: 600;
  width: 130px;
  padding: 8px 20px;
  display: flex;
  align-items: center;
  justify-self: center;
  background-color: rgba(242, 242, 242, 1);
  margin-bottom: 20px;
  margin-left: -20px;
  border-radius: 0 100px 100px 0;
}
.diamond {
  width: 10px;
  height: 10px;
  margin-left: 5px;
  background-color: #555555;
  margin-right: 15px;
  transform: rotate(45deg);
  -ms-transform: rotate(45deg); /* Internet Explorer */
  -moz-transform: rotate(45deg); /* Firefox */
  -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
  -o-transform: rotate(45deg); /* Opera */
}
.job-score {
  display: inline-block;
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
