import { useState } from 'react'
import type {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  PaginationState,
  RowData,
  RowSelectionState,
  TableOptions,
  TableState,
} from '@tanstack/react-table'
import { useAppTable } from '#/hooks/table'
import type { AppFeatures } from '#/hooks/table'
import checkboxColumn from '@/@core/components/react-table/checkbox-column'
import { matchWord } from '@/utils/SearchFn'

export interface UseTableOptions<TData extends RowData> extends Partial<
  TableOptions<AppFeatures, TData>
> {
  enableColumnResizing?: boolean
  columnResizeMode?: 'onChange' | 'onEnd'
  debugTable?: boolean
  debugHeaders?: boolean
  debugColumns?: boolean
  initialState?: Partial<TableState<AppFeatures>>
  showCheckbox?: boolean
  globalFilterFn?: FilterFn<AppFeatures, TData>
  pageSize?: number
}

export function useTable<TData extends RowData>(
  options: UseTableOptions<TData> & {
    data: TData[]
    columns: ColumnDef<AppFeatures, TData, any>[]
  },
) {
  'use no memo'
  const {
    data,
    columns,
    enableColumnResizing = true,
    columnResizeMode = 'onChange',
    debugTable = false,
    debugHeaders = false,
    debugColumns = false,
    showCheckbox = true,
    globalFilterFn = matchWord,
    pageSize,
    initialState = {},
    state: externalState,
    ...restOptions
  } = options

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    () => initialState.columnFilters ?? [],
  )
  const [globalFilter, setGlobalFilter] = useState(
    () => initialState.globalFilter ?? '',
  )
  const [pagination, setPagination] = useState<PaginationState>(() => ({
    pageIndex: initialState.pagination?.pageIndex ?? 0,
    pageSize:
      pageSize ??
      getStoredPageSize() ??
      initialState.pagination?.pageSize ??
      15,
  }))
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    () => initialState.rowSelection ?? {},
  )

  const table = useAppTable({
    ...restOptions,
    data,
    // @ts-ignore desc
    columns: showCheckbox ? [checkboxColumn, ...columns] : columns,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    enableColumnResizing,
    columnResizeMode,
    onPaginationChange: setPagination,
    globalFilterFn,
    initialState,
    atoms: {
      ...restOptions.atoms,
    },
    state: {
      ...externalState,
      columnFilters,
      globalFilter,
      pagination,
      rowSelection,
    },
    debugTable,
    debugHeaders,
    debugColumns,
  })

  const totalCount = table.getFilteredRowModel().rows.length
  const selectedFlatRows = table.getSelectedRowModel().flatRows

  return {
    table,
    globalFilter,
    setGlobalFilter,
    rowSelection,
    setRowSelection,
    totalCount,
    columnFilters,
    setColumnFilters,
    selectedFlatRows,
  }
}

function getStoredPageSize(): number | undefined {
  if (typeof window === 'undefined') return undefined

  const storedPageSize = Number(window.localStorage.getItem('PageSize'))
  return Number.isInteger(storedPageSize) && storedPageSize > 0
    ? storedPageSize
    : undefined
}
