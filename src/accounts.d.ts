interface Bank {
    id?: number
    name: string
    agency?: string
    referrer?: string
    bankAddress?: Address
    bankContactInfo?: ContactInfo
    bankLegalInfo?: LegalInfo
    iban?: string
    bic?: string
    bankCode?: string
    tellerCode?: string
    accountNumber?: string
    ribKey?: string
    holder?: string
    defaultBank?: boolean
    bankAccount?: Account
}

interface AccountModel {
    id?: number
    code: string
    languageType: string
    country?: string
    active: boolean
    current: boolean
    name: string
    note?: string
}

interface AccountGroup {
    id?: number
    sectionType: string
    name: string
    level?: number
    active: boolean
    description?: string
    parent?: AccountGroup
    accountModel: AccountModel
}

interface AccountCategory {
    id?:number
    name: string
    accountType: string
    active: boolean
    description?: string
}

interface ChartOfAccount {
    id?: string
    name: string
    number: string
    active: boolean
    note?: string
    logCodes: string
    accountGroup?: AccountGroup
    accountCategory?: AccountCategory
    parent?: ChartOfAccount
}

interface Account {
    id?: number
    number: string
    name: string
    displayName?: string
    active: boolean
    balance?: number
    balanceType?: string
    description?: string
    chartOfAccount: ChartOfAccount
    accountCategory?: AccountCategory
    parent?: Account
    enterprise: Enterprise
}

interface IOBalance {
    operationDate: String
    month: String
    year: number
    saleAmount?: number
    invoiceAmount?: number
    purchaseAmount?: number
    vendorInvoiceAmount?: number
    payment?: number
    vendorPayment?: number
    expense?: number
    deposit?: number
    withdrawal?: number
    balance?: number
}


interface IOBalanceData {
    [key: string]: IOBalance[]
}