export interface QuarterlyNoteType {
    note1: number
    note2: number
    studentFullName: string,
    student: {
        lastName: string
        firstName: string
        id: number
        registrationNumber: string
    }
}