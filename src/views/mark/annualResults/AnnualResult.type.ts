export interface AnnualResultType {
    annualReportPK: {
        studentId: number
        schoolYearId: number
    }
    observation?: string
    councilDecision?: {
        id: number
        code: string
        name: string
    }
    councilDecisionId: any
    clazz?: {
        id: number
        name: string
    }
    classId: any
    branch?: {
        id: number
        name: string
    }
    branchId: any
    student: {
        id: number
        registrationNumber: string
        lastName: string
        firstName?: string
    }
    studentFullName?: string
    annualReport?: {
        average?: number
        rank?: number
    }
    average?: number
}