import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'
import { toast } from 'react-toastify'
import { formatError } from '@/utils/ErrorHelper'
import PageHeader from '@/@core/components/ui/page-header'
import LiveView from '@/utils/LiveView'
import { classOptions, periodOptions } from '@/utils/select/selectComponents'
import Select from '@/@core/components/select'
import Button from '@/@core/components/button'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  ClassCreatedDocument,
  PeriodCreatedDocument,
  useClassesForNoteQuery,
  usePeriodsQuery,
  useQuarterlyDisciplineCalculationMutation,
  useQuarterlyDisciplinesCalculationMutation,
} from '@/gql/graphql'

const QuarterlyDisciplineCalculation = () => {
  const [period, setPeriod] = useState<{ [key: string]: any } | null>(null)
  const [clazz, setClazz] = useState<{ [key: string]: any } | null>(null)

  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, subscribeToMore } = useClassesForNoteQuery({
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

  const [computeSingle, { loading: loadingOne }] =
    useQuarterlyDisciplineCalculationMutation()

  const [computeAll, { loading: loadingAll }] =
    useQuarterlyDisciplinesCalculationMutation()

  const handleAction = (action: any) => {
    toast.info('Calcul en cours...')
    const variables = {
      classId: clazz ? Number(clazz.id) : null,
      periodId: Number(period?.id),
      schoolId: enterpriseId,
    }

    const variables2 = {
      periodId: Number(period?.id),
      schoolId: enterpriseId,
    }

    const finalVar = clazz ? variables : variables2

    action({ variables: { ...finalVar } })
      .then(async ({ data }: any) => {
        toast.success('Calcul effectué', { ...TOAST_OPTIONS })
      })
      .catch((error: any) => {
        toast.error(`Calcul non effectué : ${formatError(error)}`)
      })
  }

  return (
    <div className="flex flex-col w-full px-1 md:!px-0">
      <div className="w-full">
        <PageHeader title={t('sidebar.marks.disciplineCalculation')} />
      </div>

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
                options={clazzes || undefined}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                value={clazz}
                components={{ Option: classOptions }}
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
                placeholder="Sélectionnez un trimestre"
              />
            )}
          </LiveView>
        </div>

        {period && (
          <Button
            color="primary"
            onClick={() => handleAction(clazz ? computeSingle : computeAll)}
            loading={clazz ? loadingOne : loadingAll}
          >
            Calculer
          </Button>
        )}
      </div>
    </div>
  )
}

export default QuarterlyDisciplineCalculation
