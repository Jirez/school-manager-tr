export interface ClassDistribution {
	distributionPK: {
		schoolYearId: number;
		subjectId: number;
		classId: number;
	};
	subject: {
		id: number;
		name: string;
		subjectDepartment: {
			id: number;
		};
	};
	teacher?: {
		id: number | null;
		firstName?: string;
		lastName: string;
		code: string;
	};
	coTeacher?: {
		id: number | null;
		firstName?: string;
		lastName: string;
		code: string;
	};
	weeklyHoursCount?: number;
	weekHoursCount?: number;
	headerTeacher?: boolean;
	teacherId?: number;
	coTeacherId?: number;
	lastName?: string;
	coLastName?: string;
}
