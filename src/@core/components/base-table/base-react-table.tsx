interface ReactTableProps {
  data: any[]
  columns: any[]
  selectedRows?: any[]
  setSelectedRows: (...args: any[]) => any
  hiddenColumns?: any[]
  fuzzySearch?: boolean
  showQuickFilter?: boolean
  onModelUpdate?: (rows: any[], preGlobalFilteredRows: any[]) => void
  onGlobalFilterChanged?: (filterApi: GlobalFilterApi) => void
  onRowClicked?: (rowData: any) => void
  onRowSelected?: (data: any[]) => void // when checkbox are selected
  pageSize?: number
  showAddButton?: boolean
  onAddButtonClick?: () => void
}

export interface GlobalFilterApi {
  globalFilter: any
  setGlobalFilter: (filter: string) => void
  setDefaultGlobalFilter?: (filter: string) => void // todo remove this
}
