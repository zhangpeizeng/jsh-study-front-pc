interface BrandListTableData {
  readonly id: number;
  readonly courseName: string;
  readonly courseType: string;
  readonly courseImg: string;
  readonly signUpStartTime: string;
  readonly signUpEndTime: string;
  readonly studyStartTime: string;
  readonly studyEndTime: string;
  readonly liveStartTime: string;
  readonly liveEndTime: string;
  readonly status: number;
}

interface courseTypeList {
  readonly typeName: string;
  readonly typeCode: string;
  readonly labelName: string;
  readonly labelCode: string;
  readonly iconUrl: string;
  readonly icon: string;
  readonly remarks: string;
}

export { BrandListTableData, courseTypeList };
