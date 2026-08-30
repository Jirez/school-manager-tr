export interface StudentPaymentType {
  id?: number;
  reference: string | null;
  invoiceReference: string;
  studentInvoiceId?: number;
  paymentDate: any;
  totalAmountPaid: number;
  student: any;
  frequent: any;
  paymentAccount: any;
  paymentAccountId: any;
  paymentMode: any;
  paymentModeId: any;
  classId: any;
  studentId: any;
  note: string | null;
  studentName?: string;
  registrationNumber: string;
  items: StudentPaymentItem[];
}

export interface StudentPaymentItem {
  paidAmount: number | null;
  inKindPayment: boolean | null;
  requiredAmount?: number | null;
  studentPaymentItemPK?: {
    paymentSliceId: number;
    schoolFeeId: number;
  };
  paymentSliceId?: number;
  schoolFeeId?: number;
  paymentSlice: any;
  schoolFee: any;
  studentPaymentId?: number;
  /*paymentSlice: {
        deadline: any
        name: string
    }*/
}
