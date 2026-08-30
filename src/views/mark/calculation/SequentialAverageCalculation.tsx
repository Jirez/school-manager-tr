import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'
import { toast } from 'react-toastify'
import { formatError } from '@/utils/ErrorHelper'
import PageHeader from '@/@core/components/ui/page-header'
import LiveView from '@/utils/LiveView'
import Select from '@/@core/components/select'
import { classOptions, subPeriodOptions } from '@/utils/select/selectComponents'
import Button from '@/@core/components/button'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  ClassCreatedDocument,
  SubPeriodCreatedDocument,
  useClassesForNoteQuery,
  useSequentialAverageCalculationMutation,
  useSequentialAveragesCalculationMutation,
  useSubPeriodsQuery,
} from '@/gql/graphql'

const SequentialAverageCalculation = () => {
  const [clazz, setClazz] = useState<{ [key: string]: any }>()
  const [subPeriod, setSubPeriod] = useState<{ [key: string]: any }>()

  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useClassesForNoteQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const {
    data: dataSubPeriod,
    loading: loadingSubPeriod,
    subscribeToMore: subscribeToMoreSubPeriod,
  } = useSubPeriodsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const [computeSingle, { loading: loadingOne }] =
    useSequentialAverageCalculationMutation()

  const [computeAll, { loading: loadingAll }] =
    useSequentialAveragesCalculationMutation()

  const handleAction = (action: typeof computeAll | typeof computeSingle) => {
    //toast.info("Calcul en cours...");
    const variables = {
      classId: clazz ? Number(clazz.id) : null,
      subPeriodId: Number(subPeriod?.id),
      schoolId: enterpriseId,
    }

    const variables2 = {
      subPeriodId: Number(subPeriod?.id),
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
        <div id="displayStudentName"> </div>
        <PageHeader title={t('sidebar.marks.averageCalculation')} />
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
            document={SubPeriodCreatedDocument}
            singleVar="subPeriod"
            data={dataSubPeriod}
            listVar="subPeriods"
            subscribeToMore={subscribeToMoreSubPeriod}
            sortField="name"
            triggerUpdate={true}
            enterpriseId={enterpriseId}
          >
            {({ subPeriods }) => (
              <Select
                onChange={(val: any) => setSubPeriod(val)}
                options={subPeriods || undefined}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.id}
                value={subPeriod}
                components={{ Option: subPeriodOptions }}
                placeholder="Sélectionnez une séquence"
              />
            )}
          </LiveView>
        </div>

        {subPeriod && (
          <Button
            color="primary"
            onClick={() => handleAction(clazz ? computeSingle : computeAll)}
            loading={clazz ? loadingOne : loadingAll}
            className="round"
          >
            Calculer
          </Button>
        )}
      </div>
    </div>
  )
}

export default SequentialAverageCalculation
