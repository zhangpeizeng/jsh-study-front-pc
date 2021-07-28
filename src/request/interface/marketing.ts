/**
 *
 * 无接口前缀工程
 */

const PREFIX = `/jsh-study-service-marketing${process.env.VUE_APP_SERVER_SUFFIX}`;
// 接口列表
export const MarkeTing = {
  // 获取短信验证码
  getVerifyCode: `${PREFIX}/api/marketing/page/authorization/hcc/send-verify-code`,
  //讲师登陆校验验证码
  checkVerifyCode: `${PREFIX}/api/marketing/page/authorization/hcc/check-verify-code`,
  // 营销学院
  getSchool: `${PREFIX}/member/getschooluserinfo`,
  // 考试 - 新建考试
  addExam: `${PREFIX}/api/marketing/page/college/add-exam`,
  // 试卷-选择试卷列表
  listExam: `${PREFIX}/api/marketing/page/college/list-exam`,
  // get-新建课程-选择勋章
  listMedal: `${PREFIX}/api/marketing/page/attainment/list-study-marketing-medal`,
  // get-新建课程-编辑证书证书信息回显
  getCourseCertificateByBaseId: `${PREFIX}/api/marketing/page/attainment/get-course-certificate-by-base-id`,
  // get-新建课程-选择证书模板列表
  listStudyMarketingCertificate: `${PREFIX}/api/marketing/page/attainment/list-study-marketing-certificate`,
  // get-新建课程-选择证书保存预览
  getPreStudyMarketingCertificate: `${PREFIX}/api/marketing/page/attainment/get-pre-study-marketing-certificate`,
  //上传视频 - 获取上传信息
  getUploadVideoInfo: `${PREFIX}/api/marketing/page/college/management/get-sts-token`,
  // 新建课程
  addCourse: `${PREFIX}/api/marketing/page/college/management/insert-college-marketing`,
  // 获取课程分类
  getTreeNode: `${PREFIX}/api/marketing/page/classify/search-tree-node`,
  // 上传图片
  uploadImgFile: `${PREFIX}/api/marketing/page/college/management/upload-img-file`,
  // 富文本转换图片
  uploadPic: `${PREFIX}/api/marketing/page/common/uplode-pic`,
  // 选择课程接口
  SearchSysDict: `${PREFIX}/api/marketing/page/classify/search-sys-dict-by-condition`,
  // 选择课程接口--新增课程用--查讲师权限的终端
  SelectCourse: `${PREFIX}/api/marketing/page/classify/search-lecturer-study-terminal`,
  // 新增课程权限的终端和当前登录人得终端交集
  listCourseTerminalAndAccount: `${PREFIX}/api/marketing/page/college/management/list-course-terminal-and-account`,
  // 获取课程详情
  getCourseDetail: `${PREFIX}/api/marketing/page/college/management/get-college-marketing-by-id`,
  // 课程列表
  getCourseList: `${PREFIX}/api/marketing/page/college/management/list-college-marketing`,
  // 查询商品信息
  goodCodeList: `${PREFIX}/api/marketing/page/college/management/list-sku-info-by-product-code`,
  // 根据商品编码或者型号查询商品
  checkGoodCode: `${PREFIX}/api/marketing/page/college/management/list-plat-sku-info-by-collections`,
  // 获取当前时间
  getNowDateTime: `${PREFIX}/api/marketing/page/college/management/get-date-now`,
  // 获取当前时间
  uploadFile: `${PREFIX}/api/marketing/page/college/management/upload-file`,
  // 获取全平台课程列表
  getAllPlatList: `${PREFIX}/api/marketing/page/college/list-college-marketing-for-series-courses`,
  // 校验直播课时间是否冲突
  checkLiveTime: `${PREFIX}/api/marketing/page/college/management/check-live-time`,

  /*********************start详情*********************/

  //根据课程ID获取勋章详情
  getMedalDatil: `${PREFIX}/api/marketing/page/attainment/get-study-marketing-medal-provide-num`,
  //已发放、未发放
  getStudyMedalList: `${PREFIX}/api/marketing/page/attainment/list-student`,
  //发放勋章
  grantMedal: `${PREFIX}/api/marketing/page/attainment/provide-study-marketing-medal`,
  //根据课程ID获取学员范围
  getCustDatil: `${PREFIX}/api/marketing/page/college/management/get-throw-cust-by-base-id`,
  //获取标签
  getListTag: `${PREFIX}/api/marketing/page/college/management/list-tag-value`,
  //获取学员分组
  listGrouping: `${PREFIX}/api/marketing/page/college/management/list-grouping`,
  //学员范围导入
  importData: `${PREFIX}/api/marketing/page/college/management/check-import-data`,
  //redis中获取导入的分页数据
  listRedisCacheThrow: `${PREFIX}/api/marketing/page/college/management/list-redis-cache-throw`,
  //删除redis中导入的数据
  deleteRedisCacheThrow: `${PREFIX}/api/marketing/page/college/management/delete-redis-cache-throw`,
  //删学员范围数据库中导入的数据
  deleteCacheThrow: `${PREFIX}/api/marketing/page/college/management/delete-cache-throw`,
  //学员范围保存
  studentScopeSave: `${PREFIX}/api/marketing/page/college/management/save-throw-cust-new`,
  // 课程详情-报名清单-列表
  listSignUp: `${PREFIX}/api/marketing/page/college/list-sign-up`,
  // 课程详情-留言管理列表
  listMessageBorad: `${PREFIX}/api/marketing/page/comment/list-message-board`,
  // 课程详情-新增留言
  addCommentMessage: `${PREFIX}/api/marketing/page/comment/add-comment-message`,
  // 课程详情-获取课程回放列表
  listPlayBack: `${PREFIX}/api/marketing/page/college/list-play-back`,
  // 作业管理-查询作业提交信息列表
  listHomeworkSubmit: `${PREFIX}/api/marketing/page/college/list-homework-submit`,
  // 作业管理-保存回放信息
  insertPlayBack: `${PREFIX}/api/marketing/page/college/insert-play-back`,
  // 作业-查询作业要求等基本信息
  getHomeworkDetail: `${PREFIX}/api/marketing/page/college/get-homework-detail`,
  // 课程详情-课程回放-获取回放详情
  getPlayBackbyBaseId: `${PREFIX}/api/marketing/page/college/get-play-back-by-base-id`,
  // 作业管理-根据组织编码或组织名称查询学员集合
  getAccountByOrg: `${PREFIX}/api/marketing/page/college/get-account-by-org`,
  // 作业管理-根据会员名称或手机号获取会员集合
  listAccountInfo: `${PREFIX}/api/marketing/page/college/list-account-info-by-name-or-phone`,
  // 根据授课讲师名称查询讲师
  searchLecturerByLecturerName: `${PREFIX}/api/marketing/page/college/management/search-lecturer-by-lecturer-name`,
  //作业-查看作业提交详情
  getHomeworkSubmitDetail: `${PREFIX}/api/marketing/page/college/get-homework-submit-detail`,
  classGetHomeworkSubmitDetail: `${PREFIX}/api/marketing/page/class/management/app/get-class-homework-submit-detail`,
  //作业管理-批改作业
  insertHomeworkSubmit: `${PREFIX}/api/marketing/page/college/insert-homework-submit`,
  classInsertHomeworkSubmit: `${PREFIX}/api/marketing/page/class/homework/management/insert-class-homework-submit`,
  //回放管理-检验上传的状态
  getLiveCollegeStatus: `${PREFIX}/api/marketing/page/college/get-live-college-status`,
  //课程评价列表
  getEvaluationList: `${PREFIX}/api/marketing/page/comment/list-reviews`,
  //课程评价列表--取消置顶/置顶/屏蔽
  updateEvaluationStatus: `${PREFIX}/api/marketing/page/comment/update-review-status`,

  /*********************jdw start*********************/
  //    左侧栏列表获取
  LISTMENU: `${PREFIX}/api/marketing/page/authorization/list-menu`,
  //    课程列表
  listcollegemarketing: `${PREFIX}/api/marketing/page/college/management/list-college-marketing`,
  //    课程详情
  getcollegemarketingbyid: `${PREFIX}/api/marketing/page/college/management/get-college-marketing-by-id`,
  // 班级设置-课程详情
  getClassCourseDetailById: `${PREFIX}/api/marketing/page/class/course/class-detail/get-class-course-detail-by-id`,
  //    直播上课
  listcollegemarketinglive: `${PREFIX}/api/marketing/page/college/management/list-college-marketing-live`,
  //    通过id获取token
  getaccesstokenbyaid: `${PREFIX}/api/page/meeting/get-access-token-by-aid`,
  //    获取token
  checkauthtoken: `${PREFIX}/api/page/meeting/check-auth-token`,
  //    刷新token
  refreshtoken: `${PREFIX}/api/page/meeting/refresh-token`,
  //    修改课程上下架状态
  updatecollegemarketingbasebyid: `${PREFIX}/api/marketing/page/college/management/update-college-marketing-base-by-id`,
  //    删除课程
  deletecollegemarketingbasebyid: `${PREFIX}/api/marketing/page/college/management/delete-college-marketing-base-by-id`,
  //    查询课时信息列表
  listseriescoursesbybaseid: `${PREFIX}/api/marketing/page/college/management/list-series-courses-by-base-id`,
  //    新增课时信息
  insertseriescourses: `${PREFIX}/api/marketing/page/college/management/insert-series-courses`,
  //    课程详情-邀请
  getvhallliveurl: `${PREFIX}/api/marketing/page/college/management/get-vhall-live-url`,
  //    查询商品
  listskuinfobyproductcode: `${PREFIX}/api/marketing/page/college/management/list-sku-info-by-product-code`,
  //    获得原文档
  getdocurl: `${PREFIX}/api/marketing/page/college/management/get-doc-url`,

  // 阿里云视频下载
  getRemoteVodAddress: `${PREFIX}/api/marketing/page/college/get-remote-vod-address`,
  // 阿里云视频转码
  transCodeJob: `${PREFIX}/api/marketing/page/college/management/trans-code-job`,
  //图片转base64
  downloadPhoto: `${PREFIX}/api/marketing/page/file-operate/download-photo`,

  /*********************jinpeng *********************/
  // 课程排课
  courseSchedules: `${PREFIX}/api/marketing/page/operate/manage/search-cource-schedules`,
  // 修改直播时间
  changeLiveTime: `${PREFIX}/api/marketing/page/operate/manage/update-cource-schedules`,
  // 课程详情已学习
  detailAlready: `${PREFIX}/api/marketing/page/operate/base-detail/list-study-info`,
  // 课程详情已学习
  classDetailAlready: `${PREFIX}/api/marketing/page/class/course/class-detail/list-study-info`,
  // 课程详情
  detailNostudy: `${PREFIX}/api/marketing/page/operate/base-detail/list-unstudy-info`,
  // 未学习
  classDetailNostudy: `${PREFIX}/api/marketing/page/class/course/class-detail/list-unstudy-info`,
  // 运营分类查询
  oprateTheme: `${PREFIX}/api/marketing/page/theme/management/list-operate-theme`,
  // 分类排序
  sortTheme: `${PREFIX}/api/marketing/page/theme/management/update-operate-theme-sort`,
  // 新建主题
  addTheme: `${PREFIX}/api/marketing/page/theme/management/save-or-update`,
  // 新建主题查询课程
  searchLesson: `${PREFIX}/api/marketing/page/theme/management/list-colleges`,
  themeDetail: `${PREFIX}/api/marketing/page/theme/management/get-detail`,
  // 删除主题
  deleteTheme: `${PREFIX}/api/marketing/page/theme/management/delete`,
  // 主题上下架
  drop: `${PREFIX}/api/marketing/page/theme/management/update-status`,
  themeFenye: `${PREFIX}/api/marketing/page/theme/management/list-choose-colleges`,
  //查询文档上传状态
  getFileResult: `${PREFIX}/api/marketing/page/college/management/get-file-result`,
  /*********************广告管理*********************/
  //广告列表查询
  advertListQry: `${PREFIX}/api/marketing/page/operate/manage/search-advert-by-condition`,
  //广告列表排序
  advertListSort: `${PREFIX}/api/marketing/page/operate/manage/update-advert-sort`,
  //广告详情
  getAdvertDetail: `${PREFIX}/api/marketing/page/operate/manage/get-advert-detail`,
  //广告详情-删除
  advertDel: `${PREFIX}/api/marketing/page/operate/manage/delete-advert-by-id`,
  //广告新增修改
  advertAdd: `${PREFIX}/api/marketing/page/operate/manage/add-or-update-advert`,
  // 课程详情-学习人数+平均学习进度+平均学习时长
  studyPeopleQry: `${PREFIX}/api/marketing/page/operate/base-detail/get-study-info`,
  // 课程详情-报名人数
  signPeopleQry: `${PREFIX}/api/marketing/page/operate/base-detail/get-cus-sign-up-count`,
  // 课程详情-考试人数+考试平均分
  testPeopleQry: `${PREFIX}/api/marketing/page/operate/base-detail/get-exam-info`,
  // 课程详情-作业提交数
  taskSubmitQry: `${PREFIX}/api/marketing/page/operate/base-detail/get-homework-submit-count`,
  // 课程详情-参与PK数
  pkPeopleQry: `${PREFIX}/api/marketing/page/operate/base-detail/get-homework-pks-count`,
  // 广告管理-查询课程
  advertCourseQry: `${PREFIX}/api/marketing/page/theme/management/list-colleges`,
  // 讲师申请-根据accountId查询讲师信息
  lecturerInfoQry: `${PREFIX}/api/marketing/page/lecturer/management/get-lecturer-by-account-id`,
  // 讲师申请-新增讲师
  lecturerAdd: `${PREFIX}/api/marketing/page/lecturer/management/insert-lecturer`,
  // 讲师申请-讲师详情
  getlecturerDetail: `${PREFIX}/api/marketing/page/lecturer/management/get-lecturer-by-id`,
  // 讲师申请-查询组织列表
  getOrganizationList: `${PREFIX}/api/marketing/page/lecturer/management/list-organization`,
  // 讲师申请-选择讲师列表列表
  listAccountInfoByNameOrPhone: `${PREFIX}/api/marketing/page/college/list-account-info-by-name-or-phone`,
  // 讲师申请-终端列表--查的全部终端
  listStudyTerminal: `${PREFIX}/api/marketing/page/lecturer/management/list-study-terminal`,
  // 讲师申请-讲师审核/冻结
  updateLecturerStatusById: `${PREFIX}/api/marketing/page/lecturer/management/update-lecturer-status-by-id`,
  // 讲师申请-根据accountID查询讲师信息
  getLecturerByAccountId: `${PREFIX}/api/marketing/page/lecturer/management/get-lecturer-by-account-id`,
  // 讲师申请-获取讲师列表
  getLecturerList: `${PREFIX}/api/marketing/page/lecturer/management/list-lecturer`,
  // 讲师申请-判断这个讲师之前有没有被添加
  checkAccount: `${PREFIX}/api/marketing/page/lecturer/management/check-account`,
  // 讲师资料库-查询授课讲师列表
  getLibraryList: `${PREFIX}/api/page/teaching/lecturer/list-lecturer-library`,
  // 讲师资料库-新增/修改授课讲师库讲师
  saveLecturerLibrary: `${PREFIX}/api/page/teaching/lecturer/save-lecturer-library`,
  // 讲师资料库-查询讲师详情
  getLibraryDetail: `${PREFIX}/api/page/teaching/lecturer/get-lecturer-detail`,
  // 讲师资料库-删除授课讲师
  delTeacherLibrary: `${PREFIX}/api/page/teaching/lecturer/delete-teacher-by-id`,
  // 根据课程id查询讲师信息
  getLecturerInfo: `${PREFIX}/api/page/teaching/lecturer/get-lecturer-by-base-id`,
  // 分组管理-新增/修改分组
  groupInsert: `${PREFIX}/api/marketing/page/customer/management/insert-grouping`,
  // 分组管理-分组详情
  getGroupDetail: `${PREFIX}/api/marketing/page/customer/management/get-customer-grouping-detail`,
  // 分组管理-添加学员全选
  addAllStudent: `${PREFIX}/api/marketing/page/customer/management/list-all-customer`,
  // 分组管理-新增学员
  addStudent: `${PREFIX}/api/marketing/page/customer/management/insert-customer-by-grouping-id`,
  // 分组管理-移除学员
  delStudent: `${PREFIX}/api/marketing/page/customer/management/delete-customer-by-account-id`,
  // 分组管理-导入学员
  studentImport: `${PREFIX}/api/marketing/page/customer/management/check-customer`,
  // 分组管理-获取学员列表-弹窗
  getStudentListDialog: `${PREFIX}/api/marketing/page/customer/management/list-customer-for-insert`,
  // 分组管理-查询组织列表（专用）
  getOrgCodeList: `${PREFIX}/api/marketing/page/customer/management/list-organization`,
  /*********************助教管理*********************/
  //查询助教列表
  getAsstantList: `${PREFIX}/api/marketing/page/assistant/management/list-asstant`,
  // 获取班级列表时间
  getclasstime: `${PREFIX}/api/marketing/page/class/management/get-class-time`,
  //添加助教查询列表
  getAsstantListInsert: `${PREFIX}/api/marketing/page/assistant/management/list-asstant-for-insert`,
  //添加助教查询列表全选
  getAllAsstant: `${PREFIX}/api/marketing/page/assistant/management/list-all-asstant`,
  //添加助教
  addAsstant: `${PREFIX}/api/marketing/page/assistant/management/insert-asstant`,
  //移除助教
  delAsstant: `${PREFIX}/api/marketing/page/assistant/management/delete-asstant`,

  /*********************学员管理*********************/
  // 学员管理-获取学员列表
  getStudentList: `${PREFIX}/api/marketing/page/customer/management/list-customer`,
  // 学员管理-学员详情
  getStudentDetail: `${PREFIX}/api/marketing/page/customer/management/get-customer-detail`,
  // 学员管理-获取标签列表
  getTagList: `${PREFIX}/api/marketing/page/customer/management/list-tag-relation`,
  // 学员管理-学员解冻/冻结
  updateStudentStatus: `${PREFIX}/api/marketing/page/customer/management/update-customer-status`,
  /*********************分组管理*********************/
  // 分组管理-分组列表
  listCustomerGrouping: `${PREFIX}/api/marketing/page/customer/management/list-customer-grouping`,
  // 分组管理-分组详情
  getCustomerGroupingDetail: `${PREFIX}/api/marketing/page/customer/management/get-customer-grouping-detail`,
  // 分组管理-课程详情查询学院列表
  listCustomerByBroupingId: `${PREFIX}/api/marketing/page/customer/management/list-customer-by-grouping-id`,
  // 分组管理-分组启用/停用
  updateGroupStatus: `${PREFIX}/api/marketing/page/customer/management/update-group-status`,
  // 分组管理-分组删除
  updateGroupDelete: `${PREFIX}/api/marketing/page/customer/management/update-group-delete`,
  /*********************数据统计报表*********************/
  // 查询课程统计报表
  searchCourseStatisticReport: `${PREFIX}/api/marketing/page/operate/base-detail/search-course-summary-report`,
  // 判断课程统计报表导出方式
  getExportCourseStatisticReportFlag: `${PREFIX}/api/marketing/page/operate/base-detail/get-course-summary-report-by-email-flag`,
  // 导出课程统计报表至邮箱
  exportCourseStatisticReportToEmail: `${PREFIX}/api/marketing/page/operate/base-detail/list-course-summary-report-exceed-limit`,
  // 导出课程明细报表至邮箱
  exportCourseDetailReportToEmail: `${PREFIX}/api/marketing/page/operate/base-detail/list-course-summary-report-detail-exceed-limit`,
  // 查询学习统计报表
  searchLearningDetailReport: `${PREFIX}/api/marketing/page/operate/base-detail/search-study-summary-report`,
  // 判断学习统计报表导出方式
  getExportLearningDetailReportFlag: `${PREFIX}/api/marketing/page/operate/base-detail/get-study-summary-report-by-email-flag`,
  // 导出学习统计报表至邮箱
  exportLearningStatisticReportToEmail: `${PREFIX}/api/marketing/page/operate/base-detail/list-study-summary-report-exceed-limit`,
  // 导出学习明细报表至邮箱
  exportLearningDetailReportToEmail: `${PREFIX}/api/marketing/page/operate/base-detail/list-study-summary-report-detail-exceed-limit`,
  /*******************营销学院banner管理***********************/
  // 机构运营-banner管理-列表查询
  organizationByCondition: `${PREFIX}/api/marketing/page/general/manage/search-advert-organization-by-condition`,
  // 机构运营-banner管理-广告列表排序
  updateAdvertOrganizationSort: `${PREFIX}/api/marketing/page/general/manage/update-advert-organization-sort`,
  // 机构运营-banner管理-详情
  getAdvertOrganizationDetail: `${PREFIX}/api/marketing/page/general/manage/get-advert-organization-detail`,
  // 机构运营-banner管理-详情-删除
  deleteAdvertOrganization: `${PREFIX}/api/marketing/page/general/manage/delete-advert-organization`,
  // 机构运营-bannerr管理-广告详情-导出
  exportAdvertOrganizationOrg: `${PREFIX}/api/exchange/page/college/management/export-advert-organization-org`,
  // 机构运营-banner管理-新增或修改广告
  addOrUpdateAdvertOrganization: `${PREFIX}/api/marketing/page/general/manage/add-or-update-advert-organization`,
  // 机构运营-banner管理-新增或修改广告-查询课程
  listCollegeOrganization: `${PREFIX}/api/marketing/page/general/manage/list-college-organization`,
  // 机构运营-banner管理-新增或修改广告-查询运营主题
  listClassifyChemOrganization: `${PREFIX}/api/marketing/page/general/manage/list-classify-them-organization`,

  /*******************营销学院机构-运营分类***********************/
  // 机构运营-运营分类列表-排序
  updateClassClassifyThemeSort: `${PREFIX}/api/marketing/page/general/manage/update-class-classify-theme-sort`,
  // 机构运营-运营分类列表
  listClassClassifyTheme: `${PREFIX}/api/marketing/page/general/manage/list-class-classify-theme`,
  // 机构运营-运营分类新建/修改
  addClassClassifyTheme: `${PREFIX}/api/marketing/page/general/manage/add-class-classify-theme`,
  // 机构运营-运营分类详情
  getClassClassifyThemeDetail: `${PREFIX}/api/marketing/page/general/manage/get-class-classify-theme-detail`,
  // 机构运营-运营分类停用/启用/删除
  updateClassClassifyThemeStatus: `${PREFIX}/api/marketing/page/general/manage/update-class-classify-theme-status`,
  //机构运营-运营分类-新增或跟新主题-已选择课程分页
  listChooseColleges: `${PREFIX}/api/marketing/page/general/manage/list-choose-colleges`,
  //运营分类-新增或跟新主题-查询课程
  listColleges: `${PREFIX}/api/marketing/page/general/manage/list-colleges`,
  /*********************课程分类管理*********************/
  // 平台运营-课程分类列表
  getClassifyList: `${PREFIX}/api/marketing/page/operate/manage/list-class-classify`,
  //平台运营-课程分类列表-排序
  classifySort: `${PREFIX}/api/marketing/page/operate/manage/update-class-classify-sort`,
  //平台运营-课程分类列表-查询终端类型--查全部终端（暂时不用）
  getTerminal: `${PREFIX}/api/marketing/page/lecturer/management/list-all-study-terminal`,
  //平台运营-课程分类详情-基本信息
  getclassifyDetail: `${PREFIX}/api/marketing/page/operate/manage/get-class-classify-base-info`,
  //平台运营-课程分类新建/添加同级
  classifyAdd: `${PREFIX}/api/marketing/page/operate/manage/add-class-classify`,
  //平台运营-课程分类修改
  classifyUpdate: `${PREFIX}/api/marketing/page/operate/manage/update-class-classify`,
  //平台运营-课程分类新建-查询讲师列表
  getClassifylecturer: `${PREFIX}/api/marketing/page/assistant/management/list-lecturer-for-insert`,
  //平台运营-课程分类详情-课程信息-新增课程列表
  getClassifyCourseList: `${PREFIX}/api/marketing/page/operate/manage/list-class-classify-course-insert`,
  //平台运营-课程分类详情-课程信息-新增课程
  insertClassifyCourse: `${PREFIX}/api/marketing/page/operate/manage/insert-class-classify-course`,
  //平台运营-课程分类详情-课程信息
  getClassifyCourseInfo: `${PREFIX}/api/marketing/page/operate/manage/get-class-classify-course-info`,
  //平台运营-课程分类停用/启用/删除
  updateClassifyStatus: `${PREFIX}/api/marketing/page/operate/manage/update-class-classify-status`,
  //平台运营-课程分类详情-课程信息-移除课程
  deleteClassifyCourse: `${PREFIX}/api/marketing/page/operate/manage/delete-class-classify-course`,
  //根据父级id集合判断是否末级节点
  judgeParentNode: `${PREFIX}/api/marketing/page/operate/manage/get-class-classify-by-classify-parent-ids`,
  //机构运营-课程分类列表
  getOrgClassifyList: `${PREFIX}/api/marketing/page/general/manage/list-class-classify`,
  //机构运营-课程分类新建/添加同级
  classifyOrgAdd: `${PREFIX}/api/marketing/page/general/manage/add-class-classify`,
  //机构运营-课程分类修改
  classifyOrgUpdate: `${PREFIX}/api/marketing/page/general/manage/update-class-classify`,
  //机构运营-课程分类详情-基本信息
  getclassifyOrgDetail: `${PREFIX}/api/marketing/page/general/manage/get-class-classify-base-info`,
  //机构运营-课程分类详情-课程信息
  getClassifyCourseOrgInfo: `${PREFIX}/api/marketing/page/general/manage/get-class-classify-course-info`,
  //机构运营-获取课程分类的所有二级分类
  getClassifySecondList: `${PREFIX}/api/marketing/page/general/manage/list-class-classify-nodes-by-general-classify`,
  //机构运营-获取课程分类一级名称
  getClassifyFirstName: `${PREFIX}/api/marketing/page/general/manage/get-name-by-classify-id`,
  //机构运营-课程分类新建-机构下选框
  getClassList: `${PREFIX}/api/marketing/page/general/manage/get-first-class-classify`,
  //获得文档图片流
  getDocPicUrl: `${PREFIX}/api/marketing/page/college/management/get-doc-pic-url`,
  // 获取文件base64
  getpicture: `${PREFIX}/api/marketing/page/college/management/get-picture`,
  // 课程详情-课程统计-作业批改情况
  listhomeworkinfo: `${PREFIX}/api/marketing/page/operate/base-detail/list-home-work-info`,
  // 一考试
  alreadylistexaminfo: `${PREFIX}/api/marketing/page/class/course/class-detail/list-exam-info`,
  // 课程详情-课程统计-作业批改情况
  classListhomeworkinfo: `${PREFIX}/api/marketing/page/class/course/class-detail/list-home-work-info`,
  // 开通学员
  createCustomer: `${PREFIX}/api/marketing/page/customer/management/create-customer`,
  // 修改学员
  updateCustomer: `${PREFIX}/api/marketing/page/customer/management/update-customer`,
  // 新增学员获取组织下拉框
  searchFirstLevel: `${PREFIX}/api/marketing/page/customer/management/search-first-level`,
  // 考试统计报表-已考、未考
  searchExamReport: `${PREFIX}/api/marketing/page/operate/base-detail/search-exam-report`,
  // 根据考试统计报表导出总数判断是否发送到邮箱
  getExamSummaryReportByEmailFlag: `${PREFIX}/api/marketing/page/operate/base-detail/get-exam-summary-report-by-email-flag`,
  // 考试统计报表导出到邮箱
  listExamSummaryReportExceedLimit: `${PREFIX}/api/marketing/page/operate/base-detail/list-exam-summary-report-exceed-limit`,
  // 考试统计报表汇算
  updateExamReportCalc: `${PREFIX}/api/marketing/inner/management/update-exam-report-calc`,
  // 作业列表
  getJobList: `${PREFIX}/api/marketing/page/college/report/list-home-work-list`,
  // 作业列表-汇总接口
  getJobSummary: `${PREFIX}/api/marketing/page/college/report/list-home-work-sum`,
  // 报名列表
  getSignUpList: `${PREFIX}/api/marketing/page/college/report/list-sign-up`,
  // 根据报名列表导出总数判断是否发送到邮箱
  getSignUpEmailFlag: `${PREFIX}/api/marketing/page/college/report/get-sign-up-summary-report-by-email-flag`,
  // 报名列表导出到邮箱
  signUpexceedLimit: `${PREFIX}/api/marketing/page/college/report/list-sign-up-summary-report-exceed-limit`,
  // 跳转运营中台端获取aid接口
  getTicketToken: `${PREFIX}/api/page/op/get-auth-token-ticket-to-op`,
  // 课程详情-课程推荐-列表
  getCourseRecommendList: `${PREFIX}/api/marketing/page/course/management/list-course-recommendation`,
  // 课程详情-课程推荐-添加课程
  getRecommendInsertList: `${PREFIX}/api/marketing/page/course/management/course-recommendation-for-insert`,
  // 课程详情-课程推荐-新增
  addCourseRecommend: `${PREFIX}/api/marketing/page/course/management/add-course-recommendation`,
  // 课程详情-课程推荐-移除
  delCourseRecommend: `${PREFIX}/api/marketing/page/course/management/delete-course-recommendation`,
  // 课程详情-查用户当前所属组织
  getLecturerOrgs: `${PREFIX}/api/marketing/page/course/management/get-lecturer-orgs`,
  // 课程学习进度跟进报表-已学习判断是否发送到邮箱
  getStudentStudyReportByEmailFlag: `${PREFIX}/api/marketing/page/operate/base-detail/get-student-study-report-by-email-flag`,
  // 课程学习进度跟进报表-未学习判断是否发送到邮箱
  getStudentUnstudyReportByEmailFlag: `${PREFIX}/api/marketing/page/operate/base-detail/get-student-unstudy-report-by-email-flag`,
  // 课程学习进度跟进报表-已学习导出（已超出限制条数）
  listStudentStudyReportExceedLimit: `${PREFIX}/api/marketing/page/operate/base-detail/list-student-study-report-exceed-limit`,
  // 课程学习进度跟进报表-未学习导出（已超出限制条数）
  listStudentUnstudyReportExceedLimit: `${PREFIX}/api/marketing/page/operate/base-detail/list-student-unstudy-report-exceed-limit`,
  // 课程学习进度跟进报表-已学习
  courseStudentStudyReport: `${PREFIX}/api/marketing/page/operate/base-detail/student-study-report`,
  // 课程学习进度跟进报表-未学习
  studentStudyReportUnStudy: `${PREFIX}/api/marketing/page/operate/base-detail/student-study-report-unstudy`,
  // 课程学习进度跟进报表-学习数量
  studentStudyReportUnstudyCount: `${PREFIX}/api/marketing/page/operate/base-detail/student-study-report-unstudy-count`,
  // 获取目睹讲师直播URL
  getMuDuLiveUrl: `${PREFIX}/api/marketing/page/mudu/get-mudu-live-url`,
  // 课程详情-获取课程回放列表-目睹
  getMuDuPlayList: `${PREFIX}/api/marketing/page/mudu/list-play-back-mudu`,
  //查询运营电话
  listStudyTerminalPhone: `${PREFIX}/api/marketing/page/authorization/list-study-terminal-phone`,
  //获取证书终端属性
  listCertificateAttributeByTerminalCode: `${PREFIX}/api/marketing/page/certificate/list-certificate-attribute-by-terminal-code`,
  //根据终端编码查询证书库数据列表
  listCertificateLibraryByTerminalCode: `${PREFIX}/api/marketing/page/certificate/list-certificate-library-by-terminal-code`,
  //获取证书库证书详情
  listCertificateLibraryDetail: `${PREFIX}/api/marketing/page/certificate/list-certificate-library-detail`,
  //修改广告/banner时间
  updatePlayingSchedules: `${PREFIX}/api/marketing/page/operate/manage/update-playing-schedules`,
  /*************************************************营销学院-班级管理***************************************************/
  //学员管理-学员管理列表查询
  listClassStudentManagement: `${PREFIX}/api/marketing/page/class/management/list-class-student-management`,
  //学员管理-增加学员导入
  insertClassStudent: `${PREFIX}/api/marketing/page/class/management/insert-class-student`,
  //学员管理-审核/批量审核/批量移除
  uPStudentStatus: `${PREFIX}/api/marketing/page/class/management/update-student-status`,
  //学员管理-评定/批量评定
  updateStudentStudyStatus: `${PREFIX}/api/marketing/page/class/management/update-student-study-status`,

  // 班级列表查询
  getClassManagementList: `${PREFIX}/api/marketing/page/class/management/list-class-management`,
  // 新建修改班级
  saveClassManagement: `${PREFIX}/api/marketing/page/class/management/save-or-update-class-management`,
  // 修改班级回显
  getClassInfo: `${PREFIX}/api/marketing/page/class/management/get-class-info-by-id`,
  // 班级管理-班主任下拉接口
  getClassLecturer: `${PREFIX}/api/marketing/page/class/management/list-lecturer-for-class`,
  // 班级管理-获取一级分类
  getClassFirst: `${PREFIX}/api/marketing/page/class/management/get-class-first-class-classify`,
  //获取考试设置列表
  listClassExam: `${PREFIX}/api/marketing/page/class/exam/management/list-class-exam`,
  //删除选中考试
  deleteClassExam: `${PREFIX}/api/marketing/page/class/exam/management/delete-class-exam`,
  //考试设置列表排序
  updateClassExamSort: `${PREFIX}/api/marketing/page/class/exam/management/update-class-exam-sort`,
  //获取作业列表
  listClassHomework: `${PREFIX}/api/marketing/page/class/homework/management/list-class-homework`,
  //删除选中作业
  deleteClassHomework: `${PREFIX}/api/marketing/page/class/homework/management/delete-class-homework`,
  //作业列表排序
  updateHomeworkSort: `${PREFIX}/api/marketing/page/class/homework/management/update-class-homework-sort`,
  //新增作业保存
  saveClassHomework: `${PREFIX}/api/marketing/page/class/homework/management/save-class-homework`,
  //获取作业详情
  getClassHomeworkDetail: `${PREFIX}/api/marketing/page/class/homework/management/get-class-homework-detail`,

  // 班级详情
  // 班级详情-班级基本信息
  classBasicInfo: `${PREFIX}/api/marketing/page/class/management/get-class-base-info-by-id`,
  // 班级详情-修改班级状态
  updateClassStatus: `${PREFIX}/api/marketing/page/class/management/update-class-status`,
  // 班级详情-学习资料列表查询
  getStudyData: `${PREFIX}/api/marketing/page/class/management/get-class-data-by-class-id`,
  // 班级详情-学习资料详情
  getStudyDataDetail: `${PREFIX}/api/marketing/page/class/management/get-class-data-detail`,
  // 班级详情-学习资料删除
  delStudyData: `${PREFIX}/api/marketing/page/class/management/delete-class-data`,
  // 上传班级见证资料
  uploadMateriel: `${PREFIX}/api/marketing/page/class/management/save-class-data`,
  // 新建考试
  saveClassExam: `${PREFIX}/api/marketing/page/class/exam/management/save-class-exam`,
  // 查询辅导员列表
  listAssistantLecturer: `${PREFIX}/api/marketing/page/class/assistant/management/list-class-assistant-lecturer`,
  // 移除选中辅导员
  deleteClassAsstant: `${PREFIX}/api/marketing/page/class/assistant/management/delete-class-asstant`,
  // 添加辅导员列表获取
  getClassLecturerForAssistant: `${PREFIX}/api/marketing/page/class/assistant/management/list-class-lecturer-for-assistant`,
  // 添加辅导员列表保存
  insertClassAsstant: `${PREFIX}/api/marketing/page/class/assistant/management/insert-class-asstant`,
  // 添加辅导员全选
  allListClassLecturer: `${PREFIX}/api/marketing/page/class/assistant/management/list-class-lecturer`,
  // 作业详情-作业统计-已提交和未批改数量
  getClassHomeworkInfo: `${PREFIX}/api/marketing/page/class/homework/management/get-class-homework-info`,
  //作业详情-作业统计-已提交列表
  listClassHomeworkSubmitStudent: `${PREFIX}/api/marketing/page/class/homework/management/list-class-homework-submit-student`,
  // 作业详情-作业统计-作业批改状况
  listClassHomeWorkInfo: `${PREFIX}/api/marketing/page/class/homework/management/list-class-home-work-info`,
  // 班级详情-学员信息查询
  getClassStudentStatusData: `${PREFIX}/api/marketing/page/class/management/get-status-data`,
  // 班级详情-课表查询
  listClassCoursesRela: `${PREFIX}/api/marketing/page/class/management/list-class-courses-rela`,
  // 班级详情-考试列表
  listClassExamData: `${PREFIX}/api/marketing/page/class/management/list-class-exam-data`,
  // 班级详情-作业列表
  listClassHomeworkRela: `${PREFIX}/api/marketing/page/class/management/list-class-homework-data`,
  // 班级详情-班级统计查询
  getClassStatisticalData: `${PREFIX}/api/marketing/page/class/management/get-class-statistical-data`,
  // 考试详情
  // 考试详情-考试信息
  getClassExamDetail: `${PREFIX}/api/marketing/page/class/exam/management/get-class-exam-detail`,
  // 考试详情-考试统计-考试人数和平均分
  classExamScoreAndStudentNum: `${PREFIX}/api/marketing/page/class/exam/management/get-class-exam-info`,
  // 考试详情-考试统计-已考列表
  listClassExamStudent: `${PREFIX}/api/marketing/page/class/exam/management/list-class-exam-student`,
  // 考试详情-考试统计-未考列表
  listClassUnexamStudent: `${PREFIX}/api/marketing/page/class/exam/management/list-class-unexam-student`,
  // 课表设置-课表列表
  ManagementCoursesRela: `${PREFIX}/api/marketing/page/class/management/list-class-management-courses-rela`,
  // 课表设置-添加课程保存
  saveClassCourse: `${PREFIX}/api/marketing/page/class/management/insert-or-update-class-courses`,
  // 课表设置-修改课程回显
  getClassCourseDetail: `${PREFIX}/api/marketing/page/class/management/get-class-resource-rela`,
  // 课表设置-添加课程，选择已有课程(查课程列表)
  getClassCourseList: `${PREFIX}/api/marketing/page/class/management/list-class-marketing-for-series-courses`,
  // 课表设置-课表列表排序
  updateClassSourceSort: `${PREFIX}/api/marketing/page/class/management/update-class-source-sort`,
  // 课表设置-课表删除
  deleteClassCourses: `${PREFIX}/api/marketing/page/class/management/delete-class-courses-by-id`
};
