import type { GlobalFilterApi } from '@/@core/components/base-table/base-react-table'
import QuickFilter from '@/@core/components/base-table/quick-filter'
import Loader from '@/@core/components/spinner/loader'
import ErrorComponent from '@/@core/components/ui/error-component'
import type { HeaderGroup, Row, RowData, Table } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import React from 'react'
import { Table as BootstrapTable } from 'reactstrap'
import Button from '@/@core/components/button'
import illustration from '@/assets/images/illustration/email.svg'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import TablePagination from './table-pagination'
import { ChevronUp, ChevronDown, Plus, Search } from 'lucide-react'

type TableGroup = 'center' | 'left' | 'right'

function getTableHeaderGroups<T extends RowData>(
  table: Table<T>,
  tg?: TableGroup,
): [HeaderGroup<T>[], HeaderGroup<T>[]] {
  if (tg === 'left') {
    return [table.getLeftHeaderGroups(), table.getLeftFooterGroups()]
  }

  if (tg === 'right') {
    return [table.getRightHeaderGroups(), table.getRightFooterGroups()]
  }

  if (tg === 'center') {
    return [table.getCenterHeaderGroups(), table.getCenterFooterGroups()]
  }

  return [table.getHeaderGroups(), table.getFooterGroups()]
}

function getRowGroup<T extends RowData>(row: Row<T>, tg?: TableGroup) {
  if (tg === 'left') return row.getLeftVisibleCells()
  if (tg === 'right') return row.getRightVisibleCells()
  if (tg === 'center') return row.getCenterVisibleCells()
  return row.getVisibleCells()
}

type Props<T extends RowData> = {
  table: Table<T>
  tableGroup?: TableGroup
  onRowClicked?: (row: T) => void
  loading?: boolean
  onGlobalFilterChanged?: (filterApi: GlobalFilterApi) => void
  showQuickFilter?: boolean
  showAddButton?: boolean
  onAddButtonClick?: () => void
  modal?: NiceModalHandler
  serverOperations?: boolean
}

export function CustomTable<T extends RowData>({
  table,
  tableGroup,
  onRowClicked,
  loading = false,
  onGlobalFilterChanged,
  showQuickFilter,
  showAddButton,
  onAddButtonClick,
  modal,
  serverOperations = false,
}: Props<T>) {
  const [headerGroups] = getTableHeaderGroups(table, tableGroup)
  const [globalFilter, setGlobalFilter] = React.useState('')
  const { t } = useTranslation()

  // Sort indicator component
  const SortIndicator = ({ direction }: { direction: string | false }) => {
    if (!direction) return null
    return (
      <span className="ml-1 inline-flex">
        {direction === 'asc' ? (
          <ChevronUp size={14} className="text-primary" />
        ) : (
          <ChevronDown size={14} className="text-primary" />
        )}
      </span>
    )
  }

  return (
    <div className="custom-table-wrapper mb-3">
      {/* Quick Filter */}
      {showQuickFilter && (
        <div className="mb-2">
          <QuickFilter
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            showAddButton={showAddButton}
            onAddButtonClick={onAddButtonClick}
            autoFocus
          />
        </div>
      )}

      {/* Table Container */}
      {table.getRowModel().rows.length > 0 ? (
        <div
          className="
            border border-gray-200 dark:!border-gray-700
            rounded-lg overflow-hidden
            bg-white dark:!bg-gray-800
            shadow-sm
          "
        >
          <div className="overflow-x-auto">
            <BootstrapTable
              className="
                mb-0
                custom-compact-table
              "
              responsive
            >
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="
                      bg-gray-50 dark:!bg-gray-800/80
                      border-b border-gray-200 dark:!border-gray-700
                    "
                  >
                    {headerGroup.headers.map((header) => {
                      const meta = header.column.columnDef.meta as any
                      const alignClass =
                        meta?.align === 'right'
                          ? 'justify-end text-right'
                          : meta?.align === 'center'
                            ? 'justify-center text-center'
                            : 'justify-start text-left'

                      return (
                        <th
                          key={header.id}
                          className={`
                            relative
                            px-3 py-2
                            text-xs font-semibold
                            text-gray-600 dark:!text-gray-300
                            uppercase tracking-wider
                            border-r border-gray-100 dark:!border-gray-700
                            last:border-r-0
                            whitespace-nowrap
                            ${
                              meta?.align === 'right'
                                ? 'text-right'
                                : 'text-left'
                            }
                          `}
                          style={{
                            width: header.getSize(),
                          }}
                          colSpan={header.colSpan}
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              className={`
                                flex items-center gap-1
                                ${alignClass}
                                ${
                                  header.column.getCanSort()
                                    ? 'cursor-pointer select-none hover:text-primary transition-colors'
                                    : ''
                                }
                              `}
                              onClick={header.column.getToggleSortingHandler()}
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
                              <SortIndicator
                                direction={header.column.getIsSorted()}
                              />
                            </div>
                          )}
                          {/* Column Resize Handle */}
                          <div
                            className="
                              absolute right-0 top-0
                              h-full w-1
                              bg-transparent hover:bg-primary/50
                              select-none touch-none
                              cursor-col-resize
                              transition-colors
                            "
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                          />
                        </th>
                      )
                    })}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`
                      transition-colors duration-150
                      cursor-pointer
                      ${
                        index % 2 === 0
                          ? 'bg-white dark:!bg-gray-800'
                          : 'bg-gray-500 dark:!bg-gray-800/50'
                      }
                      hover:bg-primary/50 dark:hover:!bg-primary/10
                    `}
                    onClick={() => onRowClicked?.(row.original)}
                  >
                    {getRowGroup(row, tableGroup).map((cell) => {
                      const meta = cell.column.columnDef.meta as any
                      const alignment =
                        meta?.align === 'right'
                          ? 'text-right'
                          : meta?.align === 'center'
                            ? 'text-center'
                            : 'text-left'

                      return (
                        <td
                          key={cell.id}
                          className={`
                            px-3 py-1.5
                            text-sm text-gray-700 dark:!text-gray-300
                            align-middle
                            whitespace-nowrap
                            font-medium
                            ${alignment}
                          `}
                          style={{
                            width: cell.column.getSize(),
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </BootstrapTable>
          </div>

          {/* Pagination Footer */}
          {!serverOperations && <TablePagination table={table} />}
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader />
        </div>
      ) : !globalFilter ? (
        <NoData createData={() => modal?.show()} />
      ) : (
        <div className="w-full py-8 flex justify-center items-center">
          <div className="text-center">
            <div
              className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
              style={{
                background:
                  'linear-gradient(135deg, #ea545522 0%, #ea545511 100%)',
              }}
            >
              <Search size={20} className="text-red-400" />
            </div>
            <ErrorComponent
              message={'Votre recherche a été infructueuse.'}
              title={'Aucune donnée trouvée'}
            />
          </div>
        </div>
      )}

      <style>{`
        .custom-compact-table th,
        .custom-compact-table td {
          padding: 0.5rem 0.75rem !important;
          font-size: 0.8125rem !important;
          vertical-align: middle !important;
        }
        .custom-compact-table thead th {
          padding: 0.625rem 0.75rem !important;
          font-size: 0.6875rem !important;
        }
        .dark-layout .custom-compact-table {
          background-color: transparent !important;
        }
        .dark-layout .custom-compact-table th,
        .dark-layout .custom-compact-table td {
          border-color: #374151 !important;
        }
      `}</style>
    </div>
  )
}

const NoData = ({ createData }: any) => {
  const { t } = useTranslation()
  return (
    <div
      className="
      flex justify-center items-center flex-col
      py-10
      bg-white dark:!bg-gray-800
      border border-gray-200 dark:!border-gray-700
      rounded-lg
    "
    >
      <div className="mb-2 opacity-80">
        <img
          src={illustration}
          alt="No data"
          className="w-full h-full object-contain"
        />
      </div>

      <h4 className="text-base font-semibold text-gray-700 dark:!text-gray-200 mb-1">
        {t('table.noDataFound')}
      </h4>
      <p className="text-sm text-gray-500 dark:!text-gray-400 text-center mb-4 max-w-xs">
        {t('table.noDataFoundDescription')}
      </p>

      <Button
        onClick={createData}
        className="
        flex items-center gap-1.5
        px-4 py-1
        text-sm font-medium
        text-white
        rounded-lg
        transition-all duration-200
        hover:shadow-md
      "
        style={{
          background: 'linear-gradient(135deg, #7367f0 0%, #9e95f5 100%)',
        }}
      >
        <Plus size={16} />
        Ajouter votre premier élément
      </Button>
    </div>
  )
}

export default CustomTable
