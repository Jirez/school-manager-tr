import React from 'react'
import type { GlobalFilterApi } from '@/@core/components/base-table/base-react-table'
import type {
  SortingState,
  PaginationState,
  FilterFnOption,
  RowSelectionState,
  OnChangeFn,
  ColumnDef,
  VisibilityState,
} from '@tanstack/react-table'
import {
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useKeyPress, useMount, useUpdateEffect } from 'ahooks'
import { useTranslation } from 'react-i18next'
// import { useHotkeys } from 'react-hotkeys-hook'
import TablePagination from './table-pagination'

import QuickFilter from '@/@core/components/base-table/quick-filter'
import { matchWord } from '@/utils/SearchFn'
import Button from '@/@core/components/button'
import { useTable } from '@/context/table.context'
import Loader from '@/@core/components/spinner/loader'
import dayjs from 'dayjs'
import IndeterminateCheckbox from './indeterminate-checkbox'
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  Plus,
} from 'lucide-react'
import styled from 'styled-components'

const StyledTableContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow:
    0 4px 20px -5px rgba(0, 0, 0, 0.05),
    0 8px 32px -8px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  width: 100%;
  margin-bottom: 2rem;

  .dark-layout & {
    background: #1e253b;
    border-color: rgba(255, 255, 255, 0.05);
    box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.24);
  }
`

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  thead {
    background: #f8fafc;

    .dark-layout & {
      background: rgba(255, 255, 255, 0.02);
    }

    th {
      padding: 8px 12px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      text-align: left;
      transition: all 0.2s ease;

      .dark-layout & {
        color: #94a3b8;
        border-color: rgba(255, 255, 255, 0.05);
      }
    }
  }

  tbody {
    tr {
      transition: all 0.2s ease;

      &:hover {
        background: #f1f5f9;

        .dark-layout & {
          background: rgba(255, 255, 255, 0.03);
        }
      }

      &.focused {
        background: rgba(47, 135, 36, 0.08) !important;
        box-shadow: inset 3px 0 0 #2f8724;

        .dark-layout & {
          background: rgba(47, 135, 36, 0.15) !important;
        }
      }

      &:not(:last-child) {
        td {
          border-bottom: 1px solid rgba(0, 0, 0, 0.03);

          .dark-layout & {
            border-color: rgba(255, 255, 255, 0.03);
          }
        }
      }

      td {
        padding: 6px 12px;
        font-size: 0.8125rem;
        color: #334155;
        vertical-align: middle;

        .dark-layout & {
          color: #cbd5e1;
        }
      }
    }
  }
`

export interface TableProps {
  columns: any[] // ColumnDef<typeof table.generics>[]
  data: any[]
  onGlobalFilterChanged?: (filterApi: GlobalFilterApi) => void
  onModelUpdate?: (rows: any[], preGlobalFilteredRows: any[]) => void
  showCheckbox?: boolean
  hiddenColumns?: VisibilityState
  showQuickFilter?: boolean
  showAddButton?: boolean
  onAddButtonClick?: () => void
  globalFilterFn?: FilterFnOption<any, any>
  modal?: NiceModalHandler
  onRowClicked?: (rowData: any) => void
  onRowSelected?: (data: any[]) => void // when checkbox are selected
  pageSize?: number
  serverOperations?: boolean
  rowSelection?: RowSelectionState
  setRowSelection?: OnChangeFn<RowSelectionState>
  loading?: boolean
  initialFilter?: string
}

const CommonTable: React.FC<TableProps> = ({
  data,
  columns,
  showCheckbox = true,
  onGlobalFilterChanged,
  onModelUpdate,
  hiddenColumns = { searchText: false },
  showQuickFilter = false,
  showAddButton,
  onAddButtonClick,
  globalFilterFn = matchWord,
  modal,
  onRowClicked,
  onRowSelected,
  pageSize = 15,
  serverOperations = false,
  rowSelection,
  setRowSelection,
  loading = false,
  initialFilter,
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const { setSorting: dispatchSorting, setSelectedRow } = useTable()
  const [globalFilter, setGlobalFilter] = React.useState(initialFilter || '')
  const [rowSelection1, setRowSelection1] = React.useState<RowSelectionState>(
    {},
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(hiddenColumns)
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize || Number(localStorage.getItem('PageSize')) || 15,
  })
  const [mountTime, setMountTime] = React.useState<Date>(new Date())
  const [focusedRowIndex, setFocusedRowIndex] = React.useState<number>(-1)
  const tableContainerRef = React.useRef<HTMLDivElement>(null)

  const scrollToSelected = (index: number) => {
    if (!tableContainerRef.current) return

    // Small delay to ensure the DOM has updated with the 'focused' class if we scroll based on that,
    // though here we use the data-row-index attribute.
    setTimeout(() => {
      const selectedItem = tableContainerRef.current?.querySelector(
        `[data-row-index="${index}"]`,
      ) as HTMLElement

      if (selectedItem) {
        selectedItem.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      }
    }, 0)
  }

  const checkboxColumn: ColumnDef<any, any> = {
    id: 'selection',
    header: ({ table }) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllPageRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllPageRowsSelectedHandler(),
          id: 'selection',
        }}
      />
    ),
    footer: ({ table }) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllPageRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllPageRowsSelectedHandler(),
          id: 'selection',
        }}
      />
    ),
    cell: ({ row }) => (
      <div className="">
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
            id: row.id,
          }}
        />
      </div>
    ),
    enableHiding: false,
  }

  const table = useReactTable({
    data,
    columns: showCheckbox ? [checkboxColumn, ...columns] : columns,
    state: {
      sorting,
      globalFilter,
      pagination,
      rowSelection: serverOperations ? rowSelection : rowSelection1,
      columnVisibility,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: serverOperations ? setRowSelection : setRowSelection1,
    onColumnVisibilityChange: setColumnVisibility,
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    //
    manualSorting: serverOperations,
    manualPagination: serverOperations,
    manualFiltering: serverOperations,
    enableMultiSort: true,
  })

  useMount(() => {
    setSelectedRow([])
    dispatchSorting([])
  })

  const rows = table.getPrePaginationRowModel().rows

  useUpdateEffect(() => {
    onModelUpdate?.(rows, [])
  }, [rows, onModelUpdate])

  React.useEffect(() => {
    onGlobalFilterChanged?.({
      globalFilter,
      setGlobalFilter,
    })
  }, [globalFilter, setGlobalFilter, onGlobalFilterChanged])

  const selectedFlatRows = table.getSelectedRowModel().flatRows
  React.useEffect(() => {
    onRowSelected?.(selectedFlatRows)
  }, [selectedFlatRows, onRowSelected])

  useUpdateEffect(() => {
    if (serverOperations) {
      dispatchSorting(sorting)
    }
  }, [sorting])

  useUpdateEffect(() => {
    setSelectedRow(selectedFlatRows)
  }, [rowSelection])

  const paginatedRows = table.getRowModel().rows

  // Keyboard navigation
  useKeyPress(
    'arrowdown',
    (e) => {
      e.preventDefault()
      setFocusedRowIndex((prev) => {
        const next = prev < paginatedRows.length - 1 ? prev + 1 : prev
        if (next !== prev) scrollToSelected(next)
        return next
      })
    },
    // { enableOnFormTags: true, enabled: paginatedRows.length > 0 },
    // [paginatedRows],
  )

  useKeyPress(
    'arrowup',
    (e) => {
      e.preventDefault()
      setFocusedRowIndex((prev) => {
        const next = prev > 0 ? prev - 1 : 0
        if (next !== prev) scrollToSelected(next)
        return next
      })
    },
    // { enableOnFormTags: true, enabled: paginatedRows.length > 0 },
    // [paginatedRows],
  )

  useKeyPress(
    'enter',
    (e) => {
      if (focusedRowIndex !== -1 && paginatedRows[focusedRowIndex]) {
        e.preventDefault()
        onRowClicked?.(paginatedRows[focusedRowIndex].original)
      }
    },
    // { enableOnFormTags: true, enabled: focusedRowIndex !== -1 },
    // [focusedRowIndex, paginatedRows, onRowClicked],
  )

  // Reset focus when data or filter changes
  React.useEffect(() => {
    setFocusedRowIndex(-1)
  }, [globalFilter, pagination.pageIndex, data])

  const onQuickFilterEnter = () => {
    const lifeTime = dayjs(new Date()).diff(mountTime)
    if (focusedRowIndex !== -1 && paginatedRows[focusedRowIndex]) {
      // onRowClicked?.(paginatedRows[focusedRowIndex].original);
    } else if (paginatedRows.length === 1 || lifeTime > 200) {
      if (paginatedRows.length > 0) {
        onRowClicked?.(paginatedRows[0].original)
      }
    }
  }

  return (
    <>
      {/* <div className="inline-block border border-black shadow rounded">
                <div className="px-1 border-b border-black">
                    <label>
                        <input
                            {...{
                                type: 'checkbox',
                                checked: instance.getIsAllColumnsVisible(),
                                onChange: instance.getToggleAllColumnsVisibilityHandler(),
                                //onChange: instance.getT(),
                                className: "form-check-input"
                            }}
                        />{' '}
                        Toggle All
                    </label>
                </div>
                {instance.getAllLeafColumns()
                    //.filter(column => column.getCanHide())
                    .filter(column => !(column.id === "searchText"))
                    .map(column => {
                        return (
                            <div key={column.id} className="px-1">
                                <label>
                                    <input
                                        {...{
                                            type: 'checkbox',
                                            checked: column.getIsVisible(),
                                            onChange: column.getToggleVisibilityHandler(),
                                            className: "form-check-input"
                                        }}
                                    />{' '}
                                    {column.columnDef.id}
                                </label>
                            </div>
                        )
                    })}
            </div> */}

      {showQuickFilter && (
        <div className="mb-1">
          <QuickFilter
            globalFilter={globalFilter}
            // preGlobalFilteredRows={preGlobalFilteredRows}
            setGlobalFilter={setGlobalFilter}
            // setDefaultGlobalFilter={setDefaultFilter}
            showAddButton={showAddButton}
            onAddButtonClick={onAddButtonClick}
            autoFocus
            onEnter={onQuickFilterEnter}
          />
        </div>
      )}
      <StyledTableContainer ref={tableContainerRef}>
        {table.getRowModel().rows.length > 0 ? (
          <div className="overflow-x-auto">
            <StyledTable>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const meta = header.column.columnDef.meta as any
                      const alignClass =
                        meta?.align === 'right'
                          ? 'justify-end text-right'
                          : meta?.align === 'center'
                            ? 'justify-center text-center'
                            : 'justify-start text-left'
                      const isSorted = header.column.getIsSorted()
                      return (
                        <th
                          key={header.id}
                          colSpan={header.colSpan}
                          className={
                            meta?.align === 'right' ? 'text-right' : ''
                          }
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              {...{
                                className: `${
                                  header.column.getCanSort()
                                    ? 'cursor-pointer select-none flex items-center gap-2 group'
                                    : 'flex items-center gap-2'
                                } ${alignClass}`,
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
                            >
                              <span
                                className={
                                  meta?.align === 'right' ? '' : 'flex-1'
                                }
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                              </span>
                              {header.column.getCanSort() && (
                                <div
                                  className={`
                                  transition-all duration-200
                                  ${
                                    isSorted
                                      ? 'text-[#2f8724] opacity-100'
                                      : 'text-gray-400 opacity-0 group-hover:opacity-100'
                                  }
                                `}
                                >
                                  {{
                                    asc: <ChevronUp size={14} />,
                                    desc: <ChevronDown size={14} />,
                                  }[isSorted as string] ?? (
                                    <ChevronsUpDown size={14} />
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </th>
                      )
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {paginatedRows.map((row, index) => {
                  return (
                    <tr
                      key={row.id}
                      onClick={() => onRowClicked?.(row.original)}
                      data-row-index={index}
                      className={`cursor-pointer ${
                        focusedRowIndex === index ? 'focused' : ''
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const meta = cell.column.columnDef.meta as any
                        const alignment =
                          meta?.align === 'right'
                            ? 'text-right'
                            : meta?.align === 'center'
                              ? 'text-center'
                              : 'text-left'
                        return (
                          <td key={cell.id} className={alignment}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </StyledTable>
          </div>
        ) : loading ? (
          <div className="py-20">
            <Loader />
          </div>
        ) : !globalFilter ? (
          <NoData createData={() => modal?.show()} />
        ) : (
          <div className="w-full py-20 flex justify-center items-center flex-col text-center">
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
              <Search size={40} className="text-gray-400" />
            </div>
            <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2">
              Aucun résultat
            </h4>
            <p className="text-gray-500 max-w-xs">
              Votre recherche "<strong>{globalFilter}</strong>" n'a donné aucun
              résultat. Essayez avec d'autres mots-clés.
            </p>
          </div>
        )}

        {!serverOperations && table.getRowModel().rows.length > 0 && (
          <TablePagination table={table} />
        )}
      </StyledTableContainer>
    </>
  )
}

const NoData = ({ createData }: any) => {
  const { t } = useTranslation()
  return (
    <div
      className="flex justify-center items-center flex-col py-12 px-4 text-center"
      style={{ minHeight: '350px' }}
    >
      <div className="bg-[#2f8724]/10 p-5 rounded-full mb-4">
        <Search size={40} className="text-[#2f8724] opacity-60" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
        {t('Aucune donnée trouvée')}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
        Votre table ne contient aucune donnée. Commencez à en ajouter dès
        maintenant pour voir vos informations s'afficher ici.
      </p>
      {createData && (
        <Button
          onClick={createData}
          className="primary flex items-center gap-2"
        >
          <Plus size={16} />
          {t('Ajouter votre premier élément')}
        </Button>
      )}
    </div>
  )
}

export default CommonTable
