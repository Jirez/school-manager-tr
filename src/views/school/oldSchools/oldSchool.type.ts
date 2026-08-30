export interface OldSchoolType {
    id?: number
    name: string
    address :{
        street?: string
        state?: string
        country?: string
        town?: string
        zipCode?: string
    }
    contactInfo: {
        telephone?: string
        email?: string
        postOfficeBox?: string
        mobile?: string
        fax?: string
    }
}