// ------login page
import { Component, Prop, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";

@Component
export default class Login extends Vue {
  private username: string = "ylhtest";
  private password: string = "qwe123";
  private oldtoken: string = "";
  private loading: boolean = false;
  private jwtto = require("jwt-decode");
  @Prop({
    type: Number,
    required: false
  })
  expid: any = null;
  @Prop({
    type: String,
    required: false
  })
  expurl: any = "/shop-class-list";

  checktoken(id: any) {
    this.loading = true;
    Http.postto(MarkeTing.getaccesstokenbyaid, {
      aid: id
    })
      .then(res => {
        this.loading = false;
        console.log(res);
        if (res.data.success) {
          if (res.data && res.data.data && res.data.data != "") {
            this.oldtoken = res.data.data ? res.data.data : "";
            localStorage.setItem("oldtoken", this.oldtoken);
            this.login(this.oldtoken);
          }
        } else {
          window.location.href = `${location.protocol}//${window.location.host}/pc/nologin`;
        }
      })
      .catch(cat => {
        this.loading = false;
        window.location.href = `${location.protocol}//${window.location.host}/pc/404`;
      });
  }
  login(token: any) {
    let owner = this;
    this.loading = true;
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
            // let userString = decodeURIComponent(
            //   escape(window.atob(data.split(".")[1]))
            // );
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
          console.log("accountId++", accountId);
          console.log("accessToken++", data);
          console.log("accountName++", localStorage.getItem("accountName"));
          console.log("accountUrl++", localStorage.getItem("accountUrl"));
        } else {
          let userObj = owner.jwtto(token);
          let applyAccountId = userObj.account_id ? userObj.account_id : null;
          if (applyAccountId) {
            localStorage.setItem("applyAccountId", applyAccountId);
          }
          // 讲师没有权限
          if (res.data.code == 100) {
            window.location.href = `${location.protocol}//${window.location.host}/pc/nouser`;
          } else if (res.data.code == 300) {
            // 讲师被冻结
            window.location.href = `${location.protocol}//${window.location.host}/pc/userFreeze`;
          }
        }
      })
      .catch(cat => {
        this.loading = false;
        window.location.href = `${location.protocol}//${window.location.host}/pc/nologin`;
      });
  }

  private created() {
    // 清空本地存储
    localStorage.removeItem("accessToken");
    localStorage.removeItem("accessexp");
    localStorage.removeItem("accountId");
    localStorage.removeItem("oldtoken");
    localStorage.removeItem("accountName");
    localStorage.removeItem("accountUrl");
    localStorage.removeItem("applyAccountId");
    localStorage.removeItem("huiHuiNumber");
    console.log("login");
    const { expid, expurl } = this.$route.query;
    this.expid = expid;
    if (expurl && expurl !== "" && expurl !== " " && expurl !== "null") {
      this.expurl = expurl;
    }
    console.log(this.expid);
    this.checktoken(this.expid);
  }
}
