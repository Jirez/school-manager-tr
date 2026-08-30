export interface AccountModelType {
    id?: number
    code: string
    name: string
    languageType: "FRENCH" | "ENGLISH" | any
    country: string
    active: boolean
    current: boolean
    note?: string
}