export interface SchoolFeeLevelFormValues {
  level: any;
  levelId: any;
  modelId: any;
  items: SchoolFeeLevelItem[];
}

export interface SchoolFeeLevelItem {
  schoolFeeLevelPK?: {
    levelId: number;
    schoolFeeId: number;
    paymentGroupId: number;
    paymentSliceId: number;
  };
  studentInvoice?: {
    id: number;
    student: {
      id: number;
      lastName: string;
      firstName?: string;
    };
  };
  requiredAmount?: number;
  amount?: number;
  level?: {
    id: number;
    name: string;
  };
  schoolFee?: {
    id?: number;
    name?: string;
  };
  paymentGroup?: {
    id?: number;
    name?: string;
  };
  paymentSlice?: {
    id?: number;
    name?: string;
  };
  paymentSliceId: any;
  paymentGroupId: any;
  schoolFeeId: any;
}

export interface SchoolFeeLevelType {
  paymentGroupId: number;
  paymentGroupName: string;
  items: SchoolFeeLevelItemType[];
}

export interface SchoolFeeLevelItemType {
  paymentSliceId: number;
  paymentSliceName: string;
  items: SchoolFeeLevelItemItemType[];
}

export interface SchoolFeeLevelItemItemType {
  schoolFeeId: number;
  schoolFeeName: string;
  requiredAmount: number;
}
