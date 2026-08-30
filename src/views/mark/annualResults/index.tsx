import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuthentication } from '@/hooks/useAuthentication'
import Select from '@/@core/components/select'
import { messageService } from '@/utils/message.service'
import PageHeader from '@/@core/components/ui/page-header'
import LiveView from '@/utils/LiveView'
import {
  classOptions,
  schoolYearOptions,
} from '@/utils/select/selectComponents'
import LoadingSpinner from '@/@core/components/spinner/Loading-spinner'
import AnnualResultAdd from './AnnualResultAdd'
import { selectThemeColors } from '@/utils/Utils'
import ErrorComponent from '@/@core/components/ui/error-component'
import {
  ClassCreatedDocument,
  SchoolYearCreatedDocument,
  useAnnualResultsQuery,
  useClassesForNoteQuery,
  useSchoolYearsQuery,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'

const AnnualResults = () => {
  const { t } = useTranslation()
  useTitle(t('sidebar.marks.annualResult'))
  const { enterpriseId } = useAuthentication()
  const [clazz, setClazz] = useState<{ [key: string]: any } | null>()
  const [schoolYear, setSchoolYear] = useState<{
    [key: string]: any
  } | null>()
  const [nextSchoolYear, setNextSchoolYear] = useState<{
    [key: string]: any
  } | null>()

  const { data, subscribeToMore } = useClassesForNoteQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const {
    data: dataSchoolYear,
    loading: loadingSchoolYear,
    subscribeToMore: subscribeToMoreSchoolYear,
  } = useSchoolYearsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const {
    data: dataResult,
    loading: loadingResult,
    error,
  } = useAnnualResultsQuery({
    variables: {
      classId: clazz ? Number(clazz.id) : -1,
      schoolYearId: schoolYear ? Number(schoolYear.id) : -1,
    },
    skip: !clazz || !schoolYear,
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'annualResult') {
          setSchoolYear(null)
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
          <PageHeader title={t('sidebar.marks.annualResult')} />
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
                    options={clazzes || undefined}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    value={clazz}
                    components={{ Option: classOptions }}
                    //form={<AddClass/>}
                    placeholder="Sélectionnez une classe"
                    className="react-select"
                    classNamePrefix="select"
                    theme={selectThemeColors}
                    isClearable
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
                sortField="label"
                triggerUpdate={true}
                enterpriseId={enterpriseId}
              >
                {({ schoolYears }) => (
                  <Select
                    onChange={(val) => setSchoolYear(val)}
                    options={schoolYears || undefined}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.id}
                    value={schoolYear}
                    components={{
                      Option: schoolYearOptions,
                    }}
                    //form={<AddClass/>}
                    placeholder="Année scolaire en cours"
                    className="react-select"
                    classNamePrefix="select"
                    theme={selectThemeColors}
                    isClearable
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
                sortField="label"
                triggerUpdate={true}
                enterpriseId={enterpriseId}
              >
                {({ schoolYears }) => (
                  <Select
                    onChange={(val) => setNextSchoolYear(val)}
                    options={schoolYears || undefined}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.id}
                    value={nextSchoolYear}
                    components={{
                      Option: schoolYearOptions,
                    }}
                    //form={<AddClass/>}
                    placeholder="Année scolaire prochaine"
                    className="react-select"
                    classNamePrefix="select"
                    theme={selectThemeColors}
                    isClearable
                  />
                )}
              </LiveView>
            </div>
          </div>
        </div>

        {!error ? (
          clazz &&
          schoolYear &&
          nextSchoolYear && (
            <div className="w-full">
              {loadingResult ? (
                <LoadingSpinner />
              ) : (
                <div className="card" style={{ marginTop: 20 }}>
                  <AnnualResultAdd
                    annualResults={dataResult?.annualResults}
                    classId={clazz.id}
                    schoolYearId={schoolYear.id}
                    nextSchoolYearId={nextSchoolYear.id}
                  />
                </div>
              )}
            </div>
          )
        ) : (
          <div className="w-full mt-4 flex justify-center items-end">
            <ErrorComponent
              message={
                "Vous n'êtes pas autorisé à éditer les notes de cette évaluation. Veuillez contacter votre fournisseur afin de renouveler votre licence."
              }
              title={'Licence invalide'}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default AnnualResults
