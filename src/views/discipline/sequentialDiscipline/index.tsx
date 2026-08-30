import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSafeState as useState, useTitle } from 'ahooks'
import { useAuthentication } from '@/hooks/useAuthentication'
import { messageService } from '@/utils/message.service'
import LoadingSpinner from '@/@core/components/spinner/Loading-spinner'
import PageHeader from '@/@core/components/ui/page-header'
import LiveView from '@/utils/LiveView'
import { classOptions, subPeriodOptions } from '@/utils/select/selectComponents'
import SequentialDisciplineAdd from '@/views/discipline/sequentialDiscipline/SequentialDisciplineAdd'
import { selectThemeColors } from '@/utils/Utils'
import ErrorComponent from '@/@core/components/ui/error-component'
import Select from '@/@core/components/select'
import {
  ClassCreatedDocument,
  SubPeriodCreatedDocument,
  useClassesQuery,
  useSequentialDisciplineQuery,
  useSubPeriodsQuery,
} from '@/gql/graphql'

const SequentialDisciplines = () => {
  const { t } = useTranslation()
  useTitle(t('sidebar.discipline'))
  const [clazz, setClazz] = useState<{ [key: string]: any } | null>(null)
  const [subPeriod, setSubPeriod] = useState<{ [key: string]: any } | null>(
    null,
  )
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useClassesQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataSubPeriod,
    loading: loadingSubPeriod,
    subscribeToMore: subscribeToMoreSubPeriod,
  } = useSubPeriodsQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataDiscipline,
    loading: loadingDiscipline,
    error,
  } = useSequentialDisciplineQuery({
    variables: {
      classId: clazz ? Number(clazz.id) : -1,
      subPeriodId: subPeriod ? Number(subPeriod.id) : -1,
    },
    skip: !clazz || !subPeriod,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'sequentialDiscipline') {
          setClazz(null)
          setSubPeriod(null)
        }
      }
    })
  }, [messageService])

  return (
    <div className="flex flex-col w-full px-1 md:!px-0">
      <div>
        <div className="w-full">
          <div id="displayStudentName"> </div>
          <PageHeader title={t('sidebar.discipline')} />
        </div>

        <div className="w-full">
          <div className="row">
            <div className="w-full md:w-4/12 lg:w-3/12">
              <LiveView
                document={ClassCreatedDocument}
                singleVar="clazz"
                data={data}
                loading={loading}
                listVar="clazzes"
                subscribeToMore={subscribeToMore}
                sortField="name"
                triggerUpdate={true}
                enterpriseId={enterpriseId}
              >
                {({ clazzes }) => (
                  <Select
                    theme={selectThemeColors}
                    onChange={(val) => setClazz(val)}
                    options={clazzes || undefined}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    value={clazz}
                    components={{ Option: classOptions }}
                    placeholder="Sélectionnez une classe"
                    className="react-select"
                    classNamePrefix="select"
                  />
                )}
              </LiveView>
            </div>

            <div className="w-full md:w-4/12 lg:w-3/12">
              <LiveView
                document={SubPeriodCreatedDocument}
                singleVar="subPeriod"
                data={dataSubPeriod}
                listVar="subPeriods"
                subscribeToMore={subscribeToMoreSubPeriod}
                sortField="name"
                triggerUpdate={true}
                enterpriseId={enterpriseId}
                loading={loadingSubPeriod}
              >
                {({ subPeriods }) => (
                  <Select
                    theme={selectThemeColors}
                    onChange={(val) => setSubPeriod(val)}
                    options={subPeriods || undefined}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.id}
                    value={subPeriod}
                    components={{
                      Option: subPeriodOptions,
                    }}
                    placeholder="Sélectionnez une séquence"
                    className="react-select"
                    classNamePrefix="select"
                    isClearable
                  />
                )}
              </LiveView>
            </div>
          </div>
        </div>

        {!error ? (
          clazz &&
          subPeriod && (
            <div className="w-full mt-2">
              {loadingDiscipline ? (
                <LoadingSpinner />
              ) : (
                <SequentialDisciplineAdd
                  sequentialDisciplines={dataDiscipline?.sequentialDisciplines}
                  classId={clazz.id}
                  subPeriodId={subPeriod.id}
                />
              )}
            </div>
          )
        ) : (
          <div className="w-full mt-4 flex justify-center items-end">
            <ErrorComponent
              message={error.message}
              title={'Licence invalide'}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default SequentialDisciplines
