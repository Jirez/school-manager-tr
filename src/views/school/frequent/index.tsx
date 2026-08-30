import { useApolloClient } from '@apollo/client'
import { CardBody, CardTitle } from 'reactstrap'
import { useModal } from '@ebay/nice-modal-react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

import { SplitButton } from '@/@core/components/ui/buttons/split-button'
import { FileSpreadsheet, FileInput, ListOrdered } from 'lucide-react'

import { useAuthentication } from '@/hooks/useAuthentication'
import Toolbar from '@/@core/components/base-table/toolbar'
import Navs from '@/@core/components/navs/navs'
import { StudentsLinks } from '@/navigation/links'
import FrequentModal from './FrequentModal'
import ImportStudentModal from './ImportStudentModal'
import {
  FrequentSchoolNumberOrderDocument,
  useClassesQuery,
  useFrequentBySchoolQuery,
} from '@/gql/graphql'
import { TOAST_OPTIONS } from '@/utils/constants'
import { useAbility } from '@/context/Can'
import { useLocalStorageState, useMount, useTitle } from 'ahooks'
import { useTableColumns } from './frequentModel'
import { useTable } from '@/@core/components/react-table/useTable'
import CustomTable from '@/@core/components/react-table/custom-table'
import FrequentsDelete from './FrequentsDelete'
import { useCallback, useState } from 'react'
import Select from '@/@core/components/select'
import StudentImportProcessModal from './StudentImportProcessModal'

const Frequents = () => {
  const { enterpriseId } = useAuthentication()
  const modal = useModal(FrequentModal)
  const importModal = useModal(ImportStudentModal)
  const importProcessModal = useModal(StudentImportProcessModal)
  const { t } = useTranslation()
  const client = useApolloClient()
  const ability = useAbility()
  const [schoolFeeCompulsory] = useLocalStorageState<boolean>(
    'schoolFeeCompulsory',
    {
      defaultValue: false,
    },
  )
  const [isMount, setIsMount] = useState(false)

  useTitle(t('sidebar.students.frequents'))

  const { data, error, loading, refetch } = useFrequentBySchoolQuery({
    variables: {
      id: enterpriseId,
    },
    // fetchPolicy: 'network-only',
  })

  const { data: classesData, loading: loadingClasses } = useClassesQuery({
    variables: {
      id: enterpriseId,
    },
    // fetchPolicy: 'network-only',
  })

  const { columns } = useTableColumns(modal, refetch)

  const {
    table,
    globalFilter,
    setGlobalFilter,
    totalCount,
    setRowSelection,
    selectedFlatRows,
  } = useTable<any>({
    data: data?.frequents || [],
    columns,
    initialState: {
      columnVisibility: {
        classId: false,
        totalRequiredAmount: schoolFeeCompulsory,
        totalPaidAmount: schoolFeeCompulsory,
        balance: schoolFeeCompulsory,
        lastPaymentDate: schoolFeeCompulsory,
        socialCase: !schoolFeeCompulsory,
      },
    },
  })

  useMount(() => {
    setIsMount(true)
  })

  if (error) {
    return <div>Error! {error.message}</div>
  }

  const schoolNumberOrders = async () => {
    toast.info('Opération en cours, veuillez patienter...')

    await client.query({
      query: FrequentSchoolNumberOrderDocument,
      variables: { id: enterpriseId },
      fetchPolicy: 'no-cache',
    })

    toast.success('Attribution des numéros terminée', { ...TOAST_OPTIONS })
  }

  const extraButton = () =>
    ability.can('write', 'student') && (
      <SplitButton
        primaryAction={{
          label: t('action.new_inscription'),
          onClick: () => modal.show({ refetch }),
        }}
        dropdownActions={[
          {
            label: t('label-addFromFile'),
            onClick: () => importModal.show({ refetch }),
            icon: <FileSpreadsheet size={16} />,
          },
          {
            label: t('label-addFromFileInteractive'),
            onClick: () => importProcessModal.show({ refetch }),
            icon: <FileInput size={16} />,
          },
          {
            label: t('label-reassignNumberOrders'),
            onClick: schoolNumberOrders,
            icon: <ListOrdered size={16} />,
          },
        ]}
      />
    )

  const onClassFilterChange = useCallback(
    (values: any) => {
      if (!values || values.length === 0) {
        table.setColumnFilters([])
        return
      }
      const filters = values.map((item: any) => item.id)
      table.setColumnFilters([
        {
          id: 'classId',
          value: filters,
        },
      ])
    },
    [table],
  )

  return (
    <div className="flex flex-col w-full">
      <Navs links={StudentsLinks} />
      <Toolbar
        title={t('sidebar.students.frequents')}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        actionLabel="action.new_inscription"
        onClick={() => modal.show({ refetch })}
        extraButton={extraButton()}
        refetch={refetch}
        totalCount={totalCount}
      />

      {/* Table here */}
      <div className="!text-[0.80rem]">
        <CardTitle className="p-1 mb-0 flex justify-between items-center">
          <div>
            {isMount && selectedFlatRows?.length > 0 && (
              <div className="">
                <FrequentsDelete
                  ids={selectedFlatRows.map(({ original }) => ({
                    studentId: Number(original.frequentPK.studentId),
                    classId: Number(original.frequentPK.classId),
                    schoolYearId: Number(original.frequentPK.schoolYearId),
                  }))}
                  count={selectedFlatRows?.length}
                  refetch={() => {
                    refetch()
                    setRowSelection({})
                  }}
                />
              </div>
            )}
          </div>
          <Select
            onChange={onClassFilterChange}
            options={classesData?.clazzes || undefined}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => String(option.id)}
            placeholder={t('label-selectClasses')}
            isClearable
            className="w-full md:w-4/12"
            isMulti
            isLoading={loadingClasses}
          />
        </CardTitle>
        <CardBody className="!p-0 mt-0">
          {isMount && (
            <CustomTable modal={modal} table={table} loading={loading} />
          )}
        </CardBody>
      </div>
    </div>
  )
}

export default Frequents
