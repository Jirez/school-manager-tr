//'use no memo'
import { useState } from 'react'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFnOption,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type GroupingState,
  type PaginationState,
  type TableOptions,
  type TableState,
  useReactTable,
} from '@tanstack/react-table'
import checkboxColumn from '@/@core/components/react-table/checkbox-column'
import { matchWord } from '@/utils/SearchFn'

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
    pageSize = 15,
    ...restOptions
  } = options
  const [columnVisibility, setColumnVisibility] = useState({})
  const [grouping, setGrouping] = useState<GroupingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [columnPinning, setColumnPinning] = useState({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize || Number(localStorage.getItem('PageSize')) || 15,
  })

  const table = useReactTable({
    data,
    //@ts-ignore
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
    onPaginationChange: setPagination,
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
    debugTable,
    debugHeaders,
    debugColumns,
    ...restOptions,
  })

  const totalCount = table.getFilteredRowModel().rows.length
  const selectedFlatRows = table.getSelectedRowModel().flatRows

  // Optional: Add any table-specific effects here
  /* useEffect(() => {
    if (table.getState().columnFilters[0]?.id === "fullName") {
      if (table.getState().sorting[0]?.id !== "fullName") {
        table.setSorting([{ id: "fullName", desc: false }]);
      }
    }
  }, [table.getState().columnFilters[0]?.id]); */

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
