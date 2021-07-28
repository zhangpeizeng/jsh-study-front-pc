/**
 * 根模块路由，不属于任何模块的路由可放置在这.
 *
 * meta 可配置参数
 * @param {boolean} keepAlive 是否缓存页面,一般默认为false
 * @param {string} title 页面标题
 * @param {string} permission 页面访问权限码,无此属性则不设权限
 */
export default [
  {
    path: "/marketing",
    component: () => import("@/views/layout/basic/basic.vue"),
    redirect: "/",
    children: [
      {
        path: "/select-new-course",
        name: "SelectNewCourse",
        component: () =>
          import("@/views/marketing/select-new-course/select-new-course.vue"),
        meta: {
          keepAlive: false,
          title: "新建课程",
          extendBreadcrumbList: [
            {
              name: "课程管理"
            },
            {
              name: "课程列表"
            },
            {
              name: "新建课程"
            }
          ]
        }
      },
      {
        path: "/course-statistics-report",
        name: "CourseStatisticsReport",
        component: () =>
          import(
            "@/views/marketing/course-statistics-report/course-statistics-report.vue"
          ),
        meta: {
          keepAlive: false,
          title: "课程统计报表",
          extendBreadcrumbList: [
            {
              name: "报表管理"
            },
            {
              name: "课程统计报表"
            }
          ]
        }
      },
      {
        path: "/learning-detail-report",
        name: "LearningDetailReport",
        component: () =>
          import(
            "@/views/marketing/learning-detail-report/learning-detail-report.vue"
          ),
        meta: {
          keepAlive: false,
          title: "学习明细报表",
          extendBreadcrumbList: [
            {
              name: "报表管理"
            },
            {
              name: "学习明细报表"
            }
          ]
        }
      },
      {
        path: "/course-learning-follow",
        name: "courseLearningFollow",
        component: () =>
          import(
            "@/views/marketing/course-learning-follow/course-learning-follow.vue"
          ),
        meta: {
          keepAlive: false,
          title: "课程学习跟进",
          extendBreadcrumbList: [
            {
              name: "报表管理"
            },
            {
              name: "课程学习跟进"
            }
          ]
        }
      },
      {
        path: "/examination-statistics-report",
        name: "examinationStatisticsReport",
        component: () =>
          import(
            "@/views/marketing/examination-statistics-report/examination-statistics-report.vue"
          ),
        meta: {
          keepAlive: false,
          title: "考试统计报表",
          extendBreadcrumbList: [
            {
              name: "报表管理"
            },
            {
              name: "考试统计报表"
            }
          ]
        }
      },
      {
        path: "/add-teacher",
        name: "addTeacher",
        component: () =>
          import("@/views/marketing/teacher-page/add-teacher/add-teacher.vue"),
        meta: {
          keepAlive: false,
          title: "新增讲师",
          extendBreadcrumbList: [
            {
              name: "讲师管理"
            },
            {
              name: "讲师列表"
            },
            {
              name: "新增讲师"
            }
          ]
        }
      },
      {
        path: "/lecturer-list",
        name: "lecturerList",
        component: () =>
          import(
            "@/views/marketing/teacher-page/lecturer-list/lecturer-list.vue"
          ),
        meta: {
          keepAlive: false,
          title: "讲师列表",
          extendBreadcrumbList: [
            {
              name: "讲师管理"
            },
            {
              name: "讲师列表"
            }
          ]
        }
      },
      {
        path: "/teacher-detail",
        name: "teacherDetail",
        component: () =>
          import(
            "@/views/marketing/teacher-page/teacher-detail/teacher-detail.vue"
          ),
        meta: {
          keepAlive: false,
          title: "讲师详情",
          extendBreadcrumbList: [
            {
              name: "讲师管理"
            },
            {
              name: "讲师列表"
            },
            {
              name: "讲师详情"
            }
          ]
        }
      },
      {
        path: "/my-teacher-detail",
        name: "myTeacherDetail",
        component: () =>
          import(
            "@/views/marketing/teacher-page/my-teacher-detail/my-teacher-detail.vue"
          ),
        meta: {
          keepAlive: false,
          title: "我的信息",
          extendBreadcrumbList: [
            {
              name: "我的信息"
            }
          ]
        }
      },
      {
        path: "/teacher-library-list",
        name: "teacherLibraryList",
        component: () =>
          import(
            "@/views/marketing/teacher-page/teacher-library-list/teacher-library-list.vue"
          ),
        meta: {
          keepAlive: false,
          title: "外聘讲师库",
          extendBreadcrumbList: [
            {
              name: "讲师管理"
            },
            {
              name: "外聘讲师库"
            }
          ]
        }
      },
      {
        path: "/course-schedule",
        name: "courseSchedule",
        component: () =>
          import("@/views/marketing/course-schedule/course-schedule.vue"),
        meta: {
          keepAlive: false,
          title: "课程排课",
          extendBreadcrumbList: [
            {
              name: "平台运营"
            },
            {
              name: "课程排课"
            }
          ]
        }
      },
      {
        path: "/course-schedule",
        name: "courseSchedule",
        component: () =>
          import("@/views/marketing/course-schedule/course-schedule.vue"),
        meta: {
          keepAlive: false,
          title: "课程排课",
          extendBreadcrumbList: [
            {
              name: "平台运营"
            },
            {
              name: "课程排课"
            }
          ]
        }
      },
      {
        path: "/student-list",
        name: "studentList",
        component: () =>
          import("@/views/marketing/student-list/student-list.vue"),
        meta: {
          keepAlive: false,
          title: "学员列表",
          extendBreadcrumbList: [
            {
              name: "学员管理"
            },
            {
              name: "学员列表"
            }
          ]
        }
      },
      {
        path: "/open-student",
        name: "openStudent",
        component: () =>
          import("@/views/marketing/open-student/open-student.vue"),
        meta: {
          keepAlive: false,
          title: "开通学员",
          extendBreadcrumbList: [
            {
              name: "学员管理"
            },
            {
              name: "学员列表"
            },
            {
              name: "开通学员"
            }
          ]
        }
      },
      {
        path: "/student-detail",
        name: "studentDetail",
        component: () =>
          import("@/views/marketing/student-detail/student-detail.vue"),
        meta: {
          keepAlive: false,
          title: "学员详情",
          extendBreadcrumbList: [
            {
              name: "学员管理"
            },
            {
              name: "学员列表"
            },
            {
              name: "学员详情"
            }
          ]
        }
      },
      {
        path: "/operation-classification",
        name: "operationClassification",
        component: () =>
          import(
            "@/views/marketing/operation-classification/operation-classification.vue"
          ),
        meta: {
          keepAlive: false,
          title: "运营分类",
          extendBreadcrumbList: [
            {
              name: "平台运营"
            },
            {
              name: "运营分类"
            }
          ]
        }
      },
      {
        path: "/add-theme",
        name: "addTheme",
        component: () => import("@/views/marketing/add-theme/add-theme.vue"),
        meta: {
          keepAlive: false,
          title: "新建主题",
          extendBreadcrumbList: [
            {
              name: "平台运营"
            },
            {
              name: "运营分类"
            },
            {
              name: "新建主题"
            }
          ]
        }
      },
      {
        path: "/xiu-theme",
        name: "xiuTheme",
        component: () => import("@/views/marketing/xiu-theme/xiu-theme.vue"),
        meta: {
          keepAlive: false,
          title: "修改主题",
          extendBreadcrumbList: [
            {
              name: "平台运营"
            },
            {
              name: "运营分类"
            },
            {
              name: "修改主题"
            }
          ]
        }
      },
      {
        path: "/theme-detail",
        name: "themeDetail",
        component: () =>
          import("@/views/marketing/theme-detail/theme-detail.vue"),
        meta: {
          keepAlive: false,
          title: "主题详情",
          extendBreadcrumbList: [
            {
              name: "平台运营"
            },
            {
              name: "运营分类"
            },
            {
              name: "主题详情"
            }
          ]
        }
      },
      {
        path: "/add-recorded-course", // 录播/文档课
        name: "AddRecordedCourse",
        component: () =>
          import(
            "@/views/marketing/add-recorded-course/add-recorded-course.vue"
          ),
        meta: {
          keepAlive: false,
          title: "新建课程",
          extendBreadcrumbList: [
            {
              name: "课程管理"
            },
            {
              name: "课程列表"
            },
            {
              name: "新建课程"
            }
          ]
        }
      },
      {
        path: "/add-live-course", // 直播课
        name: "AddLiveCourse",
        component: () =>
          import("@/views/marketing/add-live-course/add-live-course.vue"),
        meta: {
          keepAlive: false,
          title: "新建课程",
          extendBreadcrumbList: [
            {
              name: "课程管理"
            },
            {
              name: "课程列表"
            },
            {
              name: "新建课程"
            }
          ]
        }
      },
      {
        path: "/add-discussion-course", // 研讨课
        name: "AddDiscussionCourse",
        component: () =>
          import(
            "@/views/marketing/add-discussion-course/add-discussion-course.vue"
          ),
        meta: {
          keepAlive: false,
          title: "新建课程",
          extendBreadcrumbList: [
            {
              name: "课程管理"
            },
            {
              name: "课程列表"
            },
            {
              name: "新建课程"
            }
          ]
        }
      },
      {
        path: "/add-series-course", // 系列课
        name: "AddSeriesCourse",
        component: () =>
          import("@/views/marketing/add-series-course/add-series-course.vue"),
        meta: {
          keepAlive: false,
          title: "新建课程",
          extendBreadcrumbList: [
            {
              name: "课程管理"
            },
            {
              name: "课程列表"
            },
            {
              name: "新建课程"
            }
          ]
        }
      },
      {
        path: "/shop-class-list", // 系列课
        name: "ShopClassList",
        component: () =>
          import(
            "@/views/marketing/shop-class/shop-class-list/shop-class-list.vue"
          ),
        meta: {
          keepAlive: false,
          title: "课程列表",
          extendBreadcrumbList: [
            {
              name: "课程管理"
            },
            {
              name: "课程列表"
            }
          ]
        }
      },
      {
        path: "/shop-class", // 系列课
        name: "ShopClass",
        component: () => import("@/views/marketing/shop-class/shop-class.vue"),
        meta: {
          keepAlive: false,
          title: "课程详情",
          extendBreadcrumbList: [
            {
              name: "课程管理"
            },
            {
              name: "课程列表"
            },
            {
              name: "课程详情"
            }
          ]
        }
      },
      {
        path: "/shop-class-cloud", // 系列课
        name: "ShopClass",
        component: () =>
          import("@/views/marketing/shop-class-cloud/shop-class.vue"),
        meta: {
          keepAlive: false,
          title: "课程详情",
          extendBreadcrumbList: [
            {
              name: "平台运营"
            },
            {
              name: "课程排课"
            },
            {
              name: "课程详情"
            }
          ]
        }
      },
      {
        path: "/goto-class-list", // 系列课
        name: "GotoClassList",
        component: () =>
          import(
            "@/views/marketing/shop-class/goto-class-list/goto-class-list.vue"
          ),
        meta: {
          keepAlive: false,
          title: "直播上课",
          extendBreadcrumbList: [
            {
              name: "课程管理"
            },
            {
              name: "直播上课"
            }
          ]
        }
      },
      {
        path: "/medal-issue",
        name: "MedalIssue",
        component: () =>
          import("@/views/marketing/medal-issue/medal-issue.vue"),
        meta: {
          keepAlive: false,
          title: "勋章发放",
          extendBreadcrumbList: [
            {
              name: "课程管理"
            },
            {
              name: "课程列表"
            },
            {
              name: "课程详情"
            },
            {
              name: "勋章发放"
            }
          ]
        }
      },
      {
        path: "/student-scope",
        name: "StudentScope",
        component: () =>
          import("@/views/marketing/student-scope/student-scope.vue"),
        meta: {
          keepAlive: false,
          title: "学员范围设置",
          extendBreadcrumbList: [
            {
              name: "课程管理"
            },
            {
              name: "课程列表"
            },
            {
              name: "课程详情"
            },
            {
              name: "学员范围设置"
            }
          ]
        }
      },
      {
        path: "/medal-issue",
        name: "medal-issue",
        component: () =>
          import("@/views/marketing/medal-issue/medal-issue.vue"),
        meta: {
          keepAlive: false,
          title: "勋章发放"
        }
      },
      {
        path: "/application-list",
        name: "applicationList",
        component: () =>
          import("@/views/marketing/application-list/application-list.vue"),
        meta: {
          keepAlive: false,
          title: "报名清单"
        }
      },
      {
        path: "/message-management",
        name: "messageManagement",
        component: () =>
          import("@/views/marketing/message-management/message-management.vue"),
        meta: {
          keepAlive: false,
          title: "留言管理"
        }
      },
      {
        path: "/job-management",
        name: "jobManagement",
        component: () =>
          import("@/views/marketing/job-management/job-management.vue"),
        meta: {
          keepAlive: false,
          title: "作业管理"
        }
      },
      {
        path: "/playback-management",
        name: "playbackManagement",
        component: () =>
          import(
            "@/views/marketing/playback-management/playback-management.vue"
          ),
        meta: {
          keepAlive: false,
          title: "回放管理"
        }
      },
      {
        path: "/advert-list", // 广告管理列表
        name: "advertList",
        component: () =>
          import("@/views/marketing/advert-manage/advert-list/advert-list.vue"),
        meta: {
          keepAlive: false,
          title: "广告管理",
          extendBreadcrumbList: [
            {
              name: "平台运营"
            },
            {
              name: "广告管理"
            }
          ]
        }
      },
      {
        path: "/advert-add", // 新建广告
        name: "advertAdd",
        component: () =>
          import("@/views/marketing/advert-manage/advert-add/advert-add.vue"),
        meta: {
          keepAlive: false,
          title: "新建广告",
          extendBreadcrumbList: [
            {
              name: "平台运营"
            },
            {
              name: "广告管理"
            },
            {
              name: "新建广告"
            }
          ]
        }
      },
      {
        path: "/advert-detail", // 广告详情
        name: "advertDetail",
        component: () =>
          import(
            "@/views/marketing/advert-manage/advert-detail/advert-detail.vue"
          ),
        meta: {
          keepAlive: false,
          title: "广告详情",
          extendBreadcrumbList: [
            {
              name: "平台运营"
            },
            {
              name: "广告管理"
            },
            {
              name: "广告详情"
            }
          ]
        }
      },
      {
        path: "/student-info", // 学员信息
        name: "studentInfo",
        component: () =>
          import(
            "@/views/marketing/student-groups/student-info/student-info.vue"
          ),
        meta: {
          keepAlive: false,
          title: "学员信息",
          extendBreadcrumbList: [
            {
              name: "学员管理"
            },
            {
              name: "学员分组"
            },
            {
              name: "学员信息"
            }
          ]
        }
      },
      {
        path: "/groups-detail", // 分组详情
        name: "groupDetail",
        component: () =>
          import(
            "@/views/marketing/student-groups/groups-detail/groups-detail.vue"
          ),
        meta: {
          keepAlive: false,
          title: "分组详情",
          extendBreadcrumbList: [
            {
              name: "学员管理"
            },
            {
              name: "学员分组"
            },
            {
              name: "分组详情"
            }
          ]
        }
      },
      {
        path: "/student-groups-list", // 学员分组列表
        name: "studentGroupsList",
        component: () =>
          import(
            "@/views/marketing/student-groups/student-groups-list/student-groups-list.vue"
          ),
        meta: {
          keepAlive: false,
          title: "学员分组",
          extendBreadcrumbList: [
            {
              name: "学员管理"
            },
            {
              name: "学员分组"
            }
          ]
        }
      },
      {
        path: "/platform-classify-list", // 平台运营-课程分类列表
        name: "platformClassifyList",
        component: () =>
          import(
            "@/views/marketing/course-classify-platform/platform-classify-list/platform-classify-list.vue"
          ),
        meta: {
          keepAlive: false,
          title: "课程分类",
          extendBreadcrumbList: [
            {
              name: "平台运营"
            },
            {
              name: "分类管理"
            }
          ]
        }
      },
      {
        path: "/platform-classify-add", // 平台运营-课程分类新增/修改
        name: "platformClassifyAdd",
        component: () =>
          import(
            "@/views/marketing/course-classify-platform/platform-classify-add/platform-classify-add.vue"
          ),
        meta: {
          keepAlive: false,
          title: "新建分类",
          extendBreadcrumbList: [
            {
              name: "平台运营"
            },
            {
              name: "分类管理"
            },
            {
              name: "新建分类"
            }
          ]
        }
      },
      {
        path: "/platform-classify-detail", // 平台运营-课程分类详情
        name: "platformClassifyDetail",
        component: () =>
          import(
            "@/views/marketing/course-classify-platform/platform-classify-detail/platform-classify-detail.vue"
          ),
        meta: {
          keepAlive: false,
          title: "分类详情",
          extendBreadcrumbList: [
            {
              name: "平台运营"
            },
            {
              name: "分类管理"
            },
            {
              name: "分类详情"
            }
          ]
        }
      },
      {
        path: "/organization-classify-list", // 机构运营-课程分类列表
        name: "organizationClassifyList",
        component: () =>
          import(
            "@/views/marketing/course-classify-organization/organization-classify-list/organization-classify-list.vue"
          ),
        meta: {
          keepAlive: false,
          title: "课程分类",
          extendBreadcrumbList: [
            {
              name: "机构运营"
            },
            {
              name: "分类管理"
            }
          ]
        }
      },
      {
        path: "/organization-classify-add", // 机构运营-课程分类新增修改
        name: "organizationClassifyAdd",
        component: () =>
          import(
            "@/views/marketing/course-classify-organization/organization-classify-add/organization-classify-add.vue"
          ),
        meta: {
          keepAlive: false,
          title: "分类管理",
          extendBreadcrumbList: [
            {
              name: "机构运营"
            },
            {
              name: "分类管理"
            },
            {
              name: "新建分类"
            }
          ]
        }
      },
      {
        path: "/organization-classify-detail", // 机构运营-课程分类详情
        name: "organizationClassifyDetail",
        component: () =>
          import(
            "@/views/marketing/course-classify-organization/organization-classify-detail/organization-classify-detail.vue"
          ),
        meta: {
          keepAlive: false,
          title: "分类管理",
          extendBreadcrumbList: [
            {
              name: "机构运营"
            },
            {
              name: "分类管理"
            },
            {
              name: "分类详情"
            }
          ]
        }
      },
      {
        path: "/theme-list",
        name: "themeList",
        component: () =>
          import("@/views/marketing/organ-operation/theme-list/theme-list.vue"),
        meta: {
          keepAlive: false,
          title: "运营分类",
          extendBreadcrumbList: [
            {
              name: "机构运营"
            },
            {
              name: "运营分类"
            }
          ]
        }
      },
      {
        path: "/organ-theme-detail",
        name: "organ-theme-detail",
        component: () =>
          import(
            "@/views/marketing/organ-operation/organ-theme-detail/organ-theme-detail.vue"
          ),
        meta: {
          keepAlive: false,
          title: "主题详情",
          extendBreadcrumbList: [
            {
              name: "机构运营"
            },
            {
              name: "运营分类"
            },
            {
              name: "主题详情"
            }
          ]
        }
      },
      {
        path: "/add-organ-theme",
        name: "add-organ-theme",
        component: () =>
          import(
            "@/views/marketing/organ-operation/add-organ-theme/add-organ-theme.vue"
          ),
        meta: {
          keepAlive: false,
          title: "新建分类",
          extendBreadcrumbList: [
            {
              name: "机构运营"
            },
            {
              name: "运营分类"
            },
            {
              name: "新建主题"
            }
          ]
        }
      },
      {
        path: "/banner-list",
        name: "bannerList",
        component: () =>
          import("@/views/marketing/banner-manage/banner-list/banner-list.vue"),
        meta: {
          keepAlive: false,
          title: "banner管理",
          extendBreadcrumbList: [
            {
              name: "机构运营"
            },
            {
              name: "banner管理"
            }
          ]
        }
      },
      {
        path: "/banner-detail",
        name: "bannerDetail",
        component: () =>
          import(
            "@/views/marketing/banner-manage/banner-detail/banner-detail.vue"
          ),
        meta: {
          keepAlive: false,
          title: "banner详情",
          extendBreadcrumbList: [
            {
              name: "机构运营"
            },
            {
              name: "banner管理"
            },
            {
              name: "banner详情"
            }
          ]
        }
      },
      {
        path: "/add-banner",
        name: "add-banner",
        component: () =>
          import("@/views/marketing/banner-manage/add-banner/add-banner.vue"),
        meta: {
          keepAlive: false,
          title: "新建banner",
          extendBreadcrumbList: [
            {
              name: "机构运营"
            },
            {
              name: "banner管理"
            },
            {
              name: "新建banner"
            }
          ]
        }
      },
      {
        path: "/job-management-list",
        name: "job-management-list",
        component: () =>
          import(
            "@/views/marketing/job-management-list/job-management-list.vue"
          ),
        meta: {
          keepAlive: false,
          title: "作业列表",
          extendBreadcrumbList: [
            {
              name: "课程管理"
            },
            {
              name: "作业列表"
            }
          ]
        }
      },
      {
        path: "/goto-mg-op",
        name: "goto-mg-op",
        component: () => import("@/views/marketing/goto-mg-op/goto-mg-op.vue"),
        meta: {
          keepAlive: false,
          title: "活动运营",
          extendBreadcrumbList: [
            {
              name: "平台运营"
            },
            {
              name: "活动运营"
            }
          ]
        }
      },
      {
        path: "/sign-up-list",
        name: "sign-up-list",
        component: () =>
          import("@/views/marketing/sign-up-list/sign-up-list.vue"),
        meta: {
          keepAlive: false,
          title: "报名明细",
          extendBreadcrumbList: [
            {
              name: "报表管理"
            },
            {
              name: "报名明细"
            }
          ]
        }
      },
      {
        path: "/class-manage-list",
        name: "class-manage-list",
        component: () =>
          import(
            "@/views/marketing/class-manage/class-manage-list/class-manage-list.vue"
          ),
        meta: {
          keepAlive: false,
          title: "班级列表",
          extendBreadcrumbList: [
            {
              name: "班级管理"
            },
            {
              name: "班级列表"
            }
          ]
        }
      },
      {
        path: "/add-class",
        name: "add-class",
        component: () =>
          import("@/views/marketing/class-manage/add-class/add-class.vue"),
        meta: {
          keepAlive: false,
          title: "新建班级",
          extendBreadcrumbList: [
            {
              name: "班级管理"
            },
            {
              name: "新建班级"
            }
          ]
        }
      },
      {
        path: "/job-details",
        name: "job-details",
        component: () =>
          import("@/views/marketing/class-manage/job-details/job-details.vue"),
        meta: {
          keepAlive: false,
          title: "作业详情",
          extendBreadcrumbList: [
            {
              name: "班级管理"
            },
            {
              name: "班级列表"
            },
            {
              name: "班级详情"
            },
            {
              name: "作业详情"
            }
          ]
        }
      },
      {
        path: "/student-manage",
        name: "student-manage",
        component: () =>
          import(
            "@/views/marketing/class-manage/student-manage/student-manage.vue"
          ),
        meta: {
          keepAlive: false,
          title: "学员管理",
          extendBreadcrumbList: [
            {
              name: "班级管理"
            },
            {
              name: "班级列表"
            },
            {
              name: "班级详情"
            },
            {
              name: "学员管理"
            }
          ]
        }
      },
      {
        path: "/class-details", // 课程详情
        name: "ClassDetail",
        component: () =>
          import(
            "@/views/marketing/class-manage/class-details/class-details.vue"
          ),
        meta: {
          keepAlive: false,
          title: "班级详情",
          extendBreadcrumbList: [
            {
              name: "班级管理"
            },
            {
              name: "班级列表"
            },
            {
              name: "班级详情"
            }
          ]
        }
      },
      {
        path: "/exams-details", // 考试详情
        name: "ExamsDetail",
        component: () =>
          import(
            "@/views/marketing/class-manage/exams-details/exams-details.vue"
          ),
        meta: {
          keepAlive: false,
          title: "考试详情",
          extendBreadcrumbList: [
            {
              name: "班级管理"
            },
            {
              name: "班级列表"
            },
            {
              name: "班级详情"
            },
            {
              name: "考试详情"
            }
          ]
        }
      },
      {
        path: "/task-settings",
        name: "task-settings",
        component: () =>
          import(
            "@/views/marketing/class-manage/task-settings/task-settings.vue"
          ),
        meta: {
          keepAlive: false,
          title: "作业设置",
          extendBreadcrumbList: [
            {
              name: "班级管理"
            },
            {
              name: "班级列表"
            },
            {
              name: "班级详情"
            },
            {
              name: "作业设置"
            }
          ]
        }
      },
      {
        path: "/exam-setting",
        name: "exam-setting",
        component: () =>
          import(
            "@/views/marketing/class-manage/exam-setting/exam-setting.vue"
          ),
        meta: {
          keepAlive: false,
          title: "考试设置",
          extendBreadcrumbList: [
            {
              name: "班级管理"
            },
            {
              name: "班级列表"
            },
            {
              name: "班级详情"
            },
            {
              name: "考试设置"
            }
          ]
        }
      },
      {
        path: "/counselor-management",
        name: "counselor-management",
        component: () =>
          import(
            "@/views/marketing/class-manage/counselor-management/counselor-management.vue"
          ),
        meta: {
          keepAlive: false,
          title: "辅导员管理",
          extendBreadcrumbList: [
            {
              name: "班级管理"
            },
            {
              name: "班级列表"
            },
            {
              name: "班级详情"
            },
            {
              name: "辅导员管理"
            }
          ]
        }
      },
      {
        path: "/timetable-setting",
        name: "timetable-setting",
        component: () =>
          import(
            "@/views/marketing/class-manage/timetable-setting/timetable-setting.vue"
          ),
        meta: {
          keepAlive: false,
          title: "课表设置",
          extendBreadcrumbList: [
            {
              name: "班级管理"
            },
            {
              name: "班级列表"
            },
            {
              name: "班级详情"
            },
            {
              name: "课表设置"
            }
          ]
        }
      },
      {
        path: "/course-details",
        name: "course-details",
        component: () =>
          import(
            "@/views/marketing/class-manage/course-details/course-details.vue"
          ),
        meta: {
          keepAlive: false,
          title: "课程详情",
          extendBreadcrumbList: [
            {
              name: "班级管理"
            },
            {
              name: "班级列表"
            },
            {
              name: "班级详情"
            },
            {
              name: "课程详情"
            }
          ]
        }
      }
    ]
  }
];
