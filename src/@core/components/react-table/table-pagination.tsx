import ReactPaginate from 'react-paginate'
import type { ReactTable, RowData } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import styled from 'styled-components'

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.05);

  .dark-layout & {
    background: #1e253b;
    border-color: rgba(255, 255, 255, 0.05);
  }

  .react-paginate {
    display: flex;
    gap: 4px;

    .page-item {
      .page-link {
        border-radius: 6px;
        min-width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8125rem;
        border: 1px solid transparent;
        transition: all 0.2s;
        background: transparent;
        color: #64748b;
        padding: 0 6px;

        &:hover {
          background: #f1f5f9;
          color: #7367f0;
        }

        .dark-layout & {
          color: #94a3b8;
          &:hover {
            background: rgba(255, 255, 255, 0.05);
          }
        }
      }

      &.active .page-link {
        background: #7367f0;
        color: white;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(115, 103, 240, 0.25);
      }

      &.disabled .page-link {
        opacity: 0.4;
        cursor: not-allowed;
      }

      &.next,
      &.prev {
        .page-link {
          background: #f1f5f9;
          .dark-layout & {
            background: rgba(255, 255, 255, 0.05);
          }
        }
      }
    }
  }
`

const PageSizeSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  color: #64748b;

  .dark-layout & {
    color: #94a3b8;
  }

  select {
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 4px 24px 4px 8px;
    background-color: white;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 4px center;
    background-size: 14px;
    appearance: none;
    outline: none;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
    font-size: 0.75rem;

    &:hover {
      border-color: #cbd5e1;
    }

    .dark-layout & {
      background-color: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
      color: #cbd5e1;
    }
  }
`

interface TablePaginationProps<T extends RowData> {
  table: ReactTable<any, T>
}

export function TablePagination<T extends RowData>({
  table,
}: TablePaginationProps<T>) {
  const { t } = useTranslation()

  // @ts-ignore desc
  const ReactPaginateComponent = (ReactPaginate as any).default || ReactPaginate

  return (
    <PaginationWrapper>
      <PageSizeSelector>
        <span className="hidden sm:inline">{t('Afficher')}</span>
        <select
          value={table.state.pagination.pageSize}
          onChange={(e) => {
            const size = Number(e.target.value)
            localStorage.setItem('PageSize', String(size))
            table.setPageSize(size)
          }}
        >
          {[5, 10, 15, 20, 30, 40, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
        <span className="hidden sm:inline">{t('éléments')}</span>
        <span className="text-xs opacity-60">
          ({t('sur')} {table.getFilteredRowModel().rows.length})
        </span>
      </PageSizeSelector>

      <ReactPaginateComponent
        previousLabel={<ArrowLeft size={16} />}
        nextLabel={<ArrowRight size={16} />}
        pageCount={table.getPageCount()}
        activeClassName="active"
        forcePage={table.state.pagination.pageIndex}
        onPageChange={(page: { selected: number }) => {
          table.setPageIndex(page.selected)
        }}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        containerClassName={'pagination react-paginate mb-0'}
      />
    </PaginationWrapper>
  )
}

export default TablePagination
