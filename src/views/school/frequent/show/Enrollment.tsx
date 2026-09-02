import type { GlobalFilterApi } from '@/@core/components/base-table/base-react-table'
import QuickFilter from '@/@core/components/base-table/quick-filter'
import GraphQLError from '@/@core/components/errors/graphql-error'
import Loader from '@/@core/components/spinner/loader'
import { TabNav } from '@/@core/components/tabs'
import PageHeader from '@/@core/components/ui/page-header'
import { useStudentsByIdQuery } from '@/gql/graphql'
import { useEffect, useState } from 'react'
import { TabPane } from 'reactstrap'
import EnrollmentHistory from '../EnrollmentHistory'
import StudentFamily from './StudentFamily'

const ProductView = ({ id }: { id: string }) => {
  // const { id } = useParams()
  const [filterApi, setFilterApi] = useState<GlobalFilterApi>()
  const [filterApi1, setFilterApi1] = useState<GlobalFilterApi>()
  const [filterApi2, setFilterApi2] = useState<GlobalFilterApi>()
  const [filterApi3, setFilterApi3] = useState<GlobalFilterApi>()
  const [tabIndex, setTabIndex] = useState(1)
  const [globalFilter, setGlobalFilter] = useState(filterApi?.globalFilter)

  const { data, error, loading } = useStudentsByIdQuery({
    variables: { id },
  })

  const showQuickFilter = () => {
    switch (tabIndex) {
      case 2:
        return (
          <QuickFilter
            globalFilter={globalFilter}
            setGlobalFilter={filterApi1?.setGlobalFilter}
          />
        )
      default:
        return (
          <QuickFilter
            globalFilter={globalFilter}
            setGlobalFilter={filterApi?.setGlobalFilter}
          />
        )
    }
  }

  useEffect(() => {
    switch (tabIndex) {
      case 2:
        setGlobalFilter(filterApi1?.globalFilter)
        break
      case 3:
        setGlobalFilter(filterApi2?.globalFilter)
        break
      default:
        setGlobalFilter(filterApi?.globalFilter)
    }
  }, [tabIndex])

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <GraphQLError error={error} />
  }

  const { student } = data!!

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader
          title={`${student?.registrationNumber} - ${student?.lastName} ${
            student?.firstName ?? ''
          }`}
          actions={showQuickFilter()}
        />
      </div>
      <TabNav
        items={[
          {
            id: '1',
            label: 'label-enrollmentHistory',
            onClick: () => {
              setTabIndex(1)
            },
          },
          {
            id: '2',
            label: 'label-family',
            onClick: () => {
              setTabIndex(2)
            },
          },
          {
            id: '3',
            label: 'label-payments',
            onClick: () => {
              setTabIndex(3)
            },
          },
          {
            id: '4',
            label: 'label-results',
            onClick: () => {
              setTabIndex(4)
            },
          },
        ]}
      >
        <TabPane tabId="1">
          <EnrollmentHistory id={id} onGlobalFilterChanged={setFilterApi} />
        </TabPane>

        <TabPane tabId="2">
          <StudentFamily id={id} onGlobalFilterChanged={setFilterApi} />
        </TabPane>

        <TabPane tabId="3"></TabPane>

        <TabPane tabId="4"></TabPane>
      </TabNav>
    </div>
  )
}

export default ProductView
