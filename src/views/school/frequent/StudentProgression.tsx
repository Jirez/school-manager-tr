import { useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

import { useAuthentication } from '@/hooks/useAuthentication'
import { formatError } from '@/utils/ErrorHelper'
import Scrollbar from '@/@core/components/ui/scrollbar'
import PageHeader from '@/@core/components/ui/page-header'
import LiveView from '@/utils/LiveView'
import { schoolYearOptions } from '@/utils/select/selectComponents'
import Button from '@/@core/components/button'
import MySelect from '@/@core/components/ui/forms/custom-select'
import {
  SchoolYearCreatedDocument,
  useSchoolYearsQuery,
  useStudentProgressionMutation,
} from '@/gql/graphql'
import { TOAST_OPTIONS } from '@/utils/constants'
import { useTitle } from 'ahooks'

const StudentProgression = () => {
  const [currentSchoolYear, setCurrentSchoolYear] = useState<
    { [key: string]: any } | undefined
  >()
  const [nextSchoolYear, setNextSchoolYear] = useState<
    { [key: string]: any } | undefined
  >()
  const { enterpriseId } = useAuthentication()
  const { t } = useTranslation()
  useTitle(t('sidebar.students.studentProgression'))

  const {
    data: dataSchoolYear,
    loading: loadingSchoolYear,
    subscribeToMore: subscribeToMoreSchoolYear,
  } = useSchoolYearsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const [makeProgression, { loading }] = useStudentProgressionMutation()

  const handleAction = () => {
    toast.info('Progression en cours...')
    const variables = {
      currentSchoolYearId: currentSchoolYear
        ? Number(currentSchoolYear.id)
        : -1,
      nextSchoolYearId: nextSchoolYear ? Number(nextSchoolYear.id) : -1,
    }

    makeProgression({ variables: { ...variables } })
      .then(async ({}) => {
        toast.success('Progression terminée', { ...TOAST_OPTIONS })
      })
      .catch((error) => {
        toast.error(`Progression non effectuée : ${formatError(error)}`)
      })
  }

  return (
    <Scrollbar className="flex flex-col w-full ">
      <div className="px-1 md:!px-0">
        <div className="w-full">
          <PageHeader title={t('sidebar.students.studentProgression')} />
        </div>

        <div className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-6/12 lg:w-4/12">
              <LiveView
                document={SchoolYearCreatedDocument}
                singleVar="schoolYear"
                data={dataSchoolYear}
                listVar="schoolYears"
                subscribeToMore={subscribeToMoreSchoolYear}
                sortField="label"
                triggerUpdate={true}
                enterpriseId={enterpriseId}
              >
                {({ schoolYears }) => (
                  <MySelect
                    loading={loadingSchoolYear}
                    onChange={(val) => setCurrentSchoolYear(val)}
                    options={schoolYears || undefined}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.id}
                    value={currentSchoolYear}
                    components={{ Option: schoolYearOptions }}
                    // form={<AddClass/>}
                    formId="schoolYear"
                    optionLabel="label"
                    placeholder="Année scolaire en cours"
                  />
                )}
              </LiveView>
            </div>

            <div className="w-full md:w-6/12 lg:w-4/12">
              <LiveView
                document={SchoolYearCreatedDocument}
                singleVar="schoolYear"
                data={dataSchoolYear}
                listVar="schoolYears"
                subscribeToMore={subscribeToMoreSchoolYear}
                sortField="label"
                triggerUpdate={true}
                enterpriseId={enterpriseId}
              >
                {({ schoolYears }) => (
                  <MySelect
                    loading={loadingSchoolYear}
                    onChange={(val) => setNextSchoolYear(val)}
                    options={schoolYears || undefined}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.id}
                    value={nextSchoolYear}
                    components={{ Option: schoolYearOptions }}
                    // form={<AddClass/>}
                    formId="schoolYear"
                    optionLabel="label"
                    placeholder="Année scolaire prochaine"
                  />
                )}
              </LiveView>
            </div>

            {currentSchoolYear && nextSchoolYear && (
              <Button
                color="primary"
                className="round"
                onClick={handleAction}
                loading={loading}
              >
                Effectuer
              </Button>
            )}
          </div>
        </div>
      </div>
    </Scrollbar>
  )
}

export default StudentProgression
