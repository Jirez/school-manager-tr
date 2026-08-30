import ReactPaginate from 'react-paginate'
import { Input } from 'reactstrap'
import { Base64 } from 'js-base64'
import { useTable } from '@/context/table.context'

interface Props {
  totalCount: number
  onPaginate: (first: number, after: string | null) => void
}

const ServerPagination: React.FC<Props> = ({ totalCount, onPaginate }) => {
  // const [pageSize, setPageSize] = useState<number>(Number(Cookies.get('pageSize')) || 10)
  // const [pageIndex, setPageIndex] = useState(0)
  const { pageIndex, pageSize, setPageIndex, setPageSize } = useTable()

  // @ts-ignore desc
  const ReactPaginateComponent = (ReactPaginate as any).default || ReactPaginate

  return (
    <>
      {totalCount > 0 && (
        <div className="flex justify-between">
          <div className="mb-1 mt-1">
            {/* <Label>#</Label>*/}
            <Input
              type="select"
              value={pageSize}
              onChange={(e) => {
                // const cursor = Base64.encode('simple-cursor' + ((pageIndex * Number(e.target.value)) - 1))
                setPageIndex(0)
                localStorage.setItem('PageSize', e.target.value)
                setPageSize(Number(e.target.value))
                onPaginate(Number(e.target.value), null)
              }}
              // bsSize="sm"
              className="h-10"
            >
              {[5, 10, 15, 20, 30, 40, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  # {pageSize}
                </option>
              ))}
            </Input>
          </div>

          <ReactPaginateComponent
            previousLabel={'<<'}
            nextLabel={'>>'}
            pageCount={Math.ceil(totalCount / pageSize)}
            // pageCount={table.getPageCount()}
            activeClassName="active"
            // forcePage={table.getState().pagination.pageIndex}
            // initialPage={state.pageIndex}
            forcePage={pageIndex}
            onPageChange={(page: { selected: number }) => {
              const cursor = Base64.encode(
                'simple-cursor' + (page.selected * pageSize - 1),
              )
              setPageIndex(page.selected)
              onPaginate(pageSize, cursor)
            }}
            pageClassName={'page-item'}
            nextLinkClassName={'page-link'}
            nextClassName={'page-item next'}
            previousClassName={'page-item prev'}
            previousLinkClassName={'page-link'}
            pageLinkClassName={'page-link'}
            containerClassName={
              'pagination react-paginate justify-content-end my-2 pe-1'
            }
          />
        </div>
      )}
    </>
  )
}

export default ServerPagination
