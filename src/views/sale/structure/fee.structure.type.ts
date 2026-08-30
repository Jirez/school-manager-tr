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
  requiredAmountF?: string;
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

export interface FeeStructureType {
  feeGroupId: number;
  feeGroupName: string;
  items: FeeStructureItem[];
}

export interface FeeStructureItem {
  installmentId: number;
  installmentName: string;
  items: FeeStructureItemItem[];
}

export interface FeeStructureItemItem {
  tuitionId: number;
  tuitionName: string;
  requiredAmount: number;
  requiredAmountF: string;
  lateFee: number;
  dueDate: string;
  gracePeriodDays: number;
}
