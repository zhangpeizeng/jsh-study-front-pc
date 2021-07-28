/**
 * @auther:seebin
 *
 * 正则规则集合
 *
 * 注：变量名需大写且带后缀_REG 如:PHONE_REG
 */

// 国内宽泛手机号正则验证
const PHONE_REG = /^1[356789][0-9]{9}$/;

// URL正则验证
const WEBSITE_REG = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/;

const PWD_REG = /^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)([^(0-9a-zA-Z)]|[()]|[a-zA-Z]|[0-9]){6,20}$/;

// 校验最多保留小数点后两位
const NUM_REG = /^(([1-9]{1}\d*)|([0]{1}))(\.(\d){0,2})?$/;

export { PHONE_REG, WEBSITE_REG, PWD_REG, NUM_REG };
