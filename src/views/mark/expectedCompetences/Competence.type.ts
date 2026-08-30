export interface CompetenceType {
    expectedCompetencePK :{
        classId: number
        periodId: number
        subjectId: number
    }
    competence?: string
    subject: {
        id: number
        code: string
        name: string
    }
}