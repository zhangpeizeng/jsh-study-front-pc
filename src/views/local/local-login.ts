import { Component, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";

@Component({
  components: {}
})
export default class LoginPage extends Vue {
  private oldtoken: string = "";
  private ylhtoken: string = "";
  private loading: boolean = false;
  private jwtto = require("jwt-decode");
  private expurl: string = "/shop-class-list";
  private userId: string = "01418107";
  private password: string = "123qwe";
  private loginDisabled: boolean = true; // 防重复点击标识
  // userId 01147049 徐彤彤
  // userId 01289133 滕秀程
  // 登录
  loginClick() {
    if (this.loginDisabled) {
      this.loginDisabled = false;
      this.loading = true;
      let loginUrl = `/ylh-cloud-service-user${process.env.VUE_APP_SERVER_SUFFIX}/api/token/get-by-username-and-password`;
      Http.getto(loginUrl, {
        username: "ylhtest",
        systemName: "ylh",
        password: this.password
      })
        .then(res => {
          if (res.data) {
            this.ylhtoken = res.data.replace("bearer ", "");
            this.checkAid(this.ylhtoken);
          }
        })
        .catch(cat => {
          this.loginDisabled = true;
          this.loading = false;
        });
    }
  }
  checkAid(ylhtoken: string) {
    let getAidUrl = `/ylh-cloud-service-user${process.env.VUE_APP_SERVER_SUFFIX}/api/page/meeting/auth/token/get-auth-token`;
    Http.postto(
      getAidUrl,
      {
        type: "hwork",
        userId: this.userId
      },
      ylhtoken
    )
      .then(res => {
        if (res.data.success) {
          this.checktoken(res.data.data.aid);
        }
      })
      .catch(cat => {
        this.loginDisabled = true;
        this.loading = false;
      });
  }
  checktoken(id: any) {
    Http.postto(MarkeTing.getaccesstokenbyaid, {
      aid: id
    })
      .then(res => {
        if (res.data.success) {
          if (res.data && res.data.data && res.data.data != "") {
            this.oldtoken = res.data.data ? res.data.data : "";
            localStorage.setItem("oldtoken", this.oldtoken);
            this.login(this.oldtoken);
          }
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
