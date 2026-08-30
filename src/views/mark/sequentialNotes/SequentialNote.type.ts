export interface SequentialNoteType {
    sequentialNotePK: {
        studentId: number,
        subjectId: number,
        subPeriodId: number,
    },
    note?: number,
    studentFullName: string,
    appreciation?: string
    student: {
        lastName: string
        firstName: string
        id: number
        registrationNumber: string
    }
}

export interface QuarterlyObservationType {
    quarterlyReportPK: {
        studentId: number
        periodId: number
    }
    observation?: string
    student: {
        lastName: string
        firstName: string
        id: number
        registrationNumber: string
    }
    studentFullName?: string
    quarterlyReport?: {
        average?: number
        rank?: number
    }
    average?: number
}