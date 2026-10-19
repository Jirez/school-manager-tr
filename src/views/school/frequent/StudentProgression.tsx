import { toast } from 'react-toastify'
import { Form } from 'reactstrap'
import { z } from 'zod'
import { Calendar } from 'lucide-react'

import { useAuthentication } from '@/hooks/useAuthentication'
import { formatError } from '@/utils/ErrorHelper'
import Scrollbar from '@/@core/components/ui/scrollbar'
import PageHeader from '@/@core/components/ui/page-header'
import LiveView from '@/utils/LiveView'
import { schoolYearOptions } from '@/utils/select/selectComponents'
import Button from '@/@core/components/button'
import {
  SchoolYearCreatedDocument,
  useSchoolYearsQuery,
  useStudentProgressionMutation,
} from '@/gql/graphql'
import { TOAST_OPTIONS } from '@/utils/constants'
import { useTitle } from 'ahooks'
import FormSection from '@/@core/components/ui/forms/form-section'
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import { useSelector } from '@tanstack/react-form'
import { m } from '@/paraglide/messages'

const studentProgressionSchema = z.object({
  currentSchoolYear: z.any().nullable(),
  nextSchoolYear: z.any().nullable(),
})

type StudentProgressionSchemaType = z.infer<typeof studentProgressionSchema>

const StudentProgression = () => {
  const { enterpriseId } = useAuthentication()
  useTitle(m.sidebar_students_studentProgression())

  const {
    data: dataSchoolYear,
    loading: loadingSchoolYear,
    subscribeToMore: subscribeToMoreSchoolYear,
  } = useSchoolYearsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const [makeProgression, { loading }] = useStudentProgressionMutation()

  const { handleSubmit, AppField, store, AppForm } = useAppForm({
    defaultValues: {
      currentSchoolYear: null,
      nextSchoolYear: null,
    } as StudentProgressionSchemaType,
    validators: {
      onChange: studentProgressionSchema,
    },
    onSubmitMeta: defaultMeta,
    onSubmit({ value }) {
      toast.info('Progression en cours...')

      makeProgression({
        variables: {
          currentSchoolYearId: value.currentSchoolYear
            ? Number(value.currentSchoolYear.id)
            : -1,
          nextSchoolYearId: value.nextSchoolYear
            ? Number(value.nextSchoolYear.id)
            : -1,
        },
      })
        .then(async ({}) => {
          toast.success('Progression terminée', { ...TOAST_OPTIONS })
        })
        .catch((error) => {
          toast.error(`Progression non effectuée : ${formatError(error)}`)
        })
    },
  })

  const currentSchoolYear = useSelector(
    store,
    (state) => state.values.currentSchoolYear,
  )
  const nextSchoolYear = useSelector(
    store,
    (state) => state.values.nextSchoolYear,
  )

  return (
    <Scrollbar className="flex flex-col w-full ">
      <div className="px-1 md:!px-0">
        <div className="w-full">
          <PageHeader title={m.sidebar_students_studentProgression()} />
        </div>

        <div className="w-full">
          <Form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <FormSection
              icon={<Calendar size={18} />}
              title={m.label_studentProgression()}
              description="Sélectionnez les années scolaires"
              color="#7367f0"
            >
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
                      <AppField
                        name="currentSchoolYear"
                        children={(field) => (
                          <field.ControlledSelect
                            label={m.label_currentSchoolYear()}
                            options={schoolYears || []}
                            getOptionLabel={(option: any) => option.label}
                            getOptionValue={(option: any) => option.id}
                            components={{ Option: schoolYearOptions }}
                            placeholder="Année scolaire en cours"
                            onChange={() => {}}
                            loading={loadingSchoolYear}
                          />
                        )}
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
                      <AppField
                        name="nextSchoolYear"
                        children={(field) => (
                          <field.ControlledSelect
                            label={m.label_nextSchoolYear()}
                            options={schoolYears || []}
                            getOptionLabel={(option: any) => option.label}
                            getOptionValue={(option: any) => option.id}
                            components={{ Option: schoolYearOptions }}
                            placeholder="Année scolaire prochaine"
                            onChange={() => {}}
                          />
                        )}
                      />
                    )}
                  </LiveView>
                </div>

                {currentSchoolYear && nextSchoolYear && (
                  <AppForm>
                    <Button
                      color="primary"
                      className="round"
                      onClick={() => handleSubmit()}
                      loading={loading}
                    >
                      Effectuer
                    </Button>
                  </AppForm>
                )}
              </div>
            </FormSection>
          </Form>
        </div>
      </div>
    </Scrollbar>
  )
}

export default StudentProgression
