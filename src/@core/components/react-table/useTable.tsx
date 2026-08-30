import { useMount, useSafeState as useState } from 'ahooks'
import type {
  ColumnDef,
  ColumnFiltersState,
  FilterFnOption,
  GroupingState,
  PaginationState,
  TableOptions,
  TableState,
} from '@tanstack/react-table'

import {
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { matchWord } from '@/utils/SearchFn'
import checkboxColumn from './checkbox-column'
import { useEffect } from 'react'

export interface UseTableOptions<TData> extends Partial<TableOptions<TData>> {
  enableColumnResizing?: boolean
  columnResizeMode?: 'onChange' | 'onEnd'
  debugTable?: boolean
  debugHeaders?: boolean
  debugColumns?: boolean
  initialState?: Partial<TableState>
  showCheckbox?: boolean
  globalFilterFn?: FilterFnOption<any>
  pageSize?: number
}

export function useTable<TData>(
  options: UseTableOptions<TData> & {
    data: TData[]
    columns: ColumnDef<TData, any>[]
  },
) {
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
    pageSize = 15,
    ...restOptions
  } = options
  const [columnVisibility, setColumnVisibility] = useState({})
  const [grouping, setGrouping] = useState<GroupingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [columnPinning, setColumnPinning] = useState({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, onPaginationChange] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize || Number(localStorage.getItem('PageSize')) || 15,
  })
  const [totalCount, setTotalCount] = useState(0)
  const [isMount, setIsMount] = useState(false)

  const table = useReactTable({
    data,
    // @ts-ignore desc
    columns: showCheckbox ? [checkboxColumn, ...columns] : columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    enableColumnResizing,
    columnResizeMode,
    onColumnVisibilityChange: setColumnVisibility,
    onGroupingChange: setGrouping,
    onColumnPinningChange: setColumnPinning,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    globalFilterFn,
    state: {
      grouping,
      columnFilters,
      globalFilter,
      columnVisibility,
      columnPinning,
      rowSelection,
      pagination,
      ...restOptions.initialState,
    },
    // debugTable,
    // debugHeaders,
    // debugColumns,
    // ...restOptions,
  })

  const {
    options: { rowCount },
    getPrePaginationRowModel,
  } = table
  const rows = isMount ? getPrePaginationRowModel().rows : []
  const selectedFlatRows = isMount ? table.getSelectedRowModel().flatRows : []

  // Optional: Add any table-specific effects here
  /* useEffect(() => {
    if (table.getState().columnFilters[0]?.id === "fullName") {
      if (table.getState().sorting[0]?.id !== "fullName") {
        table.setSorting([{ id: "fullName", desc: false }]);
      }
    }
  }, [table.getState().columnFilters[0]?.id]); */

  useMount(() => {
    setIsMount(true)
  })

  useEffect(() => {
    setTotalCount(rows.length)
  }, [rows])

  return {
    table,
    globalFilter,
    setGlobalFilter,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    totalCount,
    columnFilters,
    setColumnFilters,
    selectedFlatRows,
  }
}
