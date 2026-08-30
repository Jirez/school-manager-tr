export interface BranchType {
	id?: number;
	name: string;
	maxStudent?: number | string;
	totalCoefficient?: number;
	subjectCount?: number | string;
	classCount?: number | string;
	level: any;
	levelId: any;
	subjectBranchCollection: any;
	items: SubjectBranch[];
	branchId: any;
}

export interface SubjectBranch {
	subjectBranchPK: {
		branchId?: number;
		subjectId: number;
	};
	coefficient: any;
	weeklyHourCount?: number | null;
	sessionCount?: number | null;
	maxSessionDuration?: number | null;
	priority?: number | null;
	number?: number | null;
	scale?: number | null;
	subject?: {
		id: number;
		name: string;
		code: string;
	};
	subjectName?: string;
}
