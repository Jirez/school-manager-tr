import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Select from '@/@core/components/select'

import { useAuthentication } from '@/hooks/useAuthentication'
import { messageService } from '@/utils/message.service'
import PageHeader from '@/@core/components/ui/page-header'
import LiveView from '@/utils/LiveView'
import { classOptions, periodOptions } from '@/utils/select/selectComponents'
import QuarterlyObservationAdd from './QuarterlyObservationAdd'
import LoadingSpinner from '@/@core/components/spinner/Loading-spinner'
import {
  ClassCreatedDocument,
  PeriodCreatedDocument,
  useClassesForNoteQuery,
  usePeriodsQuery,
  useQuarterlyReportObservationsQuery,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'

const QuarterlyReportObservation = () => {
  const { t } = useTranslation()
  useTitle(t('sidebar.marks.quarterlyReportObservation'))
  const { enterpriseId } = useAuthentication()
  const [clazz, setClazz] = useState<{ [key: string]: any } | null>()
  const [period, setPeriod] = useState<{ [key: string]: any } | null>()

  const { data, subscribeToMore } = useClassesForNoteQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const { data: dataPeriod, subscribeToMore: subscribeToMorePeriod } =
    usePeriodsQuery({
      variables: { id: enterpriseId },
      fetchPolicy: 'network-only',
    })

  const { data: dataObservation, loading: loadingObservation } =
    useQuarterlyReportObservationsQuery({
      variables: {
        classId: clazz ? Number(clazz.id) : -1,
        periodId: period ? Number(period.id) : -1,
      },
      skip: !clazz || !period,
      fetchPolicy: 'no-cache',
    })

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'quarterlyReportObservation') {
          setPeriod(null)
        }
      }
    })
  }, [messageService])

  return (
    <div className="flex flex-col w-full px-1 md:!px-0">
      <div>
        <div className="w-full">
          <div id="displayStudentName"> </div>
          <PageHeader title={t('sidebar.marks.quarterlyReportObservation')} />
        </div>

        <div className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-4/12">
              <LiveView
                document={ClassCreatedDocument}
                singleVar="clazz"
                data={data}
                listVar="clazzes"
                subscribeToMore={subscribeToMore}
                sortField="name"
                triggerUpdate={true}
                enterpriseId={enterpriseId}
              >
                {({ clazzes }) => (
                  <Select
                    onChange={(val) => {
                      setClazz(val)
                    }}
                    options={
                      clazzes?.filter((c: any) => !c.competenceClass) || []
                    }
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    value={clazz}
                    components={{ Option: classOptions }}
                    //form={<AddClass/>}
                    placeholder="Sélectionnez une classe"
                  />
                )}
              </LiveView>
            </div>

            <div className="w-full md:w-4/12">
              <LiveView
                document={PeriodCreatedDocument}
                singleVar="period"
                data={dataPeriod}
                listVar="periods"
                subscribeToMore={subscribeToMorePeriod}
                sortField="name"
                triggerUpdate={true}
                enterpriseId={enterpriseId}
              >
                {({ periods }) => (
                  <Select
                    onChange={(val) => setPeriod(val)}
                    options={periods || undefined}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.id}
                    value={period}
                    components={{ Option: periodOptions }}
                    //form={<AddClass/>}
                    placeholder="Sélectionnez un trimestre"
                  />
                )}
              </LiveView>
            </div>
          </div>
        </div>

        {clazz && period && (
          <div className="w-full">
            {loadingObservation ? (
              <LoadingSpinner />
            ) : (
              <div className="card" style={{ marginTop: 20 }}>
                <QuarterlyObservationAdd
                  quarterlyObservations={
                    dataObservation?.quarterlyReportObservations
                  }
                  classId={clazz.id}
                  periodId={period.id}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default QuarterlyReportObservation
