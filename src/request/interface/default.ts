/**
 *
 * 无接口前缀工程
 */

const PREFIX = ``;

// 接口列表
export const Default = {
  // 登录
  LOGIN: `${PREFIX}/login/rest/loginajax`,
  // 营销学院
  getSchool: `${PREFIX}/member/getschooluserinfo`,
  // 左侧菜单列表
  sidebarMenu: `${PREFIX}/rest/auth/my-menu`,
  // 权限码列表
  searchPermissionList: `${PREFIX}/rest/auth/my-permission`,
  // 获取品牌
  getBrandList: `${PREFIX}/pc/cloud-goods/api/member/brand/get-brand-list`,
  // 获取产业产品组
  getProductGroupList: `${PREFIX}/pc/cloud-goods/api/common/component/get-product-group-tree`
};
