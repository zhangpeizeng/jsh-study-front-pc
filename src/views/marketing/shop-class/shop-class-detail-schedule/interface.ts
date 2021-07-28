interface BrandListTableData {
  readonly id: number;
  readonly courseName: string;
  readonly courseType: string;
  readonly studyTerminal: string;
  readonly lecturerId: number;
  readonly lecturerName: string;
  readonly lecturerCode: string;
  readonly classClassifyId: object[];
  readonly ClassClassifyDtoList: object[];
  readonly itemSkuId: number;
  readonly courseImg: string;
  readonly courseDescription: string;
  readonly signUpStatus: number;
  readonly signUpStartTime: string;
  readonly signUpEndTime: string;
  readonly studyStartTime: string;
  readonly studyEndTime: string;
  readonly collegeMarketingLiveList: object[];
  readonly content: string;
  readonly medalStatus: number;
  readonly collegeMarketingMedalRaleList: object[];
  readonly testStatus: number;
  readonly testStartTime: string;
  readonly testEndTime: string;
  readonly testId: number;
  readonly certificateStatus: number;
  readonly certificateId: number;
  readonly certificateRelaList: object[];
  readonly taskStatus: number;
  readonly taskStartTime: string;
  readonly taskEndTime: string;
  readonly pkStatus: number;
  readonly pkStartTime: string;
  readonly pkEndTime: string;
  readonly taskDescription: string;
  readonly layout: string;
  readonly peopleCount: number;
  readonly liveStartTime: string;
  readonly liveEndTime: string;
  readonly status: number;
  readonly coursesDtoList: object[];
}

interface classifydtolist {
  readonly studyTerminalCode: string;
  readonly classClassifyCode: string;
  readonly classifyId: string;
  readonly classifyName: string;
}

interface collegeMarketingLiveList {
  readonly id: number;
  readonly liveId: string;
  readonly liveName: string;
  readonly liveType: string;
  readonly sourceType: string;
}

interface collegeMarketingMedalRaleList {
  readonly medalName: string;
  readonly liveName: string;
  readonly medalTypeUrl: string;
  readonly distributionRatio: string;
  readonly sort: string;
}
interface certificateRelaList {
  readonly certificateBasePicUrl: string;
  readonly certificateName: string;
  readonly certificateDesc: string;
  readonly certificateCompany: string;
  readonly certificateUrl: string;
  readonly sort: string;
}

export {
  BrandListTableData,
  classifydtolist,
  collegeMarketingLiveList,
  collegeMarketingMedalRaleList,
  certificateRelaList
};
