import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'
import { toast } from 'react-toastify'
import { formatError } from '@/utils/ErrorHelper'
import LiveView from '@/utils/LiveView'
import PageHeader from '@/@core/components/ui/page-header'
import Select from '@/@core/components/select'
import { classOptions, periodOptions } from '@/utils/select/selectComponents'
import Button from '@/@core/components/button'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  ClassCreatedDocument,
  PeriodCreatedDocument,
  useClassesForNoteQuery,
  usePeriodsQuery,
  useQuarterlyNoteCalculationMutation,
  useQuarterlyNotesCalculationMutation,
} from '@/gql/graphql'

const QuarterlyNoteCalculation = () => {
  const [clazz, setClazz] = useState<{ [key: string]: any }>()
  const [period, setPeriod] = useState<{ [key: string]: any }>()

  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

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

  const [computeSingle, { loading: loadingOne }] =
    useQuarterlyNoteCalculationMutation()

  const [computeAll, { loading: loadingAll }] =
    useQuarterlyNotesCalculationMutation()

  const handleAction = (action: typeof computeAll | typeof computeSingle) => {
    //toast.info("Calcul en cours...");
    const variables = {
      classId: clazz ? Number(clazz.id) : null,
      periodId: Number(period?.id),
    }

    const variables2 = {
      periodId: Number(period?.id),
      schoolId: enterpriseId,
    }

    const finalVar = clazz ? variables : variables2

    //@ts-ignore
    action({ variables: { ...finalVar } })
      .then(async ({ data }) => {
        toast.success('Calcul effectué', { ...TOAST_OPTIONS })
      })
      .catch((error) => {
        toast.error(`Calcul non effectué : ${formatError(error)}`)
      })
  }

  return (
    <div className="flex flex-col w-full px-1 md:!px-0">
      <div className="w-full">
        <PageHeader title={t('sidebar.marks.noteCalculation')} />
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
                onChange={(val: any) => {
                  setClazz(val)
                }}
                options={clazzes?.filter((c: any) => !c.competenceClass) || []}
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
                onChange={(val: any) => setPeriod(val)}
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

export default QuarterlyNoteCalculation
