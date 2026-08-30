export interface StudentInvoiceType {
	id?: number;
	reference: string | null;
	operationDate: any;
	totalAmount: number;
	amountPaid: number | null;
	student: any;
	frequent: any;
	classId: any;
	studentId: any;
	note: string | null;
	studentName?: string;
	registrationNumber: string | null;
	items: StudentInvoiceItem[];
}

export interface StudentInvoiceItem {
	amount: number | null;
	requiredAmount?: number | null;
	studentInvoiceItemPK?: {
		paymentSliceId: number;
		schoolFeeId: number;
	};
	paymentSliceId?: number;
	schoolFeeId?: number;
	paymentSlice: any;
	schoolFee: any;
	/*paymentSlice: {
        deadline: any
        name: string
    }*/
}
