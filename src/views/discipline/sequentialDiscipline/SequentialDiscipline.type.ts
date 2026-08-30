export interface SequentialDisciplineType {
    sequentialDisciplinePK: {
        studentId: number
        subPeriodId: number
    }
    unjustifiedAbsence: number | null
    justifiedAbsence: number | null
    detention: number | null
    warning: number | null
    behaviorBlame: number | null
    temporaryExclusion: number | null
    definitiveExclusion: number | null
    disciplinaryBoard: number | null
    student: {
        id: number
        registrationNumber: string
        lastName: string
        firstName: string
    }
    fullName?: string
}