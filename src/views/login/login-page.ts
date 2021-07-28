import { Component, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import slider from "@/components/login/slider.vue";

@Component({
  components: {
    slider
  }
})
export default class LoginPage extends Vue {
  private oldtoken: string = "";
  private loading: boolean = false;
  private jwtto = require("jwt-decode");
  private expurl: string = "/shop-class-list";
  private telPhone: string = ""; // 手机号
  private verifyCode: string = ""; // 验证码
  private verText: string = "获取验证码";
  private verClickFlag: boolean = true; // 验证码防重复点击标识
  private countDownT: number = 60; // 短信倒计时时间
  private verColor: string = "#409eff";
  private loginDisabled: boolean = true; // 防重复点击标识
  private errorFlag: boolean = false;
  private errorText: string = ""; // 逻辑提示信息
  private errorinfo: string = ""; // 业务提示信息
  private phoneList: any = [];
  private pattern: any = /^[1]([3-9])[0-9]{9}$/; // 手机号正则校验

  verificationClick() {
    this.errorText = "";
    this.errorinfo = "";
    if (!this.telPhone && !this.pattern.test(this.telPhone)) {
      this.errorText = "请输入正确的手机号";
      return;
    }
    if (this.verClickFlag) {
      this.verClickFlag = false;
      this.loading = true;
      Http.getto(MarkeTing.getVerifyCode, {
        phone: this.telPhone
      })
        .then(res => {
          this.loading = false;
          if (res.data.data && res.data.data.success) {
            this.countdown();
          } else {
            this.verClickFlag = true;
            this.errorinfo = res.data.data.restfulErrorMessage;
            if (res.data.data.phoneDtoList) {
              this.phoneList = res.data.data.phoneDtoList;
            }
          }
        })
        .catch(cat => {
          this.loading = false;
          this.verClickFlag = true;
        });
    }
  }
  // 短信验证码倒计时
  countdown() {
    setTimeout(() => {
      if (this.countDownT > 0) {
        this.countDownT--;
        this.verColor = "#606266";
        this.verText = "剩余(" + this.countDownT + "s）";
        this.countdown();
      } else {
        this.verClickFlag = true;
        this.countDownT = 60;
        this.verColor = "#409eff";
        this.verText = "获取验证码";
      }
    }, 1000);
  }
  // 登录
  loginClick() {
    // 重置错误提示信息字段
    this.errorText = "";
    this.errorinfo = "";
    if (!this.telPhone && !this.pattern.test(this.telPhone)) {
      this.errorText = "请输入正确的手机号";
      return;
    }
    if (!this.verifyCode) {
      this.errorText = "请输入验证码";
      return;
    }
    if (this.loginDisabled) {
      this.loginDisabled = false;
      this.checktoken();
    }
  }
  // 校验验证码
  checktoken() {
    this.loading = true;
    Http.postto(MarkeTing.checkVerifyCode, {
      phone: this.telPhone,
      verifyCode: this.verifyCode
    })
      .then(res => {
        this.loading = false;
        console.log(res);
        if (res.data.success) {
          if (res.data.data.success) {
            this.oldtoken = res.data.data.accessToken
              ? res.data.data.accessToken
              : "";
            localStorage.setItem("oldtoken", this.oldtoken);
            this.login(this.oldtoken);
          } else {
            this.loginDisabled = true;
            // 业务错误提示
            this.errorinfo = res.data.data.restfulErrorMessage;
            if (res.data.data.phoneDtoList) {
              this.phoneList = res.data.phoneDtoList;
            }
          }
        } else {
          this.loginDisabled = true;
          this.errorText = res.data.errorMsg;
        }
      })
      .catch(cat => {
        this.loading = false;
        this.loginDisabled = true;
      });
  }
  // 登录
  login(token: any) {
    let owner = this;
    Http.getto(MarkeTing.checkauthtoken, { studyTerminal: "" }, token)
      .then(res => {
        this.loading = false;
        console.log(res);
        if (res.data.success && res.data.data && res.data.data != "") {
          let data = res.data.data.access_token
            ? res.data.data.access_token
            : null;
          let accountId = res.data.data.accountId
            ? res.data.data["accountId"]
            : null;
          if (accountId) {
            localStorage.setItem("accountId", accountId);
          }
          if (data && data != "") {
            localStorage.setItem("accessToken", data);
            let userString = owner.jwtto(data);
            let time = userString.exp ? userString.exp : null;
            if (time && time != "") {
              localStorage.setItem("accessexp", time);
              console.log(time);
            }
            let accountName = userString.name ? userString.name : null;
            if (accountName) {
              localStorage.setItem("accountName", accountName);
            }
            let accountUrl = userString.avatar_address
              ? userString.avatar_address
              : null;
            if (accountUrl) {
              localStorage.setItem("accountUrl", accountUrl);
            }
            let huiHuiNumber = userString.huiHuiNumber
              ? userString.huiHuiNumber
              : null;
            if (huiHuiNumber) {
              localStorage.setItem("huiHuiNumber", huiHuiNumber);
            }
            let refreshToken = res.data.refresh_token
              ? res.data.refresh_token
              : null;
            if (refreshToken) {
              localStorage.setItem("refreshToken", refreshToken);
            }
          }
          this.$router.push({
            path: this.expurl,
            query: {}
          });
        }
      })
      .catch(cat => {
        this.loginDisabled = true;
        this.loading = false;
      });
  }

  private created() {}
}
