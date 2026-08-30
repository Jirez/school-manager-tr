import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/hooks/useAuthentication'
import { toast } from 'react-toastify'
import { formatError } from '@/utils/ErrorHelper'
import PageHeader from '@/@core/components/ui/page-header'
import LiveView from '@/utils/LiveView'
import Select from '@/@core/components/select'
import {
  classOptions,
  schoolYearOptions,
} from '@/utils/select/selectComponents'
import Button from '@/@core/components/button'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  ClassCreatedDocument,
  SchoolYearCreatedDocument,
  useAnnualAverageCalculationMutation,
  useAnnualAveragesCalculationMutation,
  useClassesForNoteQuery,
  useSchoolYearsQuery,
} from '@/gql/graphql'

const AnnualAverageCalculation = () => {
  const [clazz, setClazz] = useState<{ [key: string]: any }>()
  const [schoolYear, setSchoolYear] = useState<{ [key: string]: any }>()

  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useClassesForNoteQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const { data: dataSchoolYear, subscribeToMore: subscribeToMoreSchoolYear } =
    useSchoolYearsQuery({
      variables: { id: enterpriseId },
      fetchPolicy: 'network-only',
    })

  const [computeSingle, { loading: loadingOne }] =
    useAnnualAverageCalculationMutation()

  const [computeAll, { loading: loadingAll }] =
    useAnnualAveragesCalculationMutation()

  const handleAction = (action: typeof computeSingle | typeof computeAll) => {
    //toast.info("Calcul en cours...");
    const variables = {
      classId: clazz ? Number(clazz.id) : -1,
      schoolYearId: Number(schoolYear?.id),
    }

    const variables2 = {
      schoolYearId: Number(schoolYear?.id),
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
            document={SchoolYearCreatedDocument}
            singleVar="schoolYear"
            data={dataSchoolYear}
            listVar="schoolYears"
            subscribeToMore={subscribeToMoreSchoolYear}
            sortField="name"
            triggerUpdate={true}
            enterpriseId={enterpriseId}
          >
            {({ schoolYears }) => (
              <Select
                onChange={(val: any) => setSchoolYear(val)}
                options={schoolYears || undefined}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.id}
                value={schoolYear}
                components={{ Option: schoolYearOptions }}
                placeholder="Sélectionnez une année scolaire"
              />
            )}
          </LiveView>
        </div>

        {schoolYear && (
          <Button
            className="round"
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

export default AnnualAverageCalculation
