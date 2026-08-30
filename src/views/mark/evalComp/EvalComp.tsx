import { useEffect } from 'react'
import { useSafeState as useState, useTitle } from 'ahooks'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'
import { messageService } from '@/utils/message.service'
import LoadingSpinner from '@/@core/components/spinner/Loading-spinner'
import LiveView from '@/utils/LiveView'
import Select from '@/@core/components/select'
import { classOptions, subPeriodOptions } from '@/utils/select/selectComponents'
import PageHeader from '@/@core/components/ui/page-header'
import {
  ClassCreatedDocument,
  PeriodCreatedDocument,
  useClassesForNoteQuery,
  useEvalCompOfClassQuery,
  usePeriodsQuery,
} from '@/gql/graphql'
import EvalCompAdd from './EvalCompAdd'

const EvalComp = () => {
  const { t } = useTranslation()
  useTitle(t('sidebar.marks.evaluatedCompetences'))
  const { enterpriseId } = useAuthentication()

  const [clazz, setClazz] = useState<{ [key: string]: any } | null>(null)
  const [period, setPeriod] = useState<{ [key: string]: any } | null>(null)

  const { data, loading, subscribeToMore } = useClassesForNoteQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const {
    data: dataPeriod,
    loading: loadingPeriod,
    subscribeToMore: subscribeToMorePeriod,
  } = usePeriodsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const { data: dataCompetence, loading: loadingCompetence } =
    useEvalCompOfClassQuery({
      variables: {
        classId: clazz ? Number(clazz.id) : -1,
        periodId: period ? Number(period.id) : -1,
      },
      skip: !clazz || !period,
      fetchPolicy: 'network-only',
    })

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'expectedCompetence') {
          setPeriod(null)
          setClazz(null)
        }
      }
    })
  }, [messageService])

  return (
    <div className="flex flex-col w-full px-1 md:!px-0">
      <div>
        <div className="w-full">
          <div id="displayStudentName"> </div>
          <PageHeader title={t('sidebar.marks.expectedCompetences')} />
        </div>

        <div className="flex flex-col md:flex-row gap-1">
          <div className="w-full md:w-4/12 lg:w-3/12">
            <LiveView
              document={ClassCreatedDocument}
              singleVar="clazz"
              data={data}
              listVar="clazzes"
              subscribeToMore={subscribeToMore}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
              loading={loading}
            >
              {({ clazzes }) => (
                <Select
                  onChange={(val) => {
                    setClazz(val)
                  }}
                  options={clazzes?.filter((c: any) => c.competenceClass) || []}
                  getOptionLabel={({ name }) => name}
                  getOptionValue={({ id }) => id}
                  value={clazz}
                  components={{ Option: classOptions }}
                  //formId="clazz"
                  placeholder="Sélectionnez une classe"
                />
              )}
            </LiveView>
          </div>

          <div className="w-full md:w-4/12 lg:w-3/12">
            <LiveView
              document={PeriodCreatedDocument}
              singleVar="period"
              data={dataPeriod}
              listVar="periods"
              subscribeToMore={subscribeToMorePeriod}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
              loading={loadingPeriod}
            >
              {({ periods }) => (
                <Select
                  onChange={(val) => setPeriod(val)}
                  options={periods || undefined}
                  getOptionLabel={(option: any) => option.label}
                  getOptionValue={(option: any) => option.id}
                  value={period}
                  components={{ Option: subPeriodOptions }}
                  placeholder="Sélectionnez un trimestre"
                />
              )}
            </LiveView>
          </div>
        </div>
      </div>

      {clazz && period && (
        <div className="w-full">
          {loadingCompetence ? (
            <LoadingSpinner />
          ) : (
            <div className="card" style={{ marginTop: 20 }}>
              <EvalCompAdd
                competences={dataCompetence?.competences}
                classId={clazz.id}
                period={period.id}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default EvalComp
