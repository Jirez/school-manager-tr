export interface AccountingEntryType {
	id?: number;
	number: number | string;
	operationDate: any;
	recordDate: any;
	amount: number | string;
	note?: string;
	items: AccountingEntryItem[];
}

export interface AccountingEntryItem {
	//id: number
	amount?: number | null;
	directionType?: "CREDIT" | "DEBIT";
	description?: string;
	account?: {
		id: number;
		name: string;
		number: string;
	};
	person?: {
		id: number;
		displayName: string;
	};
	logCode?: {
		id: number;
		name: string;
	};
	debit: number | string | null;
	credit: number | string | null;
}
