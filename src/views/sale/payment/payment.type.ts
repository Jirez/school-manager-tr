export interface PaymentOfStudentType {
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
  studentClass: string;
  items: PaymentOfStudentItem[];
}

export interface PaymentOfStudentItem {
  paidAmount: number | null;
  paidAmountF: any;
  inKindPayment: boolean | null;
  requiredAmount?: number | null;
  installmentId?: number;
  tuitionId?: number;
  installmentName?: string;
  tuitionName?: string;
  dueDate?: any;
  paymentId?: number;
  invoiceItemId?: number;
}
